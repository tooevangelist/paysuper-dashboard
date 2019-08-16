import { get, cloneDeep, isEqual } from 'lodash-es';
import axios from 'axios';
import qs from 'qs';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';
import { UNAUTHORIZED } from '@/errors';

// const merchantStatues = {
//   draft: 0,
//   agreementRequested: 1,
//   onReview: 2,
//   agreementSigning: 3,
//   agreementSigned: 4,
// };
const merchantAgreementTypes = {
  undefined: 0,
  paper: 1,
  electro: 2,
};

function mapDataApiToForm(data) {
  const defaultData = {
    id: '',
    status: 0,
    created_at: 0,
    updated_at: 0,
    first_payment_at: 0,
    last_payout: {},
    is_signed: false,
    agreement_type: 0,
    agreement_sent_via_mail: false,
    mail_tracking_link: '',
    signature_request: {},
    tariff: {},
    company: {
      address: '',
      address_additional: '',
      alternative_name: '',
      city: '',
      country: '',
      name: '',
      state: '',
      website: '',
      zip: '',
    },
    contacts: {
      authorized: {
        name: '',
        email: '',
        phone: '',
        position: '',
      },
      technical: {
        name: '',
        email: '',
        phone: '',
      },
    },
    banking: {
      account_number: '',
      address: '',
      correspondent_account: '',
      currency: '',
      name: '',
      swift: '',
      details: '',
    },
  };

  const newData = mergeApiValuesWithDefaults(defaultData, data);

  if (newData.country) {
    newData.country = newData.country.code_a2;
  }

  if (newData.banking.currency && newData.banking.currency.code_a3) {
    newData.banking.currency = newData.banking.currency.code_a3;
  }

  return newData;
}

function getDefaultAgreementDocument() {
  return {
    metadata: {
      name: 'Default agreement',
      extension: 'pdf',
      size: '0',
    },
    url: '#',
  };
}

export default function createMerchantStore() {
  return {
    state: () => ({
      merchant: null,
      merchantOriginalCopy: null,
      paymentMethods: [],
      paymentMethodsSort: [],
      agreementDocument: getDefaultAgreementDocument(),
    }),

    getters: {
      isMerchantChanged(state) {
        return !isEqual(state.merchant, state.merchantOriginalCopy);
      },
    },

    mutations: {
      merchant(state, data) {
        state.merchant = data;
        state.merchantOriginalCopy = cloneDeep(data);
      },
      paymentMethods(state, data) {
        state.paymentMethods = data;
      },
      paymentMethodsSort(state, data) {
        state.paymentMethodsSort = data;
      },
      agreementDocument(state, data) {
        state.agreementDocument = data;
      },
    },

    actions: {
      async initState({ dispatch }, id) {
        await dispatch('fetchMerchantById', id);
      },

      async fetchMerchantById({ commit, rootState }, id) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/merchants/${id}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).catch(error => console.warn(error));

        commit('merchant', mapDataApiToForm(get(response, 'data', {})));
      },

      async fetchMerchant({ commit, rootState }) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/merchants/user`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).catch((error) => {
          const errorCode = get(error, 'response.status');
          if (errorCode === 401) {
            throw UNAUTHORIZED;
          }
          console.warn(error);
        });

        commit('merchant', mapDataApiToForm(get(response, 'data', {})));
      },

      async fetchMerchantPaymentMethods({ state, commit, rootState }, id) {
        const merchantId = id || state.merchant.id;

        const query = qs.stringify({
          sort: state.paymentMethodsSort,
        }, { arrayFormat: 'brackets' });
        const url = `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/methods?${query}`;

        try {
          const response = await axios.get(
            url,
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );
          commit('paymentMethods', response.data);
        } catch (error) {
          console.error(error);
        }
      },

      async updateMerchant({ state, commit, rootState }) {
        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants`,
          state.merchant,
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
        commit('merchant', mapDataApiToForm(response.data));
      },

      async patchMerchant({ state, commit, rootState }, props) {
        const response = await axios.patch(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}`,
          props,
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
        commit('merchant', mapDataApiToForm(response.data));
      },

      async changeMerchantAgreement(
        {
          commit, dispatch,
        },
        {
          action, value, message, isPreSigned,
        },
      ) {
        if (action === 'setAgreementType') {
          await dispatch('patchMerchant', { agreement_type: merchantAgreementTypes[value] });
        }

        if (action === 'setStatus') {
          await dispatch('changeMerchantStatus', { status: value, message });
        }

        if (action === 'generateAgreement') {
          await dispatch('changeMerchantStatus', { status: 3 });
          if (isPreSigned) {
            await dispatch('patchMerchant', { has_psp_signature: true });
          }
          await dispatch('fetchAgreement');
        }

        if (action === 'revokeSigning') {
          await dispatch('changeMerchantStatus', { status: 0 });
          commit('agreementDocument', getDefaultAgreementDocument());
        }

        if (action === 'setPspSignature') {
          await dispatch('patchMerchant', { has_psp_signature: value });
        }

        if (action === 'setMerchantSignature') {
          await dispatch('patchMerchant', { has_merchant_signature: value });
        }

        if (action === 'setSentViaEmail') {
          await dispatch('patchMerchant', { agreement_sent_via_mail: value });
        }

        if (action === 'setMailTrackingLink') {
          await dispatch('patchMerchant', { mail_tracking_link: value });
        }
      },

      async changeMerchantStatus({ state, commit, rootState }, { status, message = '' }) {
        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/change-status`,
          {
            status,
            message,
          },
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
        commit('merchant', mapDataApiToForm(response.data));
      },

      async fetchAgreement({ state, commit, rootState }) {
        if (state.merchant.status < 3) {
          commit('agreementDocument', getDefaultAgreementDocument());
          return;
        }

        try {
          const response = await axios.get(
            `${rootState.config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/agreement`,
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );

          commit('agreementDocument', response.data);
        } catch (error) {
          console.warn(error);
        }
      },

      async sendNotification({ state, rootState }, notification) {
        await axios.post(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/notifications`,
          notification,
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
      },
    },

    namespaced: true,
  };
}
