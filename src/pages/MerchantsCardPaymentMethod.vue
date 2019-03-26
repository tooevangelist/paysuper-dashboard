<script>
import { mapState } from 'vuex';
import { UiButton, UiPageHeader } from '@protocol-one/ui-kit';
import MerchantPaymentMethodStore from '@/store/MerchantPaymentMethodStore';

export default {
  components: {
    UiButton, UiPageHeader,
  },

  asyncData({ registerStoreModule, route }) {
    return registerStoreModule(
      'MerchantPaymentMethod',
      MerchantPaymentMethodStore,
      {
        merchantID: route.params.id,
        methodID: route.params.paymentMethodID,
      },
    );
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapState('Merchant', ['merchant']),
    ...mapState('MerchantPaymentMethod', ['paymentMethod']),
    breadcrumbs() {
      const crumbs = [
        {
          label: 'Merchants list',
          url: '/merchants/',
        },
        {
          label: this.merchant.name,
          url: `/merchants/${this.merchant.id}`,
        },
      ];
      return crumbs;
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeader
      :breadcrumbs="breadcrumbs"
      :title="paymentMethod.payment_method.name"
    >
      <UiButton
        slot="right"
        text="Save"
      />
    </UiPageHeader>

    <pre>{{paymentMethod}}</pre>

  </div>
</template>
