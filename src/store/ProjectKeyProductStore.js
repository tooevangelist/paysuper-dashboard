import axios from 'axios';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';

function mapDataApiToForm(data) {
  return mergeApiValuesWithDefaults({
    long_description: {
      ru: '',
      en: '',
    },
    name: {
      ru: '',
      en: '',
    },
    description: {
      ru: '',
      en: '',
    },
    default_currency: 'USD',
    object: 'key_product',
    platforms: [],
    pricing: 'currency',

  }, data);
}

export default function createProjectKeyProductStore() {
  return {
    state: {
      keyProductId: null,
      keyProduct: null,
      platforms: [],
      keyCounts: {},
    },

    mutations: {
      keyProductId(store, data) {
        store.keyProductId = data;
      },
      keyProduct(store, data) {
        store.keyProduct = data;
      },
      platforms(store, data) {
        store.platforms = data;
      },
      keyCounts(store, data) {
        store.keyCounts = data;
      },
    },

    actions: {
      async initState({ commit, dispatch }, id) {
        if (id === 'new') {
          commit('keyProductId', null);
          const keyProduct = mapDataApiToForm({});
          commit('keyProduct', keyProduct);
          await dispatch('fetchPlatforms');
        } else {
          commit('keyProductId', id);
          await Promise.all([
            dispatch('fetchKeyProduct', id),
            dispatch('fetchPlatforms'),
          ]);
          await dispatch('fetchKeyCounts');
        }
      },

      async fetchKeyProduct({ state, commit, rootState }) {
        const url = `${rootState.config.apiUrl}/admin/api/v1/key-products/${state.keyProductId}`;
        const response = await axios.get(url);
        const keyProduct = mapDataApiToForm(response.data);
        commit('keyProduct', keyProduct);
      },

      async createKeyProduct({ commit, rootState }, { keyProduct, projectId }) {
        const url = `${rootState.config.apiUrl}/admin/api/v1/key-products`;
        const response = await axios.post(url, {
          ...keyProduct,
          project_id: projectId,
        });
        commit('keyProductId', response.data.id);
      },

      async updateKeyProduct({ state, rootState }, keyProduct) {
        const url = `${rootState.config.apiUrl}/admin/api/v1/key-products/${state.keyProductId}`;
        await axios.put(url, keyProduct);
      },

      async fetchPlatforms({ commit, rootState }) {
        const url = `${rootState.config.apiUrl}/admin/api/v1/platforms`;
        const response = await axios.get(url);
        commit('platforms', response.data.platforms);
      },

      async fetchKeyCounts({ state, dispatch }) {
        if (state.keyProduct.platforms) {
          await Promise.all(
            state.keyProduct.platforms.map(({ id }) => dispatch('getKeysCountByPlatform', id)),
          );
        }
      },

      async getKeysCountByPlatform({ state, rootState }, id) {
        const path = `/admin/api/v1/key-products/${state.keyProductId}/platforms/${id}/count`;
        const response = await axios.get(`${rootState.config.apiUrl}${path}`);
        console.log(11111, 'response', response);
      },

      async uploadKey({ state, commit, rootState }, { platformId, file }) {
        const path = `/admin/api/v1/key-products/${state.keyProductId}/platforms/${platformId}/file`;
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${rootState.config.apiUrl}${path}`, formData);
        commit('keyCounts', {
          ...state.keyCounts,
          [platformId]: response.data.total_count,
        });
      },
    },

    namespaced: true,
  };
}
