<script>
export default {
  name: 'SimplePageHeader',
};
</script>

<template>
<header class="simple-page-header">
  <div class="header-texts">
    <UiHeader level="2" :hasMargin="true">
      <slot name="title"></slot>
    </UiHeader>
    <p class="text">
      <slot name="description"></slot>
    </p>
  </div>
  <div class="header-picture">
    <slot name="picture"></slot>
  </div>
</header>
</template>

<style lang="scss" scoped>
.simple-page-header {
  margin-bottom: 32px;
  display: flex;
}

.header-texts {
}

.header-picture {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.text {
  width: 448px;
}
</style>
