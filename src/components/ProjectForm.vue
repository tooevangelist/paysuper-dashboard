<script>
import ProjectFormSettings from '@/components/ProjectFormSettings.vue';
import ProjectFormSimpleCheckout from '@/components/ProjectFormSimpleCheckout.vue';
import ProjectFormProducts from '@/components/ProjectFormProducts.vue';

export default {
  name: 'ProjectForm',

  components: {
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
      steps: {
        settings: {
          label: 'Settings',
          status: 'initial',
          description: 'Setup main scope of project parameters here.',
        },
        simpleCheckout: {
          label: 'Simple checkout',
          status: 'initial',
        },
        products: {
          label: 'Products',
          status: 'initial',
        },
      },
    };
  },

  computed: {
    currentStepItem() {
      return this.steps[this.currentStep];
    },

    isFormValid() {
      return (
        this.steps.settings.status === 'complete'
        && this.steps.simpleCheckout.status === 'complete'
      );
    },
  },

  methods: {
    chekIfFormValid() {
      this.$refs.formSettings.validateForm();
      this.$refs.formCheckout.validateForm();
      return this.isFormValid;
    },

    setStepStatus(name, isValid) {
      this.steps[name].status = isValid ? 'complete' : 'incomplete';
    },
  },
};
</script>

<template>
<div class="project-form">
  <header class="header">
    <UiHeader level="2" :hasMargin="true">{{currentStepItem.label}}</UiHeader>
    <p>{{currentStepItem.description}}</p>
  </header>

  <UiPanel>
    <ProjectFormSettings
      v-show="currentStep === 'settings'"
      :project="project"
      :uploadImage="uploadImage"
      ref="formSettings"
      @validationResult="setStepStatus('settings', $event)"
    />
    <ProjectFormSimpleCheckout
      v-show="currentStep === 'simpleCheckout'"
      :project="project"
      ref="formCheckout"
      @validationResult="setStepStatus('simpleCheckout', $event)"
    />
    <ProjectFormProducts
      v-show="currentStep === 'products'"
      :project="project"
      ref="formProducts"
      @validationResult="setStepStatus('products', $event)"
    />

    <div class="controls">
      <UiButton
        class="submit-button"
        :text="project.id ? 'SAVE' : 'CREATE'"
        @click="$emit('submitForms')"
      />
    </div>
  </UiPanel>
</div>
</template>

<style lang="scss" scoped>
.project-form {
}

.header {
  margin-bottom: 32px;
}

.controls {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  width: 140px;
}
</style>
