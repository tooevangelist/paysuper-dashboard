
import axios from 'axios';
import { get } from 'lodash-es';
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
        return Boolean(
          rootState.User.Merchant.merchant.id
          && rootGetters['User/userPermissions'].viewNotifications,
        );
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
      async initState({ commit, dispatch, getters }) {
        commit('notifications', []);
        dispatch('stopWatchForNotifications');
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
          if (!get(data, 'id')) {
            return;
          }
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
