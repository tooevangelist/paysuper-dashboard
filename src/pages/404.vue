<template>
  <div class="page-404">
    <Header level="1">404</Header>
    <Header level="2">Page not found</Header>
  </div>
</template>

<script>
import { Header } from '@protocol-one/ui-kit';

export default {
  name: 'Page404',

  components: {
    Header,
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
