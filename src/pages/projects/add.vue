<script>
import { mapState, mapActions } from 'vuex';
import { PageHeader, Button } from '@protocol-one/ui-kit';
import Project from '@/components/Project.vue';
import ProjectForm from '@/components/ProjectForm.vue';
import ProjectStore from '@/store/ProjectStore';
import Notifications from '@/mixins/Notifications';

export default {
  mixins: [Notifications],

  components: {
    Project, PageHeader, ProjectForm, Button,
  },

  asyncData({ registerStoreModule }) {
    return registerStoreModule('NewProject', ProjectStore);
  },

  data() {
    return {
      breadcrumbs: [
        {
          label: 'Projects list',
          url: '/projects/',
          router: true,
        },
        {
          label: 'Create project',
        },
      ],
    };
  },

  computed: {
    ...mapState('NewProject', ['project']),
  },

  methods: {
    ...mapActions('NewProject', ['createProject']),
    tryCreateProject() {
      const isValid = this.$refs.projectForm.validateForm();

      console.log(11111, 'isValid', isValid);
      this.createProject();

      // if (isValid) {
      //   this.createProject();
      //   this.$_Notifications_showSuccessMessage('Project has been created successfully');
      // } else {
      //   this.$_Notifications_showErrorMessage('The form is not filled right');
      // }
    },
  },
};
</script>

<template>
  <div>
    <PageHeader :breadcrumbs="breadcrumbs">
      <span slot="title">Create project</span>
      <Button slot="right" @click="tryCreateProject">Create project</Button>
    </PageHeader>
    <ProjectForm ref="projectForm" :project="project" />
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
