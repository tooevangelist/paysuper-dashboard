<script>
import axios from 'axios';
import moment from 'moment';
import { PageHeader } from '@protocol-one/ui-kit';
import Linechart from '@/components/Linechart';
import Notifications from '@/mixins/notificaton';

export default {
  components: { Linechart, PageHeader },
  mixins: [Notifications],
  data() {
    return {
      period: null,
      groupBy: 'day',
      groupByVariants: ['hour', 'day', 'week', 'month', 'year'],
      data: { labels: [], datasets: [] },
      revenue: { count: 0, total: 0, avg: 0 },
      refund: { count: 0, total: 0, avg: 0 },
      shortcuts: [
        { text: 'Today', start: moment(), end: moment() },
        { text: 'Week', start: moment().subtract(6, 'days'), end: moment() },
        { text: 'Month', start: moment().subtract(29, 'days'), end: moment() },
        { text: 'Year', start: moment().subtract(364, 'days'), end: moment() },
      ],
    };
  },
  asyncData() {
    const from = moment().subtract(7, 'days').unix();
    const to = moment().unix();

    const url = `${process.env.VUE_APP_P1PAYAPI_URL}/api/v1/s/order/revenue_dynamic/day?from=${from}&to=${to}`;

    return axios.get(url)
      .then((response) => {
        if (!response.data || !response.data.points
                        || !Array.isArray(response.data.points)) {
          return {
            data: { labels: [], datasets: [] },
            revenue: { count: 0, total: 0, avg: 0 },
            refund: { count: 0, total: 0, avg: 0 },
          };
        }

        const labels = [];
        const datasetsData = [];

        for (let i = 0; i < response.data.points.length; i += 1) {
          const point = response.data.points[i];

          labels.push(`${point.date.day}.${point.date.month}`);
          datasetsData.push(point.amount);
        }

        return {
          data: {
            labels,
            datasets: [{
              label: '', borderColor: '#48c143', fill: false, data: datasetsData,
            }],
          },
          revenue: response.data.revenue,
          refund: response.data.refund,
        };
      }).catch(() => {

      });
  },
  methods: {
    getData() {
      const self = this;

      const from = Math.floor(this.period[0].getTime() / 1000);
      const to = Math.floor(this.period[1].getTime() / 1000);

      const url = `${process.env.VUE_APP_P1PAYAPI_URL}/api/v1/s/order/revenue_dynamic/${this.groupBy}?from=${from}&to=${to}`;

      axios.get(url)
        .then((response) => {
          if (!response.data || !response.data.points
                            || !Array.isArray(response.data.points)) {
            self.data = { labels: [], datasets: [] };
            self.revenue = { count: 0, total: 0, avg: 0 };
            self.refund = { count: 0, total: 0, avg: 0 };
            return;
          }

          const labels = [];
          const datasetsData = [];

          for (let i = 0; i < response.data.points.length; i += 1) {
            const point = response.data.points[i];

            switch (self.groupBy) {
              case 'hour':
                labels.push(`${point.date.day}.${point.date.month} ${point.date.hour}`);
                break;
              case 'day':
                labels.push(`${point.date.day}.${point.date.month}`);
                break;
              case 'week':
                labels.push(`${point.date.week} ${point.date.year}`);
                break;
              case 'month':
                labels.push(`${point.date.month}.${point.date.year}`);
                break;
              case 'year':
                labels.push(point.date.year);
                break;
              default:
                labels.push('');
            }

            datasetsData.push(point.amount);
          }


          self.data = {
            labels,
            datasets: [{
              label: '', borderColor: '#48c143', fill: false, data: datasetsData,
            }],
          };
          self.revenue = response.data.revenue;
          self.refund = response.data.refund;
        }).catch((e) => {
          self.error(self.getErrorMessage(e));
        });
    },
  },
  watch: {
    groupBy() {
      this.getData();
    },
    period() {
      this.getData();
    },
  },
  mounted() {
    this.period = [moment().subtract(6, 'days').toDate(), moment().toDate()];
  },
};
</script>

<template>
  <div>
    <PageHeader>
      <span slot="title">Revenue</span>
    </PageHeader>
    <div class="page-container">
      <div class="row">
        <div class="col-sm-3 col-lg-3">
          <div class="card text-white bg-success">
            <div class="card-body">
              <div class="text-value">Revenue</div>
              <div>{{ revenue.total }}</div>
            </div>
          </div>
        </div>
        <div class="col-sm-3 col-lg-3">
          <div class="card text-white bg-primary">
            <div class="card-body">
              <div class="text-value">Average sum</div>
              <div>{{ revenue.avg }}</div>
            </div>
          </div>
        </div>
        <div class="col-sm-3 col-lg-3">
          <div class="card text-white bg-danger">
            <div class="card-body">
              <div class="text-value">Refund</div>
              <div>{{ refund.total }}</div>
            </div>
          </div>
        </div>
        <div class="col-sm-3 col-lg-3">
          <div class="card text-white bg-info">
            <div class="card-body">
              <div class="text-value">Count of payments</div>
              <div>{{ revenue.count + refund.count }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <linechart
            :data="data"
            :options="{ legend: { display: false }, maintainAspectRatio: false }"
          ></linechart>
        </div>
        <div class="col-6">
          <div class="form-group">
            <v-datepicker
              v-model="period"
              range
              placeholder="Select paid dates range"
              lang="en"
              :shortcuts="shortcuts"
            ></v-datepicker>
          </div>
          <div class="form-group">
            <select class="form-control" v-model="groupBy">
              <option
                v-for="item in groupByVariants"
                :key="item"
                v-bind:value="item"
              >Detailing: by {{ item }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
.mx-shortcuts-wrapper {
  font-size: 12px;
  line-height: 20px !important;
  padding: 12px !important;

  .mx-shortcuts {
    display: inline-block;
    border: 1px solid #73879c;
    border-radius: 3px;
    color: #73879c;
    padding: 5px 10px;
    margin: 5px;

    &:after {
      display: none;
    }
  }
}
</style>
