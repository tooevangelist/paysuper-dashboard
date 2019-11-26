import axios from 'axios';
import { saveAs } from 'file-saver';
import { delay, get } from 'lodash-es';
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
      document: null,
    },
    getters: {
      isSigendYou(state, getters) {
        return getters.status >= 3;
      },
      isSigendPS(state, getters) {
        return getters.status >= 4;
      },
      isUsingHellosign(state, getters) {
        return !getters.status;
      },
      status(state, getter, rootState) {
        return rootState.User.Merchant.merchant.status;
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
    },
    actions: {
      async initState({
        commit,
        dispatch,
        getters,
        rootState,
      }, isOnboardingStepsComplete) {
        await dispatch('fetchAgreementSignature', isOnboardingStepsComplete);
        await dispatch('fetchAgreementMetadata', isOnboardingStepsComplete);

        if (getters.status === 3) {
          dispatch('initWaitingForDocumentSigned');
        }

        if (getters.isUsingHellosign) {
          const helloSign = new HelloSign({
            clientId: rootState.config.hellosignClientId,
            // TODO: remove 3 lines below for production
            testMode: true,
            debug: true,
            skipDomainVerification: true,
          });

          helloSign.on('sign', () => {
            dispatch('User/Merchant/updateStatus', 3, { root: true });
            dispatch('initWaitingForDocumentSigned');
          });

          commit('helloSign', helloSign);
        }
      },
      async fetchAgreementSignature({ commit, getters }, isOnboardingStepsComplete) {
        const { isUsingHellosign } = getters;

        if (isOnboardingStepsComplete && isUsingHellosign) {
          const response = await axios.put(
            '{apiUrl}/admin/api/v1/merchants/agreement/signature',
            { signer_type: 0 },
          );

          commit('signature', response.data);
        }
      },
      async fetchAgreementMetadata({ commit, getters }, isOnboardingStepsComplete) {
        const { status } = getters;

        if (isOnboardingStepsComplete && status) {
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
      initWaitingForDocumentSigned({ dispatch, getters }) {
        const { centrifugoToken, merchantId, websocketUrl } = getters;
        const centrifuge = new Centrifuge(websocketUrl);

        centrifuge.setToken(centrifugoToken);
        centrifuge.subscribe(`paysuper:merchant#${merchantId}`, async ({ data }) => {
          if (get(data, 'statuses.to') === 6) {
            dispatch('User/Merchant/updateStatus', 6, { root: true });
            return;
          }

          if (get(data, 'statuses.to') === 4) {
            dispatch('User/Merchant/updateStatus', 4, { root: true });
            dispatch('User/Merchant/completeStep', 'license', { root: true });
            delay(async () => {
              await dispatch('fetchAgreementMetadata', true);
              await dispatch('fetchDocument');
            }, 5000);
          }
        });
        centrifuge.connect();
      },
      initWaitingForSignatureGenerated({ dispatch, getters }) {
        const { centrifugoToken, merchantId, websocketUrl } = getters;
        const centrifuge = new Centrifuge(websocketUrl);

        centrifuge.setToken(centrifugoToken);
        centrifuge.subscribe(`paysuper:merchant#${merchantId}`, async ({ data }) => {
          if (get(data, 'generated') === true) {
            await dispatch('fetchAgreementSignature', true);
          }
        });
        centrifuge.connect();
      },
    },
  };
}
