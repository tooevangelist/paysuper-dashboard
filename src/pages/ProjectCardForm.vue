<script>
import { mapState, mapActions } from 'vuex';
import Notifications from '@/mixins/Notifications';
import ProjectForm from '@/components/ProjectForm.vue';

export default {
  components: {
    ProjectForm,
  },
  mixins: [Notifications],

  data() {
    return {
      defaultStep: 'settings',
      currentStep: '',
    };
  },

  computed: {
    ...mapState('Project', ['project']),
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
    <ProjectForm
      ref="projectForm"
      :project="project"
      :currentStep="currentStep"
      :uploadImage="uploadImage"
      @stepChanged="handleSectionChange"
    />

    <UiButton
      @click="validateAndSaveProject"
      :text="project.id ? 'Save' : 'Create project'"
    />
  </div>
</template>
