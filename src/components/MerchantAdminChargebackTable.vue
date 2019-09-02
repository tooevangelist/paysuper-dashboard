<script>
import { find, cloneDeep } from 'lodash-es';
import ClickOutside from 'vue-click-outside';
import PaymentMethodsTable from '@/mixins/PaymentMethodsTable';
import ExpandableCellText from '@/components/ExpandableCellText.vue';
import ComplexTable from '@/components/ComplexTable.vue';
import ComplexTableRow from '@/components/ComplexTableRow.vue';
import ComplexTableCell from '@/components/ComplexTableCell.vue';
import OpenerCorner from '@/components/OpenerCorner.vue';
import SimpleMenuItem from '@/components/SimpleMenuItem.vue';

export default {
  name: 'MerchantAdminRefundCostsTable',
  mixins: [PaymentMethodsTable],

  components: {
    ComplexTable,
    ComplexTableRow,
    ComplexTableCell,
    ExpandableCellText,
    OpenerCorner,
    SimpleMenuItem,
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
  <ComplexTable>
    <ComplexTableRow :isHead="true">
      <ComplexTableCell class="cell _method">For all methods</ComplexTableCell>
      <ComplexTableCell class="cell _currency">Payout currency</ComplexTableCell>
      <ComplexTableCell class="cell _region">Region</ComplexTableCell>
      <ComplexTableCell class="cell _country">Country</ComplexTableCell>
      <ComplexTableCell class="cell _fee">Fixed fee</ComplexTableCell>
      <ComplexTableCell class="cell _fee">Chargeback fee payout party</ComplexTableCell>
    </ComplexTableRow>
    <template
      v-for="(data, index) in chargebackMainListFlattened"
    >
      <ComplexTableRow
        :key="index"
        :isPainted="index % 2 === 1"
      >
        <ComplexTableCell
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
        </ComplexTableCell>
        <ComplexTableCell class="cell _currency">USD</ComplexTableCell>
        <ComplexTableCell class="cell _region">EU</ComplexTableCell>
        <ComplexTableCell class="cell _country">{{data.country}}</ComplexTableCell>
        <ComplexTableCell
          class="cell _fee"
          v-bind="$_PaymentMethodsTable_getEditableCellProps(data.fixedFee)"
          @toggleFocus="data.fixedFee.hasFocus = $event"
          @change="$_PaymentMethodsTable_handleCellChange(data.fixedFee, $event)"
          mask="NNNNNN"
        >
          {{ $_PaymentMethodsTable_getFieldText(data.fixedFee.value, '$') }}
        </ComplexTableCell>
        <ComplexTableCell
          class="cell _payout-party"
          @click.native="data.isPayoutPartyMenuOpened = !data.isPayoutPartyMenuOpened"
          v-click-outside="() => closePayoutPartyMenu(data)"
        >
          <div class="payout-party">
            {{getPayoutPartyLabel(data)}}
            <OpenerCorner :isOpened="data.isPayoutPartyMenuOpened" />
          </div>

          <UiTip
            class="dropdown"
            innerPosition="right"
            position="bottom"
            width="180px"
            :visible="data.isPayoutPartyMenuOpened"
            :closeDelay="0"
            :stayOpenedOnHover="false"
          >
            <SimpleMenuItem
              v-for="item in payoutPartyList"
              v-text="item.label"
              :key="item.value"
              :isCurrent="data.payoutParty === item.value"
              @click.native.stop="handlePayoutPartyMenuItemClick(data, item)"
            />
          </UiTip>
        </ComplexTableCell>
      </ComplexTableRow>
    </template>
  </ComplexTable>

  <ComplexTable class="secondary-table">
    <ComplexTableRow :isHead="true">
      <ComplexTableCell class="cell _method"></ComplexTableCell>
      <ComplexTableCell class="cell _currency">Payout currency</ComplexTableCell>
      <ComplexTableCell class="cell _region">Region</ComplexTableCell>
      <ComplexTableCell class="cell _country">Country</ComplexTableCell>
      <ComplexTableCell class="cell _fee">Value, %</ComplexTableCell>
      <ComplexTableCell class="cell _fee">Business days</ComplexTableCell>
    </ComplexTableRow>
    <template
      v-for="(data, index) in chargebackSecondaryListFlattened"
    >
      <ComplexTableRow
        :key="index"
        :isPainted="index % 2 === 1"
      >
        <ComplexTableCell
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
        </ComplexTableCell>
        <ComplexTableCell class="cell _currency">USD</ComplexTableCell>
        <ComplexTableCell class="cell _region">EU</ComplexTableCell>
        <ComplexTableCell class="cell _country">United States</ComplexTableCell>
        <ComplexTableCell
          class="cell _fee"
          v-bind="$_PaymentMethodsTable_getEditableCellProps(data.value)"
          @toggleFocus="data.value.hasFocus = $event"
          @change="$_PaymentMethodsTable_handleCellChange(data.value, $event)"
          mask="NNNNNN"
        >
          {{ $_PaymentMethodsTable_getFieldText(data.value) }}
        </ComplexTableCell>
        <ComplexTableCell
          class="cell _fee"
          v-bind="$_PaymentMethodsTable_getEditableCellProps(data.businessDays)"
          @toggleFocus="data.businessDays.hasFocus = $event"
          @change="$_PaymentMethodsTable_handleCellChange(data.businessDays, $event)"
          mask="NNNNNN"
        >
          {{ $_PaymentMethodsTable_getFieldText(data.businessDays) }}
        </ComplexTableCell>
      </ComplexTableRow>
    </template>
  </ComplexTable>
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

.dropdown {
  top: calc(100% + 4px);
}
</style>
