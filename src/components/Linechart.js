import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  props: ['data', 'options'],
  watch: {
    data(value) {
      this.renderChart(value, this.options);
    },
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
};
