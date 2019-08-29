<script>
export default {
  name: 'SimpleMenuItem',

  props: {
    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
<div
  class="simple-menu-item"
  :class="{ '_current': isCurrent }"
>
  <slot></slot>
</div>
</template>

<style lang="scss" scoped>
$hover-text-color: #3d7bf5;
$hover-background-color: rgba($hover-text-color, 0.1);
$hover-deactivate-text-color: #ea3d2f;
$hover-deactivate-background-color: rgba($hover-deactivate-text-color, 0.08);

.simple-menu-item {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  cursor: pointer;
  padding: 0 16px;
  height: 32px;
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;

  &:first-child {
    margin-top: 8px;
  }
  &:last-child {
    margin-bottom: 8px;
  }

  &._deactivate {
    color: $hover-deactivate-text-color;

    // .menu-icon > svg {
    //   fill: $hover-deactivate-text-color;
    // }
  }

  &:hover:not(._current) {
    &:not(._deactivate) {
      background: $hover-background-color;
      color: $hover-text-color;

      // .menu-icon > svg {
      //   fill: $hover-text-color;
      // }
    }

    &._deactivate {
      background: $hover-deactivate-background-color;
    }
  }

  &._current {
    color: #c6cacc;
    cursor: default;
  }
}
</style>
