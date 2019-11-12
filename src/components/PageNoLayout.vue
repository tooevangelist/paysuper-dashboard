<script>
export default {
  name: 'PageNoLayout',
};
</script>

<template>
<div class="template-page-no-layout">
  <slot></slot>
</div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500|Roboto:400,500&display=swap");
@import "@/assets/scss/_custom.scss";
.page-no-layout-body {
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  line-height: 1.25;
}
.page-no-layout-body,
.page-no-layout-html {
  display: flex;
  flex-direction: column;
}
</style>
