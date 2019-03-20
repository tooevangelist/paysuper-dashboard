<script>
import { find } from 'lodash-es';
import {
  Button, FormByStep,
} from '@protocol-one/ui-kit';
import ProjectFormSettings from '@/components/ProjectFormSettings.vue';
import ProjectFormSimpleCheckout from '@/components/ProjectFormSimpleCheckout.vue';
import ProjectFormProducts from '@/components/ProjectFormProducts.vue';

export default {
  name: 'ProjectForm',

  components: {
    FormByStep,
    Button,
    ProjectFormSettings,
    ProjectFormSimpleCheckout,
    ProjectFormProducts,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
    currentStep: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      currentStepInner: this.currentStep,
      stepsStatus: {
        settings: 'initial',
        simpleCheckout: 'initial',
        products: 'initial',
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
      ];
    },

    isFormValid() {
      return (
        find(this.steps, { value: 'settings' }).status === 'complete'
        && find(this.steps, { value: 'simpleCheckout' }).status === 'complete'
      );
    },
  },

  watch: {
    currentStep(value) {
      this.currentStepInner = value;
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

    updateCurrentStep(value) {
      this.currentStepInner = value;
      this.$emit('stepChanged', this.currentStepInner);
    },
  },
};
</script>

<template>
  <div class="project-form">
    <FormByStep
      :steps="steps"
      :currentStep="currentStepInner"
      v-model="currentStepInner"
      @stepSelected="updateCurrentStep"
    >
      <ProjectFormSettings
        v-show="currentStepInner === 'settings'"
        :project="project"
        ref="formSettings"
        @validationResult="setStepStatus('settings', $event)"
      />
      <ProjectFormSimpleCheckout
        v-show="currentStepInner === 'simpleCheckout'"
        :project="project"
        ref="formCheckout"
        @validationResult="setStepStatus('simpleCheckout', $event)"
      />
      <ProjectFormProducts
        v-show="currentStepInner === 'products'"
        :project="project"
        ref="formProducts"
        @validationResult="setStepStatus('products', $event)"
        @requestOpenProduct="$emit('requestOpenProduct', $event)"
      />

      <div slot="side-footer" v-if="false">
        You have finished filling out company details, send them for review
        <div style="text-align: center; margin-top: 20px; ">
          <Button>Finish</Button>
        </div>
      </div>
    </FormByStep>
  </div>
</template>
