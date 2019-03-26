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
  },
};
</script>

<template>
  <div class="merchant-form-licence">
    <ui-table>
      <ui-table-row :isHead="true">
        <ui-table-cell>Method</ui-table-cell>
        <ui-table-cell>Available</ui-table-cell>
        <ui-table-cell>Comission rate</ui-table-cell>
        <ui-table-cell>Fee per transaction</ui-table-cell>
      </ui-table-row>
      <ui-table-row>
        <ui-table-cell>111</ui-table-cell>
        <ui-table-cell>
          <StatusIcon status="complete" />
        </ui-table-cell>
        <ui-table-cell></ui-table-cell>
        <ui-table-cell></ui-table-cell>

      </ui-table-row>
    </ui-table>
  </div>
</template>

<style lang="scss" scoped>
.merchant-form-licence {
  margin: -25px -35px;
}
</style>
