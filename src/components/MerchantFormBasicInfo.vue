<script>
import { mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import {
  UiTextField, UiHeader, UiSelect,
} from '@protocol-one/ui-kit';

export default {
  name: 'MerchantFormCompanyInfo',

  components: {
    UiTextField,
    UiHeader,
    UiSelect,
  },

  props: {
    merchant: {
      required: true,
      type: Object,
    },
  },

  computed: {
    ...mapGetters('Dictionaries', ['countriesTwoLetters']),
  },

  validations: {
    merchant: {
      name: {
        required,
      },
      country: {
        required,
      },
      zip: {
        required,
      },
      city: {
        required,
      },
      address: {
        required,
      },
      registration_number: {
        required,
      },
      tax_id: {
        required,
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
  <div class="merchant-form-basic-info">
    <UiHeader level="2" :hasMargin="true">Company</UiHeader>

    <div class="field-row">
      <UiTextField
        v-model="merchant.name"
        label="Company name"
        v-bind="getValidatedFieldProps('merchant.name')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.alternative_name"
        label="Doing business as (alternative name)"
      />
    </div>
    <div class="field-row">
      <UiSelect
        v-model="merchant.country"
        label="Country"
        :options="countriesTwoLetters"
        v-bind="getValidatedFieldProps('merchant.country')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.state"
        label="State / Province / Region"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.zip"
        label="ZIP code"
        v-bind="getValidatedFieldProps('merchant.zip')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.city"
        label="City"
        v-bind="getValidatedFieldProps('merchant.city')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.address"
        label="Address"
        v-bind="getValidatedFieldProps('merchant.address')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.address_additional"
        label="Address line 2"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.registration_number"
        label="Registration number"
        v-bind="getValidatedFieldProps('merchant.registration_number')"
      />
    </div>
    <div class="field-row">
      <UiTextField
        v-model="merchant.tax_id"
        label="Tax ID / EIN / TIN"
        v-bind="getValidatedFieldProps('merchant.tax_id')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.merchant-form-basic-info {
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
