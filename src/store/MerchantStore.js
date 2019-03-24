import axios from 'axios';

export default function createMerchantStore({ config }) {
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
      // createMerchant({ commit, rootState }) {
      //   return api.create({ email: rootState.User.email }, rootState.User.accessToken)
      //     .then((response) => {
      //       commit('merchant', response.data);
      //       return response;
      //     });
      // },
      fetchMerchant({ commit, rootState }, id) {
        return axios.get(`${config.apiUrl}/api/v1/s/merchants/${id}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).then((response) => {
          commit('merchant', response.data);
        }).catch(() => { });
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
