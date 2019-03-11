<template>
  <Page>
    <PageHeader :breadcrumbs="breadcrumbs">
      <span slot="title">Create project</span>
    </PageHeader>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <project :project="{}"/>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '@/components/Page.vue';
import { PageHeader } from '@protocol-one/ui-kit';
import Project from '@/components/Project.vue';

export default {
  components: { Page, Project, PageHeader },
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Projects list',
          url: '/project/',
          router: true,
        },
        {
          label: 'Create project',
        },
      ],
    };
  },
};
</script>
