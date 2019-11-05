<script>
import { get, find } from 'lodash-es';
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
    chargeback: {
      required: true,
      type: Array,
    },
    countries: {
      required: true,
      type: Array,
    },
  },

  data() {
    return {
      mainActiveFieldNames: [],
      secondaryActiveFieldNames: [],
      innerСhargeback: [{
        ...this.chargeback[0],
        name: 'Chargeback',
        isExpanded: false,
        items: this.chargeback,
      }],
      payoutPartyList: [
        {
          label: 'PaySuper',
          value: 'paysuper',
        },
        {
          label: 'Merchant',
          value: 'merchant',
        },
      ],
    };
  },

  computed: {
    chargebackMainListFlattened() {
      return this.$_PaymentMethodsTable_flattenDataList(this.innerСhargeback, 'name');
    },
  },

  methods: {
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
<div>
  <UiComplexTable>
    <UiComplexTableRow :isHead="true">
      <UiComplexTableCell class="cell _method">For all methods</UiComplexTableCell>
      <UiComplexTableCell class="cell _currency">Payout currency</UiComplexTableCell>
      <UiComplexTableCell class="cell _region">Region</UiComplexTableCell>
      <UiComplexTableCell class="cell _country">Country</UiComplexTableCell>
      <UiComplexTableCell class="cell _fee">Fixed fee</UiComplexTableCell>
      <UiComplexTableCell class="cell _fee">Chargeback fee payout party</UiComplexTableCell>
    </UiComplexTableRow>
    <template
      v-for="(data, index) in chargebackMainListFlattened"
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
          :hasChanges="$_PaymentMethodsTable_getIsGroupHasChanges(data, mainActiveFieldNames)"
          @click.native="data.isExpanded = !data.isExpanded"
        >
          <ExpandableCellText
            v-if="index === 0"
            :isOpened="data.isExpanded"
          >
            Chargeback
          </ExpandableCellText>
        </UiComplexTableCell>
        <UiComplexTableCell class="cell _currency">{{ data.payoutCurrency }}</UiComplexTableCell>
        <UiComplexTableCell class="cell _region">
          {{ getRegionAbbr(data.region) }}
        </UiComplexTableCell>
        <UiComplexTableCell class="cell _country">
          {{ getCountryByCode(data.country) }}
        </UiComplexTableCell>
        <UiComplexTableCell class="cell _fee">
          {{ data.fixedFee }} {{ data.fixedFeeCurrency }}
        </UiComplexTableCell>
        <UiComplexTableCell class="cell _payout-party">{{ data.payoutParty }}</UiComplexTableCell>
      </UiComplexTableRow>
    </template>
  </UiComplexTable>
</div>
</template>

<style lang="scss" scoped>
.cell {
  &._method {
    width: 30%;

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
    width: 13%;
  }
  &._payout-party {
    width: 13%;
    cursor: pointer;
    position: relative;
  }
}
.payout-party {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 9px;
}

.secondary-table {
  margin-top: 16px;
}
</style>
