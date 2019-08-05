<script>
import { required } from 'vuelidate/lib/validators';
import { map } from 'lodash-es';

export default {
  name: 'PaymentMethods',
  data() {
    return {
      hasCountriesOpened: false,
      hasChannelCustomersTipOpened: false,
      hasRefundCustomersTipOpened: false,
      currency: '',
      homeRegion: '',
      channelCostsRegion: 'north_america',
      refundCostsRegion: 'north_america',
      paymentAmount: '501-1000',
    };
  },
  validations: {
    currency: { required },
    homeRegion: { required },
  },
  computed: {
    currencies() {
      return [
        { label: 'USD', value: 'usd' },
        { label: 'Euro', value: 'euro' },
        { label: 'GBP', value: 'gbp' },
        { label: 'RUB', value: 'rub' },
      ];
    },
    paymentAmounts() {
      return [
        { label: '1-10$', value: '1-10' },
        { label: '11-100$', value: '11-100' },
        { label: '101-500$', value: '101-500' },
        { label: '501-1000$', value: '501-1000' },
      ];
    },
    prepareCountries() {
      const region = this.regions[this.homeRegion];
      return region ? region.countries.join(', ') : 'List countries for region';
    },
    prepareRegions() {
      return map(this.regions, (region, key) => ({ label: region.label, value: key }));
    },
    channelCosts() {
      return { ...this.regions[this.channelCostsRegion].costs };
    },
    refundCosts() {
      return { ...this.regions[this.refundCostsRegion].costs };
    },
    regions() {
      return {
        north_america: {
          costs: [
            {
              method: 'Visa',
              icon: 'IconVisa',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Mastercard',
              icon: 'IconMastercard',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'QIWI',
              icon: 'IconQiwi',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Ali Pay',
              icon: 'IconAliPay',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Webmoney',
              icon: 'IconWebmoney',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Yandex Money',
              icon: 'IconYandexMoney',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
          ],
          countries: ['USA'],
          defaultCurrency: 'usd',
          label: 'North America',
        },
        european_union: {
          costs: [
            {
              method: 'Visa',
              icon: 'IconVisa',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Mastercard',
              icon: 'IconMastercard',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'QIWI',
              icon: 'IconQiwi',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Ali Pay',
              icon: 'IconAliPay',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Webmoney',
              icon: 'IconWebmoney',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Yandex Money',
              icon: 'IconYandexMoney',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
          ],
          countries: ['France'],
          defaultCurrency: 'euro',
          label: 'European Union',
        },
        united_kingdom: {
          costs: [
            {
              method: 'Visa',
              icon: 'IconVisa',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Mastercard',
              icon: 'IconMastercard',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'QIWI',
              icon: 'IconQiwi',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Ali Pay',
              icon: 'IconAliPay',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Webmoney',
              icon: 'IconWebmoney',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Yandex Money',
              icon: 'IconYandexMoney',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
          ],
          countries: ['UK'],
          defaultCurrency: 'gbp',
          label: 'United Kingdom',
        },
        russia: {
          costs: [
            {
              method: 'Visa',
              icon: 'IconVisa',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Mastercard',
              icon: 'IconMastercard',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'QIWI',
              icon: 'IconQiwi',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Ali Pay',
              icon: 'IconAliPay',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Webmoney',
              icon: 'IconWebmoney',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Yandex Money',
              icon: 'IconYandexMoney',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
          ],
          countries: ['Russia'],
          defaultCurrency: 'rub',
          label: 'Russia',
        },
        worldwide: {
          costs: [
            {
              method: 'Visa',
              icon: 'IconVisa',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Mastercard',
              icon: 'IconMastercard',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'QIWI',
              icon: 'IconQiwi',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Ali Pay',
              icon: 'IconAliPay',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Webmoney',
              icon: 'IconWebmoney',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
            {
              method: 'Yandex Money',
              icon: 'IconYandexMoney',
              methodFee: '1',
              fixedFee: '1',
              overallFee: '1',
              psGeneralFixedFee: '1',
              refundFee: '1',
              refundFixedFee: '1',
              payoutParty: 'Pay Super',
            },
          ],
          countries: ['China'],
          defaultCurrency: 'usd',
          label: 'Worldwide',
        },
      };
    },
    isHomeDefaultCurrency() {
      const region = this.regions[this.homeRegion];
      return region ? region.defaultCurrency === this.currency : false;
    },
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit('submitApplication');
      }
    },
  },
};
</script>

<template>
<div class="payment-methods">
  <div class="section">
    <div class="info">
      Here you can choose the main operational region,
      where you plan your main sales volume and initial payout currency.
      This important choice will define your future money flow rates and commissions,
      so check the variants below carefully and choose the best match for your needs.
    </div>

    <div class="select">
      <UiSelect
        v-bind="$getValidatedFieldProps('homeRegion')"
        label="Home Region"
        :options="prepareRegions"
        :value="homeRegion"
        @input="homeRegion = $event"
        @blur="$v.homeRegion.$touch()"
      />
      <div
        class="icon-wrapper"
        @mouseenter="hasCountriesOpened = true"
        @mouseleave="hasCountriesOpened = false"
      >
        <IconQuestion class="question" />
        <UiTip
          class="tip"
          innerPosition="left"
          position="top"
          width="calc(100vw - 320px)"
          maxWidth="280px"
          :hasCaret="true"
          :visible="hasCountriesOpened"
        >
          {{ prepareCountries }}
        </UiTip>
      </div>
    </div>

    <div class="select">
      <UiSelect
        v-bind="$getValidatedFieldProps('currency')"
        label="Payout Currency"
        :options="currencies"
        :value="currency"
        @input="currency = $event"
        @blur="$v.currency.$touch()"
      />
      <div
        v-if="!isHomeDefaultCurrency"
        class="note"
      >
        <IconInfo class="icon-info" />
        <div class="note-text">
          Due to currency conversion you will be charged for additional 1% fee,
          because your chosen payout currency does not correspond
          with chosen region’s default payout currency.
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="title">Channel costs</div>
    <div class="info">
      Here you can find how your chosen pair Home Region and
      Payout Currency affects on different payment methods fees.
    </div>

    <div class="select">
      <UiSelect
        label="Payment Amount"
        :options="paymentAmounts"
        :value="paymentAmount"
        @input="paymentAmount = $event"
      />
    </div>

    <div class="tabs-info">
      <div
        class="icon-wrapper"
        @mouseenter="hasChannelCustomersTipOpened = true"
        @mouseleave="hasChannelCustomersTipOpened = false"
      >
        <IconQuestion class="question" />
        <UiTip
          class="tip"
          innerPosition="left"
          position="top"
          width="calc(100vw - 320px)"
          maxWidth="280px"
          :hasCaret="true"
          :visible="hasChannelCustomersTipOpened"
        >
          You can check here how your choice of <span class="bolder">Home Region</span>
          and <span class="bolder">Payout Currency</span> will affect
          on rates and fees, if your customer will get refund in another region
        </UiTip>
      </div>
      Customers’ Region
    </div>
    <div class="tabs">
      <UiButton
        v-for="(region, index) in prepareRegions"
        :key="index"
        class="tabs-btn"
        :color="channelCostsRegion === region.value ? 'blue' : 'light-gray'"
        @click="channelCostsRegion = region.value"
      >
        {{ region.label }}
      </UiButton>
    </div>

    <UiTable>
      <UiTableRow :isHead="true">
        <UiTableCell class="first-col"></UiTableCell>
        <UiTableCell align="left">Payment Method</UiTableCell>
        <UiTableCell>Method fee, %</UiTableCell>
        <UiTableCell>Fixed fee</UiTableCell>
        <UiTableCell>Overall fee, %</UiTableCell>
        <UiTableCell>PS general fixed fee</UiTableCell>
      </UiTableRow>
      <UiTableRow
        v-for="(data, index) in channelCosts"
        :key="index"
      >
        <UiTableCell class="first-col">
          <component :is="data.icon" class="method-icon" />
        </UiTableCell>
        <UiTableCell align="left">{{ data.method }}</UiTableCell>
        <UiTableCell>{{ data.methodFee }}</UiTableCell>
        <UiTableCell>{{ data.fixedFee }}</UiTableCell>
        <UiTableCell>{{ data.overallFee }}</UiTableCell>
        <UiTableCell>{{ data.psGeneralFixedFee }}</UiTableCell>
      </UiTableRow>
    </UiTable>
  </div>

  <div class="section">
    <div class="title">Refund costs</div>
    <div class="info">
      Check the refund fees policy below.
      Notice that all refund fees are being paid by Pay Super, so they are
      <span class="bolder">free of charge for you</span>.
    </div>

    <div class="tabs-info">
      <div
        class="icon-wrapper"
        @mouseenter="hasRefundCustomersTipOpened = true"
        @mouseleave="hasRefundCustomersTipOpened = false"
      >
        <IconQuestion class="question" />
        <UiTip
          class="tip"
          innerPosition="left"
          position="top"
          width="calc(100vw - 320px)"
          maxWidth="280px"
          :hasCaret="true"
          :visible="hasRefundCustomersTipOpened"
        >
          You can check here how your choice of <span class="bolder">Home Region</span>
          and <span class="bolder">Payout Currency</span> will affect
          on rates and fees, if your customer will get refund in another region
        </UiTip>
      </div>
      Customers’ Region
    </div>
    <div class="tabs">
      <UiButton
        v-for="(region, index) in prepareRegions"
        :key="index"
        class="tabs-btn"
        :color="refundCostsRegion === region.value ? 'blue' : 'light-gray'"
        @click="refundCostsRegion = region.value"
      >
        {{ region.label }}
      </UiButton>
    </div>

    <UiTable>
      <UiTableRow :isHead="true">
        <UiTableCell class="first-col"></UiTableCell>
        <UiTableCell align="left">Payment Method</UiTableCell>
        <UiTableCell>Refund fee, %</UiTableCell>
        <UiTableCell>Refund fixed fee</UiTableCell>
        <UiTableCell>Refund fee payout party</UiTableCell>
      </UiTableRow>
      <UiTableRow
        v-for="(data, index) in refundCosts"
        :key="index"
      >
        <UiTableCell class="first-col">
          <component :is="data.icon" class="method-icon" />
        </UiTableCell>
        <UiTableCell align="left">{{ data.method }}</UiTableCell>
        <UiTableCell>{{ data.refundFee }}</UiTableCell>
        <UiTableCell>{{ data.refundFixedFee }}</UiTableCell>
        <UiTableCell>{{ data.payoutParty }}</UiTableCell>
      </UiTableRow>
    </UiTable>
  </div>

  <div class="section">
    <div class="title">Chargeback</div>
    <div class="info">
      Pay attention to our chargeback policy.
      Every such transaction has a fixed cost, mentioned below.
    </div>

    <UiTable>
      <UiTableRow :isHead="true">
        <UiTableCell class="first-col"></UiTableCell>
        <UiTableCell align="left">Payment Method</UiTableCell>
        <UiTableCell>Chargeback fee, fix</UiTableCell>
        <UiTableCell>Chargeback fee payout party</UiTableCell>
      </UiTableRow>
      <UiTableRow>
        <UiTableCell class="first-col"></UiTableCell>
        <UiTableCell align="left">All Methods</UiTableCell>
        <UiTableCell>$25,00</UiTableCell>
        <UiTableCell>Merchant</UiTableCell>
      </UiTableRow>
    </UiTable>
  </div>

  <div class="section">
    <div class="title">Payout costs</div>
    <div class="info">
      Please notice there is a fixed service price for every payout transaction.
    </div>

    <UiTable>
      <UiTableRow :isHead="true">
        <UiTableCell class="first-col"></UiTableCell>
        <UiTableCell align="left">Payment Method</UiTableCell>
        <UiTableCell>Payout fee, fix</UiTableCell>
        <UiTableCell>Fee payout party</UiTableCell>
      </UiTableRow>
      <UiTableRow>
        <UiTableCell class="first-col"></UiTableCell>
        <UiTableCell align="left">All Methods</UiTableCell>
        <UiTableCell>$25,00</UiTableCell>
        <UiTableCell>Merchant</UiTableCell>
      </UiTableRow>
    </UiTable>
  </div>

  <UiButton
    class="submit"
    color="green"
    :disabled="$v.$invalid"
    @click="submit"
  >
    SUBMIT APPLICATION
  </UiButton>
</div>
</template>

<style lang="scss" scoped>
.payment-methods {
  display: flex;
  flex-direction: column;
}
.section {
  margin-bottom: 32px;
}
.title {
  font-family: Quicksand;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0.15px;
  color: #000;
  margin-bottom: 8px;
}
.info {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #5e6366;
  margin-bottom: 20px;
  max-width: 548px;
}
.select {
  position: relative;
  width: 100%;
}
.icon-wrapper {
  position: absolute;
  display: flex;
  left: -4px;
  top: 9px;
}
.question {
  fill: #3d7bf5;
  cursor: pointer;

  &:hover {
    fill: #5e6366;
  }
}
.tip {
  background-color: #000;
  padding: 12px;
  color: #fff;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  margin-left: -21px;

  &::after {
    border-top-color: #000;
  }
}
.note {
  display: flex;
}
.icon-info {
  margin-left: -6px;
  margin-right: 6px;
  fill: #ea3d2f;
  flex-shrink: 0;
  width: 12px;
}
.note-text {
  flex-basis: 568px;
}
.tabs-info {
  position: relative;
  letter-spacing: 0.4px;
  color: #5e6366;
  font-size: 12px;
  line-height: 32px;
  padding-left: 12px;
}
.tabs {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.tabs-btn {
  font-weight: normal;
  letter-spacing: 0.25px;
  flex-basis: calc(20% - 4px);
  margin-bottom: 4px;
}
.method-icon {
  width: 32px;
  height: 18px;
  display: table-cell;
}
.bolder {
  font-weight: 500;
}
.first-col {
  width: 40px;
}
.submit {
  min-width: 180px;
  align-self: flex-end;
  letter-spacing: 0.75px;
}
</style>
