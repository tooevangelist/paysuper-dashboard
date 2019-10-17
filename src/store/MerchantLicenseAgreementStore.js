import axios from 'axios';
import { saveAs } from 'file-saver';
import { delay, get } from 'lodash-es';
import HelloSign from 'hellosign-embedded';

const HELLOSIGN_CLIENT_ID = '2599245f066de53be8e5837360edf3ac';

function getDefaultAgreementDocument() {
  return {
    metadata: {
      name: 'License Agreement',
      extension: 'pdf',
      size: 0,
    },
    url: '#',
    hasSigned: false,
  };
}

export default function createMerchantLicenseAgreementStore() {
  return {
    namespaced: true,
    state: {
      merchantId: null,
      helloSign: null,
      signature: null,
      agreement: getDefaultAgreementDocument(),
      document: null,
    },
    getters: {
      isUsingHellosign(state, getters) {
        return getters.status === 3;
      },
      status(state, getters, rootState) {
        return get(rootState, 'Merchant.merchant.status', 0);
      },
    },
    actions: {
      async initState({ commit }, merchantId) {
        commit('merchantId', merchantId);
      },
      async initHellosign({
        commit,
        dispatch,
        getters,
        state,
      }) {
        dispatch('fetchAgreementMetadata');

        if (getters.isUsingHellosign) {
          dispatch('fetchAgreementSignature');

          const helloSign = new HelloSign({
            clientId: HELLOSIGN_CLIENT_ID,
            // TODO: remove 3 lines below for production
            testMode: true,
            debug: true,
            skipDomainVerification: true,
          });

          helloSign.on('sign', () => {
            commit('hasSigned', true);
            delay(async () => {
              await dispatch('Merchant/fetchMerchantById', state.merchantId, { root: true });
              await dispatch('fetchAgreementMetadata');
            }, 5000);
          });

          commit('helloSign', helloSign);
        }
      },
      async fetchAgreementSignature({ commit, state, rootState }) {
        const { apiUrl } = rootState.config;
        const { merchantId } = state;

        if (merchantId) {
          const response = await axios.put(
            `${apiUrl}/admin/api/v1/merchants/${merchantId}/agreement/signature`,
            { signer_type: 1 },
          );

          commit('signature', response.data);
        }
      },
      async fetchAgreementMetadata({
        commit,
        dispatch,
        getters,
        rootState,
        state,
      }) {
        const { apiUrl } = rootState.config;
        const { merchantId } = state;
        const { status } = getters;

        if (merchantId && status >= 3) {
          const response = await axios.get(
            `${apiUrl}/admin/api/v1/merchants/${merchantId}/agreement`,
          );
          const agreement = get(response, 'data', getDefaultAgreementDocument());

          commit('agreement', agreement);

          if (agreement.metadata.size) {
            dispatch('fetchDocument');
          }
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
      async fetchDocument({ commit, state, rootState }) {
        const { apiUrl } = rootState.config;
        const { merchantId } = state;
        const { url } = state.agreement;
        const { size, extension } = state.agreement.metadata;

        if (url === '#' || size === 0) {
          return false;
        }

        const response = await axios.get(
          `${apiUrl}/admin/api/v1/merchants/${merchantId}/agreement/document`,
          {
            headers: { Accept: `application/${extension}` },
            responseType: 'blob',
          },
        );

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
    },
    mutations: {
      merchantId(store, value) {
        store.merchantId = value;
      },
      agreement(state, data) {
        state.agreement = data;
      },
      document(state, data) {
        state.document = data;
      },
      hasSigned(state, data) {
        state.hasSigned = data;
      },
      helloSign(state, data) {
        state.helloSign = data;
      },
      signature(state, data) {
        state.signature = data;
      },
      status(state, data) {
        state.status = data;
      },
    },
  };
}
