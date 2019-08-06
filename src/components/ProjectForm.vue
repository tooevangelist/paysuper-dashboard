<script>
import { find } from 'lodash-es';
import {
  UiButton, UiFormByStep,
} from '@protocol-one/ui-kit';
import ProjectFormSettings from '@/components/ProjectFormSettings.vue';
import ProjectFormSimpleCheckout from '@/components/ProjectFormSimpleCheckout.vue';
import ProjectFormProducts from '@/components/ProjectFormProducts.vue';

export default {
  name: 'ProjectForm',

  components: {
    UiFormByStep,
    UiButton,
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
    uploadImage: {
      type: Function,
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
    <UiFormByStep
      class="project-form__form-by-step"
      :steps="steps"
      :currentStep="currentStepInner"
      v-model="currentStepInner"
      @stepSelected="updateCurrentStep"
    >
      <ProjectFormSettings
        v-show="currentStepInner === 'settings'"
        :project="project"
        :uploadImage="uploadImage"
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
      />

      <div slot="side-footer" v-if="false">
        You have finished filling out company details, send them for review
        <div style="text-align: center; margin-top: 20px; ">
          <UiButton>Finish</UiButton>
        </div>
      </div>
    </UiFormByStep>
  </div>
</template>

<style lang="scss" scoped>
.project-form {
  display: flex;
  min-height: calc(100vh - 84px);

  &__form-by-step {
    flex-grow: 1;
  }
}
</style>
