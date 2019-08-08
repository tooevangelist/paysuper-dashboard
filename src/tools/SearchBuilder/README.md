# SearchBuilder

## Default setup
### Store
```
import qs from 'qs';
import SearchBuilder from '@/tools/SearchBuilder/SearchBuilder';
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
        const queryString = qs.stringify(params, { arrayFormat: 'brackets' })
        await axios.get(`https://mysite.ru/api/?${queryString}`);
      },

    },
    
    namespaced: true,
  };
}
```

### Component container
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
    ...mapState('Abc', ['query']),
    ...mapGetters('Abc', ['getFilterValues']),
  },

  beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.updateFiltersFromQuery();
    }
    this.isSearchRouting = false;
    next();
  },

  created() {
    this.updateFiltersFromQuery();
  },

  methods: {
    ...mapActions('Abc', ['submitFilters', 'search', 'initQuery']),

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'limit', 'offset', 'sort']);
    },

    async emitSearch() {
      this.submitFilters(this.filters);
      this.navigate();
      await this.search();
    },

    navigate() {
      this.isSearchRouting = true;
      this.$router.push({
        path: this.$route.path,
        query: this.query,
      });
    },
  },
};
</script>
```


## Filter options

```
{
  defaultValue: '',
  defaultValue: () => [],
  queryName: '',
  apiQueryName: '',
  group: 'page',
  isQueryDisabled: true,
  queryToFilter({ queryValue }) {
    return Number(queryValue);
  },
  queryToApiQuery({ queryValue }) {
    return Number(queryValue);
  },
  filterToQuery({ filterValue }) {
    return filterValue.map(item => item.id).join(',');
  },
  filterToApiQuery({ filterValue }) {
    return filterValue.map(item => item.id);
  },
}
```

## Scheme example
```
function getPageQuery({ queryValue, groupFilterValues: { limit } }) {
  return {
    limit,
    offset: (queryValue - 1) * limit,
  };
}

export default {
  filters: {
    limit: {
      defaultValue: 10,
      group: 'page',
    },

    offset: {
      defaultValue: 0,
      group: 'page',
    },
  },
  groupHandlers: {
    page: {
      filterToQuery({ groupFilterValues: { offset, limit } }) {
        return {
          page: (offset / limit) + 1,
        };
      },
      queryToFilter: getPageQuery,
      queryToApiQuery: getPageQuery,
    },
  },
};
```