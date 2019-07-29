<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'BankingInfo',
  data() {
    return {
      swift: '',
      currency: '',
      bankAccount: '',
      bankName: '',
      bankAddress: '',
      corBankAccount: '',
    };
  },
  validations: {
    swift: { required },
    currency: { required },
    bankAccount: { required },
    bankName: { required },
    bankAddress: { required },
  },
  computed: {
    currencies() {
      return [
        { label: 'RUB', value: 'RUB' },
        { label: 'USD', value: 'USD' },
        { label: 'GBR', value: 'GBR' },
      ];
    },
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit('bankingInfoSubmit');
      }
    },
  },
};
</script>

<template>
<div class="banking-info">
  <div class="section">
    <div class="title">Account Details</div>
    <div class="info">
      Enter your bank account details here to receive your payouts.
      First specify the SWIFT-code and we will fill-in your bank details automatically.
    </div>

    <UiTextField
      v-bind="$getValidatedFieldProps('swift')"
      label="SWIFT"
      :value="swift"
      @input="swift = $event"
      @blur="$v.swift.$touch()"
    />
    <UiSelect
      v-bind="$getValidatedFieldProps('currency')"
      label="Account Currency"
      :options="currencies"
      :value="currency"
      @input="currency = $event"
      @blur="$v.currency.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('bankAccount')"
      label="Beneficiary’s bank account"
      :value="bankAccount"
      @input="bankAccount = $event"
      @blur="$v.bankAccount.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('bankName')"
      label="Beneficiary’s bank name"
      :value="bankName"
      @input="bankName = $event"
      @blur="$v.bankName.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('bankAddress')"
      label="Beneficiary’s bank address"
      :value="bankAddress"
      @input="bankAddress = $event"
      @blur="$v.bankAddress.$touch()"
    />
    <UiTextField
      label="Correspondent bank account"
      :value="corBankAccount"
      @input="corBankAccount = $event"
    />
  </div>

  <UiButton
    class="submit"
    :disabled="$v.$invalid"
    @click="submit"
  >
    SUBMIT INFO
  </UiButton>
</div>
</template>

<style lang="scss" scoped>
.banking-info {
  display: flex;
  flex-direction: column;
}
.section {
  margin-bottom: 12px;
}
.title {
  font-family: Quicksand;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0.15px;
  color: #000;
  margin-bottom: 8px;
}
.info {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #5e6366;
  margin-bottom: 20px;
  max-width: 548px;
}
.submit {
  width: 180px;
  align-self: flex-end;
}
</style>
