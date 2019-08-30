<script>
import CurrencyConverter from '@/components/CurrencyConverter.vue';
import { toggleSort, getSortDirection } from '@/helpers/handleSort';
import MerchantAdminChannelCostsTable from '@/components/MerchantAdminChannelCostsTable.vue';
import MerchantAdminRefundCostsTable from '@/components/MerchantAdminRefundCostsTable.vue';
import MerchantAdminChargebackTable from '@/components/MerchantAdminChargebackTable.vue';
import MerchantAdminOtherIndicatorsTable from '@/components/MerchantAdminOtherIndicatorsTable.vue';

export default {
  name: 'MerchantAdminFormPaymentMethods',

  components: {
    CurrencyConverter,
    MerchantAdminChannelCostsTable,
    MerchantAdminRefundCostsTable,
    MerchantAdminChargebackTable,
    MerchantAdminOtherIndicatorsTable,
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

  data() {
    return {
    };
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
<div class="merchant-admin-form-licence">
  <UiPanel class="general-info-panel">
    <div class="general-info">
      <div class="general-item">
        <div class="general-item-icon">
          <IconEarthGlobe />
        </div>
        <div class="general-item-content">
          <UiHeader level="3">North America</UiHeader>
          <p class="general-item-text">Home region</p>
        </div>
      </div>
      <div class="general-item">
        <div class="general-item-icon">
          <IconDollarInCircle />
        </div>
        <div class="general-item-content">
          <UiHeader level="3">USD</UiHeader>
          <p class="general-item-text">Payout currency</p>
        </div>
      </div>
    </div>
  </UiPanel>
  <UiPanel>
    <section class="section">
      <UiHeader level="3" :hasMargin="true">Active methods selection</UiHeader>
      <UiText>
        Activate set of methods available for this merchant.
      </UiText>

      <div class="payment-methods">
        <div>
          <UiSwitchBox class="switch-box" label="Visa" />
          <UiSwitchBox class="switch-box" label="JCB" />
          <UiSwitchBox class="switch-box" label="Ali Pay" />
          <UiSwitchBox class="switch-box" label="Token.io" />
        </div>
        <div>
          <UiSwitchBox class="switch-box" label="Mastercard" />
          <UiSwitchBox class="switch-box" label="Paypal" />
          <UiSwitchBox class="switch-box" label="Webmoney" />
        </div>
        <div>
          <UiSwitchBox class="switch-box" label="Union Pay" />
          <UiSwitchBox class="switch-box" label="QIWI" />
          <UiSwitchBox class="switch-box" label="Yandex Money" />
        </div>
      </div>
    </section>
    <section class="section">
      <UiHeader level="3" :hasMargin="true">Channel costs</UiHeader>
      <UiText>
        Setup channel fees for available selection of payment methods.
      </UiText>

      <MerchantAdminChannelCostsTable />
    </section>

    <section class="section">
      <UiHeader level="3" :hasMargin="true">Refund costs</UiHeader>
      <UiText>
        Setup refund fees for available selection of payment methods.
      </UiText>

      <MerchantAdminRefundCostsTable />
    </section>

    <section class="section">
      <UiHeader level="3" :hasMargin="true">Chargeback</UiHeader>
      <UiText>
        Setup chargeback fees and operational limits.
        pecified values will be the same for all payment methods.
      </UiText>
      <MerchantAdminChargebackTable />
    </section>

    <section class="section">
      <UiHeader level="3" :hasMargin="true">Other indicators</UiHeader>
      <UiText>
        Customise additional payment limits here.
      </UiText>
      <MerchantAdminOtherIndicatorsTable />
    </section>

    <section class="section">
      <UiHeader level="3" :hasMargin="true">Currency conversion rates</UiHeader>
      <UiText>
        Here you can tune up currency conversion rates for every pair.
        Later it will be used for royalty reports calculation.
      </UiText>
      <CurrencyConverter />
    </section>

    <slot name="controls"></slot>
  </UiPanel>


    <!-- <ui-table>
    <ui-table-row :isHead="true">
      <ui-table-cell
        :isSortable="true"
        :sortDirection="nameSortDirection"
        @click.native="sortByName"
      >Method</ui-table-cell>
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
  </ui-table> -->
</div>
</template>

<style lang="scss" scoped>
.merchant-admin-form-licence {
}

.general-info-panel {
  margin-bottom: 8px;
}

.general-info {
  display: flex;
}

.general-item {
  width: 50%;
  display: flex;
}

.general-item-icon {
  width: 43px;
  display: flex;
  align-items: center;
}

.general-item-content {
}

.general-item-text {
  font-size: 12px;
  line-height: 16px;
  color: #5e6366;
}

.text {
  width: 448px;
  margin-bottom: 24px;
}

.payment-methods {
  display: flex;

  & > div {
    width: 33.333%;
  }
}

.switch-box {
  & + & {
    margin-top: 8px;
  }
}

.section {
  margin-bottom: 40px;
}
</style>
