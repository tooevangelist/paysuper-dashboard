<script>
import { find, cloneDeep } from 'lodash-es';
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
  },

  data() {
    const chargebackMainListItem = {
      fixedFee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      country: 'United States',
      payoutParty: 'paysuper',
      isPayoutPartyMenuOpened: false,
    };
    const chargebackSecondaryListItem = {
      value: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      businessDays: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      payoutParty: 'paysuper',
      isPayoutPartyMenuOpened: false,
    };
    return {
      mainActiveFieldNames: ['fixedFee'],
      secondaryActiveFieldNames: ['value', 'businessDays'],
      chargebackMainList: [
        {
          ...(cloneDeep(chargebackMainListItem)),
          name: 'Chargeback',
          isExpanded: false,
          items: [
            cloneDeep(chargebackMainListItem),
            {
              ...cloneDeep(chargebackMainListItem),
              country: 'Germany',
            },
            {
              ...cloneDeep(chargebackMainListItem),
              country: 'Netherlands',
            },
            {
              ...cloneDeep(chargebackMainListItem),
              country: 'Austria',
            },
            {
              ...cloneDeep(chargebackMainListItem),
              country: 'Russia',
            },
            {
              ...cloneDeep(chargebackMainListItem),
              country: 'China',
            },
            cloneDeep(chargebackMainListItem),
          ],
        },
      ],

      chargebackSecondaryList: [
        {
          ...(cloneDeep(chargebackSecondaryListItem)),
          name: 'Total chargeback amount limit',
          isExpanded: false,
          items: [
            cloneDeep(chargebackSecondaryListItem),
            cloneDeep(chargebackSecondaryListItem),
          ],
          value: null,
        },
        {
          ...(cloneDeep(chargebackSecondaryListItem)),
          name: 'Total transactions limit',
          isExpanded: false,
          items: [
            cloneDeep(chargebackSecondaryListItem),
            cloneDeep(chargebackSecondaryListItem),
          ],
          businessDays: null,
        },
        {
          ...(cloneDeep(chargebackSecondaryListItem)),
          name: 'Total chargeback time limit',
          isExpanded: false,
          items: [
            cloneDeep(chargebackSecondaryListItem),
            cloneDeep(chargebackSecondaryListItem),
          ],
        },
      ],

      payoutPartyList: [
        {
          label: 'Pay Super',
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
      return this.$_PaymentMethodsTable_flattenDataList(this.chargebackMainList, 'name');
    },
    chargebackSecondaryListFlattened() {
      return this.$_PaymentMethodsTable_flattenDataList(this.chargebackSecondaryList, 'name');
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
        <UiComplexTableCell class="cell _currency">USD</UiComplexTableCell>
        <UiComplexTableCell class="cell _region">EU</UiComplexTableCell>
        <UiComplexTableCell class="cell _country">{{data.country}}</UiComplexTableCell>
        <UiComplexTableCell
          class="cell _fee"
          v-bind="$_PaymentMethodsTable_getEditableCellProps(data.fixedFee)"
          @toggleFocus="data.fixedFee.hasFocus = $event"
          @change="$_PaymentMethodsTable_handleCellChange(data.fixedFee, $event)"
          mask="NNNNNN"
        >
          {{ $_PaymentMethodsTable_getFieldText(data.fixedFee.value, '$') }}
        </UiComplexTableCell>
        <UiComplexTableCell
          class="cell _payout-party"
          @click.native="data.isPayoutPartyMenuOpened = !data.isPayoutPartyMenuOpened"
          v-click-outside="() => closePayoutPartyMenu(data)"
        >
          <div class="payout-party">
            {{getPayoutPartyLabel(data)}}
            <UiOpenerCorner :isOpened="data.isPayoutPartyMenuOpened" />
          </div>

          <UiTip
            innerPosition="right"
            position="bottom"
            width="180px"
            :margin="0"
            :visible="data.isPayoutPartyMenuOpened"
            :closeDelay="0"
            :stayOpenedOnHover="false"
          >
            <UiTooltipMenuItem
              v-for="item in payoutPartyList"
              v-text="item.label"
              :key="item.value"
              :isCurrent="data.payoutParty === item.value"
              @click.native.stop="handlePayoutPartyMenuItemClick(data, item)"
            />
          </UiTip>
        </UiComplexTableCell>
      </UiComplexTableRow>
    </template>
  </UiComplexTable>

  <UiComplexTable class="secondary-table">
    <UiComplexTableRow :isHead="true">
      <UiComplexTableCell class="cell _method"></UiComplexTableCell>
      <UiComplexTableCell class="cell _currency">Payout currency</UiComplexTableCell>
      <UiComplexTableCell class="cell _region">Region</UiComplexTableCell>
      <UiComplexTableCell class="cell _country">Country</UiComplexTableCell>
      <UiComplexTableCell class="cell _fee">Value, %</UiComplexTableCell>
      <UiComplexTableCell class="cell _fee">Business days</UiComplexTableCell>
    </UiComplexTableRow>
    <template
      v-for="(data, index) in chargebackSecondaryListFlattened"
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
          :hasChanges="$_PaymentMethodsTable_getIsGroupHasChanges(data, secondaryActiveFieldNames)"
          @click.native="data.isExpanded = !data.isExpanded"
        >
          <ExpandableCellText
            v-if="!data.parent"
            :isOpened="data.isExpanded"
          >
            {{ data.name }}
          </ExpandableCellText>
        </UiComplexTableCell>
        <UiComplexTableCell class="cell _currency">USD</UiComplexTableCell>
        <UiComplexTableCell class="cell _region">EU</UiComplexTableCell>
        <UiComplexTableCell class="cell _country">United States</UiComplexTableCell>
        <UiComplexTableCell
          class="cell _fee"
          v-bind="$_PaymentMethodsTable_getEditableCellProps(data.value)"
          @toggleFocus="data.value.hasFocus = $event"
          @change="$_PaymentMethodsTable_handleCellChange(data.value, $event)"
          mask="NNNNNN"
        >
          {{ $_PaymentMethodsTable_getFieldText(data.value) }}
        </UiComplexTableCell>
        <UiComplexTableCell
          class="cell _fee"
          v-bind="$_PaymentMethodsTable_getEditableCellProps(data.businessDays)"
          @toggleFocus="data.businessDays.hasFocus = $event"
          @change="$_PaymentMethodsTable_handleCellChange(data.businessDays, $event)"
          mask="NNNNNN"
        >
          {{ $_PaymentMethodsTable_getFieldText(data.businessDays) }}
        </UiComplexTableCell>
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
