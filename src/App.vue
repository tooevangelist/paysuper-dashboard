<script>
import { mapState } from 'vuex';
import Page from '@/components/Page.vue';
import PageNoLayout from '@/components/PageNoLayout.vue';
import PageShallow from '@/components/PageShallow.vue';
import ErrorPage from '@/components/ErrorPage.vue';

export default {
  name: 'App',
  components: {
    Page,
    PageNoLayout,
    PageShallow,
    ErrorPage,
  },
  computed: {
    ...mapState(['pageError']),
    layoutComponentName() {
      if (this.$route.meta && this.$route.meta.layout) {
        return this.$route.meta.layout;
      }
      return 'PageNoLayout';
    },
  },
};
</script>

<template>
  <component class="app" :is="layoutComponentName">
    <ErrorPage v-if="pageError" :errorCode="pageError" />
    <RouterView v-else />
  </component>
</template>
