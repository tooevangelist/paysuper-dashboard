import axios from 'axios';
import qs from 'qs';
import assert from 'simple-assert';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
import projectVirtualItemsScheme from '@/schemes/projectVirtualItemsScheme';

const searchBuilder = new SearchBuilder(projectVirtualItemsScheme);

export default function createProjectVirtualItemsStore() {
  return {
    state: () => ({
      virtualItems: {
        items: [],
        count: 0,
      },
      filterValues: {},
      query: {},
      apiQuery: {},
      currentItem: {},
    }),

    getters: {
      getFilterValues(state) {
        return filterNames => searchBuilder.getFilterValues({
          filterNames,
          query: state.query,
          dictionaries: {},
        });
      },

      getEmptyFilterValues() {
        return filterNames => searchBuilder.getEmptyFilterValues({
          filterNames,
        });
      },
    },

    mutations: {
      projectId(store, data) {
        store.projectId = data;
      },
      virtualItems(store, data) {
        store.virtualItems = data;
      },
      filterValues(store, value) {
        store.filterValues = value;
      },
      query(store, value) {
        store.query = value;
      },
      apiQuery(store, value) {
        store.apiQuery = value;
      },
      setCurrentItem(store, value) {
        store.currentItem = value;
      },
    },

    actions: {
      async initState({ getters, dispatch, commit }, { projectId, query }) {
        assert(projectId, 'ProjectVirtualItemsStore requires projectId param');
        const filters = getters.getFilterValues();
        commit('projectId', projectId);
        dispatch('submitFilters', filters);
        dispatch('initQuery', query);
        await dispatch('fetchItems');
      },

      async fetchItems({ state, commit, rootState }) {
        const query = qs.stringify({
          ...state.apiQuery,
        }, { arrayFormat: 'brackets' });
        const url = `${rootState.config.apiUrl}/admin/api/v1/products?${query}`;

        const response = await axios.get(url);
        const virtualItems = {
          ...response.data,
          items: response.data.items || [],
        };
        // append mode for infinite scroll
        if (state.apiQuery.offset > 0 && virtualItems.count === state.virtualItems.count) {
          virtualItems.items = [
            ...state.virtualItems.items,
            ...virtualItems.items,
          ];
        }
        commit('virtualItems', virtualItems);
      },

      initQuery({ commit }, query) {
        commit('query', query);

        const apiQuery = searchBuilder.getApiQueryFromQuery(query);
        commit('apiQuery', apiQuery);
      },

      submitFilters({ state, commit }, filters) {
        const newFilters = {
          ...state.filterValues,
          ...filters,
        };
        commit('filterValues', newFilters);

        const apiQuery = searchBuilder.getApiQueryFromFilterValues(newFilters);
        commit('apiQuery', apiQuery);

        const query = searchBuilder.getQueryFromFilterValues(newFilters);
        commit('query', query);
      },

      async deleteItem({ rootState }, id) {
        await axios.delete(`${rootState.config.apiUrl}/admin/api/v1/products/${id}`);
      },

      /**
       * Get Virtual item info by id
       * @param rootState
       * @param id
       * @returns {Promise<void>}
       */
      async getProductInfo({ rootState }, id) {
        await axios.get(`${rootState.config.apiUrl}/admin/api/v1/products/${id}`);
      },

      /**
       * Test poop
       * @param rootState
       * @returns {Promise<void>}
       */
      async createItem({ rootState }) {
        const poop = {
          object: 'product',
          type: 'simple_product',
          sku: 'Bobba_Fett_helm_eu',
          name: { en: 'Bobba Fett Helment' },
          default_currency: 'USD',
          enabled: true,
          prices: [{ amount: 99.50, currency: 'USD', region: 'USD' }],
          description: { en: '' },
          long_description: {},
          project_id: rootState.Project.project.id,
        };
        await axios.post(`${rootState.config.apiUrl}/admin/api/v1/products`, poop);
      },
    },

    namespaced: true,
  };
}
