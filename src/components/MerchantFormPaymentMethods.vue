<script>
import {
  UiTable,
  UiTableCell,
  UiTableRow,
} from '@protocol-one/ui-kit';
import StatusIcon from '@/components/StatusIcon.vue';
import { toggleSort, getSortDirection } from '@/helpers/handleSort';

export default {
  name: 'MerchantFormCompanyInfo',

  components: {
    StatusIcon,
    UiTable,
    UiTableCell,
    UiTableRow,
  },

  props: {
    merchant: {
      required: true,
      type: Object,
    },
    paymentMethods: {
      required: true,
      type: Array,
    },
    paymentMethodsSort: {
      type: Array,
      required: true,
    },
  },

  computed: {
    nameSortDirection() {
      return getSortDirection(this.paymentMethodsSort, 'name');
    },
  },

  methods: {
    sortByName() {
      this.$emit('sortPaymentMethods', toggleSort(this.paymentMethodsSort, 'name'));
    },
  },
};
</script>

<template>
  <div class="merchant-form-licence">
    <ui-table>
      <ui-table-row :isHead="true">
        <ui-table-cell
          :isSortable="true"
          :sortDirection="nameSortDirection"
          @click.native="sortByName"
        >Method</ui-table-cell>
        <ui-table-cell>Available</ui-table-cell>
        <ui-table-cell>Comission rate</ui-table-cell>
      </ui-table-row>
      <ui-table-row
        v-for="paymentMethod in paymentMethods"
        :key="paymentMethod.payment_method.id"
      >
        <ui-table-cell>{{paymentMethod.payment_method.name}}</ui-table-cell>
        <ui-table-cell>
          <StatusIcon v-if="paymentMethod.is_active" status="complete" />
        </ui-table-cell>
        <ui-table-cell>{{paymentMethod.commission.fee}}%</ui-table-cell>

      </ui-table-row>
    </ui-table>
  </div>
</template>

<style lang="scss" scoped>
.merchant-form-licence {
  margin: -25px -35px;
}
</style>
