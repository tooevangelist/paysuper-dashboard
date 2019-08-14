<script>
export default {
  name: 'LayoutSpecialNavBackLink',

  props: {
    link: {
      type: Object,
    },
  },
};
</script>

<template>
<RouterLink
  class="layout-special-nav-back-link"
  :to="link.url"
>
  <IconArrowDown
    class="icon"
    fill="#3d7bf5"
    width="12"
    height="8"
  />
  <span class="text">
    {{link.label}}

  </span>
</RouterLink>
</template>

<style lang="scss" scoped>
.layout-special-nav-back-link {
  display: flex;
  align-items: center;
  padding-left: 26px;
  color: #3d7bf5;
  font-size: 14px;
  line-height: 20px;
}

.icon {
  transform: rotate(90deg);
  margin-right: 21px;
}

.text {
  margin-top: 1px;
}
</style>
