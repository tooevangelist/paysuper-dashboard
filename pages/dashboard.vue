<template>
  <Page>
    <span slot="header-title">Dashboard</span>

    <FormByStep :steps="steps" v-model="currentStep" v-if="false">
      <template v-if="currentStep === 'company'">
        <TextField v-model="test11" label="Test 11" />
        <TextField v-model="test12" label="Test 12" />
      </template>
      <TextField v-if="currentStep === 'contacts'" v-model="test2" label="Test 2" />
      <TextField v-if="currentStep === 'banking'" v-model="test3" label="Test 3" />

      <div slot="side-footer" v-if="isFormComplete">
        You have finished filling out company details, send them for review
        <div style="text-align: center; margin-top: 20px; ">
          <Button>Finish</Button>
        </div>
      </div>
    </FormByStep>
  </Page>
</template>

<script>
import Page from '@/components/Page.vue';
import { Button, TextField, FormByStep } from '@protocol-one/ui-kit';

export default {
  components: {
    Page,
    FormByStep,
    TextField,
    Button,
  },

  data() {
    return {
      currentStep: 'company',
      test11: '',
      test12: '',
      test2: '',
      test3: '',
    };
  },

  computed: {
    steps() {
      return [
        {
          value: 'company',
          label: 'Company',
          status: this.companyStepStatus,
        },
        {
          value: 'contacts',
          label: 'Contacts',
          status: this.isContactsStepComplete ? 'complete' : 'initial',
        },
        {
          value: 'banking',
          label: 'Banking info',
          status: this.isBankigStepComplete ? 'complete' : 'initial',
        },
      ];
    },

    companyStepStatus() {
      if (this.test11 && this.test12) {
        return 'complete';
      }

      if (this.test11 || this.test12) {
        return 'incomplete';
      }

      return 'initial';
    },

    isContactsStepComplete() {
      return this.test2;
    },

    isBankigStepComplete() {
      return this.test3;
    },

    isFormComplete() {
      return !this.steps.filter(item => item.status !== 'complete').length;
    },
  },
};
</script>
