<script>
import { mapState } from 'vuex';
import { findIndex, includes } from 'lodash-es';

export default {
  name: 'LayoutTopControlsProjectSalesOptions',

  data() {
    return {
    };
  },

  computed: {
    ...mapState('Project', ['project']),

    items() {
      const projectId = this.project.id || 'new';
      return [
        {
          title: 'General',
          url: `/projects/${projectId}/`,
          routeNames: [],
        },
        {
          title: 'Virtual currency',
          url: `/projects/${projectId}/virtual-currency/`,
          routeNames: ['ProjectVirtualCurrency'],
        },
        {
          title: 'Virtual items',
          url: `/projects/${projectId}/`,
          routeNames: ['ProjectVirtualCurrency'],
        },
        {
          title: 'Game keys',
          url: `/projects/${projectId}/game-keys`,
          routeNames: ['ProjectKeyProductsList'],
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
