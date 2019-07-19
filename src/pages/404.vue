<template>
  <ErrorPage :errorCode="404" />
</template>

<script>
import ErrorPage from '@/components/ErrorPage.vue';

export default {
  name: 'Page404',

  components: {
    ErrorPage,
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
