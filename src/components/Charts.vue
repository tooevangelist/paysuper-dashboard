<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import {
  get,
  find,
  map,
  merge,
  reduce,
} from 'lodash-es';
import Barchart from '@/components/Barchart.vue';
import getBarchartOptionsByType from '@/helpers/getBarchartOptionsByType';

export default {
  name: 'DashboardItemBox',
  components: { Barchart },
  props: {
    title: {
      default: 'Dashboard',
      type: String,
    },
  },
  data() {
    return {
      paymentsCount: 30,
    };
  },
  computed: {
    ...mapState('Dashboard', [
      'base',
      'main',
      'revenue',
      'basePeriod',
      'mainPeriod',
      'currency',
      'lastPayments',
    ]),
    ...mapGetters('Dashboard', ['revenueChartPeriod', 'baseChartPeriod']),
    ...mapGetters('Dictionaries', ['countries']),

    mainPeriods() {
      return [
        { label: 'This month', value: 'current_month' },
        { label: 'Previous month', value: 'previous_month' },
        { label: 'This quarter', value: 'current_quarter' },
        { label: 'Previous quarter', value: 'previous_quarter' },
        { label: 'This year', value: 'current_year' },
        { label: 'Previous year', value: 'previous_year' },
      ];
    },
    basePeriods() {
      return [
        { label: 'Today', value: 'current_day' },
        { label: 'Yesterday', value: 'previous_day' },
        { label: 'This week', value: 'current_week' },
        { label: 'Previous week', value: 'previous_week' },
        { label: 'This month', value: 'current_month' },
        { label: 'Previous month', value: 'previous_month' },
        { label: 'This quarter', value: 'current_quarter' },
        { label: 'Previous quarter', value: 'previous_quarter' },
        { label: 'This year', value: 'current_year' },
        { label: 'Previous year', value: 'previous_year' },
      ];
    },

    revenueOptions() {
      return merge(
        getBarchartOptionsByType('revenue'),
        {
          scales: { xAxes: [{ time: { ...this.revenueChartPeriod } }] },
          tooltips: { callbacks: { label: ({ yLabel }) => `${yLabel} ${this.currency}` } },
        },
      );
    },
    mainLastBarColor() {
      return {
        gross_revenue: '#3d7bf5',
        total_transactions: '#f3aa18',
        arpu: '#2fa84f',
        vat: '#ea3d2f',
      };
    },
    mainOptions() {
      return merge(
        getBarchartOptionsByType('common'),
        { tooltips: { callbacks: { label: ({ yLabel }) => `${yLabel} ${this.currency}` } } },
      );
    },
    baseLastBarColor() {
      return {
        revenue_by_country: '#3d7bf5',
        sales_today: '#f3aa18',
        sources: '#2fa84f',
      };
    },
    baseOptions() {
      return merge(
        getBarchartOptionsByType('common'),
        { scales: { xAxes: [{ time: { ...this.baseChartPeriod } }] } },
      );
    },

    paymentsSettings() {
      return [
        { label: 'Show last 30 payments', value: 30 },
        { label: 'Show last 60 payments', value: 60 },
        { label: 'Show last 90 payments', value: 90 },
      ];
    },
  },
  methods: {
    ...mapActions('Dashboard', ['changePeriod', 'fetchLastPayments']),

    get,

    changePaymentsCount(count) {
      this.paymentsCount = count;
      this.fetchLastPayments(count);
    },

    getProjectName(project) {
      return get(
        project,
        `name.${this.$i18n.locale}`,
        get(project, 'notify_emails.0', get(project, 'merchant_id')),
      );
    },

    getCountryByCode(code) {
      return get(find(this.countries, ({ value }) => value === code), 'label', code);
    },

    getData(type) {
      if (type === 'revenue') {
        const revenue = reduce(this.revenue, (res, item) => {
          res.labels.push(item.label);
          res.data.push(item.amount);

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
          datasets: [{
            label: '',
            ...revenueColors,
            data: revenue.data,
          }],
        };
      }

      return reduce(this[type], (res, item, key) => {
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
            amount: current.toLocaleString(),
            amountPrevious: previous.toLocaleString(),
            isIncreased: current > previous,
            top: item.top || undefined,
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
};
</script>

<template>
<div class="charts">
  <div class="header">
    <div class="title">{{ title }}</div>
    <UiSelectAsButton
      :options="mainPeriods"
      :value="mainPeriod"
      @input="changePeriod({ type: 'main', period: $event })"
    />
  </div>

  <div class="section">
    <div class="box _payout">
      <div class="value">1 280 308 {{ currency }}</div>
      <div class="additional">last<br>payout</div>
    </div>
    <div class="box _payout">
      <div class="value">3 170 406 {{ currency }}</div>
      <div class="additional">next<br>payout</div>
    </div>
  </div>

  <div class="section">
    <div class="box _main">
      <div class="value">
        {{ getData('main').gross_revenue.amount }} {{ currency }}
        <IconArrowBold
          :class="['arrow', { '_is-decreased': !getData('main').gross_revenue.isIncreased }]"
        />
      </div>
      <div class="additional">Gross revenue</div>
      <Barchart
        class="main-chart"
        :data="getData('main').gross_revenue.chart"
        :options="mainOptions"
      />
    </div>
    <div class="box _main">
      <div class="value">
        {{ getData('main').total_transactions.amount }} {{ currency }}
        <IconArrowBold
          :class="['arrow', { '_is-decreased': !getData('main').total_transactions.isIncreased }]"
        />
      </div>
      <div class="additional">Total transactions</div>
      <Barchart
        class="main-chart"
        :data="getData('main').total_transactions.chart"
        :options="mainOptions"
      />
    </div>
    <div class="box _main">
      <div class="value">
        {{ getData('main').arpu.amount }} {{ currency }}
        <IconArrowBold
          :class="['arrow', { '_is-decreased': !getData('main').arpu.isIncreased }]"
        />
      </div>
      <div class="additional">ARPU</div>
      <Barchart
        class="main-chart"
        :data="getData('main').arpu.chart"
        :options="mainOptions"
      />
    </div>
    <div class="box _main">
      <div class="value">
        {{ getData('main').vat.amount }} {{ currency }}
        <IconArrowBold
          :class="['arrow', { '_is-decreased': !getData('main').vat.isIncreased }]"
        />
      </div>
      <div class="additional">VAT</div>
      <Barchart
        class="main-chart"
        :data="getData('main').vat.chart"
        :options="mainOptions"
      />
    </div>
  </div>

  <div class="section">
    <div class="box _revenue">
      <div class="box-header">
        <div class="box-title">Revenue Dynamic</div>
      </div>

      <Barchart
        :data="getData('revenue')"
        :options="revenueOptions"
      />
    </div>
  </div>

  <div class="section">
    <div class="box _basic">
      <div class="box-header">
        <div class="box-title">Basic Reports</div>
        <UiSelectAsButton
          :options="basePeriods"
          :value="basePeriod"
          @input="changePeriod({ type: 'base', period: $event })"
        />
      </div>

      <div class="basic">
        <div class="basic-item">
          <div class="basic-title">Revenue by country</div>
          <div class="value">
            {{ getData('base').revenue_by_country.amount }} {{ currency }}
            <IconArrowBold
              :class="[
                'arrow',
                { '_is-decreased': !getData('base').revenue_by_country.isIncreased },
              ]"
            />
          </div>
          <div class="additional">
            {{ getData('base').revenue_by_country.amountPrevious }} {{ currency }} previously
          </div>
          <Barchart
            class="main-chart"
            :data="getData('base').revenue_by_country.chart"
            :options="mainOptions"
          />
          <div class="top">
            <div class="top-title">Top countries</div>
            <div
              v-for="(item, index) in getData('base').revenue_by_country.top"
              :key="index"
              class="top-item"
            >
              <div class="country">{{ getCountryByCode(item.country) }}</div>
              <div class="amount">{{ item.amount }} {{ currency }}</div>
            </div>
          </div>
        </div>
        <div class="basic-item">
          <div class="basic-title">Sources</div>
          <div class="value">
            {{ getData('base').sources.amount }}
            <IconArrowBold
              :class="[
                'arrow',
                { '_is-decreased': !getData('base').sources.isIncreased },
              ]"
            />
          </div>
          <div class="additional">
            {{ getData('base').sources.amountPrevious }} previously
          </div>
          <Barchart
            class="main-chart"
            :data="getData('base').sources.chart"
            :options="baseOptions"
          />
          <div class="top">
            <div class="top-title">Best referrers</div>
            <div
              v-for="(item, index) in getData('base').sources.top"
              :key="index"
              class="top-item"
            >
              <div class="country">{{ item.name }}</div>
              <div class="amount">{{ item.count }}</div>
            </div>
          </div>
        </div>
        <div class="basic-item">
          <div class="basic-title">Sales</div>
          <div class="value">
            {{ getData('base').sales_today.amount }}
            <IconArrowBold
              :class="[
                'arrow',
                { '_is-decreased': !getData('base').sales_today.isIncreased },
              ]"
            />
          </div>
          <div class="additional">
            {{ getData('base').sales_today.amountPrevious }} previously
          </div>
          <Barchart
            class="main-chart"
            :data="getData('base').sales_today.chart"
            :options="baseOptions"
          />
          <div class="top">
            <div class="top-title">Top products</div>
            <div
              v-for="(item, index) in getData('base').sales_today.top"
              :key="index"
              class="top-item"
            >
              <div class="country">{{ item.name }}</div>
              <div class="amount">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="box _payments">
      <div class="box-header">
        <div class="box-title">Last payments</div>
        <UiSelectAsButton
          :options="paymentsSettings"
          :value="paymentsCount"
          @input="changePaymentsCount"
        />
      </div>

      <UiScrollbarBox class="scrollbox">
        <UiTable class="table">
          <UiTableRow :isHead="true">
            <UiTableCell align="left">Transaction</UiTableCell>
            <UiTableCell align="left">Project</UiTableCell>
            <UiTableCell align="left">Country</UiTableCell>
            <UiTableCell align="left">Amount</UiTableCell>
            <UiTableCell align="left">Date</UiTableCell>
            <UiTableCell align="left">User</UiTableCell>
          </UiTableRow>
          <UiTableRow
            v-for="order in lastPayments"
            :key="order.uuid"
          >
            <UiTableCell align="left">
              {{ order.transaction }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ getProjectName(order.project) }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ getCountryByCode(order.country_code) }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ order.total_payment_amount }} {{ currency }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ $formatDate(get(order, 'created_at.seconds')) }}
            </UiTableCell>
            <UiTableCell align="left">
              {{ get(order, 'user.name') || get(order, 'user.email') }}
            </UiTableCell>
          </UiTableRow>
        </UiTable>
      </UiScrollbarBox>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.charts {
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-grow: 1;
  align-items: center;
}
.title {
  font-family: Quicksand;
  font-size: 34px;
  line-height: 42px;
  letter-spacing: 0.25px;
  color: #000;
  padding-right: 16px;
}
.section {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.box {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  background-color: #fff;
  box-shadow: 0px 1px 2px rgba(8, 35, 48, 0.24), 0px 2px 6px rgba(8, 35, 48, 0.16);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  &._payout {
    padding-bottom: 36px;
    text-align: right;

    @media screen and (min-width: 768px) {
      flex-basis: calc(50% - 8px);
    }
  }
  &._main {
    height: 160px;

    @media screen and (min-width: 768px) {
      flex-basis: calc(50% - 8px);
    }
    @media screen and (min-width: 1170px) {
      flex-basis: calc(25% - 12px);
    }

    & > .value,
    & > .additional {
      flex-basis: 100%;
      white-space: nowrap;
    }
    & > .value {
      margin-bottom: 8px;
    }
  }
  &._revenue {
    height: 430px;
    padding: 40px 24px;
  }
  &._basic {
    padding: 30px 24px;
  }
  &._payments {
    height: 570px;
    padding: 24px;
    overflow: hidden;
  }
}
.value {
  font-family: Quicksand;
  color: #000;
  font-size: 24px;
  line-height: 30px;
  padding-right: 16px;
  display: flex;
  align-items: center;
}
.arrow {
  margin-left: 10px;

  &._is-decreased {
    fill: #ea3d2f;
    transform: rotate(180deg);
  }
}
.additional {
  color: #919699;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
}
.main-chart {
  height: 70px;
}
.box-header {
  display: flex;
  flex-basis: 100%;
  justify-content: space-between;
}
.box-title {
  color: #000;
  font-family: Quicksand;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0.15px;
  margin-right: 16px;
}
.basic {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  flex-wrap: wrap;
  margin-top: 20px;
}
.basic-item {
  display: flex;
  flex-wrap: wrap;
  flex-basis: calc(33% - 30px);

  & > .value,
  & > .additional {
    flex-basis: 100%;
    white-space: nowrap;
  }
  & > .value {
    margin-bottom: 8px;
  }
}
.basic-title {
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.44px;
  color: #000;
  margin-bottom: 8px;
  flex-basis: 100%;
  white-space: nowrap;
}
.top {
  display: flex;
  flex-wrap: wrap;
  flex-basis: 100%;
  flex-grow: 1;
}
.top-title,
.top-item {
  display: flex;
  align-items: center;
  flex-basis: 100%;
  height: 40px;
}
.top-title {
  font-family: Roboto;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: #919699;
}
.top-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #000;
  border-top: 1px solid #e3e5e6;
}
.icon-settings {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  margin-left: 16px;
  background-color: transparent;
  transition: background-color 0.2s ease-out;
  cursor: pointer;
  position: relative;

  & > svg {
    fill: #c6cacc;
  }

  &._active,
  &:hover {
    background-color: #f1f3f4;
  }
}
.scrollbox {
  width: 100%;
  height: 100%;
  margin-top: 12px;
}
.table {
  padding-right: 20px;
  margin-bottom: 40px;
}
</style>
