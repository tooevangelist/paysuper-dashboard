import Vue from 'vue';
import Vuex from 'vuex';

import DictionariesStore from './DictionariesStore';
import UserStore from './UserStore';
import resources from '@/resources';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    config: resources.config,
    isLoading: false,
  },
  mutations: {
    isLoading(state, value) {
      state.isLoading = value;
    },
  },
  getters: {
    getUser: state => state.user || null,
  },
  actions: {
    async initState({ dispatch }) {
      await Promise.all([
        dispatch('User/initState'),
        dispatch('Dictionaries/initState'),
      ]);
    },

    setIsLoading({ commit }, value) {
      commit('isLoading', value);
    },
  },

  modules: {
    Dictionaries: DictionariesStore,
    User: UserStore(resources),
  },
});
