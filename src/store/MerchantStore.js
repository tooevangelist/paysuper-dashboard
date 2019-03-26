import axios from 'axios';

export default function createMerchantStore({ config, notifications }) {
  return {
    state: () => ({
      merchant: null,
    }),

    mutations: {
      merchant(store, data) {
        store.merchant = data;
      },
    },

    actions: {
      async initState({ commit, dispatch }, id) {
        if (id === 'new') {
          commit('merchant', {
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
          });
          return;
        }
        await dispatch('fetchMerchant', id);
      },
      async createMerchant({
        state, commit, dispatch, rootState,
      }) {
        dispatch('setIsLoading', true, { root: true });
        try {
          const response = await axios.post(
            `${config.apiUrl}/admin/api/v1/merchants`,
            state.merchant,
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );
          commit('merchant', response.data);
          notifications.showSuccessMessage('Merchant created successfully');
        } catch (error) {
          notifications.showErrorMessage('Failed to create merchant');
        }
        dispatch('setIsLoading', false, { root: true });
      },
      fetchMerchant({ commit, dispatch, rootState }, id) {
        return axios.get(`${config.apiUrl}/admin/api/v1/merchants/${id}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).then((response) => {
          commit('merchant', response.data);
        }).catch((error) => {
          dispatch('setPageError', error.response.status, { root: true });
        });
      },
      // updateMerchant({ commit, rootState }, data) {
      //   return api.update(data, rootState.User.accessToken)
      //     .then((response) => {
      //       commit('merchant', response.data);
      //       notifications.showSuccessMessage('Merchant data updated successfully');
      //       return response;
      //     })
      //     .catch((error) => {
      //       notifications.showErrorMessage(error);
      //     });
      // },
    },

    namespaced: true,
  };
}
