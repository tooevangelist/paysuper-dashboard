<script>
import { includes } from 'lodash-es';

export default {
  props: {
    /** Header level (h1-h4) */
    level: {
      required: true,
      type: String,
      validator(value) {
        return includes(['1', '2', '3', '4'], value);
      },
    },

    align: {
      type: String,
      default: 'left',
      validator(value) {
        return includes(['left', 'center', 'right'], value);
      },
    },

    hasMargin: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
<component
  class="ui-header"
  :class="[`_align-${align}`, `_h${level}`, {'_has-margin': hasMargin}]"
  :is="`h${level}`">
  <slot />
</component>
</template>

<style lang="scss" scoped>
.ui-header {
  color: #000000;
  transition: color 0.2s ease-out;
  font-family: Quicksand;
  margin: 0;
  display: flex;
  align-items: center;

  &._h1 {
    font-weight: 900;
    line-height: normal;
    font-size: 28px;
  }

  &._h2 {
    font-weight: normal;
    font-size: 34px;
    line-height: 42px;
  }

  &._h3 {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }

  &._h4 {
    font-weight: 900;
    line-height: normal;
    font-size: 16px;
  }

  &._has-margin {
    &._h1 {
      margin-bottom: 16px;
    }
    &._h2 {
      margin-bottom: 12px;
    }
    &._h3 {
      margin-bottom: 8px;
    }
    &._h4 {
      margin-bottom: 4px;
    }
  }

  &._align-left {
    justify-content: flex-start;
    text-align: left;
  }

  &._align-center {
    justify-content: center;
    text-align: center;
  }

  &._align-right {
    justify-content: flex-end;
    text-align: right;
  }
}
</style>
