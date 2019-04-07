<template>
  <div class="form-content">
    <div class="main">
      <slot></slot>
    </div>
    <div class="side">
      <slot slot="side"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormContent',
};
</script>

<style lang="scss" scoped>
.form-content {
  display: flex;
}

.main {
  width: 528px;
}

.side {
}
</style>
