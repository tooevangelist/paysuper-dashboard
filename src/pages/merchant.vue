<script>
import { mapState, mapActions } from 'vuex';
import {
  Button, Select, TextField, PageHeader,
} from '@protocol-one/ui-kit';
import MerchantStore from '@/store/MerchantStore';
import Notifications from '../mixins/notificaton';
import Country from '../mixins/country';
import Currency from '../mixins/currency';

export default {
  mixins: [Notifications, Currency, Country],
  components: {
    PageHeader,
    Button,
    Select,
    TextField,
  },

  asyncData({ registerStoreModule, route }) {
    return registerStoreModule('Merchant', MerchantStore, {
      query: route.query,
    });
  },

  data() {
    return {
      name: '',
      currency: null,
      country: null,
      accountingPeriod: null,
      accountingPeriods: [
        { label: 'Every day', value: 'day' },
        { label: 'Every week', value: 'week' },
        { label: 'Every two week', value: '2week' },
        { label: 'Every month', value: 'month' },
        { label: 'Every quarter', value: 'quarter' },
        { label: 'Every half-year', value: 'half-year' },
        { label: 'Every year', value: 'year' },
      ],
    };
  },
  computed: {
    ...mapState('Merchant', ['merchant']),
  },
  mounted() {
    this.name = this.merchant.name;

    if (this.merchant.country) {
      this.country = this.merchant.country.code_int;
    }

    if (this.merchant.currency) {
      this.currency = this.merchant.currency.code_int;
    }

    this.accountingPeriods.forEach((item) => {
      if (this.merchant.accounting_period !== item.value) {
        return;
      }

      this.accountingPeriod = item.value;
    });
  },

  methods: {
    ...mapActions('Merchant', ['updateMerchant']),
    update() {
      this.updateMerchant({
        ...this.data,
        name: this.name,
        currency: this.currency,
        country: this.country,
        accounting_period: this.accountingPeriod,
      });
    },
  },
};
</script>

<template>
  <div>
    <PageHeader>
      <span slot="title">Merchant</span>
    </PageHeader>
    <div class="container-fluid" style="margin-top: 30px;">
      <div class="row">
        <div class="col-md-12">
          <div class="alert alert-info" role="alert" v-if="!merchant || merchant.status < 1">
            Thanks for your registration. Please enter main information
            about your company before you create first technical integration.
          </div>
        </div>

        <div class="col-md-12" v-if="merchant">
          <div class="card">
            <div class="card-header">
              <strong>Add main information about your company</strong>
            </div>
            <div class="card-body">
              <div class="form-group">
                <TextField
                  placeholder="Enter your company name"
                  v-model="name"
                  label="Name"
                />
              </div>
              <div class="form-group">
                <Select
                  label="Country"
                  :options="countries"
                  :hasEmptyValue="true"
                  @search="onCountrySearch"
                  v-model="country"
                />
              </div>
              <div class="form-group">
                <Select
                  label="Accounting currency"
                  :options="currencies"
                  :hasEmptyValue="true"
                  @search="onCurrencySearch"
                  v-model="currency"
                />
              </div>
              <div class="form-group">
                <Select
                  label="Accounting period"
                  :options="accountingPeriods"
                  :hasEmptyValue="true"
                  @search="onCurrencySearch"
                  v-model="accountingPeriod"
                />
              </div>

              <div class="form-group btn float-right">
                <Button @click="update">Save</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
