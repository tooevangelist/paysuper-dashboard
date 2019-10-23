<script>
import {
  mapState, mapGetters, mapActions,
} from 'vuex';
import {
  isEqual, get,
} from 'lodash-es';
import moment from 'moment';

import reportsStatusScheme from '@/schemes/reportsStatusScheme';
import ReportsListStore from '@/store/ReportsListStore';
import NoResults from '@/components/NoResults.vue';
import CreatePayoutModal from '@/components/CreatePayoutModal.vue';

const STATUS_COLOR = {
  pending: 'orange',
  accepted: 'green',
  waiting_payment: 'green',
  paid: 'aqua',
  dispute: 'red',
  canceled: 'transparent',
};

const STATUS = {
  pending: 'pending',
  accepted: 'confirmed',
  waiting_payment: 'paying',
  paid: 'paid',
  dispute: 'dispute',
  canceled: 'canceled',
};

export default {
  name: 'RoyaltyReportsPage',

  components: {
    NoResults,
    CreatePayoutModal,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('Reports', ReportsListStore, {
        query: route.query,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      filters: {},
      scheme: reportsStatusScheme,
      showRefundModal: false,
      currentTransaction: null,
      isCreatePayoutModalOpened: false,
    };
  },

  computed: {
    ...mapState('Reports', ['reportsList', 'filterValues', 'query', 'apiQuery', 'balance']),
    ...mapGetters('Reports', ['getFilterValues']),
    ...mapGetters('Dictionaries', ['countries']),

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

    isPayoutAmount() {
      return this.reportsList.count > 0;
    },

    payoutAmount() {
      return this.balance.debit || 0;
    },
  },

  created() {
    this.updateFiltersFromQuery();
  },

  mounted() {
    this.initInfiniteScroll();
    this.getBalance();
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('Reports', [
      'initQuery',
      'createItem',
      'submitFilters',
      'fetchReports',
      'getBalance',
    ]),

    get,

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['dateFrom', 'dateTo', 'offset', 'limit', 'status']);
    },

    filterReports() {
      this.filters.offset = 0;
      this.searchItems();
    },

    async searchItems() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchReports().catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },

    initInfiniteScroll() {
      this.$appEventsOn('contentScrollReachEnd', async () => {
        if (
          this.isInfiniteScrollLocked
          || this.filters.offset + this.filters.limit >= this.reportsList.count
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

    getColor(status) {
      return STATUS_COLOR[status];
    },

    getStatus(status) {
      return STATUS[status];
    },

    handleFilterInput(data) {
      this.filters.status = [];

      if (data === 'all') {
        this.filters.status = [];
      } else {
        this.filters.status.push(data);
      }

      this.filterReports();
    },

    getFormattedDate(item) {
      return moment.unix(item).format('DD MMM YYYY');
    },

    getValue(item, path) {
      return get(item, path) || '—';
    },

    returnColorAmount(status) {
      return status === 'paid' ? '#069697' : '#3E4345';
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        Royalty reports
      </template>
      <span slot="description">
        By these weekly reports we calculate your payments.
        You must confirm each report within 5 days period
        for it is to be paid or dispute it, after 5 days pending
        reports will be confirmed automatically.
      </span>
      <div class="controls">
        <UiButton
          :noSidePaddings="true"
          :disabled="!isPayoutAmount"
          @click="isCreatePayoutModalOpened = true"
          >
          <IconPlus slot="iconBefore" />
          CREATE PAYOUT
        </UiButton>
      </div>
    </UiPageHeaderFrame>

    <CreatePayoutModal
      v-if="isCreatePayoutModalOpened"
      @close="isCreatePayoutModalOpened = false"
      />

    <div class="total-amount">
      <UiPanel>
        <div class="control-bar _center">
          <div class="total-amount__summ">
            {{ $formatPrice(payoutAmount, balance.currency) }}
          </div>
          <div class="total-amount__text">
            Total royalty amount
          </div>
        </div>
      </UiPanel>
    </div>

    <UiPanel>
      <div class="control-bar">
        <div class="control-bar _left-center">
          <UiFilterDate
            v-model="dateFilter"
            @input="filterReports"
          />
          <UiFilterReportsStatus
            class="filter-status"
            @input="handleFilterInput"
            :value="filters.status[0]"
            :scheme="scheme" />
        </div>
      </div>

      <div class="reports-list">
        <UiTable v-if="reportsList.items.length">
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
            class="report"
            v-for="(report, index) in reportsList.items"
            :key="index"
            :link="`/reports/${report.id}`"
            >
            <UiTableCell align="left">
              {{ getFormattedDate(report.period_from.seconds) }}
              —
              {{ getFormattedDate(report.period_to.seconds) }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ getFormattedDate(report.created_at.seconds) }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ getValue(report, 'payout_document_id') }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ getFormattedDate(report.payout_date.seconds) }}
            </UiTableCell>
            <UiTableCell align="left" :style="{ color: returnColorAmount(report.status) }">
              {{
                report.totals !== null
                  ? $formatPrice(report.totals.payout_amount, report.currency)
                  : '—'
              }}
            </UiTableCell>
            <UiTableCell align="left" class="report__status">
              <UiLabelTag class="status" :color="getColor(report.status)">
                <IconFlag
                  class="report__status-flag"
                  v-if="report.is_auto_accepted"
                  />
                {{ getStatus(report.status) }}
              </UiLabelTag>
              <UiTip
                v-if="report.is_auto_accepted"
                width="258px"
                :visible="true"
                position="top"
                innerPosition="center"
                :margin="0"
                class="report__status-tip">
                  This report was accepted automatically.
                  You must make a decision to Confirm or Dispute
                  each report within 5 days period, since it was created
              </UiTip>
            </UiTableCell>
            <UiTableCell/>
          </UiTableRow>
        </UiTable>

        <NoResults type="add-new" v-else>You don’t have any item yet</NoResults>
      </div>
    </UiPanel>
  </div>
</template>

<style lang="scss" scoped>
.total-amount {
  margin-bottom: 8px;

  &__summ {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;
    color: #000;
  }
  &__text {
    font-size: 12px;
    line-height: 1.3;
    color: #5E6366;
  }
}
.control-bar {
  display: flex;
  &._center {
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  &._left-center {
    justify-content: center;
    align-items: center;
  }
}

.status-filter {
  margin-left: 4px;
  position: relative;
  top: 1px;
}

.reports-list {
  margin-top: 32px;
}

.report {
  &:hover {
    background: rgba(61, 123, 245, 0.08);
    color: #3D7BF5;
    cursor: pointer;
  }

  &__status {
    position: relative;
    & .label-tag {
      width: 104px;
    }
    &-flag {
      margin-right: 3px;
    }
    &-tip {
      display: none;
      background: #000;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
      text-align: left;
      line-height: 16px;
      box-shadow: none;
      padding: 12px;

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

.filter-status {
  margin: 0 0 0 2px;
}

.status {
  text-transform: capitalize;
}
</style>
