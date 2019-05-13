<script>
import randomString from 'random-string';
import { required, minLength, url } from 'vuelidate/lib/validators';
import {
  UiButton, UiTextField, UiHeader, UiTextarea, UiSwitchBox,
} from '@protocol-one/ui-kit';
import LangTextField from '@/components/LangTextField.vue';
import CoverImage from '@/components/CoverImage.vue';

import { isEmpty } from 'lodash-es';

export default {
  name: 'ProjectFormSettings',

  components: {
    UiTextField,
    UiButton,
    UiHeader,
    UiTextarea,
    UiSwitchBox,
    LangTextField,
    CoverImage,
  },

  props: {
    project: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      isPaymentsRestricted: !isEmpty(this.project.create_invoice_allowed_urls),
    };
  },

  computed: {
    createInvoiceAllowedUrls: {
      get() {
        return (this.project.create_invoice_allowed_urls || []).join('\n');
      },

      set(value) {
        this.project.create_invoice_allowed_urls = value ? value.split('\n') : [];
      },
    },
  },

  validations() {
    const rules = {
      project: {
        name: {
          en: {
            required,
          },
        },
        url_check_account: {
          required,
          url,
        },
        url_process_payment: {
          required,
          url,
        },
        url_redirect_success: {
          required,
          url,
        },
        url_redirect_fail: {
          required,
          url,
        },
        secret_key: {
          required,
          minLength: minLength(12),
        },
      },
    };

    // if (!this.initialEmail) {
    //   rules.email = {
    //     required,
    //     email,
    //   };
    // }

    // if (!this.isBankCardPayment) {
    //   rules.ewallet = {
    //     wrongFormatType(value) {
    //       if (!this.activePaymentMethod.account_regexp) {
    //         return true;
    //       }
    //       return getRegexp(this.activePaymentMethod.account_regexp).test(value);
    //     },
    //   };
    // }

    return rules;
  },

  methods: {
    validateForm() {
      this.$v.$touch();
      // const isValidArray = [
      //   !this.$v.$invalid,
      // ];

      // if (this.isBankCardPayment) {
      //   const { isValid } = this.$refs.bankCardForm.validate();
      //   isValidArray.push(isValid);
      // }

      // if (isValidArray.filter(item => !item).length) {
      //   // has errors
      //   return;
      // }
      this.$watch('$v.$invalid', (value) => {
        this.$emit('validationResult', !value);
      });
      this.$emit('validationResult', !this.$v.$invalid);
    },

    generateSecretKey() {
      this.project.secret_key = randomString({
        length: 15,
        special: true,
        exclude: ['`', '/', '\\'],
      });
    },

    getValidatedFieldProps(path) {
      return {
        required: true,
        hasError: this.$isFieldInvalid(path),
        errorText: this.$getFieldErrorMessages(path),
      };
    },
  },
};
</script>

<template>
  <div class="project-form-settings">
    <UiHeader level="2" :hasMargin="true">Settings</UiHeader>

    <CoverImage value=""></CoverImage>

    <div class="field-row">
      <LangTextField
        :value="project.name"
        label="Project name"
        v-bind="getValidatedFieldProps('project.name.en')"
      />
    </div>

    <div class="field-row">
      <UiTextField
        v-model="project.url_check_account"
        label="Validation request URL"
        v-bind="getValidatedFieldProps('project.url_check_account')"
      />
    </div>

    <div class="field-row">
      <UiTextField
        v-model="project.url_process_payment"
        label="Payment notifications URL"
        v-bind="getValidatedFieldProps('project.url_process_payment')"
      />
    </div>

    <div class="field-row">
      <UiTextField
        v-model="project.url_redirect_success"
        label="Success redirect URL"
        v-bind="getValidatedFieldProps('project.url_redirect_success')"
      />
    </div>

    <div class="field-row">
      <UiTextField
        v-model="project.url_redirect_fail"
        label="Failed attempt redirect URL"
        v-bind="getValidatedFieldProps('project.url_redirect_fail')"
      />
    </div>

    <div class="field-row">
      Restrict payment attempts
      <UiSwitchBox class="switch-box" v-model="isPaymentsRestricted" />
    </div>

    <div class="field-row" v-if="isPaymentsRestricted">
      <UiTextarea class="textarea" label="Allowed URLs" v-model="createInvoiceAllowedUrls" />
      <!--
        Request for creation order will be possible only from the URLs specified here.
        List URLs through comma.
      -->
    </div>

    <div class="field-row">
      <UiTextField
        v-model="project.secret_key"
        label="Secret key"
        v-bind="getValidatedFieldProps('project.secret_key')"
      />
      <UiButton class="generate-button" @click="generateSecretKey">Generate</UiButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project-form-settings {
  width: 528px;
}

.field-row {
  display: flex;
  align-items: center;
}

.switch-box {
  margin-left: 16px;
}

.textarea {
  width: 100%;
}

.generate-button {
  margin-left: 30px;
}
</style>
