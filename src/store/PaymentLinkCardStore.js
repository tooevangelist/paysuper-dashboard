import axios from 'axios';
import qs from 'qs';

export default function createPaymentLinkPageStore() {
  return {
    state: {
      apiQuery: {},
      productsList: [],
      projectsList: [],
    },

    mutations: {
      apiQuery(store, value) {
        store.apiQuery = value;
      },
      productsList(store, data) {
        store.productsList = data;
      },
      projectsList(store, data) {
        store.projectsList = data;
      },
    },

    actions: {
      async initState({ dispatch }) {
        await dispatch('fetchProjects');
      },

      async fetchProducts({ state, commit, rootState }, projectId) {
        const query = qs.stringify({
          ...state.apiQuery,
          project_id: projectId,
          limit: 30,
        }, { arrayFormat: 'brackets' });
        const url = `${rootState.config.apiUrl}/admin/api/v1/products?${query}`;

        const response = await axios.get(url);
        const virtualItems = {
          ...response.data,
          items: response.data.items || [],
        };
        commit('productsList', virtualItems);
      },

      async createItem({ rootState }, data) {
        await axios.post(`${rootState.config.apiUrl}/admin/api/v1/paylinks`, data);
      },

      async fetchProjects({ state, commit, rootState }) {
        const query = qs.stringify({
          ...state.apiQuery,
          merchant_id: rootState.User.Merchant.merchant.id,
        }, { arrayFormat: 'brackets' });

        const { data } = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/projects?${query}`);
        commit('projectsList', data);
      },
    },


    namespaced: true,
  };
}
