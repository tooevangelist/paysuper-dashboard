import axios from 'axios';
import qs from 'qs';
import assert from 'simple-assert';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
import projectTransactionsScheme from '@/schemes/projectTransactionsScheme';

const searchBuilder = new SearchBuilder(projectTransactionsScheme);

export default function createProjectVirtualItemsStore() {
  return {
    state: () => ({
      transactionsList: {
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
      transactionsList(store, data) {
        store.transactionsList = data;
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
    },

    actions: {
      async initState({ getters, dispatch, commit }, { projectId, query }) {
        assert(projectId, 'ProjectVirtualItemsStore requires projectId param');
        const filters = getters.getFilterValues();
        commit('projectId', projectId);
        dispatch('submitFilters', filters);
        dispatch('initQuery', query);
        await dispatch('fetchTransactions');
      },

      async fetchTransactions({ state, commit, rootState }) {
        const query = qs.stringify({
          ...state.apiQuery,
        }, { arrayFormat: 'brackets' });
        const url = `${rootState.config.apiUrl}/admin/api/v1/order?${query}&project_date_from=1569888000`;

        const response = await axios.get(url);
        const transactionsList = {
          ...response.data,
          items: response.data.items || [],
        };
        // append mode for infinite scroll
        if (state.apiQuery.offset > 0 && transactionsList.count === state.transactionsList.count) {
          transactionsList.items = [
            ...state.transactionsList.items,
            ...transactionsList.items,
          ];
        }
        commit('transactionsList', transactionsList);
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
    },

    namespaced: true,
  };
}
