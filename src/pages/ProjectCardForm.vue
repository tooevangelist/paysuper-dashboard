<script>
import { mapState, mapActions } from 'vuex';
import { UiButton, UiPageHeader } from '@protocol-one/ui-kit';
import Notifications from '@/mixins/Notifications';
import ProjectForm from '@/components/ProjectForm.vue';

export default {
  components: {
    UiButton, UiPageHeader, ProjectForm,
  },
  mixins: [Notifications],

  data() {
    return {
      defaultStep: 'settings',
      currentStep: '',
    };
  },

  computed: {
    ...mapState('Project', ['project', 'product']),
    breadcrumbs() {
      const crumbs = [
        {
          label: 'Projects list',
          url: '/projects',
        },
      ];

      if (this.product) {
        if (this.project.id) {
          crumbs.push({
            label: this.project.name,
            url: `/projects/${this.project.id}`,
          });
        } else {
          crumbs.push({
            label: 'New project',
            url: '/projects/new',
          });
        }
      }
      return crumbs;
    },
  },

  async beforeRouteUpdate(to, from, next) {
    if (to.params.id !== from.params.id) {
      await this.initState(to.params.id);
    }
    this.applyQueryParams(to);
    next();
  },

  created() {
    this.applyQueryParams(this.$route);
  },

  methods: {
    ...mapActions(['setIsLoading', 'uploadImage']),
    ...mapActions('Project', [
      'initState',
      'createProject',
      'saveProject',
    ]),

    applyQueryParams(route) {
      this.currentStep = route.query.step || this.defaultStep;
    },

    handleSectionChange(step) {
      this.$router.push({ query: { step } });
    },

    async validateAndSaveProject() {
      const isProjectValid = this.$refs.projectForm.chekIfFormValid();

      if (isProjectValid) {
        if (this.project.id) {
          this.saveProject();
        } else {
          this.setIsLoading(true);
          try {
            await this.createProject();
            this.$router.push({
              path: `/projects/${this.project.id}`,
            });
            this.$_Notifications_showSuccessMessage('Project created successfully');
          } catch (error) {
            console.warn(error);
            this.$_Notifications_showErrorMessage('Failed to create project');
          }

          this.setIsLoading(false);
        }
      } else {
        this.$_Notifications_showErrorMessage('The form is not filled right');
      }
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeader
      :breadcrumbs="breadcrumbs"
      :title="project.name.en || 'New project'"
    >
      <UiButton
        slot="right"
        @click="validateAndSaveProject"
        :text="project.id ? 'Save' : 'Create project'"
      />
    </UiPageHeader>

    <ProjectForm
      ref="projectForm"
      :project="project"
      :currentStep="currentStep"
      :uploadImage="uploadImage"
      @stepChanged="handleSectionChange"
    />
  </div>
</template>
