import axios from 'axios';

export default function createMerchantsListStore({ config }) {
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
        return axios.get(`${config.apiUrl}/admin/api/v1/merchants`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).then((response) => {
          commit('merchants', response.data);
        }).catch(() => { });
      },
    },

    namespaced: true,
  };
}
