<template>
  <ErrorPage :errorCode="404" />
</template>

<script>
import ErrorPage from '@/pages/ErrorPage.vue';

export default {
  name: 'Error404Page',

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
