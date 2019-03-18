import axios from 'axios';
// import router from '@/router';

export default function createUserStore({ config }) {
  const accessToken = localStorage.getItem('token') || '';
  return {
    state: {
      accessToken,
      isAuthorised: false,
      authIframeSrc: `${config.ownBackendUrl}/auth1/login`,
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
      async initState({ state, dispatch }) {
        if (state.accessToken) {
          await dispatch('refreshToken');
        }
      },

      // async fetchUserInfo({ state }) {
      //   try {
      //     const userinfoResult = await axios.get(config.apiUserInfoUrl, {
      //       headers: {
      //         Authorization: `Bearer ${state.accessToken}`,
      //         // 'X-CLIENT-ID': rootState.clientID,
      //       },
      //     });

      //     console.log(11111, 'userinfoResult', userinfoResult);
      //     // commit('userinfo', userinfoResult.data);
      //     // eslint-disable-next-line
      //   } catch (error) {
      //     // console.log(11111, 'error', error);
      //   }
      // },

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
        return axios.get(`${config.ownBackendUrl}/auth1/refresh`, {
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

      async logout({ commit }) {
        try {
          await axios.get(`${config.ownBackendUrl}/auth1/logout`, {
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
  };
}
