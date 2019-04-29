import axios from 'axios';
import qs from 'qs';

export default function createProjectsListStore({ config, notifications }) {
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
        const query = qs.stringify({
          // merchant_id: rootState.User.Merchant.merchant.id,
        });
        return axios.get(`${config.apiUrl}/admin/api/v1/projects?${query}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).then((response) => {
          commit('projects', response.data);
        }).catch(() => { });
      },

      async removeProject({ dispatch, rootState }, id) {
        dispatch('setIsLoading', true, { root: true });
        try {
          await axios.delete(`${config.apiUrl}/admin/api/v1/projects/${id}`, {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          });
          await dispatch('fetchProjects');
          notifications.showSuccessMessage('Project disactivated');
        } catch (error) {
          notifications.showErrorMessage('Failed to disactivate project');
        }
        dispatch('setIsLoading', false, { root: true });
      },
    },

    namespaced: true,
  };
}
