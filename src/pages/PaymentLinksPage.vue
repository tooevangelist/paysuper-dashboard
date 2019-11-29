<script>
import {
  mapState, mapGetters, mapActions,
} from 'vuex';
import {
  isEqual, get,
} from 'lodash-es';
import moment from 'moment';
import paymentLinksStatusScheme from '@/schemes/paymentLinksStatusScheme';
import PaymentLinksListStore from '@/store/PaymentLinksListStore';
import NoResults from '@/components/NoResults.vue';


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
  name: 'PaymentLinksPage',

  components: {
    NoResults,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('Links', PaymentLinksListStore, {
        query: route.query,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      filters: {},
      scheme: paymentLinksStatusScheme,
    };
  },

  computed: {
    ...mapState('Links', ['linksList', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('Links', ['getFilterValues']),

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
    ...mapActions('Links', [
      'initQuery',
      'createItem',
      'submitFilters',
      'fetchLinks',
    ]),

    get,

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['dateFrom', 'dateTo', 'offset', 'limit', 'status']);
    },

    filterLinks() {
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
          || this.filters.offset + this.filters.limit >= this.linksList.count
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

      this.filterLinks();
    },

    formatDate(date) {
      return moment.unix(date).format('D MMM YYYY, HH:MM');
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        Payment links
      </template>
      <span slot="description">
        Do aliquip labore dolor irure cillum deserunt nulla.
        Anim do qui et qui esse qui ex eu. Adipisicing dolor ea proident
        nostrud sint consequat consectetur dolor irure cillum deserunt.
      </span>
    </UiPageHeaderFrame>

    <UiPanel>
      <div class="control-bar">
        <div class="control-bar__left"/>
        <div class="control-bar__right">
          <RouterLink to="/payment-links-create/">
            <UiButton>
              CREATE LINK
            </UiButton>
          </RouterLink>
        </div>
      </div>

      <div class="links-list">
        <UiTable v-if="linksList.items.length">
          <UiTableRow :isHead="true">
            <UiTableCell align="left">Name</UiTableCell>
            <UiTableCell align="left">Link ID</UiTableCell>
            <UiTableCell align="left">Visits</UiTableCell>
            <UiTableCell align="left">Purchases</UiTableCell>
            <UiTableCell align="left">Conversion</UiTableCell>
            <UiTableCell align="left">Total</UiTableCell>
            <UiTableCell align="left">Due date</UiTableCell>
            <UiTableCell align="left" width="3%"></UiTableCell>
          </UiTableRow>
          <UiTableRow
            class="link"
            v-for="(link, index) in linksList.items"
            :key="index"
            :link="`/payment-links/${link.id}`"
            >
            <UiTableCell align="left">
              {{ link.name }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ link.id }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ link.visits }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ link.gross_total_amount }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ link.conversion }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ link.sales_count }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ formatDate(link.expires_at.seconds) }}
             </UiTableCell>
          </UiTableRow>
        </UiTable>

        <NoResults type="add-new" v-else>You don’t have any item yet</NoResults>
      </div>
    </UiPanel>

  </div>
</template>

<style lang="scss" scoped>
.control-bar {
  display: flex;
  justify-content: space-between;
}

.status-filter {
  margin-left: 4px;
  position: relative;
  top: 1px;
}

.links-list {
  margin-top: 32px;
}

.link {
  &:hover {
    background: rgba(61, 123, 245, 0.08);
    color: #3d7bf5;
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
        content: "";
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

.status-paid {
  color: #069697;
}

.cell-with-menu {
  position: relative;
  padding-right: 5px;
}
.dots-menu {
  position: relative;
  &__item {
    /deep/ .menu-icon {
      svg {
        fill: #78909c !important;
      }
    }
  }
}
</style>
