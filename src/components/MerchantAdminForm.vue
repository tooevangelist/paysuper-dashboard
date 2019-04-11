<script>
import { map, filter } from 'lodash-es';
import {
  UiButton, UiFormByStep,
} from '@protocol-one/ui-kit';
import MerchantAdminFormCompanyInfo from '@/components/MerchantAdminFormCompanyInfo.vue';
import MerchantAdminFormAgreement from '@/components/MerchantAdminFormAgreement.vue';
import MerchantFormAgreement from '@/components/MerchantFormAgreement.vue';
import MerchantAdminFormPaymentMethods from '@/components/MerchantAdminFormPaymentMethods.vue';

export default {
  name: 'MerchantForm',

  components: {
    UiFormByStep,
    UiButton,
    MerchantAdminFormCompanyInfo,
    MerchantAdminFormAgreement,
    MerchantFormAgreement,
    MerchantAdminFormPaymentMethods,
  },

  props: {
    merchant: {
      type: Object,
      required: true,
    },
    paymentMethods: {
      type: Array,
      required: true,
    },
    currentStep: {
      type: String,
      required: true,
    },
    agreementDocument: {
      type: Object,
      required: true,
    },
    paymentMethodsSort: {
      type: Array,
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
          component: 'MerchantAdminFormCompanyInfo',
          isValidable: true,
        },
        licenseAgreement: {
          label: 'License agreement',
          status: 'initial',
          component: 'MerchantAdminFormAgreement',
        },
        // licenseAgreementClient: {
        //   label: 'License agreement client',
        //   status: 'initial',
        //   component: 'MerchantFormAgreement',
        // },
        paymentMethods: {
          label: 'Payment methods',
          status: 'initial',
          component: 'MerchantAdminFormPaymentMethods',
        },
      },
    };
  },

  computed: {
    isFormValid() {
      return !filter(this.steps, item => item.status !== 'complete' && item.isValidable).length;
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
  <div class="merchant-admin-form">
    <UiFormByStep
      class="merchant-admin-form__form-by-step"
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
        :paymentMethods="stepValue === 'paymentMethods' ? paymentMethods : undefined"
        :agreementDocument="agreementDocument"
        :paymentMethodsSort="paymentMethodsSort"
        ref="forms"
        @validationResult="setStepStatus(stepValue, $event)"
        @requestAgreementChange="$emit('requestAgreementChange', $event)"
        @sendNotification="$emit('sendNotification', $event)"
        @sortPaymentMethods="$emit('sortPaymentMethods', $event)"
      />
    </UiFormByStep>
  </div>
</template>

<style lang="scss" scoped>
.merchant-admin-form {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 84px);

  &__form-by-step {
    flex-grow: 1;
  }
}
</style>
