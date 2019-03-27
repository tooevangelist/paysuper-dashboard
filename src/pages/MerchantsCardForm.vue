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

    handleSaveButtonClick() {
      this.validateAndSaveMerchant();
    },

    async validateAndSaveMerchant() {
      const isMerchantValid = this.$refs.merchantForm.chekIfFormValid();

      if (isMerchantValid) {
        this.updateMerchant();
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
      :breadcrumbs="breadcrumbs"
      :title="merchant.name || 'New merchant'"
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
