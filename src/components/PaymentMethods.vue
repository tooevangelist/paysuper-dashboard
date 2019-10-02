<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import Notifications from '@/mixins/Notifications';

export default {
  name: 'PaymentMethods',
  mixins: [Notifications],
  data() {
    return {
      hasCountriesOpened: false,
      hasChannelCustomersTipOpened: false,
      hasRefundCustomersTipOpened: false,
    };
  },
  validations: {
    currency: { required },
    region: { required },
  },
  computed: {
    ...mapState('Company/Tariff', [
      'amount',
      'currency',
      'channelCostsRegion',
      'refundCostsRegion',
      'region',
      'regions',
    ]),
    ...mapState('User/Merchant', ['merchant', 'onboardingSteps']),
    ...mapGetters('Dictionaries', ['currenciesThreeLetters']),

    status() {
      return this.merchant.status;
    },
    amounts() {
      return [
        { label: `0.75-5 ${this.currency}`, value: '0.75-5' },
        { label: `1-10 ${this.currency}`, value: '1-10' },
        { label: `11-100 ${this.currency}`, value: '11-100' },
        { label: `101-500 ${this.currency}`, value: '101-500' },
        { label: `501-1000 ${this.currency}`, value: '501-1000' },
      ];
    },
    prepareCountries() {
      const region = this.regions[this.region];
      return region ? region.countries.join(', ') : 'List countries for region';
    },
    prepareRegions() {
      return [
        { label: 'North America', value: 'north_america' },
        { label: 'European United', value: 'eu' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Russia', value: 'russia' },
        { label: 'Worldwide', value: 'worldwide' },
      ];
    },
    channelCosts() {
      const region = this.regions[this.channelCostsRegion];
      return region ? region.channelCosts : [];
    },
    refundCosts() {
      const region = this.regions[this.refundCostsRegion];
      return region ? region.refundCosts : [];
    },
    regionChannelAbbr() {
      const region = this.regions[this.channelCostsRegion];
      return region ? region.abbreviation : null;
    },
    regionRefundAbbr() {
      const region = this.regions[this.refundCostsRegion];
      return region ? region.abbreviation : null;
    },
    chargeback() {
      const region = this.regions[this.region];
      return region ? region.chargeback : {};
    },
    payout() {
      const region = this.regions[this.region];
      return region ? region.payout : {};
    },
    isHomeDefaultCurrency() {
      const region = this.regions[this.region];
      return region && this.currency ? region.defaultCurrency === this.currency : true;
    },
    isOneLineCountries() {
      return this.prepareCountries.length < 44;
    },
    currencyErrorText() {
      return this.isHomeDefaultCurrency
        ? this.$getFieldErrorMessages('currency')
        : `Due to currency conversion you will be charged for additional 1% fee,
          because your chosen payout currency does not correspond
          with chosen region’s default payout currency.`;
    },
  },
  async mounted() {
    try {
      await this.initState();
    } catch (error) {
      this.$_Notifications_showErrorMessage(error);
    }
  },
  methods: {
    ...mapActions('Company/Tariff', [
      'initState',
      'submitTariffs',
      'updateAmount',
      'updateCurrency',
      'updateChannelCostsRegion',
      'updateRefundCostsRegion',
      'updateRegion',
    ]),

    async submit() {
      this.$v.region.$touch();
      this.$v.currency.$touch();

      if (!this.$v.region.$invalid && !this.$v.currency.$invalid) {
        try {
          const hasSubmit = await this.submitTariffs();

          if (hasSubmit) {
            this.$emit('hasSubmit');
          }
        } catch (error) {
          this.$_Notifications_showErrorMessage(error);
        }
      }
    },
  },
};
</script>

<template>
<div class="payment-methods">
  <div class="section">
    <div class="info">
      Choose payout currency and the main operational region,
      where you plan your main sales volume.
      This important choice will define your future money flow rates and commissions,
      so check the variants below carefully,
      since you will not be able to change these parameters in future.
    </div>

    <div class="select">
      <UiSelect
        v-bind="$getValidatedFieldProps('region')"
        label="Home Region"
        :options="prepareRegions"
        :value="region"
        @input="updateRegion($event)"
        @blur="$v.region.$touch()"
      />
      <div
        class="icon-wrapper"
        @mouseenter="hasCountriesOpened = true"
        @mouseleave="hasCountriesOpened = false"
      >
        <IconQuestion class="question" />
        <UiTip
          :class="['tip', { '_nowrap': isOneLineCountries }]"
          innerPosition="left"
          position="top"
          maxWidth="280px"
          :width="isOneLineCountries ? 'auto' : 'calc(100vw - 320px)'"
          :hasCaret="true"
          :visible="hasCountriesOpened"
        >
          {{ prepareCountries }}
        </UiTip>
      </div>
    </div>

    <div class="info">
      Your chosen payout currency must match the currency of your bank account in
      <span class="blue-text">Banking Info</span> section.
    </div>
    <div class="select">
      <UiSelect
        v-bind="$getValidatedFieldProps('currency')"
        label="Payout Currency"
        :options="currenciesThreeLetters"
        :value="currency"
        :errorText="currencyErrorText"
        :hasError="$isFieldInvalid('currency') || !isHomeDefaultCurrency"
        :errorColor="isHomeDefaultCurrency ? 'red' : 'black'"
        @input="updateCurrency($event)"
        @blur="$v.currency.$touch()"
      />
    </div>
  </div>

  <div class="section">
    <div class="title">Channel costs</div>
    <div class="info">
      You can find how your chosen pair <span class="bolder">Home Region</span> and
      <span class="bolder">Payout Currency</span> affects on different payment methods fees.
    </div>

    <div class="select">
      <UiSelect
        label="Payment Amount"
        :options="amounts"
        :value="amount"
        @input="updateAmount($event)"
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
      External regions rates ({{ regionChannelAbbr }})
    </div>
    <div class="tabs">
      <UiButton
        v-for="(region, index) in prepareRegions"
        :key="index"
        class="tabs-btn"
        color="light-gray"
        :isRounded="true"
        :isTransparent="channelCostsRegion !== region.value"
        @click="updateChannelCostsRegion(region.value)"
      >
        {{ region.label }}
      </UiButton>
    </div>

    <transition name="table" mode="out-in">
      <UiTable v-if="channelCosts.length">
        <UiTableRow :isHead="true" class="row-indent">
          <UiTableCell class="cell _second" align="left">Payment Method</UiTableCell>
          <UiTableCell class="cell _channel">Method fee, %</UiTableCell>
          <UiTableCell class="cell _channel">Fixed fee, {{ currency }}</UiTableCell>
          <UiTableCell class="cell _channel">Overall fee, %</UiTableCell>
          <UiTableCell class="cell _channel">PS general fixed fee</UiTableCell>
        </UiTableRow>
        <UiTableRow
          v-for="(data, index) in channelCosts"
          :key="index"
        >
          <UiTableCell class="cell _first">
            <component :is="data.icon" class="method-icon" />
          </UiTableCell>
          <UiTableCell class="cell _second" align="left">{{ data.method }}</UiTableCell>
          <UiTableCell class="cell _channel">{{ data.methodFee }}</UiTableCell>
          <UiTableCell class="cell _channel">{{ data.fixedFee }}</UiTableCell>
          <UiTableCell class="cell _channel">{{ data.overallFee }}</UiTableCell>
          <UiTableCell class="cell _channel">{{ data.psGeneralFixedFee }}</UiTableCell>
        </UiTableRow>
      </UiTable>
    </transition>
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
      External regions rates ({{ regionRefundAbbr }})
    </div>
    <div class="tabs">
      <UiButton
        v-for="(region, index) in prepareRegions"
        :key="index"
        class="tabs-btn"
        color="light-gray"
        :isRounded="true"
        :isTransparent="refundCostsRegion !== region.value"
        @click="updateRefundCostsRegion(region.value)"
      >
        {{ region.label }}
      </UiButton>
    </div>

    <transition name="table" mode="out-in">
      <UiTable v-if="refundCosts.length">
        <UiTableRow :isHead="true" class="row-indent">
          <UiTableCell class="cell _second" align="left">Payment Method</UiTableCell>
          <UiTableCell class="cell _refund">Refund fee, %</UiTableCell>
          <UiTableCell class="cell _refund">Refund fixed fee, {{ currency }}</UiTableCell>
          <UiTableCell class="cell _refund">Refund fee payout party</UiTableCell>
        </UiTableRow>
        <UiTableRow
          v-for="(data, index) in refundCosts"
          :key="index"
        >
          <UiTableCell class="cell _first">
            <component :is="data.icon" class="method-icon" />
          </UiTableCell>
          <UiTableCell class="cell _second" align="left">{{ data.method }}</UiTableCell>
          <UiTableCell class="cell _refund">{{ data.refundFee }}</UiTableCell>
          <UiTableCell class="cell _refund">{{ data.refundFixedFee }}</UiTableCell>
          <UiTableCell class="cell _refund">{{ data.payoutParty }}</UiTableCell>
        </UiTableRow>
      </UiTable>
    </transition>
  </div>

  <div class="section">
    <div class="title">Chargeback</div>
    <div class="info">
      Pay attention to our chargeback policy.
      Every such transaction has a fixed cost, mentioned below.
    </div>

    <UiTable>
      <UiTableRow :isHead="true" class="row-indent">
        <UiTableCell class="cell _second" align="left">Payment Method</UiTableCell>
        <UiTableCell class="cell _merch">Chargeback fixed fee, {{ currency }}</UiTableCell>
        <UiTableCell class="cell _merch">Chargeback fee payout party</UiTableCell>
      </UiTableRow>
      <UiTableRow class="row-indent">
        <UiTableCell class="cell _second" align="left">All Methods</UiTableCell>
        <UiTableCell class="cell _merch">{{ chargeback.fee }}</UiTableCell>
        <UiTableCell class="cell _merch">{{ chargeback.payoutParty}}</UiTableCell>
      </UiTableRow>
    </UiTable>
  </div>

  <div class="section">
    <div class="title">Payout costs</div>
    <div class="info">
      Please notice there is a fixed service price for every payout transaction.
    </div>

    <UiTable>
      <UiTableRow :isHead="true" class="row-indent">
        <UiTableCell class="cell _second" align="left">Payment Method</UiTableCell>
        <UiTableCell class="cell _merch">Payout fixed fee, {{ currency }}</UiTableCell>
        <UiTableCell class="cell _merch">Fee payout party</UiTableCell>
      </UiTableRow>
      <UiTableRow class="row-indent">
        <UiTableCell class="cell _second" align="left">All Methods</UiTableCell>
        <UiTableCell class="cell _merch">{{ payout.fee }}</UiTableCell>
        <UiTableCell class="cell _merch">{{ payout.payoutParty}}</UiTableCell>
      </UiTableRow>
    </UiTable>
  </div>

  <UiButton
    class="submit"
    color="green"
    :disabled="onboardingSteps.tariff || status !== 0"
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
  max-width: 420px;
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

  &._nowrap {
    white-space: nowrap;
  }

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
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.tabs > .tabs-btn {
  font-weight: normal;
  letter-spacing: 0.25px;
  margin-bottom: 4px;
  margin-right: 4px;
}
.method-icon {
  width: 32px;
  height: 18px;
  display: table-cell;
}
.bolder {
  font-weight: 500;
}
.blue-text {
  color: #3d7bf5;
}
.row-indent {
  &::before {
    content: '';
    display: table-cell;
    width: 40px;
    border-bottom: 2px solid #e3e5e6;
  }
}
.cell {
  &._first {
    width: 40px;
  }
  &._second {
    width: 120px;
  }
  &._channel {
    width: 19.5%;
  }
  &._refund {
    width: 26%;
  }
  &._merch {
    width: 39%;
  }
}
.table-enter,
.table-leave-active {
  opacity: 0;
}
.table-enter-active,
.table-leave-active {
  transition: opacity 0.2s ease-out;
}
.submit {
  min-width: 180px;
  align-self: flex-end;
  letter-spacing: 0.75px;
}
</style>
