
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
          throw new Error('User.Merchant must be inited before fetching user notifications');
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

      async markNotificationAsReaded({ state, commit, rootState }, notificationId) {
        const { id } = rootState.User.Merchant.merchant;
        try {
          const { data } = await axios.put(
            `{apiUrl}/admin/api/v1/merchants/${id}/notifications/${notificationId}/mark-as-read`,
          );
          const newNotifications = state.notifications.map((item) => {
            if (item.id === data.id) {
              return data;
            }
            return item;
          });
          commit('notifications', newNotifications);
        } catch (error) {
          console.error(error);
        }
      },
    },

    namespaced: true,
  };
}
