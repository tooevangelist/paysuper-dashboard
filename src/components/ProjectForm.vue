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

  methods: {
    validateForm() {
      if (
        this.$refs.formSettings.validateForm()
        && this.$refs.formCheckout.validateForm()
      ) {
        return true;
      }

      return false;
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
      />
      <ProjectFormSimpleCheckout
        v-show="currentStep === 'simple-checkout'"
        :project="project"
        ref="formCheckout"
      />

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
