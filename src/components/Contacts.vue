<script>
import { mapActions, mapState } from 'vuex';
import { email, maxLength, required } from 'vuelidate/lib/validators';
import { onlyRusAndLat, phone } from '@/helpers/customValidators';
import Notifications from '@/mixins/Notifications';

export default {
  name: 'Contacts',
  mixins: [Notifications],
  validations: {
    contacts: {
      authorized: {
        name: { onlyRusAndLat, maxLength: maxLength(30), required },
        email: { maxLength: maxLength(100), email, required },
        phone: { maxLength: maxLength(20), phone, required },
        position: { onlyRusAndLat, maxLength: maxLength(30), required },
      },
      technical: {
        name: { onlyRusAndLat, maxLength: maxLength(30), required },
        email: { maxLength: maxLength(100), email, required },
        phone: { maxLength: maxLength(20), phone, required },
      },
    },
  },
  computed: {
    ...mapState('Company/Contacts', ['contacts']),
    ...mapState('User/Merchant', ['merchant']),

    status() {
      return this.merchant.status;
    },
  },
  async mounted() {
    try {
      await this.initState();
    } catch (error) {
      this.$_Notifications_showErrorMessage(error);
    }
  },
  methods: {
    ...mapActions('Company/Contacts', ['initState', 'updateContacts', 'submitContacts']),

    updateField(type, key, value) {
      this.updateContacts({
        ...this.contacts,
        [type]: {
          ...this.contacts[type],
          [key]: value,
        },
      });
    },
    async submit() {
      this.$v.contacts.$touch();
      if (!this.$v.contacts.$invalid) {
        try {
          const hasSubmit = await this.submitContacts();

          if (hasSubmit) {
            this.$emit('hasSubmit');
          }
        } catch (error) {
          this.$_Notifications_showErrorMessage(error);
        }
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
      v-bind="$getValidatedFieldProps('contacts.authorized.name')"
      label="Name"
      :value="contacts.authorized.name"
      @input="updateField('authorized', 'name', $event)"
      @blur="$v.contacts.authorized.name.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('contacts.authorized.position')"
      label="Position"
      :value="contacts.authorized.position"
      @input="updateField('authorized', 'position', $event)"
      @blur="$v.contacts.authorized.position.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('contacts.authorized.email')"
      label="Email"
      :value="contacts.authorized.email"
      @input="updateField('authorized', 'email', $event)"
      @blur="$v.contacts.authorized.email.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('contacts.authorized.phone')"
      label="Phone"
      :value="contacts.authorized.phone"
      @input="updateField('authorized', 'phone', $event)"
      @blur="$v.contacts.authorized.phone.$touch()"
    />
  </div>

  <div class="section">
    <div class="title">Technical Specialist</div>
    <div class="info">
      Identify your technical representative, which will be in charge of technical integrations,
      customizing the technical settings and communicating with our tech. specialists.
    </div>

    <UiTextField
      v-bind="$getValidatedFieldProps('contacts.technical.name')"
      label="Name"
      :value="contacts.technical.name"
      @input="updateField('technical', 'name', $event)"
      @blur="$v.contacts.technical.name.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('contacts.technical.email')"
      label="Email"
      :value="contacts.technical.email"
      @input="updateField('technical', 'email', $event)"
      @blur="$v.contacts.technical.email.$touch()"
    />
    <UiTextField
      v-bind="$getValidatedFieldProps('contacts.technical.phone')"
      label="Phone"
      :value="contacts.technical.phone"
      @input="updateField('technical', 'phone', $event)"
      @blur="$v.contacts.technical.phone.$touch()"
    />
  </div>

  <UiButton
    class="submit"
    :disabled="$v.contacts.$invalid || status !== 0"
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
