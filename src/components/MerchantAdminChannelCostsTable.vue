<script>
import { some, flatten, cloneDeep } from 'lodash-es';
import ExpandableCellText from '@/components/ExpandableCellText.vue';
import ComplexTable from '@/components/ComplexTable.vue';
import ComplexTableRow from '@/components/ComplexTableRow.vue';
import ComplexTableCell from '@/components/ComplexTableCell.vue';
import OpenerCorner from '@/components/OpenerCorner.vue';

const activeFieldNames = ['fee', 'fixedFee', 'overallFee', 'psGeneralFixedFee'];
export default {
  name: 'MerchantAdminChannelCostsTable',

  components: {
    ComplexTable,
    ComplexTableRow,
    ComplexTableCell,
    ExpandableCellText,
    OpenerCorner,
  },

  props: {
  },

  data() {
    const channelCostsItem = {
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
      overallFee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      psGeneralFixedFee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
    };
    return {
      channelCosts: [
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'Visa',
          icon: 'IconVisa',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'Mastercard',
          icon: 'IconMastercard',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'QIWI',
          icon: 'IconQiwi',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'Ali Pay',
          icon: 'IconAliPay',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'Webmoney',
          icon: 'IconWebmoney',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
        {
          ...(cloneDeep(channelCostsItem)),
          method: 'Yandex Money',
          icon: 'IconYandexMoney',
          isExpanded: false,
          items: [
            cloneDeep(channelCostsItem),
            cloneDeep(channelCostsItem),
          ],
        },
      ],
    };
  },

  computed: {
    channelCostsFlattened() {
      const result = [];
      this.channelCosts.forEach((item) => {
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
      this.channelCostsFlattened[index][fieldName].hasFocus = false;
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
          newIndex = this.channelCostsFlattened.length - 1;
        } else {
          newIndex = index - 1;
        }
      }
      if (focusMoveDirection === 'down') {
        if (index + 1 === this.channelCostsFlattened.length) {
          newIndex = 0;
        } else {
          newIndex = index + 1;
        }
      }
      this.channelCostsFlattened[newIndex][newFieldName].hasFocus = true;
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
    <ComplexTableCell class="cell _amount">Payment amount</ComplexTableCell>
    <ComplexTableCell class="cell _region">Region</ComplexTableCell>
    <ComplexTableCell class="cell _country">Country</ComplexTableCell>
    <ComplexTableCell class="cell _fee">Fee, %</ComplexTableCell>
    <ComplexTableCell class="cell _fee">Fixed fee</ComplexTableCell>
    <ComplexTableCell class="cell _fee">Overall fee</ComplexTableCell>
    <ComplexTableCell class="cell _fee">PS general fixed fee</ComplexTableCell>
  </ComplexTableRow>
  <template
    v-for="(data, index) in channelCostsFlattened"
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
      <ComplexTableCell class="cell _amount">501–1000$</ComplexTableCell>
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
        class="cell _fee"
        v-bind="getCellProps(data.overallFee)"
        @toggleFocus="data.overallFee.hasFocus = $event"
        @moveFocus="moveFocus(index, 'overallFee', $event)"
        @change="handleCellChange(data.overallFee, $event)"
      >
        {{ getCellText(data.overallFee.value, '%') }}
      </ComplexTableCell>
      <ComplexTableCell
        class="cell _fee"
        v-bind="getCellProps(data.psGeneralFixedFee)"
        @toggleFocus="data.psGeneralFixedFee.hasFocus = $event"
        @moveFocus="moveFocus(index, 'psGeneralFixedFee', $event)"
        @change="handleCellChange(data.psGeneralFixedFee, $event)"
      >
        {{ getCellText(data.psGeneralFixedFee.value, '$') }}
      </ComplexTableCell>
    </ComplexTableRow>
  </template>

</ComplexTable>
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
    width: 14%;
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
}
.method-icon {
  width: 32px;
  height: 18px;
  margin-right: 4px;
}
</style>
