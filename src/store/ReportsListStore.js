import axios from 'axios';
import qs from 'qs';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
import projectReportsScheme from '@/schemes/projectReportsScheme';

const searchBuilder = new SearchBuilder(projectReportsScheme);

export default function createReportsListStore() {
  return {
    state: () => ({
      reportsList: {
        items: [],
        count: 0,
      },
      balanceDebit: 0,
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
      reportsList(store, data) {
        store.reportsList = data;
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
      balanceDebit(store, value) {
        store.balanceDebit = value;
      },
    },

    actions: {
      async initState({ getters, dispatch }, { query }) {
        const filters = getters.getFilterValues();
        dispatch('submitFilters', filters);
        dispatch('initQuery', query);
        await dispatch('fetchReports');
      },

      async fetchReports({ state, commit, rootState }) {
        const query = qs.stringify({
          ...state.apiQuery,
          merchant_id: rootState.User.Merchant.merchant.id,
        }, { arrayFormat: 'brackets' });
        const url = `${rootState.config.apiUrl}/admin/api/v1/royalty_reports?${query}`;

        const response = await axios.get(url);
        const reportsList = {
          ...response.data,
          items: response.data.items || [],
        };
        // append mode for infinite scroll
        if (state.apiQuery.offset > 0 && reportsList.count === state.reportssList.count) {
          reportsList.items = [
            ...state.reportsList.items,
            ...reportsList.items,
          ];
        }
        commit('reportsList', reportsList);
      },

      async getDebit({ commit, rootState }) {
        const url = `${rootState.config.apiUrl}/admin/api/v1/balance`;
        const response = await axios.get(url);
        const balanceDebit = response.data.debit || 0;

        commit('balanceDebit', balanceDebit);
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
