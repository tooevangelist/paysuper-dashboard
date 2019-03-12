<script>
import {
  Button, FormByStep,
} from '@protocol-one/ui-kit';
import ProjectFormSettings from '@/components/ProjectFormSettings.vue';

export default {
  name: 'ProjectForm',

  components: {
    FormByStep,
    Button,
    ProjectFormSettings,
  },

  props: {
    project: {
      type: Object,
      default: () => ({
        name: '',
        url_check_account: '',
        url_process_payment: '',
        url_redirect_fail: '',
        secret_key: '',
        create_invoice_allowed_urls: [],
      }),
    },
  },

  data() {
    return {
      currentStep: 'settings',
    };
  },

  computed: {
    steps() {
      return [
        {
          value: 'settings',
          label: 'Settings',
          status: 'initial',
        },
        {
          value: 'simple-checkout',
          label: 'Simple checkout',
          status: 'initial',
        },
        {
          value: 'products',
          label: 'Products',
          status: 'initial',
        },
        {
          value: 'subscriptions',
          label: 'Subscriptions',
          status: 'initial',
        },
      ];
    },

    isFormComplete() {
      return !this.steps.filter(item => item.status !== 'complete').length;
    },
  },
};
</script>

<template>
  <div class="project-form">
    <FormByStep :steps="steps" v-model="currentStep">
      <ProjectFormSettings v-if="currentStep === 'settings'" :project="project" />

      <div slot="side-footer" v-if="isFormComplete">
        You have finished filling out company details, send them for review
        <div style="text-align: center; margin-top: 20px; ">
          <Button>Finish</Button>
        </div>
      </div>
    </FormByStep>
    <pre>{{project}}</pre>
  </div>
</template>

<style lang="scss" scoped>
</style>
