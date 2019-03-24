import axios from 'axios';

export default function createMerchantsListStore({ config, notifications }) {
  return {
    state: () => ({
      merchants: [],
    }),

    mutations: {
      merchants(store, data) {
        store.merchants = data;
      },
    },

    actions: {
      initState({ dispatch }) {
        return dispatch('fetchMerchants');
      },

      fetchMerchants({ commit, rootState }) {
        return axios.get(`${config.apiUrl}/api/v1/s/merchants`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).then((response) => {
          commit('merchants', response.data);
        }).catch(() => { });
      },

      async removeMerchant({ dispatch, rootState }, id) {
        dispatch('setIsLoading', true, { root: true });
        try {
          await axios.delete(`${config.apiUrl}/api/v1/s/merchants/${id}`, {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          });
          await dispatch('fetchMerchants');
          notifications.showSuccessMessage('Merchant disactivated');
        } catch (error) {
          notifications.showErrorMessage('Failed to disactivate merchant');
        }
        dispatch('setIsLoading', false, { root: true });
      },
    },

    namespaced: true,
  };
}
