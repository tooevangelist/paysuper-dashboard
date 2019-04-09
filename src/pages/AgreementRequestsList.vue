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
import MerchanstListStore from '@/store/MerchanstListStore';
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
      await registerStoreModule('AgreementRequestsList', MerchanstListStore, {
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

  beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.updateFiltersFromQuery();
    }
    this.isSearchRouting = false;
    next();
  },


  created() {
    this.filters = this.getFilterValues(['quickFilter', 'limit', 'offset']);
  },

  computed: {
    ...mapState('AgreementRequestsList', ['merchants', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('AgreementRequestsList', ['getFilterValues']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.searchMerchants();
      }, 500);
    },
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('AgreementRequestsList', ['submitFilters', 'fetchMerchants']),

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
  },
};
</script>

<template>
  <div>
    <UiPageHeader>
      <span slot="title">Agreement requests</span>
      <UiTextField
        slot="right"
        label="Quick search"
        v-model="filters.quickFilter"
        @input="handleQuickSearchInput"
      />
    </UiPageHeader>

    <ui-table>
      <ui-table-row :isHead="true">
        <ui-table-cell>Company</ui-table-cell>
        <ui-table-cell>Country</ui-table-cell>
        <ui-table-cell>Last change</ui-table-cell>
        <ui-table-cell>Singing via</ui-table-cell>
        <ui-table-cell>Operator</ui-table-cell>
        <ui-table-cell>Status</ui-table-cell>
      </ui-table-row>
      <ui-table-row
        v-for="merchant in merchants.items"
        :key="merchant.id"
        :link="{
          url: `/merchants/${merchant.id}`,
          router: true
        }"
      >
        <ui-table-cell>{{merchant.name || '—'}}</ui-table-cell>
        <ui-table-cell>
          {{merchant.country ? merchant.country.code_a3 : '—'}}
        </ui-table-cell>
        <ui-table-cell>
          —
        </ui-table-cell>
        <ui-table-cell>
          <template v-if="merchant.agreement_type === 1">Pen and paper</template>
          <template v-if="merchant.agreement_type === 2">E-sign</template>
        </ui-table-cell>
        <ui-table-cell>
        </ui-table-cell>

        <ui-table-cell>
          <template v-if="merchant.status === 1">New</template>
          <template v-if="merchant.status === 2">Checking</template>
          <template v-if="merchant.status === 3">Singing</template>
        </ui-table-cell>

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
