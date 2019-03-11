<template>
  <Page>
    <PageHeader :breadcrumbs="breadcrumbs" :title="project.name" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <project :project="project"/>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import axios from 'axios';
import { PageHeader } from '@protocol-one/ui-kit';
import Notifications from '@/mixins/notificaton';
import Page from '@/components/Page.vue';
import Project from '@/components/Project.vue';

export default {
  middleware: 'IsNotAuthenticated',
  components: { Page, Project, PageHeader },
  mixins: [Notifications],
  asyncData(context) {
    return axios.get(`${process.env.VUE_APP_P1PAYAPI_URL}/api/v1/s/project/${context.route.params.id}`, {
      headers: { Authorization: `Bearer ${context.store.state.user.accessToken}` },
    }).then(response => ({
      project: response.data,
    })).catch(() => {});
  },

  data() {
    return {
      project: {

      },
    };
  },

  computed: {
    breadcrumbs() {
      return [
        {
          label: 'Projects list',
          url: '/project/',
          router: true,
        },
      ];
    },
  },
};
</script>
