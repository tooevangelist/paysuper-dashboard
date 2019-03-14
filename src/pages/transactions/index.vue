<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { PageHeader, UiPaginator } from '@protocol-one/ui-kit';
import TransactionFilters from '@/components/TransactionFilters.vue';
import TransactionsList from '@/components/TransactionsList.vue';
import TransactionSearchStore from '@/store/TransactionSearchStore';

export default {
  middleware: 'IsNotAuthenticated',
  components: {
    TransactionFilters, TransactionsList, PageHeader, UiPaginator,
  },
  asyncData({ store, route }) {
    store.registerModule('TransactionSearch', TransactionSearchStore);
    return store.dispatch('TransactionSearch/initState', {
      query: route.query,
    });
  },
  data() {
    return {
      filters: {},
      isSearchRouting: false,
    };
  },
  computed: {
    ...mapState('TransactionSearch', ['query']),
    ...mapGetters('TransactionSearch', ['items', 'count', 'getFilterValues', 'getEmptyFilterValues']),
  },
  beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.$refs.filters.updateFiltersFromQuery();
      this.updateFiltersFromQuery();
    }
    this.isSearchRouting = false;
    next();
  },
  created() {
    this.updateFiltersFromQuery();
  },
  methods: {
    ...mapActions('TransactionSearch', ['searchTransactions', 'submitFilters', 'initQuery']),

    handlePageChange({ offset }) {
      this.filters.offset = offset;
      this.submitFilters({ offset });
      this.searchTransactions();
      this.isSearchRouting = true;
      this.navigate();
    },

    handleFiltersSearchRequest(filters) {
      this.submitFilters(filters);
      this.searchTransactions();
      this.isSearchRouting = true;
      this.navigate();
    },

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['offset', 'limit']);
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

<template>
  <div>
    <PageHeader :breadcrumbs="[{label: '...', url: '/'}]" title="Transactions search" />
    <div style="width: 100%;">
      <TransactionFilters
        @searchRequested="handleFiltersSearchRequest"
        :getFilterValues="getFilterValues"
        :getEmptyFilterValues="getEmptyFilterValues"
        ref="filters"
      />

      <TransactionsList
        :items="items"
        :count="count"
      />

      <UiPaginator
        v-if="items.length"
        :offset="filters.offset"
        :limit="filters.limit"
        :count="count"
        @pageChanged="handlePageChange"
      />
      <p v-if="!items.length" class="no-results">Computer says no results</p>

    </div>
  </div>
</template>

<style lang="scss">
.no-results {
  font-size: 20px;
  color: #b1b1b1;
  text-align: center;
  padding: 100px 0;
}
</style>
