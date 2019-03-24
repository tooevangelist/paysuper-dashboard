<script>
import { map, filter } from 'lodash-es';
import {
  UiButton, UiFormByStep,
} from '@protocol-one/ui-kit';
import MerchantFormBasicInfo from '@/components/MerchantFormBasicInfo.vue';
import MerchantFormContacts from '@/components/MerchantFormContacts.vue';
import MerchantFormBankingInfo from '@/components/MerchantFormBankingInfo.vue';

export default {
  name: 'MerchantForm',

  components: {
    UiFormByStep,
    UiButton,
    MerchantFormBasicInfo,
    MerchantFormContacts,
    MerchantFormBankingInfo,
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
      steps: {
        basicInfo: {
          label: 'Basic info',
          status: 'initial',
          component: 'MerchantFormBasicInfo',
        },
        contacts: {
          label: 'Contacts',
          status: 'initial',
          component: 'MerchantFormContacts',
        },
        bankingInfo: {
          label: 'Banking info',
          status: 'initial',
          component: 'MerchantFormBankingInfo',
        },
        licenseAgreement: {
          label: 'License agreement',
          status: 'initial',
          component: 'UiButton',
        },
        paymentMethods: {
          label: 'Payment methods',
          status: 'initial',
          component: 'UiButton',
        },
      },
    };
  },

  computed: {
    isFormValid() {
      return !filter(this.steps, item => item.status !== 'complete').length;
    },

    stepsList() {
      return map(this.steps, (item, value) => ({
        ...item,
        value,
      }));
    },
  },

  watch: {
    currentStep(value) {
      this.currentStepInner = value;
    },
  },

  methods: {
    chekIfFormValid() {
      this.$refs.forms.forEach((form) => {
        if (form.validateForm) {
          form.validateForm();
        }
      });
      return this.isFormValid;
    },

    setStepStatus(name, isValid) {
      this.steps[name].status = isValid ? 'complete' : 'incomplete';
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
      :steps="stepsList"
      :currentStep="currentStepInner"
      v-model="currentStepInner"
      @stepSelected="updateCurrentStep"
    >
      <component
        v-for="(step, stepValue) in steps"
        :is="step.component"
        :key="stepValue"
        v-show="currentStepInner === stepValue"
        :merchant="merchant"
        ref="forms"
        @validationResult="setStepStatus(stepValue, $event)"
      />
    </UiFormByStep>
    <pre style="width: 100%;">
      {{merchant}}
    </pre>
  </div>
</template>

<style lang="scss" scoped>
.merchant-form {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 84px);

  &__form-by-step {
    flex-grow: 1;
  }
}
</style>
