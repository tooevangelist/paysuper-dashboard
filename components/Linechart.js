import { Line } from 'vue-chartjs';

export default {
    extends: Line,
    props: ['data', 'options'],
    watch: {
        data: function (value) {
            this.renderChart(value, this.options)
        }
    },
    mounted: function () {
        this.renderChart(this.data, this.options)
    }
}