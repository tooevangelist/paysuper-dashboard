import axios from 'axios';
import { get } from 'lodash-es';
import MerchantStore from '@/store/MerchantStore';
import { UNAUTHORIZED } from '@/errors';

export default function createUserStore({ notifications }) {
  const accessToken = localStorage.getItem('token') || '';
  return {
    state: {
      accessToken,
      isAuthorised: false,
      authIframeSrc: '',
      role: localStorage.getItem('userRole') || 'merchant',
    },

    mutations: {
      accessToken(state, value) {
        state.accessToken = value;
      },
      isAuthorised(state, value) {
        state.isAuthorised = value;
      },
      authIframeSrc(state, value) {
        state.authIframeSrc = value;
      },
      role(state, value) {
        state.role = value;
        localStorage.setItem('userRole', value);
      },
    },

    actions: {
      async initState({ commit, dispatch, rootState }) {
        commit('authIframeSrc', `${rootState.config.ownBackendUrl}/auth1/login`);

        try {
          await dispatch('initUserMerchantData');
        } catch (error) {
          await dispatch('refreshToken');
          if (error !== UNAUTHORIZED) {
            console.warn(error);
          }
        }
      },

      async initUserMerchantData({ commit, dispatch }) {
        try {
          await dispatch('Merchant/initState');
          commit('isAuthorised', true);
        } catch (error) {
          throw error;
        }
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
        try {
          const response = await axios.get(`${rootState.config.ownBackendUrl}/auth1/refresh`, {
            // this method requires only cookies for authrization
            withCredentials: true,
          });
          await dispatch('setAccessToken', response.data.access_token);
        } catch (error) {
          if (get(error, 'response.data.error.message') !== 'User not logged') {
            console.warn(error);
          }
          await dispatch('logout');
        }
      },

      async logout({ commit, rootState }) {
        try {
          await axios.get(`${rootState.config.ownBackendUrl}/auth1/logout`, {
            withCredentials: true,
          });
          // eslint-disable-next-line
        } catch (error) { }
        localStorage.removeItem('token');
        commit('isAuthorised', false);
        commit('accessToken', '');
        // router.push({ path: '/login' });
      },
    },

    namespaced: true,

    modules: {
      Merchant: MerchantStore({ notifications }),
    },
  };
}
