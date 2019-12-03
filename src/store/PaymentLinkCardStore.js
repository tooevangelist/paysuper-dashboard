import axios from 'axios';
import qs from 'qs';
import assert from 'simple-assert';

export default function createPaymentLinkPageStore() {
  return {
    state: {
      apiQuery: {},
      productsList: [],
      projectsList: [],
      linkItem: null,
      linkId: null,
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
      linkId(state, data) {
        state.linkId = data;
      },
      linkItem(state, data) {
        state.linkItem = data;
      },
    },

    actions: {
      async initState({ commit, dispatch }, { linkId }) {
        assert(linkId, 'PaymentLinkPageStore requires linkId param');
        commit('linkId', linkId);
        if (linkId !== 'new') {
          await dispatch('fetchLinkData', linkId);
        } else {
          commit('linkItem', {});
        }

        await dispatch('fetchProjects');
      },

      async fetchLinkData({ commit, rootState }, id) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/paylinks/${id}`);
        commit('linkItem', response.data);
      },

      async fetchProducts({ state, commit, rootState }, { projectId, type }) {
        const query = qs.stringify({
          ...state.apiQuery,
          project_id: projectId,
          limit: 30,
        }, { arrayFormat: 'brackets' });
        const url = `${rootState.config.apiUrl}/admin/api/v1/${type}?${query}`;

        const response = await axios.get(url);
        const path = type === 'key-products' ? 'products' : 'items';
        const virtualItems = {
          items: response.data[path] || [],
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
