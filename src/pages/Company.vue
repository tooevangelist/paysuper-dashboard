<script>
import { mapState, mapActions } from 'vuex';
import { UiButton, UiPageHeader } from '@protocol-one/ui-kit';
import Notifications from '@/mixins/Notifications';
import MerchantForm from '@/components/MerchantForm.vue';

export default {
  components: {
    UiButton, UiPageHeader, MerchantForm,
  },
  mixins: [Notifications],

  asyncData({ store }) {
    const merchantId = store.state.User.Merchant.merchant.id;
    return store.dispatch('User/Merchant/fetchMerchantPaymentMethods', merchantId);
  },

  data() {
    return {
      defaultStep: 'basicInfo',
      currentStep: '',
    };
  },

  computed: {
    ...mapState('User/Merchant', ['merchant', 'paymentMethods']),
  },

  beforeRouteUpdate(to, from, next) {
    this.applyQueryParams(to);
    next();
  },

  created() {
    this.applyQueryParams(this.$route);
  },

  methods: {
    ...mapActions('User/Merchant', [
      'saveMerchant',
      'changeMerchantStatus',
    ]),

    applyQueryParams(route) {
      this.currentStep = route.query.step || this.defaultStep;
    },

    handleSectionChange(step) {
      this.$router.push({ query: { step } });
    },

    handleSaveButtonClick() {
      this.validateAndSaveMerchant();
    },

    async validateAndSaveMerchant() {
      const isMerchantValid = this.$refs.merchantForm.chekIfFormValid();

      if (isMerchantValid) {
        this.saveMerchant();
      } else {
        this.$_Notifications_showErrorMessage('The form is not filled right');
      }
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeader
      title="Company"
    >
      <UiButton
        slot="right"
        @click="handleSaveButtonClick"
        :text="merchant.id ? 'Save' : 'Create merchant'"
      />
    </UiPageHeader>
    <MerchantForm
      ref="merchantForm"
      :merchant="merchant"
      :paymentMethods="paymentMethods"
      :currentStep="currentStep"
      @stepChanged="handleSectionChange"
      @requestStatusChange="changeMerchantStatus"
    />
  </div>
</template>
