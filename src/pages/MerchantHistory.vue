<script>
import { debounce } from 'lodash-es';
import { mapState, mapGetters, mapActions } from 'vuex';
import {
  UiPageHeader,
  UiTable,
  UiTableCell,
  UiTableRow,
  UiTextField,
  UiPaginator,
} from '@protocol-one/ui-kit';
import moment from 'moment';
import MerchantHistoryStore from '@/store/MerchantHistoryStore';
import NoResults from '@/components/NoResults.vue';

export default {
  components: {
    UiPageHeader,
    UiTable,
    UiTableCell,
    UiTableRow,
    UiTextField,
    UiPaginator,
    NoResults,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('MerchantHistory', MerchantHistoryStore, {
        merchantId: route.params.id,
        query: route.query,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      filters: {},
      isSearchRouting: false,
    };
  },

  computed: {
    ...mapState('MerchantHistory', ['merchants', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('MerchantHistory', ['getFilterValues']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.searchMerchants();
      }, 500);
    },

    breadcrumbs() {
      const crumbs = [
        {
          label: 'Merchants list',
          url: '/merchants/',
        },
      ];
      return crumbs;
    },
  },

  async beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.updateFiltersFromQuery();
      this.setIsLoading(true);
      await this.fetchMerchants();
      this.setIsLoading(false);
    }
    this.isSearchRouting = false;
    next();
  },

  created() {
    this.updateFiltersFromQuery();
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('MerchantHistory', ['submitFilters', 'fetchMerchants', 'initQuery']),

    formatDate(date) {
      return moment.unix(date).format('D MMM YYYY, HH:MM');
    },

    async searchMerchants() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchMerchants();
      this.setIsLoading(false);
    },

    handlePageChange({ offset }) {
      this.filters.offset = offset;
      this.searchMerchants();
    },

    navigate() {
      this.$router.push({
        path: this.$route.path,
        query: this.query,
      });
    },

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'limit', 'offset']);
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeader :breadcrumbs="breadcrumbs">
      <span slot="title">History</span>
      <UiTextField
        slot="right"
        label="Quick search"
        v-model="filters.quickFilter"
        @input="handleQuickSearchInput"
      />
    </UiPageHeader>

    <ui-table>
      <ui-table-row :isHead="true">
        <ui-table-cell>User</ui-table-cell>
        <ui-table-cell>Event</ui-table-cell>
        <ui-table-cell>Message</ui-table-cell>
        <ui-table-cell>Date</ui-table-cell>
      </ui-table-row>
      <ui-table-row
        v-for="merchant in merchants.items"
        :key="merchant.id"
        :link="{
          url: `/merchants/${merchant.id}`,
          router: true
        }"
      >
        <ui-table-cell></ui-table-cell>
        <ui-table-cell>{{merchant.title}}</ui-table-cell>
        <ui-table-cell>{{merchant.message}}</ui-table-cell>
        <ui-table-cell>{{formatDate(merchant.created_at.seconds)}}</ui-table-cell>
      </ui-table-row>
    </ui-table>

    <UiPaginator
      v-if="merchants.items.length"
      :offset="filters.offset"
      :limit="filters.limit"
      :count="merchants.count"
      @pageChanged="handlePageChange"
    />
    <NoResults v-if="!merchants.items.length" />
  </div>
</template>
