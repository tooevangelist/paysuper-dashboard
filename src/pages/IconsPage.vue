<script>
import { keysIn } from 'lodash-es';

export default {
  name: 'IconsPage',

  computed: {
    iconComponentsList() {
      const iconComponentNames = keysIn(this.$options.components)
        .filter(name => /^Icon[A-Z]/.test(name));

      return iconComponentNames;
    },
  },
};
</script>

<template>
<div>
  <table class="table">
    <tr
      v-for="item in iconComponentsList"
      :key="item"
    >
      <td class="cell">
        {{item}}
      </td>
      <td class="cell">
        <component class="icon" :is="item"></component>
      </td>
    </tr>
  </table>
</div>
</template>

<style lang="scss" scoped>
.icon {
  max-width: 50px;
  max-height: 50px;
}

.table {
  border-collapse: collapse;
}

.cell {
  padding: 10px 15px;
  border: 1px solid #ccc;
  background: rgba(0, 0, 0, 0.05);
}
</style>
