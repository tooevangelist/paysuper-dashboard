import axios from 'axios';
import assert from 'simple-assert';
import { merge, map, includes } from 'lodash-es';
import { NOT_FOUND_ERROR } from '@/errors';

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
  const newData = merge(defaultData, data);
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
          notifications.showErrorMessage('Failed to create merchant');
          console.warn(error);
        }
      },

      async fetchMerchantById({ commit, dispatch, rootState }, id) {
        try {
          const response = await axios.get(`${config.apiUrl}/admin/api/v1/merchants/${id}`, {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          });
          commit('merchant', mapDataApiToForm(response.data));
        } catch (error) {
          dispatch('setPageError', error.response.status, { root: true });
        }
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
            console.warn(error);
          }
        }
      },

      async fetchMerchantPaymentMethods({ commit, dispatch, rootState }, id) {
        try {
          const response = await axios.get(
            `${config.apiUrl}/admin/api/v1/merchants/${id}/methods`,
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );
          commit('paymentMethods', response.data);
        } catch (error) {
          dispatch('setPageError', error.response.status, { root: true });
        }
      },

      async updateMerchant({
        state, commit, dispatch, rootState,
      }) {
        dispatch('setIsLoading', true, { root: true });
        try {
          const response = await axios.put(
            `${config.apiUrl}/admin/api/v1/merchants`,
            state.merchant,
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
