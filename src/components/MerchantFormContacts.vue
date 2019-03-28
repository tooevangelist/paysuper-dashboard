<script>
import { required, email } from 'vuelidate/lib/validators';
import {
  UiTextField, UiHeader,
} from '@protocol-one/ui-kit';

export default {
  name: 'MerchantFormCompanyInfo',

  components: {
    UiTextField,
    UiHeader,
  },

  props: {
    merchant: {
      required: true,
      type: Object,
    },
  },

  validations: {
    merchant: {
      contacts: {
        authorized: {
          name: {
            required,
          },
          email: {
            required,
            email,
          },
          position: {
            required,
          },
        },
      },
    },
  },

  methods: {
    validateForm() {
      this.$v.$touch();

      this.$watch('$v.$invalid', (value) => {
        this.$emit('validationResult', !value);
      });
      this.$emit('validationResult', !this.$v.$invalid);
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
  <div class="merchant-form-contacts">
    <UiHeader level="2" :hasMargin="true">Contacts</UiHeader>
    <div class="field-row">
      <UiTextField
        v-model="merchant.contacts.authorized.name"
        label="Authorized person full name"
        v-bind="getValidatedFieldProps('merchant.contacts.authorized.name')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.contacts.authorized.position"
        label="Authorized person position"
        v-bind="getValidatedFieldProps('merchant.contacts.authorized.position')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.contacts.authorized.email"
        label="Email"
        v-bind="getValidatedFieldProps('merchant.contacts.authorized.email')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.contacts.authorized.phone"
        label="Phone"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.contacts.technical.name"
        label="Technical specialist name"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.contacts.technical.email"
        label="Technical specialist email"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.contacts.technical.phone"
        label="Technical specialist phone"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.merchant-form-contacts {
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
