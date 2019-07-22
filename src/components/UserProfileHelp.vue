<script>
import { filter } from 'lodash-es';

export default {
  name: 'UserProfileHelp',

  props: {
    profile: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      helpOptions: [
        {
          label: 'I need help with product promotion and development',
          valuePropName: 'product_promotion_and_development',
        },
        {
          label: 'I need help with games promotion that have already been released',
          valuePropName: 'released_game_promotion',
        },
        {
          label: 'I need help with international sales',
          valuePropName: 'international_sales',
        },
        {
          label: 'Other',
          valuePropName: 'other',
        },
      ],
    };
  },

  watch: {
    '$v.$invalid': function isInvalid(value) {
      this.$emit('valid', !value);
    },
  },

  validations() {
    const isAnyHelpChecked = () => filter(this.profile.help, item => item).length;
    return {
      profile: {
        help: {
          product_promotion_and_development: { isAnyHelpChecked },
          released_game_promotion: { isAnyHelpChecked },
          international_sales: { isAnyHelpChecked },
          other: { isAnyHelpChecked },
        },
      },
    };
  },
};
</script>

<template>
<div class="user-profile-basic">
  <UiHeader
    align="center"
    :hasMargin="true"
    level="2"
  >What can we do for you?</UiHeader>
  <p class="text">
    Tell us how we can help you. This will allow us to determine <br>
    the first steps of our future cooperation.
  </p>
  <div class="subtitle">Select one or more options:</div>
  <div class="form">
    <UiCheckbox
      class="checkbox"
      v-for="item in helpOptions"
      v-model="profile.help[item.valuePropName]"
      :key="item.valuePropName"
    >
      {{item.label}}
    </UiCheckbox>
  </div>
</div>
</template>

<style lang="scss" scoped>
.user-profile-basic {
}

.text {
  text-align: center;
  margin-bottom: 32px;
}

.subtitle {
  font-size: 16px;
  line-height: 24px;
  color: #919699;
  margin-bottom: 16px;
}

.form {
}

.checkbox {
  display: block;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  margin-bottom: 12px;
}
</style>
