<script>
import { mapState } from 'vuex';
import { findIndex } from 'lodash-es';
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
          title: 'Basic info',
          value: 'basicInfo',
          icon: 'IconMoney',
          url: `/merchants/${this.merchant.id || 'new'}?step=basicInfo`,
        },
        {
          title: 'Licence agreement',
          value: 'licenseAgreement',
          icon: 'IconMoney',
          url: `/merchants/${this.merchant.id || 'new'}?step=licenseAgreement`,
        },
        {
          title: 'Payment Methods',
          value: 'paymentMethods',
          icon: 'IconMoney',
          url: `/merchants/${this.merchant.id || 'new'}?step=paymentMethods`,
        },
        {
          title: 'History',
          value: 'history',
          icon: 'IconMoney',
          url: `/merchants/${this.merchant.id || 'new'}/history/`,
        },
      ];
    },

    currentItemIndex() {
      if (this.$route.name === 'MerchantAdminCardHistory') {
        return findIndex(this.items, { value: 'history' });
      }
      return findIndex(this.items, { value: this.$route.query.step || 'basicInfo' });
      // return findIndex(this.items, item => includes(item.routeNames, this.$route.name));
    },

    status() {
      // if (this.project.status === 4) {
      //   return 'inactive';
      // }
      return 'new';
    },
  },
};
</script>

<template>
<LayoutMainNavInnerBase
  :headTitle="merchant.name || ''"
  :headStatus="status"
  :headImage="''"
  :items="items"
  :currentItemIndex="currentItemIndex"
/>
</template>
