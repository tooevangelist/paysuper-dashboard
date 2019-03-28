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
    ...mapState('Merchant', ['merchant', 'paymentMethods']),
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
      'changeMerchantStatus',
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

    async handleStatusChangeRequest() {
      this.setIsLoading(true);
      try {
        await this.changeMerchantStatus();

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
      @stepChanged="handleSectionChange"
      @requestStatusChange="handleStatusChangeRequest"
    />
  </div>
</template>
