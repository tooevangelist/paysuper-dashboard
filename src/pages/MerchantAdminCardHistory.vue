<script>
import { debounce } from 'lodash-es';
import { mapState, mapGetters, mapActions } from 'vuex';
import {
  UiButton,
  UiHeader,
  UiPageHeader,
  UiTable,
  UiTableCell,
  UiTableRow,
  UiTextField,
  UiPaginator,
  UiModal,
} from '@protocol-one/ui-kit';
import moment from 'moment';
import MerchantHistoryStore from '@/store/MerchantHistoryStore';
import NoResults from '@/components/NoResults.vue';
import MerchantStatusTransitionLabel from '@/components/MerchantStatusTransitionLabel.vue';
import { toggleSort, getSortDirection } from '@/helpers/handleSort';

export default {
  components: {
    UiButton,
    UiHeader,
    UiPageHeader,
    UiTable,
    UiTableCell,
    UiTableRow,
    UiTextField,
    UiPaginator,
    UiModal,
    NoResults,
    MerchantStatusTransitionLabel,
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
      isHistoryDetailsDialogOpen: false,
      currentHistoryItem: null,
    };
  },

  computed: {
    ...mapState('Merchant', ['merchant']),
    ...mapState('MerchantHistory', ['history', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('MerchantHistory', ['getFilterValues']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.searchHistory();
      }, 500);
    },

    breadcrumbs() {
      const crumbs = [
        {
          label: 'Merchants list',
          url: '/merchants/',
        },
        {
          label: this.merchant.name,
          url: `/merchants/${this.merchant.id}`,
        },
      ];
      return crumbs;
    },

    dateSortDirection() {
      return getSortDirection(this.filters.sort, 'created_at');
    },
  },

  async beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.updateFiltersFromQuery();
      this.setIsLoading(true);
      await this.fetchHistory();
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
    ...mapActions('MerchantHistory', ['submitFilters', 'fetchHistory', 'initQuery']),

    formatDate(date) {
      return moment.unix(date).format('D MMM YYYY, HH:MM');
    },

    async searchHistory() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchHistory();
      this.setIsLoading(false);
    },

    handlePageChange({ offset }) {
      this.filters.offset = offset;
      this.searchHistory();
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

    openHistoryDetailsDialog(item) {
      this.currentHistoryItem = item;
      this.isHistoryDetailsDialogOpen = true;
    },

    closeHistoryDetailsDialog() {
      this.isHistoryDetailsDialogOpen = false;
      this.currentHistoryItem = null;
    },

    sortByDate() {
      this.filters.sort = toggleSort(this.filters.sort, 'created_at');
      this.searchHistory();
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
        <ui-table-cell
          :isSortable="true"
          :sortDirection="dateSortDirection"
          @click.native="sortByDate"
        >Date</ui-table-cell>
      </ui-table-row>
      <ui-table-row
        v-for="item in history.items"
        :key="item.id"
        @click.native="openHistoryDetailsDialog(item)"
      >
        <ui-table-cell></ui-table-cell>
        <ui-table-cell>{{item.title}}</ui-table-cell>
        <ui-table-cell>
          <div class="message">{{item.message}}</div>
        </ui-table-cell>
        <ui-table-cell>{{formatDate(item.created_at.seconds)}}</ui-table-cell>
      </ui-table-row>
    </ui-table>

    <UiPaginator
      v-if="history.items.length"
      :offset="filters.offset"
      :limit="filters.limit"
      :count="history.count"
      @pageChanged="handlePageChange"
    />
    <NoResults v-if="!history.items.length" />

    <UiModal
      v-if="isHistoryDetailsDialogOpen"
      :hasCloseButton="true"
      @close="closeHistoryDetailsDialog"
    >
      <div class="dialog" slot="main">
        <UiHeader level="2" :hasMargin="true">{{currentHistoryItem.title}}</UiHeader>

        <MerchantStatusTransitionLabel
          v-if="currentHistoryItem.statuses"
          :codeFrom="currentHistoryItem.statuses.from"
          :codeTo="currentHistoryItem.statuses.to"
        />

        <div
          class="dialog__message"
          v-if="currentHistoryItem.message"
          v-text="currentHistoryItem.message"
        />

        <div class="dialog__controls">
          <div class="dialog__date">
            {{formatDate(currentHistoryItem.created_at.seconds)}}
          </div>
          <UiButton
            class="dialog__button"
            @click="closeHistoryDetailsDialog"
          >OK</UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>


<style lang="scss" scoped>
.merchant-status-changer {
  display: inline-flex;
}

.message {
  min-width: 360px;
  max-width: 490px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.select {
  width: 130px;
}

.dialog {
  width: 470px;

  &__message {
    color: #999999;
    margin-top: 30px;
    font-size: 16px;
  }

  &__date {
    color: #999999;
    font-size: 16px;
  }

  &__controls {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__button {
    margin-left: 16px;
  }
}
</style>
