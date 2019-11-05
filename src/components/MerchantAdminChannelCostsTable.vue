<script>
import { get, find, map } from 'lodash-es';
import PaymentMethodsTable from '@/mixins/PaymentMethodsTable';
import ExpandableCellText from '@/components/ExpandableCellText.vue';

export default {
  name: 'MerchantAdminChannelCostsTable',

  mixins: [PaymentMethodsTable],

  components: {
    ExpandableCellText,
  },

  props: {
    channelCosts: {
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
      innerChannelCosts: map(this.channelCosts, arrByMethod => ({
        ...arrByMethod[0],
        isExpanded: false,
        items: arrByMethod,
      })),
    };
  },

  computed: {
    channelCostsFlattened() {
      return this.$_PaymentMethodsTable_flattenDataList(this.innerChannelCosts, 'method');
    },
  },

  methods: {
    moveFocus(index, fieldName, focusMoveDirection) {
      this.$_PaymentMethodsTable_moveFocus({
        index,
        fieldName,
        focusMoveDirection,
        activeFieldNames: this.activeFieldNames,
        flattenedDataList: this.channelCostsFlattened,
      });
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
    <UiComplexTableCell class="cell _amount">Payment amount</UiComplexTableCell>
    <UiComplexTableCell class="cell _region">Region</UiComplexTableCell>
    <UiComplexTableCell class="cell _country">Country</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Fee, %</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Fixed fee</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">Overall fee</UiComplexTableCell>
    <UiComplexTableCell class="cell _fee">PS general fixed fee</UiComplexTableCell>
  </UiComplexTableRow>
  <template
    v-for="(data, index) in channelCostsFlattened"
  >
    <UiComplexTableRow
      :key="index"
      :isPainted="index % 2 === 1"
    >
      <UiComplexTableCell
        class="cell _method"
        align="left"
        :class="{ '_leading': !data.parent}"
        :isCollapsed="!!data.parent"
        :hasChanges="$_PaymentMethodsTable_getIsGroupHasChanges(data, activeFieldNames)"
        :hasError="$_PaymentMethodsTable_getIsGroupHasError(data, activeFieldNames)"
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
      <UiComplexTableCell class="cell _amount">{{ data.amount }}</UiComplexTableCell>
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
      <UiComplexTableCell class="cell _fee">{{ data.overallFee }}</UiComplexTableCell>
      <UiComplexTableCell class="cell _fee">
        {{ data.psGeneralFixedFee }} {{ data.psGeneralFixedFeeCurrency }}
      </UiComplexTableCell>
    </UiComplexTableRow>
  </template>

</UiComplexTable>
</template>

<style lang="scss" scoped>
.cell {
  &._method {
    width: 22%;

    &._leading {
      cursor: pointer;
    }
  }
  &._currency {
    width: 7%;
  }
  &._amount {
    width: 10%;
  }
  &._region {
    width: 7%;
  }
  &._country {
    width: 18%;
  }
  &._fee {
    width: 9%;
  }
}
.method-icon {
  width: 32px;
  height: 18px;
  margin-right: 4px;
}
</style>
