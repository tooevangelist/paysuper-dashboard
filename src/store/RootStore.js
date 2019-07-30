import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { includes } from 'lodash-es';

import DictionariesStore from './DictionariesStore';
import UserStore from './UserStore';
import resources from '@/resources';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    config: {
      ownBackendUrl: '',
      apiUrl: 'https://p1payapi.tst.protocol.one',
    },
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
    config(state, value) {
      state.config = value;
    },
  },
  getters: {
    getUser: state => state.user || null,
  },
  actions: {
    async initState({ dispatch }) {
      await dispatch('fetchConfig');
      await Promise.all([
        dispatch('User/initState'),
        dispatch('Dictionaries/initState'),
      ]);
    },

    /**
     * Wtf? Because in production there is a need to pass env-variables
     * AFTER building phase - when the app is actually starting
     * So the variables are passed through local node-backend
     * In local development the backend is running on another port so we're
     * duplicating the service through vue.config.js
     */
    async fetchConfig({ commit }) {
      const { data } = await axios.get('/conf');
      commit('config', data);
    },

    setIsLoading({ commit }, value) {
      commit('isLoading', value);
    },

    setPageError({ commit }, error) {
      if (!error) {
        commit('pageError', null);
      } else if (error.response && includes([404, 500], error.response.status)) {
        commit('pageError', error.response.status);
      } else {
        console.error(error);
      }
    },
  },

  modules: {
    Dictionaries: DictionariesStore(resources),
    User: UserStore(resources),
  },
});
