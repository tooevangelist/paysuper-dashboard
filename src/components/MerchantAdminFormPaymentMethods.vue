<script>
import {
  UiTable,
  UiTableCell,
  UiTableRow,
} from '@protocol-one/ui-kit';
import StatusIcon from '@/components/StatusIcon.vue';

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
  },
};
</script>

<template>
  <div class="merchant-admin-form-licence">
    <ui-table>
      <ui-table-row :isHead="true">
        <ui-table-cell>Method</ui-table-cell>
        <ui-table-cell>Key</ui-table-cell>
        <ui-table-cell>Available</ui-table-cell>
        <ui-table-cell>Comission rate</ui-table-cell>
      </ui-table-row>
      <ui-table-row
        v-for="paymentMethod in paymentMethods"
        :key="paymentMethod.payment_method.id"
        :link="`/merchants/${merchant.id}/paymentMethod/${paymentMethod.payment_method.id}`"
      >
        <ui-table-cell>{{paymentMethod.payment_method.name}}</ui-table-cell>
        <ui-table-cell>
          <StatusIcon v-if="paymentMethod.integration.terminal_password" status="complete" />
        </ui-table-cell>
        <ui-table-cell>
          <StatusIcon v-if="paymentMethod.is_active" status="complete" />
        </ui-table-cell>
        <ui-table-cell>{{paymentMethod.commission.fee}}%</ui-table-cell>

      </ui-table-row>
    </ui-table>
  </div>
</template>

<style lang="scss" scoped>
.merchant-admin-form-licence {
  margin: -25px -35px;
}
</style>
