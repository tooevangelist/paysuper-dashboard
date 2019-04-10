import axios from 'axios';
import qs from 'qs';
import { isEmpty } from 'lodash-es';
import SearchBuilder from '@/tools/SearchBuilder';
import merchantsListScheme from '@/schemes/merchantsListScheme';

const searchBuilder = new SearchBuilder(merchantsListScheme);

export default function createMerchantHistoryStore({ config }) {
  return {
    state: () => ({
      merchantId: null,
      merchants: {
        items: [],
        count: 0,
      },
      filterValues: {},
      query: {},
      apiQuery: {},
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
      merchantId(store, data) {
        store.merchantId = data;
      },
      merchants(store, data) {
        store.merchants = data;
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
      async initState({ commit, dispatch }, { merchantId, query }) {
        commit('merchantId', merchantId);
        dispatch('initQuery', query);
        await dispatch('fetchMerchants');
      },

      async fetchMerchants({ state, commit, rootState }) {
        const query = qs.stringify(state.apiQuery);
        const url = `${config.apiUrl}/admin/api/v1/merchants/${state.merchantId}/notifications?${query}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        });
        const merchants = !isEmpty(response.data) ? response.data : {
          items: [],
          count: 0,
        };
        commit('merchants', merchants);
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
