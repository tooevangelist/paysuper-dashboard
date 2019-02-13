import api from '../api/merchant';

export default {
  state: () => ({
    merchant: null,
  }),

  mutations: {
    merchant(store, data) {
      store.merchant = data;
    },
  },

  actions: {
    create({ commit, rootState }) {
      return api.create({ email: rootState.user.email }, rootState.user.accessToken)
        .then((response) => {
          commit('merchant', response.data);
          return response;
        });
    },
    get({ commit, rootState }) {
      return api.get(rootState.user.accessToken)
        .then((response) => {
          commit('merchant', response.data);
          return response;
        }).catch(() => {

        });
    },
    update({ commit, rootState }, data) {
      return api.update(data, rootState.user.accessToken)
        .then((response) => {
          commit('merchant', response.data);
          return response;
        });
    },
  },
};

