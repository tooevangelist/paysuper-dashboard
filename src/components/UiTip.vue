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
    margin: {
      default: 20,
      type: Number,
    },
    hasCaret: {
      default: false,
      type: Boolean,
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
    closeDelay: {
      default: 300,
      type: Number,
    },
    stayOpenedOnHover: {
      default: true,
      type: Boolean,
    },
    frameless: {
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
  computed: {
    marginByPosition() {
      const isTop = this.position === 'top';
      const key = isTop ? 'margin-bottom' : 'margin-top';
      return { [key]: `${this.margin}px` };
    },
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
        this.$emit('afterClose');
      }, this.closeDelay);
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
    { [$style._caret]: hasCaret },
    { [$style._shown]: visible || innerVisible },
    { [$style['_opened-on-hover']]: stayOpenedOnHover },
    { [$style._framed]: !frameless }
  ]"
  :style="{
    height: height || undefined,
    width: width || undefined,
    maxHeight: maxHeight || undefined,
    maxWidth: maxWidth || undefined,
    ...marginByPosition,
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
  cursor: auto;
  white-space: normal;

  &._framed {
    border: 1px solid #f1f3f4;
    box-shadow: 0px 2px 8px rgba(8, 35, 48, 0.16),
      0px 8px 16px rgba(8, 35, 48, 0.1);
  }

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    cursor: default;
  }

  &._caret::after {
    display: block;
  }

  &._bottom {
    transform: translate3d(0, 20px, 0);
    top: 100%;

    &._inner-center {
      transform: translate3d(-50%, 20px, 0);
    }

    &::after {
      top: -11px;
    }
  }

  &._top {
    transform: translate3d(0, -20px, 0);
    bottom: 100%;

    &._inner-center {
      transform: translate3d(-50%, -20px, 0);
    }

    &::after {
      bottom: -11px;
    }
  }

  &._inner-left {
    left: 0;

    &::after {
      left: 20px;
    }
  }

  &._inner-right {
    right: 0;

    &::after {
      right: 20px;
    }
  }

  &._inner-center {
    left: 50%;

    &::after {
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
    }
  }

  &._shown,
  &._opened-on-hover:hover {
    pointer-events: auto;
    opacity: 1;
    transform: translate3d(0, 0, 0);

    &._inner-center {
      transform: translate3d(-50%, 0, 0);
    }
  }

  &::after {
    content: "";
    display: none;
    width: 0;
    height: 0;
    position: absolute;
    border: 6px solid transparent;
  }
}
</style>
