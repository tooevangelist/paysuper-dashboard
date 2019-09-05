<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';

export default {
  components: {
    VuePerfectScrollbar,
  },
  props: {
    settings: {
      type: Object,
    },
  },
  data() {
    return {
      innerSettings: { ...this.settings },
    };
  },
  mounted() {
    this.innerSettings = {
      ...this.innerSettings,
      swicher: false,
    };
  },

  methods: {
    update() {
      this.$refs.scrollbar.update();
    },
  },
};
</script>

<template>
<VuePerfectScrollbar
  class="ui-scrollbar-box"
  :settings="innerSettings"
  ref="scrollbar"
  v-on="$listeners"
>
  <slot></slot>
</VuePerfectScrollbar>
</template>

<style lang="scss">
.ui-scrollbar-box {
  & > .ps__scrollbar-y-rail > .ps__scrollbar-y {
    background-color: transparent !important;
    position: relative;
    right: 2px !important;
    width: 11px;

    &::before {
      content: "";
      background-color: rgba(0, 0, 0, 0.7);
      width: 3px;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: 4px;
    }
  }
  &.ps:hover > .ps__scrollbar-y-rail:hover,
  &.ps:hover.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail,
  &.ps.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail {
    background-color: transparent;
  }

  &.ps > .ps__scrollbar-y-rail > .ps__scrollbar-y {
    // width: 3px;
    right: 5px;
    border-radius: 4px;
  }

  &.ps > .ps__scrollbar-y-rail {
    cursor: pointer;
    opacity: 0.6;
  }
}
</style>
