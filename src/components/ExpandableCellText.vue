<script>
export default {
  name: 'ExpandableCellText',
  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
<div class="expandable-cell-text" :class="{'_opened': isOpened}">
  <div class="head">
    <slot></slot>
  </div>
  <UiOpenerCorner :isOpened="isOpened" />
</div>
</template>

<style lang="scss" scoped>
.expandable-cell-text {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &._opened {
    color: #919699;
  }
}

.head {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}
</style>
