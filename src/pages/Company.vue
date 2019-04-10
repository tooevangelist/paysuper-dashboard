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
    return Promise.all([
      store.dispatch('User/Merchant/fetchMerchantPaymentMethods'),
      store.dispatch('User/Merchant/fetchAgreement'),
    ]);
  },

  data() {
    return {
      defaultStep: 'basicInfo',
      currentStep: '',
    };
  },

  computed: {
    ...mapState('User/Merchant', ['merchant', 'paymentMethods', 'agreementDocument']),
  },

  beforeRouteUpdate(to, from, next) {
    this.applyQueryParams(to);
    next();
  },

  created() {
    this.applyQueryParams(this.$route);
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('User/Merchant', [
      'updateMerchant',
      'changeMerchantAgreement',
    ]),

    applyQueryParams(route) {
      this.currentStep = route.query.step || this.defaultStep;
    },

    handleSectionChange(step) {
      this.$router.push({ query: { step } });
    },

    async validateAndSaveMerchant() {
      const isMerchantValid = this.$refs.merchantForm.chekIfFormValid();

      if (isMerchantValid) {
        this.setIsLoading(true);
        try {
          await this.updateMerchant();
          this.$_Notifications_showSuccessMessage('Merchant updated successfully');
        } catch (error) {
          console.warn(error);
          this.$_Notifications_showErrorMessage('Failed to update merchant');
        }
        this.setIsLoading(false);
      } else {
        this.$_Notifications_showErrorMessage('The form is not filled right');
      }
    },

    async handleStatusChangeRequest(payload) {
      this.setIsLoading(true);
      try {
        await this.changeMerchantAgreement(payload);

        this.$_Notifications_showSuccessMessage('Merchant status updated successfully');
      } catch (error) {
        console.warn(error);
        this.$_Notifications_showErrorMessage('Failed to update merchant status');
      }
      this.setIsLoading(false);
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
        text="Save"
        @click="validateAndSaveMerchant"
      />
    </UiPageHeader>
    <MerchantForm
      ref="merchantForm"
      :merchant="merchant"
      :paymentMethods="paymentMethods"
      :currentStep="currentStep"
      :agreementDocument="agreementDocument"
      @stepChanged="handleSectionChange"
      @requestAgreementChange="handleStatusChangeRequest"
    />
  </div>
</template>
