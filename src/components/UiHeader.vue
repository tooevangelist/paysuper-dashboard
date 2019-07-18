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
<div
  class="header"
  :class="[`_align-${align}`, {'_has-margin': hasMargin}]"
>
  <component class="tag" :is="`h${level}`">
    <slot />
  </component>
</div>
</template>

<style lang="scss" scoped>
.header {
  h1 {
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    font-size: 28px;
  }

  h2 {
    font-style: normal;
    font-weight: normal;
    font-size: 34px;
    line-height: 42px;
  }

  h3 {
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    font-size: 18px;
  }

  h4 {
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    font-size: 16px;
  }

  &._has-margin {
    margin-bottom: 16px;
  }
}

.tag {
  font-family: Quicksand;
  color: #000000;
  margin: 0;
  display: flex;
  align-items: center;

  .header._align-left & {
    justify-content: flex-start;
    text-align: left;
  }

  .header._align-center & {
    justify-content: center;
    text-align: center;
  }

  .header._align-right & {
    justify-content: flex-end;
    text-align: right;
  }
}
</style>
