<script>
import { mapState, mapActions } from 'vuex';
import {
  UiButton,
  UiPageHeader,
  UiHeader,
  UiSwitchBox,
  UiTextField,
} from '@protocol-one/ui-kit';
import MerchantPaymentMethodStore from '@/store/MerchantPaymentMethodStore';
import Notifications from '@/mixins/Notifications';

export default {
  components: {
    UiButton,
    UiPageHeader,
    UiHeader,
    UiSwitchBox,
    UiTextField,
  },
  mixins: [Notifications],

  asyncData({ registerStoreModule, route }) {
    return registerStoreModule(
      'MerchantPaymentMethod',
      MerchantPaymentMethodStore,
      {
        merchantId: route.params.id,
        paymentMethodId: route.params.paymentMethodId,
      },
    );
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapState('Merchant', ['paymentMethod']),
    ...mapState('MerchantPaymentMethod', ['paymentMethod']),
    breadcrumbs() {
      const crumbs = [
        {
          label: 'Merchants list',
          url: '/paymentMethods/',
        },
        {
          label: this.paymentMethod.name,
          url: `/paymentMethods/${this.paymentMethod.id}`,
        },
      ];
      return crumbs;
    },
  },

  methods: {
    ...mapActions('MerchantPaymentMethod', ['updatePaymentMethod']),
    ...mapActions(['setIsLoading']),

    async savePaymentMethod() {
      this.setIsLoading(true);
      try {
        await this.updatePaymentMethod();
        this.$_Notifications_showSuccessMessage('PaymentMethod updated successfully');
      } catch (error) {
        console.warn(error);
        this.$_Notifications_showErrorMessage('Failed to save payment method');
      }
      this.setIsLoading(false);
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
        @click="savePaymentMethod"
      />
    </UiPageHeader>
    <div class="paymentMethods-card-payment-method">
      <div class="fields-group">
        <UiHeader level="2" :hasMargin="true">Terms</UiHeader>
        <div class="field-row">
          <UiTextField
            v-model="paymentMethod.commission.fee"
            label="Rate in %"
          />
        </div>
      </div>

      <div class="fields-group">
        <UiHeader level="2" :hasMargin="true">Bank integration</UiHeader>
        <div class="field-row">
          <UiTextField
            v-model="paymentMethod.integration.terminal_id"
            label="Wallet ID"
          />
        </div>
        <div class="field-row">
          <UiTextField
            v-model="paymentMethod.integration.terminal_password"
            label="Wallet key"
          />
        </div>
          <div class="field-row">
          <UiTextField
            v-model="paymentMethod.integration.terminal_callback_password"
            label="Wallet callback key"
          />
        </div>
        <div class="field-row">
          Active
          <UiSwitchBox class="switch-box" v-model="paymentMethod.is_active" />
        </div>
      </div>
    </div>
    <pre>{{paymentMethod}}</pre>
  </div>
</template>

<style lang="scss" scoped>
.paymentMethods-card-payment-method {
  width: 600px;
  padding: 25px 35px;
}

.fields-group {
  margin-bottom: 30px;
}

.field-row {
  display: flex;
  align-items: center;
}

.switch-box {
  margin-left: 16px;
}

.textarea {
  width: 100%;
}

.generate-button {
  margin-left: 30px;
}
</style>
