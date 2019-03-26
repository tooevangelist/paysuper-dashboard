import Vue from 'vue';
import Vuex from 'vuex';
import assert from 'simple-assert';
import { includes } from 'lodash-es';

import DictionariesStore from './DictionariesStore';
import UserStore from './UserStore';
import resources from '@/resources';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    config: resources.config,
    isLoading: false,
    pageError: null,
  },
  mutations: {
    isLoading(state, value) {
      state.isLoading = value;
    },
    pageError(state, value) {
      state.pageError = value;
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

    setPageError({ commit }, value) {
      assert(includes([404, 500, null], value), `Unknown page error "${value}"`);
      commit('pageError', value);
    },
  },

  modules: {
    Dictionaries: DictionariesStore(resources),
    User: UserStore(resources),
  },
});
