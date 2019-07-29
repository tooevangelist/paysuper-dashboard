import axios from 'axios';
import { get } from 'lodash-es';
import MerchantStore from '@/store/MerchantStore';
import { NOT_FOUND_ERROR, UNAUTHORIZED } from '@/errors';
// import router from '@/router';

export default function createUserStore({ config, notifications }) {
  const accessToken = localStorage.getItem('token') || '';
  return {
    state: {
      accessToken,
      isAuthorised: false,
      authIframeSrc: `${config.ownBackendUrl}/auth1/login`,
      isAdmin: false,
    },

    mutations: {
      accessToken(state, value) {
        state.accessToken = value;
      },

      isAuthorised(state, value) {
        state.isAuthorised = value;
      },

      isAdmin(state, value) {
        state.isAdmin = value;
      },
    },

    actions: {
      async initState({ dispatch }) {
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
          await dispatch('Merchant/fetchMerchant');
          commit('isAuthorised', true);
        } catch (error) {
          if (error === NOT_FOUND_ERROR) {
            await dispatch('Merchant/createMerchant', {
              contacts: {
                authorized: {},
                technical: {},
              },
              banking: {},
            });
          }

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
      async refreshToken({ dispatch }) {
        try {
          const response = await axios.get(`${config.ownBackendUrl}/auth1/refresh`, {
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

      async logout({ commit }) {
        try {
          await axios.get(`${config.ownBackendUrl}/auth1/logout`, {
            withCredentials: true,
          });
          // eslint-disable-next-line
        } catch (error) { }
        // localStorage.removeItem('token');
        commit('isAuthorised', false);
        commit('accessToken', '');
        // router.push({ path: '/login' });
      },
    },

    namespaced: true,

    modules: {
      Merchant: MerchantStore({ config, notifications }),
    },
  };
}
