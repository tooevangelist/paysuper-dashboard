# SearchBuilder

```
import qs from 'qs';
import SearchBuilder from '@/tools/SearchBuilder';
import abcScheme from '@/schemes/abcScheme';
const searchBuilder = new SearchBuilder(abcScheme);

export default function createAbcStore({ config }) {
  return {
    state: () => ({
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
      async initState({ dispatch }, { query }) {
        await dispatch('initQuery', query);
      },

      async initQuery({ commit, dispatch }, query) {
        commit('query', query);

        const apiQuery = searchBuilder.getApiQueryFromQuery(query);
        commit('apiQuery', apiQuery);

        const filterValues = searchBuilder.getEmptyFilterValues();
        commit('filterValues', filterValues);

        await dispatch('search');
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

      async search({ state }) {
        const params = {
          ...state.apiQuery,
        };

        await axios.get(`https://mysite.ru/api/?${qs.stringify(params)}`);
      },

    },
    
    namespaced: true,
  };
}
```

```
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      filters: {},
      isSearchRouting: false,
    };
  },

  computed: {
    ...mapGetters('Abc', ['getFilterValues']),
  },

  beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.updateFiltersFromQuery();
    }
    this.isSearchRouting = false;
    next();
  },

  created() {
    this.updateFiltersFromQuery();
  },

  methods: {
    ...mapState('Abc', ['query']),
    ...mapActions('Abc', ['submitFilters', 'search']),

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'limit', 'offset', 'sort']);
    },

    async emitSearch() {
      this.isSearchRouting = true;
      this.submitFilters(this.filters);
      this.navigate();
      await this.search();
    },

    navigate() {
      this.$router.push({
        path: this.$route.path,
        query: this.query,
      });
    },
  },
};
</script>
```