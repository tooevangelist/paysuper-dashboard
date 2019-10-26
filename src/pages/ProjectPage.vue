<script>
import ProjectStore from '@/store/ProjectStore';

export default {
  name: 'ProjectPage',

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('Project', ProjectStore, {
        id: route.params.id,
        name: route.query.name,
        image: route.query.image,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
};
</script>

<template>
<RouterView />
</template>
