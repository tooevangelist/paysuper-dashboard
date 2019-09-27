<script>
export default {
  name: 'UiComplexTableCell',
};
</script>

<template>
<div class="complex-table-cell">
  <slot />
</div>
</template>

<style lang="scss" scoped>
.complex-table-cell {
  display: table;
  width: 100%;
  border-collapse: collapse;
  border-bottom: 1px solid #e3e5e6;
}
</style>
