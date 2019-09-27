<template>
<span class="ui-dots-menu-trigger" :class="{ '_opened': isOpened }">
  <IconThreeHorizontalDots />
</span>
</template>

<script>
export default {
  name: 'UiDotsMenuTrigger',

  props: {
    isOpened: {
      default: false,
      type: Boolean,
    },
  },
};
</script>


<style lang="scss" scoped>
.ui-dots-menu-trigger {
  display: inline-flex;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;

  &._opened {
    background: #f1f3f4;
  }
}
</style>
