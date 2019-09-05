<script>
import { includes } from 'lodash-es';

export default {
  name: 'UiTable',

  props: {
    layout: {
      type: String,
      default: 'auto',
      validator(value) {
        return includes(['auto', 'fixed'], value);
      },
    },
  },
};
</script>


<template>
<div class="ui-table" :class="`_layout-${layout}`">
  <slot />
</div>
</template>

<style lang="scss" scoped>
.ui-table {
  display: table;
  width: 100%;

  &._layout-fixed {
    table-layout: fixed;
  }
}
</style>
