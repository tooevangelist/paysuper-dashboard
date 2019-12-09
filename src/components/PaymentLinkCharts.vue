<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { get, map, reduce } from 'lodash-es';
import PaymentLinkChartsHeader from '@/components/PaymentLinkChartsHeader.vue';
import ChartsPaylinkSummary from '@/components/ChartsPaylinkSummary.vue';
import ChartsPaylinkBase from '@/components/ChartsPaylinkBase.vue';
import ChartsLastPayments from '@/components/ChartsLastPayments.vue';

const COLORS = [
  '#F44336',
  '#FF9800',
  '#FFEB3B',
  '#8BC34A',
  '#009688',
  '#00BCD4',
  '#03A9F4',
  '#3F51B5',
  '#795548',
  '#E3E5E6',
];

export default {
  name: 'PaymentLinkCharts',
  components: {
    PaymentLinkChartsHeader,
    ChartsPaylinkSummary,
    ChartsPaylinkBase,
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
      'currency',
    ]),
    ...mapGetters('PaymentLinkCharts', ['mainChartPeriod', 'getFilterValues']),
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
        gross_summary: '#3d7bf5',
        total_transactions: '#f3aa18',
        arpu: '#2fa84f',
        vat: '#ea3d2f',
      };
    },
    baseLastBarColor() {
      return {
        summary_by_country: '#3d7bf5',
        sales_today: '#f3aa18',
        sources: '#2fa84f',
      };
    },
    summaryData() {
      if (!this.summary) {
        return [];
      }

      const summary = reduce(this.summary.top, (res, item) => {
        res.labels.push(item.label);
        res.data.push(item.amount);

        return res;
      }, { labels: [], data: [] });

      const summaryColors = {
        backgroundColor: map(summary.data, (item, index) => {
          const isLastBar = index === summary.data.length - 1;
          return isLastBar ? '#3d7bf5' : '#e9edef';
        }),
        hoverBackgroundColor: map(summary.data, (item, index) => {
          const isLastBar = index === summary.data.length - 1;
          return isLastBar ? '#3d7bf5' : '#c5d7fc';
        }),
      };

      return {
        labels: summary.labels,
        hasChart: Boolean(summary.labels.length),
        datasets: [{
          label: '',
          ...summaryColors,
          data: summary.data,
        }],
      };
    },
    baseData() {
      return this.getData('base');
    },
    getData() {
      return type => reduce(this[type], (res, item, key) => {
        const chart = reduce(item.top, (result, chartItem) => {
          result.labels.push(chartItem.country || chartItem.name);
          result.data.push(chartItem.count || chartItem.amount);

          return result;
        }, { labels: [], data: [] });

        const colors = {
          backgroundColor: map(chart.data, (chartItem, index) => {
            return COLORS[index];
          }),
          hoverBackgroundColor: map(chart.data, (chartItem, index) => {
            return COLORS[index];
          }),
        };

        return {
          ...res,
          [key]: {
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
    :chartPeriod="mainChartPeriod"
    :currency="currency"
    :data="summaryData"
  />

  <ChartsPaylinkBase
    :chartPeriod="mainChartPeriod"
    :countries="countries"
    :currency="currency"
    :data="baseData"
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
