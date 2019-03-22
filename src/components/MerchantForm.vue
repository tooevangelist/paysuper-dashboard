<script>
import {
  UiButton, UiFormByStep,
} from '@protocol-one/ui-kit';

export default {
  name: 'MerchantForm',

  components: {
    UiFormByStep,
    UiButton,
  },

  props: {
    merchant: {
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
        payouts: 'initial',
      },
    };
  },

  computed: {
    steps() {
      return [
        {
          label: 'Company Info',
          value: 'companyInfo',
          status: this.stepsStatus.settings,
        },
        {
          label: 'Agreement',
          value: 'agreement',
          status: this.stepsStatus.simpleCheckout,
        },
        {
          label: 'Payment methods',
          value: 'paymentMethods',
          status: this.stepsStatus.products,
        },
        {
          label: 'Payouts',
          value: 'payouts',
          status: this.stepsStatus.payouts,
        },
      ];
    },

    isFormValid() {
      return !this.steps.filter(item => item.status !== 'complete').length;
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
  <div class="merchant-form">
    <UiFormByStep
      class="merchant-form__form-by-step"
      :steps="steps"
      :currentStep="currentStepInner"
      v-model="currentStepInner"
      @stepSelected="updateCurrentStep"
    >

      <UiButton>lal</UiButton>
    </UiFormByStep>
  </div>
</template>

<style lang="scss" scoped>
.merchant-form {
  display: flex;
  min-height: calc(100vh - 84px);

  &__form-by-step {
    flex-grow: 1;
  }
}
</style>
