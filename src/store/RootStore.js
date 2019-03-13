import Vue from 'vue';
import Vuex from 'vuex';

import DictionariesStore from './DictionariesStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
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
  },
});
