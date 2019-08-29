<script>
import { some, flatten, cloneDeep } from 'lodash-es';
import ClickOutside from 'vue-click-outside';
import ExpandableCellText from '@/components/ExpandableCellText.vue';
import ComplexTable from '@/components/ComplexTable.vue';
import ComplexTableRow from '@/components/ComplexTableRow.vue';
import ComplexTableCell from '@/components/ComplexTableCell.vue';

const activeFieldNames = ['value'];
export default {
  name: 'MerchantAdminRefundCostsTable',

  components: {
    ComplexTable,
    ComplexTableRow,
    ComplexTableCell,
    ExpandableCellText,
  },

  directives: {
    ClickOutside,
  },

  props: {
  },

  data() {
    const otherIndicatorsItem = {
      value: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      payoutParty: 'paysuper',
      isPayoutPartyMenuOpened: false,
    };
    return {
      otherIndicators: [
        {
          ...(cloneDeep(otherIndicatorsItem)),
          name: 'Payout costs',
          isExpanded: false,
          items: [
            cloneDeep(otherIndicatorsItem),
            cloneDeep(otherIndicatorsItem),
          ],
        },
        {
          ...(cloneDeep(otherIndicatorsItem)),
          name: 'Minimal payout limit',
          isExpanded: false,
          items: [
            cloneDeep(otherIndicatorsItem),
            cloneDeep(otherIndicatorsItem),
          ],
        },
        {
          ...(cloneDeep(otherIndicatorsItem)),
          name: 'Minimal product price',
          isExpanded: false,
          items: [
            cloneDeep(otherIndicatorsItem),
            cloneDeep(otherIndicatorsItem),
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
    otherIndicatorsFlattened() {
      const result = [];
      this.otherIndicators.forEach((item) => {
        result.push(item);
        if (item.items && item.isExpanded) {
          result.push(
            ...item.items.map(sub => ({ ...sub, parent: item.name })),
          );
        }
      });

      return result;
    },
  },

  methods: {

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

    getCellText(value, symbol = '') {
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
        .map(item => activeFieldNames.map(name => (item[name] ? item[name].hasChanges : false)));

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
    <ComplexTableCell class="cell _method" align="left">For all methods</ComplexTableCell>
    <ComplexTableCell class="cell _currency">Payout currency</ComplexTableCell>
    <ComplexTableCell class="cell _region">Region</ComplexTableCell>
    <ComplexTableCell class="cell _country">Country</ComplexTableCell>
    <ComplexTableCell class="cell _value">Fixed value</ComplexTableCell>
  </ComplexTableRow>
  <template
    v-for="(data, index) in otherIndicatorsFlattened"
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
          {{ data.name }}
        </ExpandableCellText>
      </ComplexTableCell>
      <ComplexTableCell class="cell _currency">USD</ComplexTableCell>
      <ComplexTableCell class="cell _region">EU</ComplexTableCell>
      <ComplexTableCell class="cell _country">United States</ComplexTableCell>
      <ComplexTableCell
        class="cell _value"
        v-bind="getCellProps(data.value)"
        @toggleFocus="data.value.hasFocus = $event"
        @change="handleCellChange(data.value, $event)"
        mask="NNNNNN"
      >
        {{ getCellText(data.value.value, '$') }}
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
  &._value {
    width: 30%;
  }
}
</style>
