<script>
import {
  Button, FormByStep,
} from '@protocol-one/ui-kit';
import ProjectFormSettings from '@/components/ProjectFormSettings.vue';
import ProjectFormSimpleCheckout from '@/components/ProjectFormSimpleCheckout.vue';

export default {
  name: 'ProjectForm',

  components: {
    FormByStep,
    Button,
    ProjectFormSettings,
    ProjectFormSimpleCheckout,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      currentStep: 'settings',
      stepsStatus: {
        settings: 'initial',
        simpleCheckout: 'initial',
        products: 'initial',
        subscriptions: 'initial',
      },
    };
  },

  computed: {
    steps() {
      return [
        {
          value: 'settings',
          label: 'Settings',
          status: this.stepsStatus.settings,
        },
        {
          value: 'simpleCheckout',
          label: 'Simple checkout',
          status: this.stepsStatus.simpleCheckout,
        },
        {
          value: 'products',
          label: 'Products',
          status: this.stepsStatus.products,
        },
        {
          value: 'subscriptions',
          label: 'Subscriptions',
          status: this.stepsStatus.subscriptions,
        },
      ];
    },

    isFormValid() {
      return !this.steps.filter(item => item.status !== 'complete').length;
    },
  },

  methods: {
    chekIfFormValid() {
      this.$refs.formSettings.validateForm();
      this.$refs.formCheckout.validateForm();
      return this.isFormValid;
    },

    setStepStatus(name, isValid) {
      this.stepsStatus[name] = isValid ? 'complete' : 'incomplete';
    },
  },
};
</script>

<template>
  <div class="project-form">
    <FormByStep :steps="steps" v-model="currentStep">
      <ProjectFormSettings
        v-show="currentStep === 'settings'"
        :project="project"
        ref="formSettings"
        @validationResult="setStepStatus('settings', $event)"
      />
      <ProjectFormSimpleCheckout
        v-show="currentStep === 'simpleCheckout'"
        :project="project"
        ref="formCheckout"
        @validationResult="setStepStatus('simpleCheckout', $event)"
      />

      <div slot="side-footer" v-if="isFormValid">
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
