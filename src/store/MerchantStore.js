import api from '@/api/merchant';

export default function createMerchantStore({ notifications }) {
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
      initState({ dispatch }) {
        return dispatch('fetchMerchant');
      },
      createMerchant({ commit, rootState }) {
        return api.create({ email: rootState.User.email }, rootState.User.accessToken)
          .then((response) => {
            commit('merchant', response.data);
            return response;
          });
      },
      fetchMerchant({ commit, rootState }) {
        return api.get(rootState.User.accessToken)
          .then((response) => {
            commit('merchant', response.data);
            return response;
          }).catch(() => {

          });
      },
      updateMerchant({ commit, rootState }, data) {
        return api.update(data, rootState.User.accessToken)
          .then((response) => {
            commit('merchant', response.data);
            notifications.showSuccessMessage('Merchant data updated successfully');
            return response;
          })
          .catch((error) => {
            notifications.showErrorMessage(error);
          });
      },
    },

    namespaced: true,
  };
}
