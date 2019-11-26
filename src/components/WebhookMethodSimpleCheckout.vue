<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'WebhookMethodSimpleCheckout',

  data() {
    return {
      form: {
        userId: null,
        transactionId: null,
        amount: null,
        currency: null,
      },
    };
  },

  validations: {
    form: {
      userId: {
        required,
      },
      transactionId: {
        required,
      },
      amount: {
        required,
      },
      currency: {
        required,
      },
    },
  },
};
</script>

<template>
  <div>
    <UiTextField
      label="User ID"
      :required="true"
      v-model="form.userId"
      v-bind="$getValidatedFieldProps('form.userId')"/>
    <UiTextField
      label="Transaction ID"
      :required="true"
      v-model="form.transactionId"
      v-bind="$getValidatedFieldProps('form.transactionId')"/>
    <UiTextField
      label="Amount"
      :required="true"
      v-model="form.amount"
      v-bind="$getValidatedFieldProps('form.amount')"/>
    <UiTextField
      label="Currency"
      :required="true"
      v-model="form.currency"
      v-bind="$getValidatedFieldProps('form.currency')"/>

    <div class="controls">
      <UiButton
        class="test-button"
        :disabled="$v.form.$invalid"
        @click="$emit('input', { ...form,  type: 'simple'})"
        text="TEST"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.controls {
  margin-top: 36px;
  display: flex;
  justify-content: flex-end;
}

.test-button {
  width: 140px;
}
</style>
