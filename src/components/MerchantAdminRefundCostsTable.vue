<script>
import {
  find, some, flatten, cloneDeep,
} from 'lodash-es';
import ClickOutside from 'vue-click-outside';
import ExpandableCellText from '@/components/ExpandableCellText.vue';
import ComplexTable from '@/components/ComplexTable.vue';
import ComplexTableRow from '@/components/ComplexTableRow.vue';
import ComplexTableCell from '@/components/ComplexTableCell.vue';
import OpenerCorner from '@/components/OpenerCorner.vue';
import SimpleMenuItem from '@/components/SimpleMenuItem.vue';

const activeFieldNames = ['fee', 'fixedFee'];
export default {
  name: 'MerchantAdminRefundCostsTable',

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
    const refundCostsItem = {
      fee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      fixedFee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      payoutParty: 'paysuper',
      isPayoutPartyMenuOpened: false,
    };
    return {
      refundCosts: [
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Visa',
          icon: 'IconVisa',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Mastercard',
          icon: 'IconMastercard',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'QIWI',
          icon: 'IconQiwi',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Ali Pay',
          icon: 'IconAliPay',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Webmoney',
          icon: 'IconWebmoney',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Yandex Money',
          icon: 'IconYandexMoney',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
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
    refundCostsFlattened() {
      const result = [];
      this.refundCosts.forEach((item) => {
        result.push(item);
        if (item.items && item.isExpanded) {
          result.push(
            ...item.items.map(sub => ({ ...sub, parent: item.method })),
          );
        }
      });

      return result;
    },
  },

  methods: {
    moveFocus(index, fieldName, focusMoveDirection) {
      this.refundCostsFlattened[index][fieldName].hasFocus = false;
      const fieldIndex = activeFieldNames.indexOf(fieldName);
      let newFieldName = fieldName;
      let newIndex = index;

      if (focusMoveDirection === 'right') {
        if (fieldIndex + 1 === activeFieldNames.length) {
          [newFieldName] = activeFieldNames;
        } else {
          newFieldName = activeFieldNames[fieldIndex + 1];
        }
      }
      if (focusMoveDirection === 'left') {
        if (fieldIndex === 0) {
          newFieldName = activeFieldNames[activeFieldNames.length - 1];
        } else {
          newFieldName = activeFieldNames[fieldIndex - 1];
        }
      }
      if (focusMoveDirection === 'up') {
        if (index === 0) {
          newIndex = this.refundCostsFlattened.length - 1;
        } else {
          newIndex = index - 1;
        }
      }
      if (focusMoveDirection === 'down') {
        if (index + 1 === this.refundCostsFlattened.length) {
          newIndex = 0;
        } else {
          newIndex = index + 1;
        }
      }
      this.refundCostsFlattened[newIndex][newFieldName].hasFocus = true;
    },

    handleCellChange(field, value) {
      if (!value) {
        field.hasError = true;
      } else {
        field.hasError = false;
      }
      field.value = value;

      if (Number(field.value) !== 1) {
        field.hasChanges = true;
      } else {
        field.hasChanges = false;
      }
    },

    getCellText(value, symbol) {
      if (value) {
        return `${value}${symbol}`;
      }
      return value;
    },

    getGroupHasChanges(rowData) {
      if (rowData.parent) {
        return false;
      }
      const hasChangesArray = [rowData, ...(rowData.items ? rowData.items : [])]
        .map(item => activeFieldNames.map(name => item[name].hasChanges));

      return some(flatten(hasChangesArray), item => item);
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

    getCellProps(field) {
      return {
        isEditable: true,
        hasChanges: field.hasChanges,
        hasError: field.hasError,
        hasFocus: field.hasFocus,
        value: field.value,
      };
    },
  },
};
</script>

<template>
<ComplexTable>
  <ComplexTableRow :isHead="true">
    <ComplexTableCell class="cell _method" align="left">Payment Method</ComplexTableCell>
    <ComplexTableCell class="cell _currency">Payout currency</ComplexTableCell>
    <ComplexTableCell class="cell _region">Region</ComplexTableCell>
    <ComplexTableCell class="cell _country">Country</ComplexTableCell>
    <ComplexTableCell class="cell _fee">Fee, %</ComplexTableCell>
    <ComplexTableCell class="cell _fee">Fixed fee</ComplexTableCell>
    <ComplexTableCell class="cell _fee">Refund fee payout party</ComplexTableCell>
  </ComplexTableRow>
  <template
    v-for="(data, index) in refundCostsFlattened"
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
        :hasChanges="getGroupHasChanges(data)"
        @click.native="data.isExpanded = !data.isExpanded"
      >
        <ExpandableCellText
          v-if="!data.parent"
          :isOpened="data.isExpanded"
        >
          <component :is="data.icon" class="method-icon" />
          {{ data.method }}
        </ExpandableCellText>
      </ComplexTableCell>
      <ComplexTableCell class="cell _currency">USD</ComplexTableCell>
      <ComplexTableCell class="cell _region">EU</ComplexTableCell>
      <ComplexTableCell class="cell _country">United States</ComplexTableCell>
      <ComplexTableCell
        class="cell _fee"
        v-bind="getCellProps(data.fee)"
        @toggleFocus="data.fee.hasFocus = $event"
        @moveFocus="moveFocus(index, 'fee', $event)"
        @change="handleCellChange(data.fee, $event)"
        mask="###"
      >
        {{ getCellText(data.fee.value, '%') }}
      </ComplexTableCell>
      <ComplexTableCell
        class="cell _fee"
        v-bind="getCellProps(data.fixedFee)"
        @toggleFocus="data.fixedFee.hasFocus = $event"
        @moveFocus="moveFocus(index, 'fixedFee', $event)"
        @change="handleCellChange(data.fixedFee, $event)"
        mask="NNNNNN"
      >
        {{ getCellText(data.fixedFee.value, '$') }}
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
    width: 8%;
  }
  &._payout-party {
    width: 18%;
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
.dropdown {
  top: calc(100% + 4px);
}
</style>
