<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { PageHeader, UiPaginator } from '@protocol-one/ui-kit';
import TransactionsSearchStore from '@/store/TransactionsSearchStore';
import TransactionFilters from '@/components/TransactionFilters.vue';
import TransactionsList from '@/components/TransactionsList.vue';
import NoResults from '@/components/NoResults.vue';

export default {
  components: {
    TransactionFilters,
    TransactionsList,
    PageHeader,
    UiPaginator,
    NoResults,
  },
  asyncData({ store, route, resources }) {
    if (store.state.TransactionSearch) {
      return undefined;
    }
    store.registerModule('TransactionSearch', TransactionsSearchStore(resources));
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
    ...mapState('TransactionSearch', ['query', 'paymentMethods', 'projects', 'statuses']),
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
      this.submitFilters(this.filters);
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
        :paymentMethods="paymentMethods"
        :projects="projects"
        :statuses="statuses"
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
      <NoResults v-if="!items.length" />
    </div>
  </div>
</template>
