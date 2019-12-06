<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { get, map, reduce } from 'lodash-es';
import PaymentLinkChartsHeader from '@/components/PaymentLinkChartsHeader.vue';
import ChartsPaylinkSummary from '@/components/ChartsPaylinkSummary.vue';
import ChartsBasic from '@/components/ChartsBasic.vue';
import ChartsLastPayments from '@/components/ChartsLastPayments.vue';

export default {
  name: 'PaymentLinkCharts',
  components: {
    PaymentLinkChartsHeader,
    ChartsPaylinkSummary,
    ChartsBasic,
    ChartsLastPayments,
  },
  data() {
    return {
      filters: {},
    };
  },
  props: {
    title: {
      default: 'Revenue dynamic',
      type: String,
    },
  },
  computed: {
    ...mapState('PaymentLinkCharts', [
      'base',
      'main',
      'summary',
      'basePeriod',
      'mainPeriod',
      'lastPayments',
    ]),
    ...mapState('PaymentLink', [
      'currency',
    ]),
    ...mapGetters('PaymentLinkCharts', ['getFilterValues', 'mainChartPeriod']),
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

    mainLastBarColor() {
      return {
        gross_revenue: '#3d7bf5',
        total_transactions: '#f3aa18',
        arpu: '#2fa84f',
        vat: '#ea3d2f',
      };
    },
    baseLastBarColor() {
      return {
        revenue_by_country: '#3d7bf5',
        sales_today: '#f3aa18',
        sources: '#2fa84f',
      };
    },
    revenueData() {
      const revenue = reduce(this.summary, (res, item) => {
        res.labels.push(item.date);
        res.data.push(item.gross_total_amount);

        return res;
      }, { labels: [], data: [] });

      const revenueColors = {
        backgroundColor: map(revenue.data, (item, index) => {
          const isLastBar = index === revenue.data.length - 1;
          return isLastBar ? '#3d7bf5' : '#e9edef';
        }),
        hoverBackgroundColor: map(revenue.data, (item, index) => {
          const isLastBar = index === revenue.data.length - 1;
          return isLastBar ? '#3d7bf5' : '#c5d7fc';
        }),
      };

      return {
        labels: revenue.labels,
        hasChart: Boolean(revenue.labels.length),
        datasets: [{
          label: '',
          ...revenueColors,
          data: revenue.data,
        }],
      };
    },
    mainData() {
      return this.getData('main');
    },
    baseData() {
      return this.getData('base');
    },
    getData() {
      return type => reduce(this[type], (res, item, key) => {
        const current = get(item, 'total_current', get(item, 'amount_current', item.count_current));
        const previous = get(item, 'total_previous', get(item, 'amount_previous', item.count_previous));
        const chart = reduce(item.chart, (result, chartItem) => {
          result.labels.push(chartItem.label);
          result.data.push(chartItem.value || chartItem.amount);

          return result;
        }, { labels: [], data: [] });

        const colors = {
          backgroundColor: map(chart.data, (chartItem, index) => {
            const isLastBar = index === chart.data.length - 1;
            return isLastBar ? this[`${type}LastBarColor`][key] : '#e9edef';
          }),
          hoverBackgroundColor: map(chart.data, (chartItem, index) => {
            const isLastBar = index === chart.data.length - 1;
            return isLastBar ? this[`${type}LastBarColor`][key] : '#c5d7fc';
          }),
        };

        return {
          ...res,
          [key]: {
            amount: current,
            amountPrevious: previous,
            hasIncreasedArrow: Boolean(current || previous),
            isIncreased: current > previous,
            hasTop: Boolean((item.top || []).length),
            top: item.top || undefined,
            hasChart: Boolean(chart.labels.length),
            chart: {
              labels: chart.labels,
              datasets: [{
                label: '',
                ...colors,
                data: chart.data,
              }],
            },
          },
        };
      }, {});
    },
  },
  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('PaymentLinkCharts', ['changePeriod', 'fetchLastPayments', 'submitFilters', 'fetchChart']),

    get,

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['dateFrom', 'dateTo']);
    },

    async setFilters(filters) {
      this.dateFilter = filters;

      this.setIsLoading(true);
      this.submitFilters(this.filters);
      await this.fetchChart('summary').catch(this.$showErrorMessage);
      await this.fetchChart('country').catch(this.$showErrorMessage);
      await this.fetchChart('referrer').catch(this.$showErrorMessage);
      await this.fetchChart('date').catch(this.$showErrorMessage);
      await this.fetchChart('utm').catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },
  },

  created() {
    this.updateFiltersFromQuery();
  },
};
</script>

<template>
<div id="dashboard-charts" class="charts">
  <PaymentLinkChartsHeader
    :period="mainPeriod"
    :filters="dateFilter"
    :title="title"
    @changePeriod="changePeriod"
    @setFilters="setFilters"
  />

  <ChartsPaylinkSummary
    :chartPeriod="dateFilter"
    :currency="currency"
    :data="revenueData"
  />

  <ChartsBasic
    :chartPeriod="mainChartPeriod"
    :countries="countries"
    :currency="currency"
    :data="baseData"
    :period="basePeriod"
    @changePeriod="changePeriod"
  />

  <ChartsLastPayments
    :countries="countries"
    :currency="currency"
    :lastPayments="lastPayments"
    @fetchLastPayments="fetchLastPayments"
  />
</div>
</template>

<style lang="scss" scoped>
.charts {
  display: flex;
  flex-direction: column;
  /deep/.box {
    box-shadow: none;
  }
}
</style>
