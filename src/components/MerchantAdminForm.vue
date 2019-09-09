<script>
import { filter } from 'lodash-es';
import MerchantAdminFormCompanyInfo from '@/components/MerchantAdminFormCompanyInfo.vue';
import MerchantAdminFormAgreement from '@/components/MerchantAdminFormAgreement.vue';
import MerchantFormAgreement from '@/components/MerchantFormAgreement.vue';
import MerchantAdminFormPaymentMethods from '@/components/MerchantAdminFormPaymentMethods.vue';

export default {
  name: 'MerchantAdminForm',

  components: {
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
      },
    };
  },

  computed: {
    isFormValid() {
      return !filter(this.steps, item => item.status !== 'complete' && item.isValidable).length;
    },
    currentStepItem() {
      return this.steps[this.currentStep];
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

    setStepStatus(/* name, isValid */) {
      // this.steps[name].status = isValid ? 'complete' : 'incomplete';
    },
  },
};
</script>

<template>
<div class="merchant-admin-form">
  <header class="header">
    <UiHeader level="2" :hasMargin="true">{{currentStepItem.label}}</UiHeader>
    <p class="text">{{currentStepItem.description}}</p>
  </header>

  <component
    v-for="(step, stepValue) in steps"
    :is="step.component"
    :key="stepValue"
    v-show="currentStep === stepValue"
    :merchant="merchant"
    :paymentMethods="stepValue === 'paymentMethods' ? paymentMethods : undefined"
    :agreementDocument="agreementDocument"
    :paymentMethodsSort="paymentMethodsSort"
    ref="forms"
    @validationResult="setStepStatus(stepValue, $event)"
    @requestAgreementChange="$emit('requestAgreementChange', $event)"
    @sendNotification="$emit('sendNotification', $event)"
    @sortPaymentMethods="$emit('sortPaymentMethods', $event)"
  >
    <div class="controls" slot="controls">
      <UiButton
        class="submit-button"
        text="SAVE"
        @click="$emit('submitForms')"
      />
    </div>
  </component>
</div>
</template>

<style lang="scss" scoped>
.merchant-admin-form {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 84px);
}

.header {
  margin-bottom: 32px;
}

.text {
  width: 448px;
}

.controls {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  width: 140px;
}
</style>
