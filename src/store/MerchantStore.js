import axios from 'axios';
import { NOT_FOUND_ERROR } from '@/errors';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';
import qs from 'qs';

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
    name: '',
    alternative_name: '',
    website: '',
    country: '',
    state: '',
    zip: '',
    city: '',
    address: '',
    address_additional: '',
    registration_number: '',
    tax_id: '',
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
      currency: '',
      name: '',
      address: '',
      account_number: '',
      swift: '',
      details: '',
    },
  };

  const newData = mergeApiValuesWithDefaults(defaultData, data);

  if (newData.country) {
    newData.country = newData.country.code_a2;
  }

  if (newData.banking.currency) {
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

export default function createMerchantStore({ config }) {
  return {
    state: () => ({
      merchant: null,
      paymentMethods: [],
      paymentMethodsSort: [],
      agreementDocument: getDefaultAgreementDocument(),
    }),

    mutations: {
      merchant(store, data) {
        store.merchant = data;
      },
      paymentMethods(store, data) {
        store.paymentMethods = data;
      },
      paymentMethodsSort(store, data) {
        store.paymentMethodsSort = data;
      },
      agreementDocument(store, data) {
        store.agreementDocument = data;
      },
    },

    actions: {
      async initState({ dispatch }, id) {
        await dispatch('fetchMerchantById', id);
        await Promise.all([
          dispatch('fetchMerchantPaymentMethods', id),
          dispatch('fetchAgreement'),
        ]);
      },

      async createMerchant({ commit, rootState }, merchant) {
        try {
          const response = await axios.post(
            `${config.apiUrl}/admin/api/v1/merchants`,
            merchant,
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );
          commit('merchant', response.data);
        } catch (error) {
          console.error(error);
        }
      },

      async fetchMerchantById({ commit, rootState }, id) {
        const response = await axios.get(`${config.apiUrl}/admin/api/v1/merchants/${id}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        });
        commit('merchant', mapDataApiToForm(response.data));
      },

      async fetchMerchant({ commit, rootState }) {
        try {
          const response = await axios.get(`${config.apiUrl}/admin/api/v1/merchants/user`, {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          });
          commit('merchant', mapDataApiToForm(response.data));
        } catch (error) {
          if (error.response && error.response.status === 404) {
            throw NOT_FOUND_ERROR;
          } else {
            console.error(error);
          }
        }
      },

      async fetchMerchantPaymentMethods({ state, commit, rootState }, id) {
        const merchantId = id || state.merchant.id;

        const query = qs.stringify({
          sort: state.paymentMethodsSort,
        }, { arrayFormat: 'brackets' });
        const url = `${config.apiUrl}/admin/api/v1/merchants/${merchantId}/methods?${query}`;

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
          `${config.apiUrl}/admin/api/v1/merchants`,
          state.merchant,
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
        commit('merchant', mapDataApiToForm(response.data));
      },

      async patchMerchant({ state, commit, rootState }, props) {
        const response = await axios.patch(
          `${config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}`,
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
          `${config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/change-status`,
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
            `${config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/agreement`,
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
          `${config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/notifications`,
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
