import axios from 'axios';
import router from '@/router';

export default {
  state: {
    accessToken: '',
    isAuthorised: false,
  },

  mutations: {
    accessToken(state, value) {
      state.accessToken = value;
    },

    isAuthorised(state, value) {
      state.isAuthorised = value;
    },
  },

  actions: {
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
    refreshToken({ dispatch }) {
      return axios.get(`${process.env.VUE_APP_BACKEND_DOMAIN}/auth1/refresh`, {
        // this method requires only cookies for authrization
        withCredentials: true,
      })
        .then((response) => {
          dispatch('setAccessToken', response.data.accessToken);
          return response;
        })
        .catch((error) => {
          console.warn(error);
          dispatch('logout');
        });
    },

    logout({ commit }) {
      axios.get(`${process.env.VUE_APP_BACKEND_DOMAIN}/auth1/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem('token');
      commit('isAuthorised', false);
      commit('accessToken', '');
      router.push({ path: '/login' });
    },
  },

  namespaced: true,
};
