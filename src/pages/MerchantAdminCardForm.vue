<script>
import { mapState, mapActions } from 'vuex';
import { UiButton, UiPageHeader } from '@protocol-one/ui-kit';
import Notifications from '@/mixins/Notifications';
import MerchantAdminForm from '@/components/MerchantAdminForm.vue';

export default {
  components: {
    UiButton, UiPageHeader, MerchantAdminForm,
  },
  mixins: [Notifications],

  data() {
    return {
      defaultStep: 'basicInfo',
      currentStep: '',
    };
  },

  computed: {
    ...mapState('Merchant', ['merchant', 'paymentMethods', 'agreementDocument']),
    breadcrumbs() {
      const crumbs = [
        {
          label: 'Merchants list',
          url: '/merchants/',
        },
      ];
      return crumbs;
    },
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
    ...mapActions('Merchant', [
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

    async handleAgreementChangeRequest(payload) {
      this.setIsLoading(true);
      try {
        await this.changeMerchantAgreement(payload);

        this.$_Notifications_showSuccessMessage('Merchant\'s agreement updated successfully');
      } catch (error) {
        console.warn(error);
        this.$_Notifications_showErrorMessage('Failed to update merchant\'s agreement');
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
      :title="merchant.name || 'Merchant'"
    >
      <UiButton
        slot="right"
        @click="validateAndSaveMerchant"
        text="Save"
      />
    </UiPageHeader>
    <MerchantAdminForm
      ref="merchantForm"
      :merchant="merchant"
      :paymentMethods="paymentMethods"
      :currentStep="currentStep"
      :agreementDocument="agreementDocument"
      @stepChanged="handleSectionChange"
      @requestAgreementChange="handleAgreementChangeRequest"
    />
  </div>
</template>
