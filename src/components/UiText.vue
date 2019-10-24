<script>
export default {
  name: 'UiText',
};
</script>

<template>
<p class="ui-text">
  <slot></slot>
</p>
</template>

<style lang="scss" scoped>
.ui-text {
  max-width: 448px;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 20px;
  color: #5e6366;

  a {
    color: #3d7bf5;
  }
}
</style>
