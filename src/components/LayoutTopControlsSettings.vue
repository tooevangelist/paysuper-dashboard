<script>
import { findIndex, includes } from 'lodash-es';
import LayoutTopControlsMenuBase from '@/components/LayoutTopControlsMenuBase.vue';

export default {
  name: 'LayoutTopControlsProjectSalesOptions',

  components: {
    LayoutTopControlsMenuBase,
  },

  computed: {
    items() {
      return [
        /* {
          title: 'Payout settings',
          url: '/settings/payout-settings/',
          routeNames: [''],
        },
        {
          title: 'Company info',
          url: '/settings/company-info/',
          routeNames: [''],
        }, */
        {
          title: 'User roles',
          url: '/settings/user-roles/',
          routeNames: ['MerchantUserRoles'],
        },
      ];
    },

    currentItemIndex() {
      return findIndex(this.items, item => includes(item.routeNames, this.$route.name));
    },
  },
};
</script>

<template>
  <LayoutTopControlsMenuBase v-bind="{ items, currentItemIndex }" />
</template>
