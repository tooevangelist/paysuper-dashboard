<script>
import { mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import {
  UiTextField, UiHeader, UiTextarea, UiSelect,
} from '@protocol-one/ui-kit';

export default {
  name: 'MerchantFormCompanyInfo',

  components: {
    UiTextField,
    UiHeader,
    UiTextarea,
    UiSelect,
  },

  props: {
    merchant: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapGetters('Dictionaries', ['currenciesThreeLetters']),
  },

  validations: {
    merchant: {
      banking: {
        currency: {
          required,
        },
        name: {
          required,
        },
        address: {
          required,
        },
        account_number: {
          required,
        },
        swift: {
          required,
        },
        details: {
          required,
        },
      },
    },
  },

  mounted() {
    this.$emit('validationResult', !this.$v.$invalid);
    this.$watch('$v.$invalid', (value) => {
      this.$emit('validationResult', !value);
    });
  },

  methods: {
    validateForm() {
      this.$v.$touch();
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
  <div class="merchant-form-banking-info" id="merchant-banking-info">
    <UiHeader level="2" :hasMargin="true">
      Banking info
    </UiHeader>
    <div class="field-row">
      <UiSelect
        v-model="merchant.banking.currency"
        label="Payout currency"
        :options="currenciesThreeLetters"
        v-bind="getValidatedFieldProps('merchant.banking.currency')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.banking.name"
        label="Bank"
        v-bind="getValidatedFieldProps('merchant.banking.name')"
      />
    </div>
    <div class="field-row">
      <UiTextarea
        class="textarea"
        v-model="merchant.banking.address"
        label="Bank address"
        v-bind="getValidatedFieldProps('merchant.banking.address')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.banking.account_number"
        label="Account number"
        v-bind="getValidatedFieldProps('merchant.banking.account_number')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.banking.swift"
        label="SWIFT"
        v-bind="getValidatedFieldProps('merchant.banking.swift')"
      />
    </div>
    <div class="field-row">
      <UiTextarea
        class="textarea"
        v-model="merchant.banking.details"
        label="Correspondent bank details"
        v-bind="getValidatedFieldProps('merchant.banking.details')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.merchant-form-banking-info {
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
