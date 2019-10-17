<script>
import {
  mapState, mapGetters, mapActions,
} from 'vuex';
import { format } from 'date-fns';
import {
  debounce, isEqual, get, find,
} from 'lodash-es';
import transactionsStatusScheme from '@/schemes/transactionsStatusScheme';
import PictureTabletWithChart from '@/components/PictureTabletWithChart.vue';
import ProjectTransactionsListStore from '@/store/ProjectTransactionsListStore';
import NoResults from '@/components/NoResults.vue';

const STATUS_COLOR = {
  created: 'blue',
  processed: 'green',
  pending: 'yellow',
  refunded: 'red',
  chargeback: 'red',
  rejected: 'transparent',
  canceled: 'transparent',
};

export default {
  name: 'ProjectTransctionsListPage',

  components: {
    PictureTabletWithChart,
    NoResults,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('ProjectTransactions', ProjectTransactionsListStore, {
        query: route.query,
        projectId: route.params.id,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      scheme: transactionsStatusScheme,
      tempFilters: {
        status: 2,
        method: 3,
      },
    };
  },

  computed: {
    ...mapState('ProjectTransactions', ['transactionsList', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('ProjectTransactions', ['getFilterValues']),
    ...mapGetters('Dictionaries', ['countries']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.filterTransactions();
      }, 500);
    },
  },

  created() {
    this.updateFiltersFromQuery();
  },

  mounted() {
    this.initInfiniteScroll();
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('ProjectTransactions', [
      'initQuery',
      'createItem',
      'submitFilters',
      'fetchTransactions',
    ]),

    get,

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'offset', 'limit']);
    },

    filterTransactions() {
      this.filters.offset = 0;
      this.searchItems();
    },

    async searchItems() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchTransactions().catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },

    initInfiniteScroll() {
      this.$appEventsOn('contentScrollReachEnd', async () => {
        if (
          this.isInfiniteScrollLocked
          || this.filters.offset + this.filters.limit >= this.transactionsList.count
        ) {
          return;
        }
        this.isInfiniteScrollLocked = true;

        this.filters.offset += this.filters.limit;
        await this.searchItems();
        this.isInfiniteScrollLocked = false;
      });
    },

    navigate() {
      if (isEqual(this.$route.query, this.query)) {
        return;
      }
      this.$router.push({
        path: this.$route.path,
        query: this.query,
      });
    },

    getProductName(items) {
      if (items === null) {
        return 'Checkout';
      }

      if (items.length > 1) {
        return 'Product';
      }

      return items[0].name;
    },

    getCountryByCode(code) {
      return get(find(this.countries, ({ value }) => value === code), 'label', code);
    },

    formatDateAndTime(seconds) {
      const datetime = new Date(seconds * 1000);
      return format(datetime, 'dd.MM.yyyy, HH:mm:ss');
    },

    getColor(status) {
      return STATUS_COLOR[status];
    },

    refundAvailable(status) {
      const badStatus = [
        'canceled',
        'refunded',
        'rejected',
        'chargeback',
      ]
      return !badStatus.includes(status);
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        Transactions
      </template>
      <span slot="description">
        All your customers' transactions are presented here, organised by Products,
        Dates and other parameters.
        Click any transaction to dive into transaction card to see additional details.
      </span>
      <PictureTabletWithChart slot="picture" />
    </UiPageHeaderFrame>

    <UiPanel>
      <div class="control-bar">
        <div class="control-bar__left">
          <UiFilterSearchInput
            :isAlwaysExpanded="true" />
          <UiStatusFilter :scheme="scheme" :countsByStatus="tempFilters" />
        </div>

        <div class="control-bar__right">
        </div>
      </div>

      <div class="transactions-list">
        <UiTable v-if="transactionsList.items.length">
          <UiTableRow :isHead="true">
            <UiTableCell align="left">Project</UiTableCell>
            <UiTableCell align="left">Product</UiTableCell>
            <UiTableCell align="left">Date & Time</UiTableCell>
            <UiTableCell align="left">Country</UiTableCell>
            <UiTableCell align="left">Method</UiTableCell>
            <UiTableCell align="left">Transaction ID</UiTableCell>
            <UiTableCell align="left">Net amount</UiTableCell>
            <UiTableCell align="left" width="3%"></UiTableCell>
          </UiTableRow>
          <UiTableRow
            class="transaction"
            v-for="transaction in transactionsList.items"
            :key="transaction.id">
            <UiTableCell align="left" class="status">
              <div class="status-dot"
               :class="getColor(transaction.status)"
               :title="transaction.status"></div>
              {{ transaction.project.name.en }}
            </UiTableCell>
            <UiTableCell align="left">{{ getProductName(transaction.items) }}</UiTableCell>
            <UiTableCell align="left">
              {{ formatDateAndTime(transaction.created_at.seconds) }}
            </UiTableCell>
            <UiTableCell
              align="left"
              class="country-name"
              :title="getCountryByCode(transaction.country_code)">
              <div>{{ getCountryByCode(transaction.country_code) }}</div>
            </UiTableCell>
            <UiTableCell align="left">{{ transaction.payment_method.title }}</UiTableCell>
            <UiTableCell align="left">{{ transaction.transaction }}</UiTableCell>
            <UiTableCell align="left" :class="`status-${transaction.status}`">
              {{$formatPrice(transaction.total_payment_amount, transaction.currency)}}
            </UiTableCell>
            <UiTableCell align="left">
              <div class="transaction__refund">
                <IconRetry v-if="refundAvailable(transaction.status)"/>
                <UiTip
                  width="140px"
                  :visible="true"
                  position="top"
                  innerPosition="center"
                  :margin="10"
                  class="transaction__refund-tip">
                  Request for refund
                </UiTip>
              </div>

            </UiTableCell>
          </UiTableRow>
        </UiTable>

        <NoResults type="add-new" v-else>You don’t have any transactions yet</NoResults>
      </div>
    </UiPanel>
  </div>
</template>

<style lang="scss" scoped>
.status-filter {
  margin-left: 4px;
  position: relative;
  top: 1px;
}

.transactions-list {
  margin-top: 32px;
}

.country-name > div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100px;
}

.transaction {
  &:hover {
    background: rgba(61, 123, 245, 0.08);
    color: #3D7BF5;
    cursor: pointer;
  }

  &__refund {
    position: relative;
    &-tip {
      display: none;
      height: 39px;
      background: #000;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      line-height: 38px;
      box-shadow: none;

      &:after {
        display: block;
        content: '';
        width: 6px;
        height: 6px;
        position: absolute;
        bottom: -4px;
        background: #000000;
        transform: rotate(45deg);
      }
    }

    &:hover &-tip {
      display: block;
    }
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  top: -2px;
  margin-right: 5px;

  &.green {
    background: #2fa84f;
  }

  &.blue {
    background: #3d7bf5;
  }

  &.yellow {
    background: #f3aa18;
  }

  &.red {
    background: #ea3d2f;
  }

  &.transparent {
    border: 1px solid #919699;
  }
}

.status-processed {
  color: #069697;
}

.status-refunded {
  color: #EA3D2F;
}
</style>
