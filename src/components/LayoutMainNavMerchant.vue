<script>
import { mapState } from 'vuex';
import {
  findIndex,
  get,
  includes,
  kebabCase,
  map,
  startCase,
  upperFirst,
} from 'lodash-es';
import LayoutMainNavInnerBase from '@/components/LayoutMainNavInnerBase.vue';

function getItemIcon(item) {
  return {
    personalProfile: 'IconProfile',
    companyInfo: 'IconBusinessCase',
    licenseAgreement: 'IconBlank',
    paymentMethods: 'IconMoney',
    history: 'IconSandglass',
  }[item];
}

function getItemAvailable(item, status) {
  return {
    personalProfile: true,
    companyInfo: true,
    licenseAgreement: status !== 'archive',
    paymentMethods: status !== 'archive',
    history: true,
  }[item];
}

export default {
  name: 'LayoutMainNavProject',

  components: {
    LayoutMainNavInnerBase,
  },

  computed: {
    ...mapState('Merchant', ['merchant']),

    items() {
      const navItems = [
        'personalProfile',
        'companyInfo',
        'licenseAgreement',
        'paymentMethods',
        'history',
      ];

      return map(navItems, item => ({
        title: startCase(item),
        value: item,
        icon: getItemIcon(item),
        url: `/merchants/${this.merchant.id || 'new'}/${kebabCase(item)}/`,
        routeNames: [`MerchantAdmin${upperFirst(item)}`],
        available: getItemAvailable(item, this.status),
      }));
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
