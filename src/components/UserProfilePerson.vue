<script>
import { required, maxLength } from 'vuelidate/lib/validators';
import { onlyRusAndLat } from '@/helpers/customValidators';

export default {
  name: 'UserProfileBasic',

  props: {
    profile: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      positionOptions: [
        {
          label: 'CEO',
          value: 'CEO',
        },
        {
          label: 'CTO',
          value: 'CTO',
        },
        {
          label: 'CMO',
          value: 'CMO',
        },
        {
          label: 'CFO',
          value: 'CFO',
        },
        {
          label: 'Project Management',
          value: 'Project Management',
        },
        {
          label: 'Generic Management',
          value: 'Generic Management',
        },
        {
          label: 'Software Developer',
          value: 'Software Developer',
        },
        {
          label: 'Marketing',
          value: 'Marketing',
        },
        {
          label: 'Support',
          value: 'Support',
        },
      ],
    };
  },

  validations: {
    profile: {
      personal: {
        first_name: {
          required,
          maxLength: maxLength(30),
          onlyRusAndLat,
        },
        last_name: {
          required,
          maxLength: maxLength(30),
          onlyRusAndLat,
        },
        position: {
          required,
        },
      },
    },
  },

  watch: {
    '$v.$invalid': function isInvalid(value) {
      this.$emit('valid', !value);
    },
  },

  mounted() {
    this.$v.$touch();
    this.$emit('valid', !this.$v.$invalid);
  },
};
</script>

<template>
<div class="user-profile-basic">
  <UiHeader
    align="center"
    :hasMargin="true"
    level="2"
  >Tell us about yourself</UiHeader>
  <p class="text">
    We look forward to getting to know you a little better. <br>
    Please tell us how to contact you and what role you play in <br>
    your company.
  </p>
  <UiTextField
    label="First name"
    v-model="profile.personal.first_name"
    :required="true"
    :hasError="$isFieldInvalid('profile.personal.first_name')"
    :errorText="$getFieldErrorMessages(
      'profile.personal.first_name', ['maxLength', 'onlyRusAndLat']
    )"
  />
  <UiTextField
    label="Last name"
    v-model="profile.personal.last_name"
    :required="true"
    :hasError="$isFieldInvalid('profile.personal.last_name')"
    :errorText="$getFieldErrorMessages(
      'profile.personal.last_name', ['maxLength', 'onlyRusAndLat']
    )"
  />
  <UiSelect
    label="Your position or role"
    :required="true"
    :options="positionOptions"
    v-model="profile.personal.position"
  />
</div>
</template>

<style lang="scss" scoped>
.user-profile-basic {
}

.text {
  text-align: center;
}
</style>
