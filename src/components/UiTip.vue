<script>
import { includes } from 'lodash-es';

export default {
  props: {
    height: {
      default: '',
      type: String,
    },
    width: {
      default: '',
      type: String,
    },
    maxHeight: {
      default: '',
      type: String,
    },
    maxWidth: {
      default: '',
      type: String,
    },
    innerPosition: {
      default: 'left',
      type: String,
      validator(value) {
        return includes(['center', 'left', 'right'], value);
      },
    },
    position: {
      default: 'top',
      type: String,
      validator(value) {
        return includes(['bottom', 'top'], value);
      },
    },
    visible: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      innerVisible: false,
      timeoutId: 0,
    };
  },
  methods: {
    hide() {
      if (this.timeoutId) {
        return;
      }

      this.timeoutId = setTimeout(() => {
        this.innerVisible = false;

        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }, 300);
    },
    show() {
      this.innerVisible = true;

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = 0;
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.show();
      } else {
        this.hide();
      }
    },
  },
};
</script>

<template>
<div
  :class="[
    $style.container,
    $style[`_${position}`],
    $style[`_inner-${innerPosition}`],
    { [$style._shown]: visible || innerVisible }
  ]"
  :style="{
    height: height || undefined,
    width: width || undefined,
    maxHeight: maxHeight || undefined,
    maxWidth: maxWidth || undefined,
  }"
  @mouseenter="innerVisible = true"
  @mouseleave="hide"
>
  <slot />
</div>
</template>

<style module lang="scss">
.container {
  position: absolute;
  border-radius: 8px;
  font-size: 12px;
  line-height: 18px;
  padding: 0;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease-out;
  z-index: 20;
  background-color: #fff;
  border: 1px solid #F1F3F4;
  box-shadow: 0px 8px 16px rgba(8, 35, 48, 0.1), 0px 24px 32px rgba(8, 35, 48, 0.06);
  cursor: auto;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    cursor: default;
  }

  &._bottom {
    transform: translate3d(0, 20px, 0);
    top: calc(100% + 20px);

    &._inner-center {
      transform: translate3d(-50%, 20px, 0);
    }
  }

  &._top {
    transform: translate3d(0, -20px, 0);
    bottom: calc(100% + 20px);

    &._inner-center {
      transform: translate3d(-50%, -20px, 0);
    }
  }

  &._inner-left {
    left: 0;
  }

  &._inner-right {
    right: 0;
  }

  &._inner-center {
    left: 50%;
  }

  &._shown,
  &:hover {
    pointer-events: auto;
    opacity: 1;
    transform: translate3d(0, 0, 0);

    &._inner-center {
      transform: translate3d(-50%, 0, 0);
    }
  }
}
</style>
