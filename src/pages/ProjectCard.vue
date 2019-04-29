<script>
import ProjectStore from '@/store/ProjectStore';

export default {
  name: 'ProjectCard',

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('Project', ProjectStore, route.params.id);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
};
</script>

<template>
  <RouterView></RouterView>
</template>
