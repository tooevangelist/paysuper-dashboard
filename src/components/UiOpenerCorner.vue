<script>
import { includes } from 'lodash-es';

export default {
  name: 'UiOpenerCorner',

  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },

    colorClosed: {
      type: String,
      default: 'blue',
      validator(value) {
        return includes(['blue', 'gray-blue'], value);
      },
    },
    colorOpened: {
      type: String,
      default: 'gray',
      validator(value) {
        return includes(['gray', 'gray-blue'], value);
      },
    },
  },
};
</script>

<template>
<div
  :class="[
    'opener-corner',
    `_color-closed-${colorClosed}`,
    `_color-opened-${colorOpened}`,
    {'_opened': isOpened}
  ]"
></div>
</template>

<style lang="scss" scoped>
.opener-corner {
  display: inline-flex;
  height: 20px;
  width: 20px;
  justify-content: center;
  align-items: center;

  &::after {
    content: "";
    height: 8px;
    width: 8px;
    border: 4px solid transparent;
    transition: transform 0.2s ease-out, border-color 0.2s ease-out;
    transform-origin: center 2px;
    margin-top: 2px;
    box-sizing: border-box;
  }

  &._color-closed-blue::after {
    border-top-color: #3d7bf5;
  }
  &._color-closed-gray-blue::after {
    border-top-color: #5b88de;
  }

  &._opened {
    &::after {
      transform: rotate(180deg);
    }
    &._color-opened-gray::after {
      border-top-color: #c6cacc;
    }
    &._color-opened-gray-blue::after {
      border-top-color: #5b88de;
    }
  }
}
</style>
