<script>
export default {
  name: 'UiTableCellUnit',
};
</script>

<template>
<div class="ui-table-cell-unit">
  <slot></slot>
</div>
</template>

<style lang="scss" scoped>
.ui-table-cell-unit {
  display: flex;
  align-items: center;
  height: 38px;

  & + & {
    border-top: 1px dashed #c6cacc;
  }
}
</style>
