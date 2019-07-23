<script>
import { mapState } from 'vuex';
import DashboardShallow from '@/components/DashboardShallow.vue';
import ErrorPage from '@/components/ErrorPage.vue';
import Page from '@/components/Page.vue';
import PageNoLayout from '@/components/PageNoLayout.vue';
import PageShallow from '@/components/PageShallow.vue';

export default {
  name: 'App',
  components: {
    DashboardShallow,
    ErrorPage,
    Page,
    PageNoLayout,
    PageShallow,
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
