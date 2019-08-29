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

const activeFieldNames = ['value', 'businessDays'];
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
    const chargebackMainListItem = {
      fixedFee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
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
      chargebackMainList: [
        {
          ...cloneDeep(chargebackMainListItem),
          country: 'United States',
        },
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
        {
          ...cloneDeep(chargebackMainListItem),
          country: 'United States',
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
    chargebackSecondaryListFlattened() {
      const result = [];
      this.chargebackSecondaryList.forEach((item) => {
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
      if (!field) {
        return {
          isInactive: true,
        };
      }
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
      v-for="(data, index) in chargebackMainList"
    >
      <ComplexTableRow
        :key="index"
        :isPainted="index % 2 === 1"
      >
        <ComplexTableCell
          class="cell _method"
          align="left"
          :isCollapsed="index > 0"
        >
          <ExpandableCellText
            v-if="index === 0"
            :isOpened="true"
          >
            Chargeback
          </ExpandableCellText>
        </ComplexTableCell>
        <ComplexTableCell class="cell _currency">USD</ComplexTableCell>
        <ComplexTableCell class="cell _region">EU</ComplexTableCell>
        <ComplexTableCell class="cell _country">{{data.country}}</ComplexTableCell>
        <ComplexTableCell
          class="cell _fee"
          v-bind="getCellProps(data.fixedFee)"
          @toggleFocus="data.fixedFee.hasFocus = $event"
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
          class="cell _fee"
          v-bind="getCellProps(data.value)"
          @toggleFocus="data.value.hasFocus = $event"
          @change="handleCellChange(data.value, $event)"
          mask="NNNNNN"
        >
          {{ data.value ? getCellText(data.value.value) : '–' }}
        </ComplexTableCell>
        <ComplexTableCell
          class="cell _fee"
          v-bind="getCellProps(data.businessDays)"
          @toggleFocus="data.businessDays.hasFocus = $event"
          @change="handleCellChange(data.businessDays, $event)"
          mask="NNNNNN"
        >
          {{ data.businessDays ? getCellText(data.businessDays.value) : '–' }}
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
