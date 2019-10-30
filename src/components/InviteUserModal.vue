<script>
import { email, maxLength, required } from 'vuelidate/lib/validators';

export default {
  name: 'InviteUserModal',

  data() {
    return {
      email: '',
      role: 'developer',
      roles: [
        {
          label: 'Developer',
          value: 'merchant_developer',
        },
        {
          label: 'Accounting',
          value: 'merchant_accounting',
        },
        {
          label: 'Support',
          value: 'merchant_support',
        },
        {
          label: 'View Only',
          value: 'merchant_view_only',
        },
      ],
    };
  },

  validations() {
    return {
      email: { maxLength: maxLength(100), email, required },
    };
  },
};
</script>

<template>
  <div>
    <UiModal width="448px" :hasCloseButton="true" @close="$emit('close')">
      <UiHeader
        slot="header"
        level="3"
        align="center"
      >
        Invitation
      </UiHeader>

      <div class="content">
        <div class="descr">
          Choose a specific role for new user and invitational letter will be sent to their Email.
        </div>

        <UiTextField
          v-bind="$getValidatedFieldProps('email')"
          v-model="email"
          type="email"
          label="Email"
          :required="true" />

        <UiSelect
          label="User role"
          :required="true"
          :options="roles"
          v-model="role"
        />
      </div>

      <div class="controls">
        <UiButton
          class="modal-button"
          color="blue"
          :disabled="$v.email.$invalid"
          @click="$emit('input', { email, role })"
        >
          CONFIRM
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>

<style lang="scss" scoped>
.content {
  padding: 0;

  .descr {
    text-align: center;
    width: 100%;
    font-size: 16px;
    margin-bottom: 16px;
  }
}

.modal-button {
  width: 100%;
}
</style>
