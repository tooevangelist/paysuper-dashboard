<script>
import {
  mapState, mapGetters, mapActions,
} from 'vuex';
import {
  isEqual,
} from 'lodash-es';
import { format } from 'date-fns';
import PayoutsStore from '@/store/PayoutStore';
import NoResults from '@/components/NoResults.vue';
import payoutsStatusScheme from '@/schemes/payoutsStatusScheme';

const STATUS_COLOR = {
  paid: 'cyan',
  in_progress: 'green',
  pending: 'orange',
  failed: 'red',
  skip: 'gray',
  canceled: 'transparent',
};

export default {
  name: 'payouts',

  components: {
    NoResults,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('Payouts', PayoutsStore, {
        query: route.query,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      filters: {},
      scheme: payoutsStatusScheme,
      filterCounts: {},
      showRefundModal: false,
      colors: STATUS_COLOR,
    };
  },

  computed: {
    ...mapState('Payouts', ['payoutsList', 'filterValues', 'query', 'apiQuery', 'balance']),
    ...mapGetters('Payouts', ['getFilterValues']),

    dateFilter: {
      get() {
        return [this.filters.dateFrom || null, this.filters.dateTo || null];
      },
      set(value) {
        const [dateFrom, dateTo] = value;
        this.filters.dateFrom = dateFrom;
        this.filters.dateTo = dateTo;
      },
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
    ...mapActions('Payouts', [
      'initQuery',
      'submitFilters',
      'fetchPayouts',
    ]),

    format,

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'offset', 'limit', 'status']);
    },

    filterPayouts() {
      this.filters.offset = 0;
      this.searchItems();
    },

    async searchItems() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchPayouts().catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },

    initInfiniteScroll() {
      this.$appEventsOn('contentScrollReachEnd', async () => {
        if (
          this.isInfiniteScrollLocked
          || this.filters.offset + this.filters.limit >= this.payoutsList.count
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

    formatPeriod(fromSec, toSec) {
      const dateFrom = new Date(fromSec * 1000);
      const dateTo = new Date(toSec * 1000);
      return `${format(dateFrom, 'dd.MM.yyyy')} — ${format(dateTo, 'dd.MM.yyyy')}`;
    },

    handleStatusInput(value) {
      console.log(value);
      if (value === 'all') {
        this.filters.status = [];
      } else {
        this.filters.status.push(value);
      }
      this.filterPayouts();
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        Payouts
      </template>
      <span slot="description">
        Each payout is based on one or more royalty reports.
        On a quarterly basis you will get an automatically formed payout invoice to close
        a quarter taxation period.
      </span>
    </UiPageHeaderFrame>

    <UiPanel class="balance">
      <div class="balance__total">
        {{ $formatPrice(balance.total, balance.currency) }}
      </div>
      <div class="balance__description">Amount available for withdrawal</div>
    </UiPanel>

    <UiPanel>
      <div class="control-bar">
        <div class="control-bar__left">
          <UiStatusFilter
            @input="handleStatusInput"
            align="left"
            :value="filters.status"
            :scheme="scheme"/>
        </div>

        <div class="control-bar__right"></div>
      </div>

      <div class="payouts-list">
        <UiTable v-if="payoutsList.items.length">
          <UiTableRow :isHead="true">
            <UiTableCell align="left">Period</UiTableCell>
            <UiTableCell align="left">Report date</UiTableCell>
            <UiTableCell align="left">Payout ID</UiTableCell>
            <UiTableCell align="left">Payment date</UiTableCell>
            <UiTableCell align="left">Amount</UiTableCell>
            <UiTableCell align="left">Status</UiTableCell>
            <UiTableCell align="left" width="3%"></UiTableCell>
          </UiTableRow>
          <UiTableRow
            v-for="(payout, index) in payoutsList.items"
            :key="index">
            <UiTableCell align="left">
              {{ formatPeriod(payout.period_from.seconds, payout.period_to.seconds) }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ format(payout.created_at.seconds * 1000, 'dd.MM.yyyy') }}
            </UiTableCell>
            <UiTableCell align="left">{{ payout.id }}</UiTableCell>
            <UiTableCell align="left">
              <!--{{ format(payout.arrival_date.seconds * 1000, 'dd.MM.yyyy') }}-->
            </UiTableCell>
            <UiTableCell align="left">
              {{ $formatPrice(payout.balance, payout.currency) }}
            </UiTableCell>
            <UiTableCell align="left">
              <UiLabelTag :color="colors[payout.status]">
                {{payout.status}}
              </UiLabelTag>
            </UiTableCell>
            <UiTableCell align="left" width="3%">
              <div class="download">
                <IconDownload></IconDownload>
              </div>
            </UiTableCell>
          </UiTableRow>
        </UiTable>

        <NoResults type="add-new" v-else>You don’t have any item yet</NoResults>
      </div>
    </UiPanel>
  </div>
</template>

<style lang="scss" scoped>
.balance {
  margin-bottom: 8px;
  text-align: center;

  &__total {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.15px;
    color: #000;
  }

  &__description {
    font-size: 12px;
    color: #5E6366;
  }
}

.status-filter {
  margin-left: 4px;
  position: relative;
  top: 1px;
}

.payouts-list {
  margin-top: 32px;
}

.download {
  width: 14px;
  height: 14px;
  cursor: pointer;

  svg {
    max-width: 100%;
    max-height: 100%;
    fill: #919699;
  }

  &:hover svg {
    fill: #3D7BF5;
  }
}
</style>
