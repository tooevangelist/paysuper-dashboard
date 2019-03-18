<script>
import { mapState } from 'vuex';
import { PageHeader } from '@protocol-one/ui-kit';
import Notifications from '@/mixins/notificaton';
import Project from '@/components/Project.vue';
import ProjectStore from '@/store/ProjectStore';

export default {
  components: { Project, PageHeader },
  mixins: [Notifications],

  asyncData({ registerStoreModule, route }) {
    return registerStoreModule('Project', ProjectStore, route.params.id);
  },

  computed: {
    ...mapState('Project', ['project']),
    breadcrumbs() {
      return [
        {
          label: 'Projects list',
          url: '/projects/',
          router: true,
        },
      ];
    },
  },
};
</script>

<template>
  <div>
    <PageHeader :breadcrumbs="breadcrumbs" :title="project.name" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <project :project="project"/>
        </div>
      </div>
    </div>
  </div>
</template>
