
import axios from 'axios';
import Centrifuge from 'centrifuge';
import getUnixTime from 'date-fns/getUnixTime';

export default function createUserNotificationsStore() {
  let centrifuge = null;

  return {
    state: {
      isWatchingInited: false,
      notifications: [],
    },
    getters: {
      isEnabled(state, getters, rootState, rootGetters) {
        return rootGetters['User/userPermissions'].viewNotifications || false;
      },
    },
    mutations: {
      isWatchingInited(state, value) {
        state.isWatchingInited = value;
      },
      notifications(state, value) {
        state.notifications = value;
      },
    },
    actions: {
      async initState({ dispatch, getters }) {
        if (!getters.isEnabled) {
          return;
        }
        await dispatch('fetchNotifications');
        dispatch('watchForNotifications');
      },

      async fetchNotifications({ commit }) {
        try {
          const { data } = await axios.get(
            '{apiUrl}/admin/api/v1/merchants/notifications?sort[]=-created_at',
          );
          commit('notifications', data.items || []);
        } catch (error) {
          console.error(error);
        }
      },

      async markNotificationAsReaded({ state, commit }, notificationId) {
        try {
          const { data } = await axios.put(
            `{apiUrl}/admin/api/v1/merchants/notifications/${notificationId}/mark-as-read`,
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

      watchForNotifications({
        state, commit, getters, rootState,
      }) {
        const { merchant } = rootState.User.Merchant;
        if (
          !getters.isEnabled || state.isWatchingInited || !merchant.id || !merchant.centrifugo_token
        ) {
          return;
        }
        centrifuge = new Centrifuge(rootState.config.websocketUrl);

        centrifuge.setToken(merchant.centrifugo_token);
        centrifuge.subscribe(`paysuper:merchant#${merchant.id}`, async ({ data }) => {
          commit('notifications', [
            {
              ...data,
              created_at: data.created_at || {
                seconds: getUnixTime(new Date()),
              },
            },
            ...state.notifications,
          ]);
        });
        centrifuge.connect();
        commit('isWatchingInited', true);
      },

      stopWatchForNotifications({ commit }) {
        if (centrifuge) {
          centrifuge.disconnect();
          centrifuge = null;
        }
        commit('isWatchingInited', false);
      },
    },

    namespaced: true,
  };
}
