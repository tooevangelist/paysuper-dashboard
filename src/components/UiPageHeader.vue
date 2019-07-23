<script>
export default {
  name: 'UiPageHeader',
};
</script>

<template>
<div class="page-header">
  <div class="left">
    <slot name="left" />
  </div>
  <div class="right">
    <slot name="right" />
  </div>
</div>
</template>

<style lang="scss" scoped>
.page-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  width: 100%;
  padding: 4px 16px;
  background: #fff;
  box-shadow: 0px 1px 2px rgba(8, 35, 48, 0.24), 0px 2px 6px rgba(8, 35, 48, 0.16);
  flex-wrap: wrap;
  align-content: stretch;
}
.left,
.right {
  display: flex;
  align-content: center;
  align-items: center;
  padding: 8px 0;
}
.left {
  margin-right: 16px;
}
</style>
