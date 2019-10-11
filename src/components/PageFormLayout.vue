<script>
export default {
  name: 'PageFormLayout',
};
</script>

<template>
<div class="template-page-form-layout">
  <slot></slot>
</div>
</template>

<style lang="scss">
@import url("//static.protocol.one/common/fonts/Lato.css");
@import "@/assets/scss/_custom.scss";
.page-form-layout-body {
  margin: 0;
  font-family: Lato, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.25;
}
.page-form-layout-body,
.page-form-layout-html {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.template-page-form-layout {
  height: 100%;
  & > div {
    height: 100%;
  }
}
</style>