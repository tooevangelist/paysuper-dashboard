import axios from 'axios';

export default function createMerchantStore({ config }) {
  return {
    state: () => ({
      projects: [],
    }),

    mutations: {
      projects(store, data) {
        store.projects = data;
      },
    },

    actions: {
      initState({ dispatch }) {
        return dispatch('fetchProjects');
      },

      fetchProjects({ commit, rootState }) {
        return axios.get(`${config.apiUrl}/api/v1/s/project`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).then((response) => {
          commit('projects', response.data);
        }).catch(() => { });
      },

      removeProject({ dispatch, rootState }, id) {
        return axios.delete(`${config.apiUrl}/api/v1/s/project/${id}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).then(() => {
          dispatch('fetchProjects');
        }).catch(() => { });
      },
    },

    namespaced: true,
  };
}
