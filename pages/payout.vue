<template>
  <div>
    <PageHeader>
      <span slot="title">Payout</span>
    </PageHeader>
    <div class="page-container">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="period">Select period</label>
            <select id="period" class="form-control" v-model="selected" @change="show">
              <option
                v-for="(item, key) in periods"
                v-bind:key="key"
                v-bind:value="item"
              >{{ item.label }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row" v-if="payout != null">
        <div class="col">
          <table class="table">
            <tr>
              <th>Period</th>
              <th>Currency</th>
              <th>Total amount</th>
              <th>Payout amount</th>
              <th>Commission amount</th>
              <th>Refund amount</th>
              <th>Chargeback amount</th>
              <th>&nbsp;</th>
            </tr>
            <tr>
              <td>{{ selected.label }}</td>
              <td>{{ merchant.currency['code_a3'] }}</td>
              <td>{{ payout['success_with_commissions'] }}</td>
              <td>{{ payout['success_without_commissions'] }}</td>
              <td>{{ payout['total_commission'] }}</td>
              <td>{{ payout['total_refund'] }}</td>
              <td>{{ payout['total_chargeback'] }}</td>
              <td>
                <nuxt-link
                  type="button"
                  class="btn btn-outline-primary btn-sm"
                  v-bind:to="{ path: '/order', query: { pm_date_from: selected.from, pm_date_to: selected.to }}"
                  active-class
                  tag="button"
                >
                  <i class="fa fa-search"></i> Show log
                </nuxt-link>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { PageHeader } from '@protocol-one/ui-kit';
import axios from 'axios';
import Notifications from '@/mixins/notificaton';

export default {
  middleware: 'IsNotAuthenticated',
  mixins: [Notifications],
  components: {
    PageHeader,
  },
  data() {
    return {
      periods: [],
      selected: null,
      payout: null,
    };
  },
  methods: {
    show() {
      const self = this;
      const url = `${process.env.apiServerUrl}/api/v1/s/order/accounting_payment?from=${this.selected.from}&to=${this.selected.to}`;

      axios.get(url, { headers: { Authorization: `Bearer ${this.$store.state.user.accessToken}` } })
        .then((response) => {
          self.payout = response.data;
        }).catch(() => {

        });
    },
  },
  computed: {
    ...mapState('merchant', ['merchant']),
  },
  mounted() {
    if (this.merchant.first_payment_at
                && this.merchant.first_payment_at != null && this.merchant.accounting_period != null) {
      const cDate = this.$moment();
      const fpDate = this.$moment(this.merchant.first_payment_at);

      while (fpDate.unix() <= cDate.unix()) {
        const item = { from: fpDate.unix() };

        switch (this.merchant.accounting_period) {
          case 'day':
            item.label = fpDate.format('MMM Do YYYY');
            fpDate.add(1, 'd');
            break;
          case 'week':
            item.label = fpDate.format('MMM Do YYYY');
            fpDate.add(1, 'w');
            break;
          case '2week':
            item.label = fpDate.format('MMM Do YYYY');
            fpDate.add(2, 'w');
            break;
          case 'month':
            item.label = fpDate.format('MMM YYYY');
            fpDate.add(1, 'M');
            break;
          case 'quarter':
            item.label = fpDate.format('MMM YYYY');
            fpDate.add(3, 'M');
            break;
          case 'half-year':
            item.label = fpDate.format('MMM YYYY');
            fpDate.add(6, 'M');
            break;
          case 'year':
            item.label = fpDate.format('MMM YYYY');
            fpDate.add(1, 'y');
            break;
        }

        item.to = fpDate.unix();

        this.periods.push(item);
      }
    }
  },
};
</script>
