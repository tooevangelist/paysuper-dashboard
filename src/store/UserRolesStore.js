import axios from 'axios';
import qs from 'qs';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
import userRolesScheme from '@/schemes/userRolesScheme';

const searchBuilder = new SearchBuilder(userRolesScheme);

export default function createUserRolesStore() {
  return {
    state: () => ({
      users: {}, // no pagination here
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
      users(store, data) {
        store.users = data;
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
      async initState({ getters, dispatch }, { query }) {
        const filters = getters.getFilterValues();
        dispatch('submitFilters', filters);
        dispatch('initQuery', query);
        await dispatch('fetchUsers');
      },

      async fetchUsers({ state, commit }) {
        const query = qs.stringify({
          ...state.apiQuery,
        }, { arrayFormat: 'brackets' });
        const url = `{apiUrl}/admin/api/v1/merchants/users?${query}`;

        const response = await axios.get(url);
        const users = response.data;
        // append mode for infinite scroll
        commit('users', users);
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

      async invite({ dispatch }, user) {
        const response = await axios.post('{apiUrl}/admin/api/v1/merchants/invite', user);
        await dispatch('fetchUsers');
        return response.data;
      },

      async delete({ dispatch }, user) {
        await axios.delete(`{apiUrl}/admin/api/v1/merchants/users/roles/${user.id}`);
        await dispatch('fetchUsers');
      },

      async changeRole({ dispatch }, user) {
        await axios.put(`{apiUrl}/admin/api/v1/merchants/users/roles/${user.id}`, {
          email: user.email,
          role: user.role,
        });
        await dispatch('fetchUsers');
      },
    },

    namespaced: true,
  };
}
