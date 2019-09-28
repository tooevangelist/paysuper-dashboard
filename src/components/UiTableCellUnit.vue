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
  margin: 0 -2px;
  padding: 0 2px;

  &:first-child {
    margin-top: -9px;
  }
  &:last-child {
    margin-bottom: -9px;
  }

  & + & {
    border-top: 1px dashed #c6cacc;
  }
}
</style>
