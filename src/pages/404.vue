<template>
  <PageError :errorCode="404" />
</template>

<script>
import PageError from '@/components/PageError.vue';

export default {
  name: 'Page404',

  components: {
    PageError,
  },
};
</script>

<style lang="scss" scoped>
.page-404 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
