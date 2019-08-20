<script>
import { cloneDeep, isEqual } from 'lodash-es';
import { mapState, mapActions } from 'vuex';
import Notifications from '@/mixins/Notifications';
import ProjectForm from '@/components/ProjectForm.vue';
import SaveDataWarningModal from '@/components/SaveDataWarningModal.vue';

export default {
  components: {
    ProjectForm,
    SaveDataWarningModal,
  },
  mixins: [Notifications],

  data() {
    return {
      projectLocal: null,
      defaultStep: 'settings',
      currentStep: '',
      routNextCallback: null,

      isUnsavedDataModalOpened: false,
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

  async beforeRouteLeave(to, from, next) {
    if (isEqual(this.project, this.projectLocal)) {
      next();
      return;
    }
    try {
      await this.confirmDataSaved();
      next(false);
      this.validateAndSaveProject();
    } catch (error) {
      next();
    }
  },

  created() {
    this.applyQueryParams(this.$route);
    this.updateProjectLocal();
  },

  methods: {
    ...mapActions(['setIsLoading', 'uploadImage']),
    ...mapActions('Project', [
      'initState',
      'createProject',
      'saveProject',
    ]),

    updateProjectLocal() {
      this.projectLocal = cloneDeep(this.project);
    },

    applyQueryParams(route) {
      this.currentStep = route.query.step || this.defaultStep;
    },

    handleSectionChange(step) {
      this.$router.push({ query: { step } });
    },

    async validateAndSaveProject() {
      const isProjectValid = this.$refs.projectForm.chekIfFormValid();
      if (isProjectValid) {
        this.setIsLoading(true);
        try {
          if (this.project.id) {
            await this.saveProject(this.projectLocal);
          } else {
            await this.createProject(this.projectLocal);
            this.$router.push({
              path: `/projects/${this.project.id}`,
            });
          }
          this.updateProjectLocal();
          this.$_Notifications_showSuccessMessage('Project saved successfully');
        } catch (error) {
          this.$_Notifications_showErrorMessage(error);
        }
        this.setIsLoading(false);
      } else {
        this.$_Notifications_showErrorMessage('The form is not filled right');
      }
    },

    confirmDataSaved() {
      return new Promise((resolve, reject) => {
        this.isUnsavedDataModalOpened = true;
        this.$refs.saveDataWarningModal.$once('submit', (result) => {
          if (result) {
            resolve();
          } else {
            reject();
          }
          this.isUnsavedDataModalOpened = false;
        });
      });
    },

  },
};
</script>

<template>
<div>
  <ProjectForm
    ref="projectForm"
    :project="projectLocal"
    :currentStep="currentStep"
    :uploadImage="uploadImage"
    @stepChanged="handleSectionChange"
    @submitForms="validateAndSaveProject"
  />

  <SaveDataWarningModal
    v-show="isUnsavedDataModalOpened"
    ref="saveDataWarningModal"
  />
</div>
</template>
