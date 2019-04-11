<script>
import { debounce, find } from 'lodash-es';
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
import MerchanstListStore from '@/store/MerchanstListStore';
import NoResults from '@/components/NoResults.vue';
import LabelTag from '@/components/LabelTag.vue';
import merchantStatusScheme from '@/schemes/merchantStatusScheme';
import { toggleSort, getSortDirection } from '@/helpers/handleSort';

export default {
  components: {
    UiPageHeader,
    UiTable,
    UiTableCell,
    UiTableRow,
    UiTextField,
    UiPaginator,
    NoResults,
    LabelTag,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('AgreementRequestsList', MerchanstListStore, {
        query: route.query,
        apiQueryExtention: {
          status: [1, 2, 3],
        },
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      filters: {},
      isSearchRouting: false,
      statuses: merchantStatusScheme,
    };
  },

  computed: {
    ...mapState('Dictionaries', ['countries']),
    ...mapState('AgreementRequestsList', ['merchants', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('AgreementRequestsList', ['getFilterValues']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.searchMerchants();
      }, 500);
    },

    nameSortDirection() {
      return getSortDirection(this.filters.sort, 'name');
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
    ...mapActions('AgreementRequestsList', ['submitFilters', 'fetchMerchants', 'initQuery']),

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
      this.filters = this.getFilterValues(['quickFilter', 'limit', 'offset', 'sort']);
    },

    formatDate(date) {
      return moment.unix(date).format('D MMM YYYY, HH:MM');
    },

    getCountryName(country) {
      if (!country) {
        return '—';
      }
      return find(this.countries, { code_int: country.code_int }).name.en;
    },

    sortByName() {
      this.filters.sort = toggleSort(this.filters.sort, 'name');
      this.searchMerchants();
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
        <ui-table-cell
          :isSortable="true"
          :sortDirection="nameSortDirection"
          @click.native="sortByName"
        >Company</ui-table-cell>
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
          url: `/merchants/${merchant.id}?step=licenseAgreement`,
          router: true
        }"
      >
        <ui-table-cell>{{merchant.name || '—'}}</ui-table-cell>
        <ui-table-cell>
          {{getCountryName(merchant.country)}}
        </ui-table-cell>
        <ui-table-cell>
          {{merchant.updated_at ? formatDate(merchant.updated_at.seconds) : '—'}}
        </ui-table-cell>
        <ui-table-cell>
          <template v-if="merchant.agreement_type === 1">Pen and paper</template>
          <template v-if="merchant.agreement_type === 2">E-sign</template>
        </ui-table-cell>
        <ui-table-cell>
        </ui-table-cell>

        <ui-table-cell>
          <LabelTag
            :color="statuses[merchant.status].color"
            v-text="statuses[merchant.status].text"
          />
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
