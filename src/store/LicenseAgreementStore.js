import axios from 'axios';
import { saveAs } from 'file-saver';
import { delay, get, includes } from 'lodash-es';
import Centrifuge from 'centrifuge';
import HelloSign from 'hellosign-embedded';

function getDefaultAgreementDocument() {
  return {
    metadata: {
      name: 'License Agreement',
      extension: 'pdf',
      size: 0,
    },
    url: '#',
  };
}

export default function createLicenseAgreementStore() {
  return {
    namespaced: true,
    state: {
      helloSign: null,
      signature: null,
      agreement: getDefaultAgreementDocument(),
      hasGeneratedAgreement: false,
    },
    getters: {
      isSigendYou(state, getters) {
        return includes([3, 4], getters.status);
      },
      isSigendPS(state, getters) {
        return getters.status === 4;
      },
      isUsingHellosign(state, getters) {
        return !includes([3, 4, 5, 6], getters.status);
      },
      status(state, getter, rootState) {
        return rootState.User.Merchant.merchant.status;
      },
      merchantId(state, getter, rootState) {
        return rootState.User.Merchant.merchant.id;
      },
      centrifugoToken(state, getter, rootState) {
        return rootState.User.Merchant.merchant.centrifugo_token;
      },
      websocketUrl(state, getter, rootState) {
        return rootState.config.websocketUrl;
      },
    },
    mutations: {
      agreement(state, data) {
        state.agreement = data;
      },
      document(state, data) {
        state.document = data;
      },
      helloSign(state, data) {
        state.helloSign = data;
      },
      signature(state, data) {
        state.signature = data;
      },
      hasGeneratedAgreement(state, data) {
        state.hasGeneratedAgreement = data;
      },
    },
    actions: {
      async initState({
        commit,
        dispatch,
        getters,
        rootState,
      }) {
        const { hellosignClientId, hellosignTestMode } = rootState.config;

        await dispatch('fetchAgreementSignature');
        await dispatch('fetchAgreementMetadata');

        if (includes([3, 7], getters.status)) {
          dispatch('initWaitingForChangeStatus');
        }

        if (getters.isUsingHellosign) {
          const helloSign = new HelloSign({
            clientId: hellosignClientId,
            testMode: hellosignTestMode,
            debug: hellosignTestMode,
            skipDomainVerification: hellosignTestMode,
          });

          helloSign.on('sign', () => {
            dispatch('User/Merchant/updateStatus', 3, { root: true });
            dispatch('initWaitingForChangeStatus');
          });

          commit('helloSign', helloSign);
        }
      },
      async fetchAgreementSignature({ commit, getters }) {
        const { isUsingHellosign, status } = getters;

        if (isUsingHellosign && includes([7, 8], status)) {
          const response = await axios.put(
            '{apiUrl}/admin/api/v1/merchants/agreement/signature',
          );

          commit('signature', response.data);
        }
      },
      async fetchAgreementMetadata({ commit, getters }) {
        const { status } = getters;

        if (includes([3, 4, 7, 8], status)) {
          const response = await axios.get(
            '{apiUrl}/admin/api/v1/merchants/agreement',
          );
          const agreement = get(response, 'data', getDefaultAgreementDocument());

          commit('agreement', agreement);
        }
      },
      async uploadDocument({ dispatch, state }) {
        const hasDocument = !!state.document || await dispatch('fetchDocument');
        const { extension } = state.agreement.metadata;

        if (hasDocument) {
          saveAs(
            new Blob([state.document], { type: `application/${extension}` }),
            `License Agreement.${extension}`,
          );
        }
      },
      async fetchDocument({ commit, state }) {
        const { url } = state.agreement;
        const { size, extension } = state.agreement.metadata;

        if (url === '#' || size === 0) {
          return false;
        }

        const response = await axios.get(url, {
          headers: { Accept: `application/${extension}` },
          responseType: 'blob',
        });

        if (response.status === 200) {
          commit('document', response.data);
          return true;
        }

        return false;
      },
      openLicense({ state, getters }) {
        if (getters.isUsingHellosign) {
          state.helloSign.open(state.signature.sign_url);
        }
      },
      initWaitingForChangeStatus({ dispatch, getters, state }) {
        const { centrifugoToken, merchantId, websocketUrl } = getters;
        const centrifuge = new Centrifuge(websocketUrl);

        centrifuge.setToken(centrifugoToken);
        centrifuge.subscribe(`paysuper:merchant#${merchantId}`, async ({ data }) => {
          const status = get(data, 'statuses.to', null);

          if (status === 6) {
            dispatch('User/Merchant/updateStatus', status, { root: true });
            return;
          }

          if (status === 8) {
            dispatch('User/Merchant/updateStatus', status, { root: true });
            if (state.signature) {
              return;
            }
            if (state.hasGeneratedAgreement) {
              await dispatch('fetchAgreementSignature');
            } else {
              dispatch('initWaitingForSignatureGenerated');
            }
            return;
          }

          if (status === 4) {
            dispatch('User/Merchant/updateStatus', status, { root: true });
            dispatch('User/Merchant/completeStep', 'license', { root: true });
            delay(async () => {
              await dispatch('fetchAgreementMetadata');
              await dispatch('fetchDocument');
            }, 5000);
          }
        });
        centrifuge.connect();
      },
      initWaitingForSignatureGenerated({ commit, dispatch, getters }) {
        const {
          centrifugoToken,
          merchantId,
          status,
          websocketUrl,
        } = getters;
        const centrifuge = new Centrifuge(websocketUrl);

        centrifuge.setToken(centrifugoToken);
        centrifuge.subscribe(`paysuper:merchant#${merchantId}`, async ({ data }) => {
          if (get(data, 'generated') === true) {
            if (status === 8) {
              await dispatch('fetchAgreementSignature', true);
            }
            commit('hasGeneratedAgreement', true);
          }
        });
        centrifuge.connect();
      },
    },
  };
}
