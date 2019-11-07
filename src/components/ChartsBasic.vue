<script>
import { get, find, merge } from 'lodash-es';
import Barchart from '@/components/Barchart.vue';
import getBarchartOptionsByType from '@/helpers/getBarchartOptionsByType';

export default {
  name: 'ChartsBasic',
  components: { Barchart },
  props: {
    chartPeriod: {
      default: () => ({}),
      type: Object,
    },
    countries: {
      default: () => [],
      type: Array,
    },
    currency: {
      default: 'USD',
      type: String,
    },
    data: {
      default: () => ({}),
      type: Object,
    },
    period: {
      default: 'current_month',
      type: String,
    },
  },
  computed: {
    periods() {
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
    chartOptions() {
      return merge(
        getBarchartOptionsByType('common'),
        { scales: { xAxes: [{ time: { ...this.chartPeriod } }] } },
      );
    },
    mainOptions() {
      return merge(
        getBarchartOptionsByType('common'),
        {
          scales: { xAxes: [{ time: { ...this.chartPeriod } }] },
          tooltips: { callbacks: { label: ({ yLabel }) => `${yLabel} ${this.currency}` } },
        },
      );
    },
  },
  methods: {
    getCountryByCode(code) {
      return get(find(this.countries, ({ value }) => value === code), 'label', code);
    },
  },
};
</script>

<template>
<div class="charts-basic">
  <div class="box">
    <div class="box-header">
      <div class="box-title">Basic Reports</div>
      <UiSelectAsButton
        color="transparent-gray"
        size="small"
        :options="periods"
        :value="period"
        :isTransparent="true"
        @input="$emit('changePeriod', { type: 'base', period: $event })"
      />
    </div>

    <div class="basic">
      <div class="basic-item">
        <div class="basic-title">Revenue by country</div>
        <div class="value">
          {{ $formatPrice(data.revenue_by_country.amount, currency) }}
          <IconArrowBold
            v-if="data.revenue_by_country.hasIncreasedArrow"
            :class="[
              'arrow',
              { '_is-decreased': !data.revenue_by_country.isIncreased },
            ]"
          />
        </div>
        <div class="additional">
          {{
            $formatPrice(
              data.revenue_by_country.amountPrevious,
              currency
            )
          }} previously
        </div>
        <Barchart
          v-if="data.revenue_by_country.hasChart"
          class="chart"
          :data="data.revenue_by_country.chart"
          :options="mainOptions"
        />
        <div
          v-if="data.revenue_by_country.hasTop"
          class="top"
        >
          <div class="top-title">Top countries</div>
          <div
            v-for="(item, index) in data.revenue_by_country.top"
            :key="index"
            class="top-item"
          >
            <div class="country">{{ getCountryByCode(item.country) }}</div>
            <div class="amount">{{ $formatPrice(item.amount, currency) }}</div>
          </div>
        </div>
      </div>
      <div class="basic-item">
        <div class="basic-title">Sources</div>
        <div class="value">
          {{ data.sources.amount }}
          <IconArrowBold
            v-if="data.sources.hasIncreasedArrow"
            :class="[
              'arrow',
              { '_is-decreased': !data.sources.isIncreased },
            ]"
          />
        </div>
        <div class="additional">
          {{ data.sources.amountPrevious }} previously
        </div>
        <Barchart
          v-if="data.sources.hasChart"
          class="chart"
          :data="data.sources.chart"
          :options="chartOptions"
        />
        <div
          v-if="data.sources.hasTop"
          class="top"
        >
          <div class="top-title">Best referrers</div>
          <div
            v-for="(item, index) in data.sources.top"
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
          {{ data.sales_today.amount }}
          <IconArrowBold
            v-if="data.sales_today.hasIncreasedArrow"
            :class="[
              'arrow',
              { '_is-decreased': !data.sales_today.isIncreased },
            ]"
          />
        </div>
        <div class="additional">
          {{ data.sales_today.amountPrevious }} previously
        </div>
        <Barchart
          v-if="data.sales_today.hasChart"
          class="chart"
          :data="data.sales_today.chart"
          :options="chartOptions"
        />
        <div
          v-if="data.sales_today.hasTop"
          class="top"
        >
          <div class="top-title">Top products</div>
          <div
            v-for="(item, index) in data.sales_today.top"
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
</template>

<style lang="scss" scoped>
.charts-basic {
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
  margin-bottom: 16px;
  flex-wrap: wrap;
  padding: 30px 24px;
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
.chart {
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
  align-self: flex-start;

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
</style>
