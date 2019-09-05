<template>
<component
  :is="tagName"
  class="ui-table-row"
  :class="{
    '_head': isHead,
    '_clickable': isClickable || link
  }"
  :to="link && isRouter(link.router) ? url : null"
  :href="link ? url : null"
>
  <slot />
</component>
</template>

<script>
export default {
  name: 'UiTableRow',

  props: {
    isHead: {
      type: Boolean,
      default: false,
    },
    isClickable: {
      type: Boolean,
      default: false,
    },
    link: {
      type: [Object, String],
    },
  },

  computed: {
    routerComponentName() {
      if (this.$options.components.NuxtLink) {
        return 'NuxtLink';
      }
      if (this.$options.components.RouterLink) {
        return 'RouterLink';
      }
      return 'a';
    },
    tagName() {
      if (!this.link) {
        return 'div';
      }

      if (this.isRouter(this.link.router)) {
        return this.routerComponentName;
      }

      return 'a';
    },
    url() {
      return typeof this.link === 'string' ? this.link : this.link.url;
    },
  },

  methods: {
    /**
     * Default value for router is true
     * @param {?boolean} router
     * @return {boolean}
     */
    isRouter(router) {
      return router !== false;
    },
  },
};
</script>


<style lang="scss" scoped>
.ui-table-row {
  display: table-row;
  text-decoration: none;
  color: #000;

  &._clickable:hover {
    background: rgba(61, 123, 245, 0.08);
    cursor: pointer;
    color: #3d7bf5;
  }
}
</style>
