<script>
import { debounce } from 'lodash-es';
import { mapState, mapGetters, mapActions } from 'vuex';
import MerchantHistoryStore from '@/store/MerchantHistoryStore';
import SimplePageHeader from '@/components/SimplePageHeader.vue';
import PictureClock from '@/components/PictureClock.vue';
import MerchantAdminFormHistory from '@/components/MerchantAdminFormHistory.vue';
import { toggleSort, getSortDirection } from '@/helpers/handleSort';

export default {
  components: {
    SimplePageHeader,
    PictureClock,
    MerchantAdminFormHistory,
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
  <SimplePageHeader>
    <span slot="title">History</span>
    <span slot="description">
      This text log will keep the status change and conversation history with
      merchant for checking the current onboarding status and future reference.
    </span>
    <PictureClock slot="picture" />
  </SimplePageHeader>

  <MerchantAdminFormHistory :items="history.items" />
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
