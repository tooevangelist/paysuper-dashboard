<script>
import { mapState } from 'vuex';
import { get, findIndex, includes } from 'lodash-es';
import LayoutMainNavInnerBase from '@/components/LayoutMainNavInnerBase.vue';

export default {
  name: 'LayoutMainNavProject',

  components: {
    LayoutMainNavInnerBase,
  },

  computed: {
    ...mapState('Merchant', ['merchant']),

    items() {
      return [
        {
          title: 'Personal Profile',
          value: 'personalProfile',
          icon: 'IconProfile',
          url: `/merchants/${this.merchant.id || 'new'}/personal-profile/`,
          routeNames: ['MerchantAdminPersonalProfile'],
        },
        {
          title: 'Company Info',
          value: 'companyInfo',
          icon: 'IconBusinessCase',
          url: `/merchants/${this.merchant.id || 'new'}/company-info/`,
          routeNames: ['MerchantAdminCompanyInfo'],
        },
        // {
        //   title: 'Licence Agreement',
        //   value: 'licenseAgreement',
        //   icon: 'IconMoney',
        //   url: `/merchants/${this.merchant.id || 'new'}?step=licenseAgreement`,
        // },
        {
          title: 'Payment Methods',
          value: 'paymentMethods',
          icon: 'IconMoney',
          url: `/merchants/${this.merchant.id || 'new'}/payment-methods/`,
          routeNames: ['MerchantAdminPaymentMethods'],
        },
        {
          title: 'History',
          value: 'history',
          icon: 'IconSandglass',
          url: `/merchants/${this.merchant.id || 'new'}/history/`,
          routeNames: ['MerchantAdminHistory'],
        },
      ];
    },

    currentItemIndex() {
      const routeIndex = findIndex(this.items, item => includes(item.routeNames, this.$route.name));
      if (routeIndex !== -1) {
        return routeIndex;
      }
      return findIndex(this.items, { value: this.$route.query.step || 'basicInfo' });
    },

    status() {
      // if (this.project.status === 4) {
      //   return 'inactive';
      // }
      return 'new';
    },

    headTitle() {
      return get(this.merchant, 'company.name') || '';
    },
  },
};
</script>

<template>
<LayoutMainNavInnerBase
  :headTitle="headTitle"
  :headStatus="status"
  :headImage="''"
  :items="items"
  :currentItemIndex="currentItemIndex"
/>
</template>
