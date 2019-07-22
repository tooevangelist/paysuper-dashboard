<script>
import { filter } from 'lodash-es';
import { required, maxLength } from 'vuelidate/lib/validators';
import { onlyRusAndLat } from '@/helpers/customValidators';


export default {
  name: 'UserProfileCompany',

  props: {
    profile: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      value: '',
      annualIncomeOptions: [
        {
          label: '0 - $1000',
          value: '0-1000',
        },
        {
          label: '$1000 - $10.000',
          value: '1000-10000',
        },
        {
          label: '$10.000 - $100.000',
          value: '10000-100000',
        },
        {
          label: '$100.000 - $1.000.000',
          value: '100000-1000000',
        },
        {
          label: 'More than $1.000.000',
          value: '1000000-0',
        },
      ],
      employeesNumberOptions: [
        {
          label: '1 - 10',
          value: '1-10',
        },
        {
          label: '11 - 50',
          value: '11-50',
        },
        {
          label: '51 - 100',
          value: '51-100',
        },
        {
          label: 'More than 100',
          value: '100-0',
        },
      ],
      activityKindOptions: [
        {
          label: 'Develop and publish your games',
          value: 'Develop and publish your games',
        },
        {
          label: 'Publish games of other companies',
          value: 'Publish games of other companies',
        },
        {
          label: 'Publish your games through other publishers',
          value: 'Publish your games through other publishers',
        },
        {
          label: 'Other',
          value: 'Other',
        },
      ],
      monetizationOptions: [
        {
          label: 'Paid subscriptions',
          valuePropName: 'paid_subscription',
        },
        {
          label: 'In-game advertising',
          valuePropName: 'in_game_advertising',
        },
        {
          label: 'In-game purchases',
          valuePropName: 'in_game_purchases',
        },
        {
          label: 'Premium access',
          valuePropName: 'premium_access',
        },
        {
          label: 'Other',
          valuePropName: 'other',
        },
      ],
      supportedPlatformsOptions: [
        {
          label: 'PC/MacOS',
          valuePropName: 'pc_mac',
        },
        {
          label: 'Game console',
          valuePropName: 'game_console',
        },
        {
          label: 'Mobile device',
          valuePropName: 'mobile_device',
        },
        {
          label: 'Web browser',
          valuePropName: 'web_browser',
        },
        {
          label: 'Other',
          valuePropName: 'other',
        },
      ],
    };
  },

  computed: {
    annualIncome: {
      get() {
        const value = this.profile.company.annual_income;
        if (!value) {
          return '';
        }
        return `${value.from}-${value.to}`;
      },
      set(value) {
        if (!value) {
          this.profile.company.annual_income = null;
        } else {
          const splittedValue = value.split('-');
          this.profile.company.annual_income = {
            from: Number(splittedValue[0]),
            to: Number(splittedValue[1]),
          };
        }
      },
    },
    employeesNumber: {
      get() {
        const value = this.profile.company.number_of_employees;
        if (!value) {
          return '';
        }
        return `${value.from}-${value.to}`;
      },
      set(value) {
        if (!value) {
          this.profile.company.number_of_employees = null;
        } else {
          const splittedValue = value.split('-');
          this.profile.company.number_of_employees = {
            from: Number(splittedValue[0]),
            to: Number(splittedValue[1]),
          };
        }
      },
    },
  },

  watch: {
    '$v.$invalid': function isInvalid(value) {
      this.$emit('valid', !value);
    },
  },

  validations() {
    const isAnyMonetizationChecked = () => filter(
      this.profile.company.monetization,
      item => item,
    ).length;
    const isAnyPlatformsChecked = () => filter(
      this.profile.company.platforms,
      item => item,
    ).length;

    return {
      profile: {
        company: {
          company_name: {
            required,
            maxLength: maxLength(60),
            onlyRusAndLat,
          },
          website: {
            required,
          },
          annual_income: {
            required,
          },
          number_of_employees: {
            required,
          },
          kind_of_activity: {
            required,
          },
          monetization: {
            paid_subscription: { isAnyMonetizationChecked },
            in_game_advertising: { isAnyMonetizationChecked },
            in_game_purchases: { isAnyMonetizationChecked },
            premium_access: { isAnyMonetizationChecked },
            other: { isAnyMonetizationChecked },
          },
          platforms: {
            pc_mac: { isAnyPlatformsChecked },
            game_console: { isAnyPlatformsChecked },
            mobile_device: { isAnyPlatformsChecked },
            web_browser: { isAnyPlatformsChecked },
            other: { isAnyPlatformsChecked },
          },
        },
      },
    };
  },

  mounted() {
    this.$v.$touch();
  },
};
</script>

<template>
<div class="user-profile-basic">
  <UiHeader
    align="center"
    :hasMargin="true"
    level="2"
  >Tell us about your company and games</UiHeader>
  <p class="text">
    A few more questions about your business in order <br>
    to determine the planned scope of work and allocate <br>
    the necessary resources in advance.
  </p>

  <div class="form-section">
    <UiTextField
      label="Company name"
      v-model="profile.company.company_name"
      :hasError="$isFieldInvalid('profile.company.company_name')"
      :errorText="$getFieldErrorMessages(
        'profile.company.company_name', ['maxLength', 'onlyRusAndLat']
      )"
    />
    <UiTextField
      label="Website"
      v-model="profile.company.website"
    />
    <UiSelect label="Annual income" v-model="annualIncome" :options="annualIncomeOptions" />
    <UiSelect
      label="Number of employees"
      v-model="employeesNumber"
      :options="employeesNumberOptions"
    />
  </div>

  <div class="form-section">
    <div class="subtitle">Kind of your activity:</div>
    <UiRadio
      class="checkbox-and-radio"
      v-for="item in activityKindOptions"
      v-model="profile.company.kind_of_activity"
      :key="item.value"
      :value="item.value"
    >
      {{item.label}}
    </UiRadio>
  </div>

  <div class="form-section">
    <div class="subtitle">What do you use for monetization:</div>
    <UiCheckbox
      class="checkbox-and-radio"
      v-for="item in monetizationOptions"
      v-model="profile.company.monetization[item.valuePropName]"
      :key="item.valuePropName"
    >
      {{item.label}}
    </UiCheckbox>
  </div>

  <div class="form-section">
    <div class="subtitle">Supported platforms:</div>
    <UiCheckbox
      class="checkbox-and-radio"
      v-for="item in supportedPlatformsOptions"
      v-model="profile.company.platforms[item.valuePropName]"
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
  margin-bottom: 24px;
}

.subtitle {
  font-size: 16px;
  line-height: 24px;
  color: #919699;
  margin-bottom: 16px;
}

.form-section {
  & + & {
    margin-top: 30px;
  }
}

.checkbox-and-radio {
  display: block;

  & + & {
    margin-top: 16px;
  }
}
</style>
