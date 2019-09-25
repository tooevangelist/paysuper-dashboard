<script>
import Chart from '@/helpers/roundedBarCharts';

export default {
  props: ['data', 'options'],
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      const ctx = this.$refs.chart;
      this.chart = new Chart(ctx, {
        type: 'roundedBar',
        data: this.data,
        options: this.options,
      });
    },
  },
  watch: {
    data(value) {
      this.chart.options = this.options;
      this.chart.data = value;
      this.chart.update();
    },
  },
};
</script>

<template>
<div class="chart-container">
  <canvas ref="chart"></canvas>
</div>
</template>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 10vw;
  height: 100%;
  flex-grow: 1;
}
</style>
