<script>
import { get, find, map } from 'lodash-es';
import ClickOutside from 'vue-click-outside';
import PaymentMethodsTable from '@/mixins/PaymentMethodsTable';
import ExpandableCellText from '@/components/ExpandableCellText.vue';

export default {
  name: 'MerchantAdminRefundCostsTable',
  mixins: [PaymentMethodsTable],

  components: {
    ExpandableCellText,
  },

  directives: {
    ClickOutside,
  },

  props: {
    refundCosts: {
      required: true,
      type: Object,
    },
    countries: {
      required: true,
      type: Array,
    },
  },

  data() {
    return {
      activeFieldNames: [],
      innerRefundCosts: map(this.refundCosts, arrByMethod => ({
        ...arrByMethod[0],
        isExpanded: false,
        items: arrByMethod,
      })),
      payoutPartyList: [
        { label: 'PaySuper', value: 'paysuper' },
        { label: 'Merchant', value: 'merchant' },
      ],
    };
  },

  computed: {
    refundCostsFlattened() {
      return this.$_PaymentMethodsTable_flattenDataList(this.innerRefundCosts, 'method');
    },
  },

  methods: {
    moveFocus(index, fieldName, focusMoveDirection) {
      this.$_PaymentMethodsTable_moveFocus({
        index,
        fieldName,
        focusMoveDirection,
        activeFieldNames: this.activeFieldNames,
        flattenedDataList: this.refundCostsFlattened,
      });
    },

    closePayoutPartyMenu(data) {
      data.isPayoutPartyMenuOpened = false;
    },

    getPayoutPartyLabel(data) {
      return find(this.payoutPartyList, { value: data.payoutParty }).label;
    },

    handlePayoutPartyMenuItemClick(data, item) {
      if (data.payoutParty === item.value) {
        return;
      }
      data.payoutParty = item.value;
      data.isPayoutPartyMenuOpened = false;
    },
    getRegionAbbr(region) {
      return {
        europe: 'EU',
        russia_and_cis: 'RU & CIS',
        asia: 'Asia',
        latin_america: 'LA',
        worldwide: 'WW',
      }[region] || region;
    },
    getCountryByCode(code) {
      return get(find(this.countries, ({ value }) => value === code), 'label', code);
    },
  },
};
</script>

<template>
<UiComplexTable>
  <UiComplexTableRow :isHead="true">
    <UiComplexTableCell class="cell _method" align="left">Payment Method</UiComplexTableCell>
    <UiComplexTableCell class="cell _currency">Payout currency</UiComplexTableCell>
    <UiComplexTableCell class="cell _region">Region</UiComplexTableCell>
    <UiComplexTableCell class="cell _country">Country</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Fee, %</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Fixed fee</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Refund fee payout party</UiComplexTableCell>
  </UiComplexTableRow>
  <template
    v-for="(data, index) in refundCostsFlattened"
  >
    <UiComplexTableRow
      :key="index"
      :isPainted="index % 2 === 1"
    >
      <UiComplexTableCell
        class="cell _method"
        :class="{ '_leading': !data.parent}"
        align="left"
        :isCollapsed="!!data.parent"
        :hasChanges="$_PaymentMethodsTable_getIsGroupHasChanges(data, activeFieldNames)"
        @click.native="data.isExpanded = !data.isExpanded"
      >
        <ExpandableCellText
          v-if="!data.parent"
          :isOpened="data.isExpanded"
        >
          <component :is="data.icon" class="method-icon" />
          {{ data.method }}
        </ExpandableCellText>
      </UiComplexTableCell>
      <UiComplexTableCell class="cell _currency">{{ data.payoutCurrency }}</UiComplexTableCell>
      <UiComplexTableCell class="cell _region">
        {{ getRegionAbbr(data.region) }}
      </UiComplexTableCell>
      <UiComplexTableCell class="cell _country">
        {{ getCountryByCode(data.country) }}
      </UiComplexTableCell>
      <UiComplexTableCell class="cell _fee">{{ data.methodFee }}%</UiComplexTableCell>
      <UiComplexTableCell class="cell _fee">
        {{ data.fixedFee }} {{ data.fixedFeeCurrency }}
      </UiComplexTableCell>
      <UiComplexTableCell class="cell _payout-party">{{ data.payoutParty }}</UiComplexTableCell>
    </UiComplexTableRow>
  </template>
</UiComplexTable>
</template>

<style lang="scss" scoped>
.cell {
  &._method {
    width: 24%;

    &._leading {
      cursor: pointer;
    }
  }
  &._currency {
    width: 7%;
  }
  &._region {
    width: 7%;
  }
  &._country {
    width: 18%;
  }
  &._fee {
    width: 12%;
  }
  &._payout-party {
    width: 16%;
    cursor: pointer;
    position: relative;
  }
}
.method-icon {
  width: 32px;
  height: 18px;
  margin-right: 4px;
}
.payout-party {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 9px;
}
</style>
