<script>
import { merge } from 'lodash-es';
import Barchart from '@/components/Barchart.vue';
import getBarchartOptionsByType from '@/helpers/getBarchartOptionsByType';

export default {
  name: 'ChartsRevenue',
  components: { Barchart },
  props: {
    chartPeriod: {
      default: () => ([]),
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
  },
  computed: {
    chartOptions() {
      return merge(
        getBarchartOptionsByType('revenue'),
        {
          scales: { xAxes: [{ time: { min: this.chartPeriod[0], max: this.chartPeriod[1] } }] },
          tooltips: { callbacks: { label: ({ yLabel }) => `${yLabel} ${this.currency}` } },
        },
      );
    },
  },
};
</script>

<template>
<div
  v-if="data.hasChart"
  class="charts-revenue"
>
  <div class="box">
    <div class="box-header">
      <div class="box-title">Revenue Dynamic</div>
    </div>

    <Barchart
      :data="data"
      :options="chartOptions"
    />
  </div>
</div>
</template>

<style lang="scss" scoped>
.charts-revenue {
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
  height: 430px;
  padding: 40px 24px;
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
</style>
