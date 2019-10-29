<script>
import { findIndex, includes } from 'lodash-es';

export default {
  name: 'LayoutTopControlsProjectSalesOptions',

  data() {
    return {
    };
  },

  computed: {
    items() {
      return [
        {
          title: 'Payout settings',
          url: '/settings/payout-settings/',
          routeNames: [''],
        },
        {
          title: 'Company info',
          url: '/settings/company-info/',
          routeNames: [''],
        },
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
  <div class="layout-top-controls-project-sales-options">
    <RouterLink
      class="button"
      v-for="(item, index) in items"
      :class="{ '_current': index === currentItemIndex }"
      :key="index"
      :to="item.url"
    >
      {{ item.title }}
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.layout-top-controls-project-sales-options {
  height: 100%;
}

.button {
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  background-color: transparent;
  cursor: pointer;
  height: 100%;
  padding: 0 20px;
  min-width: 120px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &._current {
    border-bottom: 3px solid #3d7bf5;
  }
}
</style>
