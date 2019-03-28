import axios from 'axios';
import assert from 'simple-assert';
import { map, includes } from 'lodash-es';
import { NOT_FOUND_ERROR } from '@/errors';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';

const merchantStatues = {
  draft: 0,
  agreementRequested: 1,
  onReview: 2,
  approved: 3,
  rejected: 4,
  agreementSigning: 5,
  agreementSigned: 6,
};
const mechantStatusNamesArray = map(merchantStatues, (value, key) => key);

// const merchantAgreementTypes = {
//   undefined: 0,
//   paper: 1,
//   e: 2,
// };


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

  console.log(11111, 'newData', newData);

  if (newData.country) {
    newData.country = newData.country.code_a2;
  }

  if (newData.banking.currency) {
    newData.banking.currency = newData.banking.currency.code_a3;
  }

  return newData;
}

export default function createMerchantStore({ config, notifications }) {
  return {
    state: () => ({
      merchant: null,
      paymentMethods: [],
    }),

    mutations: {
      merchant(store, data) {
        store.merchant = data;
      },
      paymentMethods(store, data) {
        store.paymentMethods = data;
      },
    },

    actions: {
      async initState({ dispatch }, id) {
        await Promise.all([
          dispatch('fetchMerchantById', id),
          dispatch('fetchMerchantPaymentMethods', id),
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

      async changeMerchantStatus({
        state, commit, dispatch, rootState,
      }, statusName) {
        assert(includes(mechantStatusNamesArray, statusName), `Unknown status ${statusName}`);
        const status = merchantStatues[statusName];
        dispatch('setIsLoading', true, { root: true });
        try {
          const response = await axios.put(
            `${config.apiUrl}/admin/api/v1/merchants/${state.merchant.id}/change-status`,
            {
              status,
            },
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );
          commit('merchant', mapDataApiToForm(response.data));
          notifications.showSuccessMessage('Merchant updated successfully');
        } catch (error) {
          notifications.showErrorMessage('Failed to update merchant');
        }
        dispatch('setIsLoading', false, { root: true });
      },
    },

    namespaced: true,
  };
}
