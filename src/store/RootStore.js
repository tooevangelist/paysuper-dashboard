import Vue from 'vue';
import Vuex from 'vuex';

import DictionariesStore from './DictionariesStore';
import UserStore from './UserStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    config: {
      ownBackendUrl: process.env.VUE_APP_BACKEND_DOMAIN,
      apiUrl: process.env.VUE_APP_P1PAYAPI_URL,
      projectID: process.env.VUE_APP_P1PAYAPI_PROJECT_IDENTIFIER,
    },
  },
  getters: {
    getUser: state => state.user || null,
  },
  actions: {
    async initState({ dispatch }) {
      await dispatch('Dictionaries/initState');
    },
  },

  modules: {
    Dictionaries: DictionariesStore,
    User: UserStore,
  },
});
