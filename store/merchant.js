import api from '../api/merchant';

export const state = () => ({
  merchant: null,
});

export const getters = {
  getMerchant: state => state.merchant || null,
};

export const mutations = {
  setMerchant(store, data) {
    store.merchant = data;
  },
};

export const actions = {
  create({ commit, rootState }) {
    return api.create({ email: rootState.user.email }, rootState.user.accessToken)
      .then((response) => {
        commit('setMerchant', response.data);
        return response;
      });
  },
  get({ commit, rootState }) {
    return api.get(rootState.user.accessToken)
      .then((response) => {
        commit('setMerchant', response.data);
        return response;
      }).catch(() => {

      });
  },
  update({ commit, rootState }, data) {
    return api.update(data, rootState.user.accessToken)
      .then((response) => {
        commit('setMerchant', response.data);
        return response;
      });
  },
};
