import axios from 'axios';
import MerchantStore from '@/store/MerchantStore';
import UserNotificationsStore from './UserNotificationsStore';
import { UNAUTHORIZED } from '@/errors';

export default function createUserStore(resources) {
  const accessToken = localStorage.getItem('token') || '';
  return {
    state: {
      accessToken,
      isAuthorised: false,
      role: localStorage.getItem('userRole') || 'merchant',
    },

    mutations: {
      accessToken(state, value) {
        state.accessToken = value;
      },
      isAuthorised(state, value) {
        state.isAuthorised = value;
      },
      role(state, value) {
        state.role = value;
        localStorage.setItem('userRole', value);
      },
    },

    getters: {
      authIframeSrc(state, getters, rootState) {
        return `${rootState.config.ownBackendUrl}/auth1/login`;
      },
    },

    actions: {
      async initState({ dispatch }) {
        try {
          await dispatch('initUserMerchantData');
          dispatch('Notifications/initState');
        } catch (error) {
          if (error !== UNAUTHORIZED) {
            console.error(error);
          }
        }
      },

      async initUserMerchantData({ commit, dispatch }) {
        await dispatch('Merchant/fetchMerchant');
        commit('isAuthorised', true);
      },

      /**
       * Set new access token to store and localeStorage
       * @param commit
       * @param token
       */
      setAccessToken({ commit }, token) {
        localStorage.setItem('token', token);
        commit('isAuthorised', true);
        commit('accessToken', token);
      },

      /**
       * Refresh expired token
       * @param commit
       * @param state
       * @param dispatch
       * @returns {Promise.<T>|Promise<any>|Promise}
       */
      async refreshToken({ dispatch, rootState }) {
        const response = await axios.get(`${rootState.config.ownBackendUrl}/auth1/refresh`, {
          // this method requires only cookies for authrization
          withCredentials: true,
        });
        await dispatch('setAccessToken', response.data.access_token);
      },

      async logout({ commit, rootState }) {
        try {
          await axios.get(`${rootState.config.ownBackendUrl}/auth1/logout`, {
            withCredentials: true,
          });
          // eslint-disable-next-line
        } catch { }
        localStorage.removeItem('token');
        commit('isAuthorised', false);
        commit('accessToken', '');
      },
    },

    namespaced: true,

    modules: {
      Merchant: MerchantStore(resources),
      Notifications: UserNotificationsStore(resources),
    },
  };
}
