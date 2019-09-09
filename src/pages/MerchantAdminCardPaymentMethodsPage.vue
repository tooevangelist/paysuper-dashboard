<script>
import { mapState } from 'vuex';
// import MerchantPaymentMethodStore from '@/store/MerchantPaymentMethodStore';
import MerchantAdminFormPaymentMethods from '@/components/MerchantAdminFormPaymentMethods.vue';

export default {
  name: 'MerchantAdminCardPaymentMethodPage',
  components: {
    MerchantAdminFormPaymentMethods,
  },
  // asyncData({ registerStoreModule, route }) {
  //   return registerStoreModule(
  //     'MerchantPaymentMethod',
  //     MerchantPaymentMethodStore,
  //     {
  //       merchantId: route.params.id,
  //       paymentMethodId: route.params.paymentMethodId,
  //     },
  //   );
  // },

  computed: {
    ...mapState('Merchant', ['merchant']),
    // ...mapState('MerchantPaymentMethod', ['paymentMethod']),
  },

  methods: {

  },
};
</script>

<template>
<div class="merchant-admin-card-payment-method-page">
  <header class="header">
    <UiHeader level="2" :hasMargin="true">Payment methods</UiHeader>
    <p class="text">
      Customise a unique setup of payment methods, commissions and rates.
      Every merchant must be setup individually, since not all methods and rates are available
      for all merchants. Edit respective table values right in their cells.
    </p>
  </header>

  <MerchantAdminFormPaymentMethods
    :merchant="merchant"
    :paymentMethods="[]"
  >
    <div class="controls" slot="controls">
      <UiButton
        class="submit-button"
        text="SAVE"
        @click="$emit('submitForms')"
      />
    </div>
  </MerchantAdminFormPaymentMethods>
</div>
</template>

<style lang="scss" scoped>
.header {
  margin-bottom: 32px;
}

.text {
  width: 448px;
}

.controls {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  width: 140px;
}
</style>
