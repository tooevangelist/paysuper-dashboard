import axios from 'axios';
import { saveAs } from 'file-saver';
import { delay, get } from 'lodash-es';
import initHellosign from '@/helpers/initHellosign';

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
      agreementNeedsToUpload: false,
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
        const { hellosignClientId, hellosignTestMode } = rootState.config;

        dispatch('fetchAgreementMetadata');

        if (getters.isUsingHellosign) {
          dispatch('fetchAgreementSignature');

          const helloSign = initHellosign(hellosignClientId, hellosignTestMode);

          helloSign.on('sign', () => {
            delay(() => {
              dispatch('Merchant/fetchMerchantById', state.merchantId, { root: true });
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
        const { agreement, merchantId } = state;
        const { status } = getters;

        if (merchantId && status >= 3) {
          const response = await axios.get(
            `{apiUrl}/system/api/v1/merchants/${merchantId}/agreement`,
          );
          const agreementNew = get(response, 'data', getDefaultAgreementDocument());

          if (agreement.metadata.size !== agreementNew.metadata.size) {
            commit('agreement', agreementNew);
            commit('agreementNeedsToUpload', false);
            await dispatch('fetchDocument');
          } else {
            commit('agreementNeedsToUpload', true);
          }
        }
      },
      async uploadDocument({ dispatch, state }) {
        if (state.agreementNeedsToUpload) {
          await dispatch('fetchAgreementMetadata');
        }
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
