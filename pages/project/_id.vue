<template>
  <Page>
    <span slot="header-title">Projects</span>
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
import Page from '@/components/Page.vue';
import Notifications from '../../mixins/notificaton';
import Project from '../../components/Project.vue';

export default {
  middleware: 'IsNotAuthenticated',
  components: { Project, Page },
  mixins: [Notifications],
  asyncData(context) {
    return axios.get(`${process.env.apiServerUrl}/api/v1/s/project/${context.route.params.id}`, {
      headers: { Authorization: `Bearer ${context.store.state.user.accessToken}` },
    }).then(response => ({
      project: response.data,
    })).catch(() => {});
  },
};
</script>
