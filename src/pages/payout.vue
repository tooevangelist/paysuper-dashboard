<script>
import { mapState, mapActions } from 'vuex';
import { UiPageHeader } from '@protocol-one/ui-kit';
import moment from 'moment';
import Notifications from '@/mixins/notificaton';
import PayoutStore from '@/store/PayoutStore';

export default {
  mixins: [Notifications],
  components: {
    UiPageHeader,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('Payout', PayoutStore, route.params.id);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      periods: [],
      selected: null,
      payout: null,
    };
  },

  computed: {
    ...mapState('User/Merchant', ['merchant']),
  },

  mounted() {
    if (
      this.merchant.first_payment_at
      && this.merchant.first_payment_at != null
      && this.merchant.accounting_period != null
    ) {
      const cDate = moment();
      const fpDate = moment(this.merchant.first_payment_at);

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
          default:
            fpDate.add(0, 'day');
        }

        item.to = fpDate.unix();

        this.periods.push(item);
      }
    }
  },

  methods: {
    ...mapActions('Payout', ['fetchPayout']),
    show() {
      this.fetchPayout(this.selected);
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeader>
      <span slot="title">Payout</span>
    </UiPageHeader>
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
                <router-link
                  type="button"
                  class="btn btn-outline-primary btn-sm"
                  :to="{ path: '/transactions', query: {
                    pm_date_from: selected.from, pm_date_to: selected.to
                  }}"
                  active-class
                  tag="button"
                >
                  <i class="fa fa-search"></i> Show log
                </router-link>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
