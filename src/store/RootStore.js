import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { get } from 'lodash-es';

import DictionariesStore from './DictionariesStore';
import LeaveFeedbackStore from './LeaveFeedbackStore';
import UserStore from './UserStore';
import ProductStore from './ProductStore';
import resources from '@/resources';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    config: {},
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
        dispatch('Dictionaries/initState'),
        dispatch('User/initState'),
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
        return;
      }

      const errorCode = get(error, 'response.status', 520);
      commit('pageError', errorCode);
      console.error(error);
    },

    async uploadImage({ rootState }, imagefile) {
      const formData = new FormData();
      formData.append('file', imagefile);
      const { data } = await axios.post(`${rootState.config.ownBackendUrl}/upload_file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
  },

  modules: {
    Dictionaries: DictionariesStore(resources),
    LeaveFeedback: LeaveFeedbackStore(resources),
    User: UserStore(resources),
    Products: ProductStore(resources),
  },
});
