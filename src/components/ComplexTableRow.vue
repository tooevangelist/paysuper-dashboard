<script>
export default {
  name: 'ComplexTableRow',

  props: {
    isHead: {
      type: Boolean,
      default: false,
    },
    isHoverable: {
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
    isPainted: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    routerComponentName() {
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

<template>
<component
  :is="tagName"
  class="complex-table-row"
  :class="{
    '_head': isHead,
    '_hoverable': isHoverable,
    '_clickable': isClickable || link
  }"
  :to="link && isRouter(link.router) ? url : null"
  :href="link ? url : null"
>
  <slot />
</component>
</template>

<style lang="scss" scoped>
.complex-table-row {
  display: table-row;
  text-decoration: none;

  &._hoverable:hover {
    background: #e3eeff;
  }

  &._clickable {
    cursor: pointer;
  }
}
</style>
