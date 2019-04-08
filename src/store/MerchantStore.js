import axios from 'axios';
import { NOT_FOUND_ERROR } from '@/errors';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';

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

export default function createMerchantStore({ config }) {
  return {
    state: () => ({
      merchant: null,
      paymentMethods: [],
      agreementDocument: {
        metadata: {
          name: 'Fake agreement.pdf',
          extension: 'pdf',
          size: '0',
        },
        url: '#',
      },
    }),

    mutations: {
      merchant(store, data) {
        store.merchant = data;
      },
      paymentMethods(store, data) {
        store.paymentMethods = data;
      },
      agreementDocument(store, data) {
        store.agreementDocument = data;
      },
    },

    actions: {
      async initState({ state, dispatch }, id) {
        await Promise.all([
          dispatch('fetchMerchantById', id),
          dispatch('fetchMerchantPaymentMethods', id),
        ]);

        if (state.merchant.status >= 3) {
          await dispatch('fetchAgreement', id);
        }
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

      async fetchMerchantPaymentMethods({ commit, rootState }, id) {
        try {
          const response = await axios.get(
            `${config.apiUrl}/admin/api/v1/merchants/${id}/methods`,
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
          state, commit, dispatch, rootState,
        },
        {
          action, value, message,
        },
      ) {
        if (action === 'setAgreementType') {
          // newMerchantData.agreement_type = merchantAgreementTypes[value];

          // if (newMerchantData.status === 4) {
          //   newMerchantData.status = 1;
          // }
          const response = await axios.patch(
            `${config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}`,
            {
              agreement_type: merchantAgreementTypes[value],
            },
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );
          commit('merchant', mapDataApiToForm(response.data));
        }

        if (action === 'setStatus') {
          await dispatch('changeMerchantStatus', { status: value, message });
        }

        if (action === 'generateAgreement') {
          await dispatch('changeMerchantStatus', { status: 3 });
          await dispatch('fetchAgreement', state.merchant.id);
        }

        if (action === 'revokeSigning') {
          await dispatch('changeMerchantStatus', { status: 0 });
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

      // async generateAgreement({ state, commit, rootState }, { isPreSigned }) {
      //   const response = await axios.get(
      //     `${config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/agreement`,
      //     {
      //       headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
      //     },
      //   );

      //   commit('agreementDocument', response.data);
      //   console.log(11111, 'generateAgreement', response.data);
      //   console.log(11111, 'isPreSigned', isPreSigned);
      // },

      async fetchAgreement({ commit, rootState }, merchantId) {
        try {
          const response = await axios.get(
            `${config.apiUrl}/admin/api/v1/merchants/${merchantId}/agreement`,
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );

          commit('agreementDocument', response.data);
        } catch (error) {
          console.warn(error);
        }
      },
    },

    namespaced: true,
  };
}
