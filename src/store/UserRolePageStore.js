import axios from 'axios';

export default function createUserRolePageStore() {
  return {
    state: {
      user: null,
    },

    mutations: {
      user(state, data) {
        state.user = data;
      },
    },

    actions: {
      async initState({ dispatch }, { roleId }) {
        await dispatch('fetchRoleData', roleId);
      },

      async fetchRoleData({ commit }, roleId) {
        const response = await axios
          .get(`{apiUrl}/admin/api/v1/merchants/users/roles/${roleId}`);
        commit('user', response.data.user_role);
      },

      async delete({ commit }, user) {
        await axios.delete(`{apiUrl}/admin/api/v1/merchants/users/roles/${user.id}`);
        commit('user', user);
      },

      async changeRole({ commit }, user) {
        const response = await axios.put(`{apiUrl}/admin/api/v1/merchants/users/roles/${user.id}`, {
          email: user.email,
        });
        commit('user', response.data.user_role);
      },

      async resendInvite({ commit }, user) {
        const response = await axios.post('{apiUrl}/admin/api/v1/merchants/users/resend', {
          email: user.email,
          role: user.role,
        });
        if (response.data.user_role) {
          commit('user', response.data.user_role);
        }

        return response.data;
      },
    },

    namespaced: true,
  };
}
