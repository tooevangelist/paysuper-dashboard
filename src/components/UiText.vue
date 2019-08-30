<script>
export default {
  name: 'UiText',
};
</script>

<template>
<p class="text">
  <slot></slot>
</p>
</template>

<style lang="scss" scoped>
.text {
  max-width: 448px;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 20px;
  color: #5e6366;
}
</style>
