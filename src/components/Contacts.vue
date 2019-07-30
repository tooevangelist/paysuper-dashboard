<script>
import { email, required } from 'vuelidate/lib/validators';

function phone(val) {
  const regex = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
  return regex.test(val);
}

export default {
  name: 'Contacts',
  data() {
    return {
      agentFirstName: '',
      agentLastName: '',
      agentEmail: '',
      agentPatronymic: '',
      agentPhone: '',
      techFirstName: '',
      techLastName: '',
      techEmail: '',
      techPhone: '',
    };
  },
  validations: {
    agentFirstName: { required },
    agentLastName: { required },
    agentEmail: { email, required },
    agentPhone: { phone, required },
    techFirstName: { required },
    techLastName: { required },
    techEmail: { email, required },
    techPhone: { phone, required },
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit('contactsSubmit');
      }
    },
  },
};
</script>

<template>
<div class="contacts">
  <div class="section">
    <div class="title">Company Representative</div>
    <div class="info">
      Identify your company’s official representative person. He or she
      will be mentioned in legal documentation, signing documents,
      resolving banking and payment issues and will participate in possible disputes
      with your customers.
    </div>

    <UiTextField
      v-bind="$getValidatedFieldProps('agentFirstName')"
      label="First name"
      :value="agentFirstName"
      @input="agentFirstName = $event"
      @blur="$v.agentFirstName.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('agentLastName')"
      label="Last name"
      :value="agentLastName"
      @input="agentLastName = $event"
      @blur="$v.agentLastName.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('agentEmail')"
      label="Email"
      :value="agentEmail"
      @input="agentEmail = $event"
      @blur="$v.agentEmail.$touch()"
    />
    <UiTextField
      label="Patronymic"
      :value="agentPatronymic"
      @input="agentPatronymic = $event"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('agentPhone')"
      label="Phone"
      :value="agentPhone"
      @input="agentPhone = $event"
      @blur="$v.agentPhone.$touch()"
    />
  </div>

  <div class="section">
    <div class="title">Technical Specialist</div>
    <div class="info">
      Identify your technical representative, which will be in charge of technical integrations,
      customizing the technical settings and communicating with our tech. specialists.
    </div>

    <UiTextField
      v-bind="$getValidatedFieldProps('techFirstName')"
      label="First name"
      :value="techFirstName"
      @input="techFirstName = $event"
      @blur="$v.techFirstName.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('techLastName')"
      label="Last name"
      :value="techLastName"
      @input="techLastName = $event"
      @blur="$v.techLastName.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('techEmail')"
      label="Email"
      :value="techEmail"
      @input="techEmail = $event"
      @blur="$v.techEmail.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('techPhone')"
      label="Phone"
      :value="techPhone"
      @input="techPhone = $event"
      @blur="$v.techPhone.$touch()"
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
.contacts {
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
  min-width: 180px;
  align-self: flex-end;
  letter-spacing: 0.75px;
}
</style>
