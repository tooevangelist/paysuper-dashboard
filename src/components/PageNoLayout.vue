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
@import url("//static.protocol.one/common/fonts/Lato.css");
@import "@/assets/scss/_custom.scss";
body {
  margin: 0;
  font-family: Lato, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.25;

  & * {
    box-sizing: border-box;
  }
}
.template-page-no-layout {
  & a {
    text-decoration: none;
    color: #2f6ecd;

    &:hover {
      text-decoration: underline;
    }
  }

  & p {
    margin: 0;
  }

  & ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  & label {
    margin: 0;
  }
}
</style>
