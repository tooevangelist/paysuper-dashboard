import axios from 'axios';
import { saveAs } from 'file-saver';
import { delay, get } from 'lodash-es';
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

export default function createMerchantLicenseAgreementStore() {
  return {
    namespaced: true,
    state: {
      merchantId: null,
      helloSign: null,
      signature: null,
      agreement: getDefaultAgreementDocument(),
      document: null,
      operatingCompanies: [],
      operatingCompany: null,
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
      async initState({ commit, dispatch }, merchantId) {
        commit('merchantId', merchantId);
        await dispatch('fetchOperatingCompanies');
      },

      async fetchOperatingCompanies({ commit }) {
        const response = await axios.get(
          '{apiUrl}/system/api/v1/operating_company',
        );

        if (response.data) {
          const companies = response.data.map(item => ({
            label: `${item.name} (${item.country})`,
            value: item.id,
          }));
          commit('operatingCompanies', companies);
        }
      },

      async initHellosign({
        commit,
        dispatch,
        getters,
        state,
        rootState,
      }) {
        dispatch('fetchAgreementMetadata');

        if (getters.isUsingHellosign) {
          dispatch('fetchAgreementSignature');

          const helloSign = new HelloSign({
            clientId: rootState.config.hellosignClientId,
            // TODO: remove 3 lines below for production
            testMode: true,
            debug: true,
            skipDomainVerification: true,
          });

          helloSign.on('sign', () => {
            dispatch('Merchant/fetchMerchantById', state.merchantId, { root: true });
            delay(() => {
              dispatch('fetchAgreementMetadata');
            }, 6000);
          });

          commit('helloSign', helloSign);
        }
      },
      async fetchAgreementSignature({ commit, state }) {
        const { merchantId } = state;

        if (merchantId) {
          const response = await axios.put(
            `{apiUrl}/system/api/v1/merchants/${merchantId}/agreement/signature`,
          );

          commit('signature', response.data);
        }
      },
      async fetchAgreementMetadata({
        commit,
        dispatch,
        getters,
        state,
      }) {
        const { merchantId } = state;
        const { status } = getters;

        if (merchantId && status >= 3) {
          const response = await axios.get(
            `{apiUrl}/system/api/v1/merchants/${merchantId}/agreement`,
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
      async fetchDocument({ commit, state }) {
        const { merchantId } = state;
        const { url } = state.agreement;
        const { size, extension } = state.agreement.metadata;

        if (!merchantId || url === '#' || size === 0) {
          return false;
        }

        const response = await axios.get(
          `{apiUrl}/system/api/v1/merchants/${merchantId}/agreement/document`,
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
      async setOperatingCompany({ commit, state, dispatch }, id) {
        const { merchantId } = state;

        if (merchantId) {
          const response = await axios.post(
            `{apiUrl}/system/api/v1/merchants/${merchantId}/set_operating_company`,
            { operating_company_id: id },
          );
          if (response) {
            commit('operatingCompany', response.id);
            dispatch('Merchant/fetchMerchantById', state.merchantId, { root: true });
          }
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
      operatingCompanies(state, data) {
        state.operatingCompanies = data;
      },
      operatingCompany(state, data) {
        state.operatingCompany = data;
      },
    },
  };
}
