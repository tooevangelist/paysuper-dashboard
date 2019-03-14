<script>
import { PageHeader, Button } from '@protocol-one/ui-kit';
import Project from '@/components/Project.vue';
import ProjectForm from '@/components/ProjectForm.vue';

export default {
  components: {
    Project, PageHeader, ProjectForm, Button,
  },
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

<template>
  <div>
    <PageHeader :breadcrumbs="breadcrumbs">
      <span slot="title">Create project</span>
      <Button slot="right">Create project</Button>
    </PageHeader>
    <ProjectForm />
    <br>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <project :project="{}"/>
        </div>
      </div>
    </div>
  </div>
</template>
