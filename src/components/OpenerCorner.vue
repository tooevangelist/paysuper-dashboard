<script>
export default {
  name: 'OpenerCorner',

  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
<div class="opener-corner" :class="{'_opened': isOpened}"></div>
</template>

<style lang="scss" scoped>
.opener-corner {
  display: inline-flex;
  height: 20px;
  width: 20px;
  justify-content: center;
  align-items: center;

  &::after {
    content: "";
    height: 8px;
    width: 8px;
    border: 4px solid transparent;
    border-top-color: #3d7bf5;
    transition: transform 0.2s ease-out, border-color 0.2s ease-out;
    transform-origin: center 2px;
    margin-top: 2px;
  }

  &._opened::after {
    transform: rotate(180deg);
    border-top-color: #c6cacc;
  }
}
</style>
