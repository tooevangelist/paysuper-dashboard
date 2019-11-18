import axios from 'axios';
import assert from 'simple-assert';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';

const DEFAULTS = {
  images: [],
  name: {
    en: '',
  },
  description: {
    en: '',
  },
  long_description: {
    en: '',
  },
  billing_type: 'real',
  enabled: true,
  pricing: 'manual',
  prices: [],
};

export default function createProjectVirtualItemPageStore() {
  return {
    state: {
      virtualItem: null,
      itemId: null,
    },

    mutations: {
      projectId(store, data) {
        store.projectId = data;
      },
      itemId(state, data) {
        state.itemId = data;
      },
      virtualItem(state, data) {
        state.virtualItem = mergeApiValuesWithDefaults(DEFAULTS, data);
      },
    },

    actions: {
      async initState({ dispatch, commit }, { projectId, itemId }) {
        assert(projectId, 'ProjectVirtualItemsStore requires projectId param');
        commit('projectId', projectId);
        commit('itemId', itemId);
        if (itemId !== 'new') {
          await dispatch('fetchItemData', itemId);
        } else {
          commit('virtualItem', {});
        }
      },

      async fetchItemData({ commit, rootState }, id) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/products/${id}`);
        commit('virtualItem', response.data.item);
      },

      /**
       * Edit Virtual item
       * @param rootState
       * @param commit
       * @param data {Object}
       * @param projectId {String}
       * @returns {Promise<void>}
       */
      async editItem({ rootState, commit }, { data, projectId }) {
        const response = await axios.put(`${rootState.config.apiUrl}/admin/api/v1/products/${data.id}`, {
          ...data,
          project_id: projectId,
        });
        commit('virtualItem', response.data);
      },

      /**
       * Create new Virtual item
       * @param rootState
       * @param data {Object}
       * @param projectId {String}
       * @returns {Promise<void>}
       */
      async createItem({ rootState }, { data, projectId }) {
        await axios.post(`${rootState.config.apiUrl}/admin/api/v1/products`, {
          ...data,
          project_id: projectId,
        });
      },
    },

    namespaced: true,
  };
}
