<script>
import { mapState } from 'vuex';
import ErrorPage from '@/pages/ErrorPage.vue';
import Layout from '@/components/Layout.vue';
import Page from '@/components/Page.vue';
import PageNoLayout from '@/components/PageNoLayout.vue';
import PageShallow from '@/components/PageShallow.vue';

export default {
  name: 'App',
  components: {
    ErrorPage,
    Layout,
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
    <ErrorPage
      v-if="pageError"
      :errorCode="pageError"
      :layout="layoutComponentName"
    />
    <RouterView v-else />
  </component>
</template>
