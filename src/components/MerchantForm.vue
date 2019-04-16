<script>
import { map, filter } from 'lodash-es';
import {
  UiButton,
  UiHeader,
  UiFormByStep,
  UiModal,
} from '@protocol-one/ui-kit';
import MerchantFormBasicInfo from '@/components/MerchantFormBasicInfo.vue';
import MerchantFormContacts from '@/components/MerchantFormContacts.vue';
import MerchantFormBankingInfo from '@/components/MerchantFormBankingInfo.vue';
import MerchantFormAgreement from '@/components/MerchantFormAgreement.vue';
import MerchantFormPaymentMethods from '@/components/MerchantFormPaymentMethods.vue';
import FormContent from '@/components/FormContent.vue';
import StatusIcon from '@/components/StatusIcon.vue';

export default {
  name: 'MerchantForm',

  components: {
    UiFormByStep,
    UiButton,
    UiHeader,
    UiModal,
    MerchantFormBasicInfo,
    MerchantFormContacts,
    MerchantFormBankingInfo,
    MerchantFormAgreement,
    MerchantFormPaymentMethods,
    FormContent,
    StatusIcon,
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
      isAgreementBlockerDialogOpen: false,
      currentStepInner: this.currentStep,
      steps: {
        basicInfo: {
          label: 'Basic info',
          status: 'initial',
          component: 'MerchantFormBasicInfo',
          isValidable: true,
        },
        contacts: {
          label: 'Contacts',
          status: 'initial',
          component: 'MerchantFormContacts',
          isValidable: true,
        },
        bankingInfo: {
          label: 'Banking info',
          status: 'initial',
          component: 'MerchantFormBankingInfo',
          isValidable: true,
        },
        licenseAgreement: {
          label: 'License agreement',
          status: 'initial',
          component: 'MerchantFormAgreement',
          isValidable: false,
        },
        paymentMethods: {
          label: 'Payment methods',
          status: 'initial',
          component: 'MerchantFormPaymentMethods',
          isValidable: false,
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

  mounted() {
    this.validateStepsForAgreement();
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

    handleStepChange(value) {
      this.setCurrentStep(value);
      this.validateStepsForAgreement();
    },

    setCurrentStep(value) {
      this.currentStepInner = value;
      this.$emit('stepChanged', this.currentStepInner);
    },

    validateStepsForAgreement() {
      if (this.currentStepInner !== 'licenseAgreement') {
        this.isAgreementBlockerDialogOpen = false;
        return;
      }

      this.chekIfFormValid();
      if (!this.isFormValid) {
        this.isAgreementBlockerDialogOpen = true;
      }
    },

    closeAgreementBlockerDialog() {
      this.isAgreementBlockerDialogOpen = false;
      this.setCurrentStep('basicInfo');
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
      @stepSelected="handleStepChange"
    >
      <FormContent
        v-for="(step, stepValue) in steps"
        :key="stepValue"
        :hasStyling="step.isValidable"
        v-show="currentStepInner === stepValue"
      >
        <component
          :is="step.component"
          :merchant="merchant"
          :paymentMethods="stepValue === 'paymentMethods' ? paymentMethods : undefined"
          :agreementDocument="agreementDocument"
          :paymentMethodsSort="paymentMethodsSort"
          ref="forms"
          @validationResult="setStepStatus(stepValue, $event)"
          @requestAgreementChange="$emit('requestAgreementChange', $event)"
          @sortPaymentMethods="$emit('sortPaymentMethods', $event)"
        />

        <template
          slot="side"
          v-if="stepValue === 'basicInfo' && step.status === 'complete'"
        >
          <StatusIcon status="complete" />
          <UiButton
            class="next-step-button"
            @click="setCurrentStep('contacts')"
          >To step 2</UiButton>
        </template>
        <template
          slot="side"
          v-if="stepValue === 'contacts' && step.status === 'complete'"
        >
          <StatusIcon status="complete" />
          <UiButton
            class="next-step-button"
            @click="setCurrentStep('bankingInfo')"
          >To step 3</UiButton>
        </template>
        <template
          slot="side"
          v-if="stepValue === 'bankingInfo' && step.status === 'complete'"
        >
          <StatusIcon status="complete" />
          <UiButton
            class="next-step-button"
            @click="handleStepChange('licenseAgreement')"
          >To review</UiButton>
        </template>
      </FormContent>
    </UiFormByStep>

    <UiModal v-if="isAgreementBlockerDialogOpen" @close="closeAgreementBlockerDialog">
      <div class="dialog" slot="main">
        <UiHeader level="2" :hasMargin="true">Please fill company info first</UiHeader>
        <p>
          We will consider your application,
          but you need to fill in the required fields about the company first.
        </p>
        <div class="dialog__controls">
          <UiButton @click="closeAgreementBlockerDialog">OK</UiButton>
        </div>
      </div>
    </UiModal>
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

.dialog {
  width: 450px;

  &__controls {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
  }
}

.next-step-button {
  margin-left: 10px;
}
</style>
