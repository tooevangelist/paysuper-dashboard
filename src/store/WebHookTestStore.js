import axios from 'axios';
import assert from 'simple-assert';

export default function createWebHookTestStore() {
  return {
    state: {
      projectId: null,
      virtualItems: null,
      keys: null,
    },

    mutations: {
      projectId(state, data) {
        state.projectId = data;
      },

      virtualItems(state, data) {
        state.virtualItems = data;
      },

      keys(state, data) {
        state.keys = data;
      },
    },

    getters: {
      virtualItemsList(state) {
        return state.virtualItems.items.map(item => ({ label: item.name.en, value: item.id }));
      },

      keysList(state) {
        return state.keys.products.map(item => ({ label: item.name.en, value: item.id }));
      },
    },

    actions: {
      async initState({ commit }, { projectId }) {
        assert(projectId, 'WebHookTestStore requires projectId param');
        commit('projectId', projectId);
      },

      sendHook({ state }, data) {
        return axios.post(`{apiUrl}/admin/api/v1/projects/${state.projectId}/webhook/testing`, data);
      },

      async fetchVirtualItems({ commit }) {
        const response = await axios.get('{apiUrl}/admin/api/v1/products?');
        commit('virtualItems', response.data);
        return response;
      },

      async fetchKeys({ commit }) {
        const response = await axios.get('{apiUrl}/admin/api/v1/key-products?');
        commit('keys', response.data);
        return response;
      },
    },

    namespaced: true,
  };
}
