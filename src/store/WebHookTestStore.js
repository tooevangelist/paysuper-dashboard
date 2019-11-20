import axios from 'axios';

export default function createWebHookTestStore() {
  return {
    state: {
      projectId: null,
    },

    mutations: {
      projectId(state, data) {
        state.projectId = data;
      },
    },

    actions: {
      async sendHook({ state }, data) {
        const response = await axios.post(`{apiUrl}/admin/api/v1/projects/${state.projectId}/webhook/testing`, data);
        return response;
      },
    },

    namespaced: true,
  };
}
