
import axios from 'axios';

export default function createUserNotificationsStore() {
  return {
    state: {
      notifications: [],
    },
    mutations: {
      notifications(state, value) {
        state.notifications = value;
      },
    },
    actions: {
      async initState({ dispatch, rootState }) {
        if (!rootState.User.Merchant.merchant) {
          return;
        }

        await dispatch('fetchNotifications');
      },

      async fetchNotifications({ commit, rootState }) {
        const { id } = rootState.User.Merchant.merchant;
        try {
          const { data } = await axios.get(
            `{apiUrl}/admin/api/v1/merchants/${id}/notifications?sort[]=-created_at`,
          );
          commit('notifications', data.items);
        } catch (error) {
          console.error(error);
        }
      },
    },

    namespaced: true,
  };
}
