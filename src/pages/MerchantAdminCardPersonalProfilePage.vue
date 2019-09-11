<script>
import { mapState } from 'vuex';
import { omitBy, map } from 'lodash-es';
import SimplePageHeader from '@/components/SimplePageHeader.vue';
import PictureProfileAndPeople from '@/components/PictureProfileAndPeople.vue';
import MerchantProfileStore from '@/store/MerchantProfileStore';

export default {
  name: 'MerchantAdminCardPersonalProfilePage',

  components: {
    SimplePageHeader,
    PictureProfileAndPeople,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('MerchantProfile', MerchantProfileStore, route.params.id);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      helpOptions: {
        product_promotion_and_development: 'Product promotion and development',
        released_game_promotion: 'Games promotion that have already been released',
        international_sales: 'International sales',
        other: 'Other',
      },

      annualIncomeOptions: {
        '0-1000': '0 - $1000',
        '1000-10000': '$1000 - $10.000',
        '10000-100000': '$10.000 - $100.000',
        '100000-1000000': '$100.000 - $1.000.000',
        '1000000-0': 'More than $1.000.000',
      },
      employeesNumberOptions: {
        '1-10': '1 - 10',
        '11-50': '11 - 50',
        '51-100': '51 - 100',
        '100-0': 'More than 100',
      },
    };
  },

  computed: {
    ...mapState('MerchantProfile', ['profile']),

    helpText() {
      const checkedItems = omitBy(this.profile.help, item => !item);
      const wtf = map(checkedItems, (value, key) => `— ${this.helpOptions[key]}`);
      return wtf ? wtf.join('<br/>') : 'Not defined';
    },

    websiteText() {
      return `<a 
        target="_blank" 
        href="${this.profile.company.website}
      ">${this.profile.company.website}</a>`;
    },

    annualIncomeText() {
      if (!this.profile.company.annual_income) {
        return 'Not defined';
      }
      const { from, to } = this.profile.company.annual_income;
      return this.annualIncomeOptions[`${from}-${to}`];
    },

    employeesNumberText() {
      if (!this.profile.company.number_of_employees) {
        return 'Not defined';
      }
      const { from, to } = this.profile.company.number_of_employees;
      return this.employeesNumberOptions[`${from}-${to}`];
    },
  },
};
</script>

<template>
<div>
  <SimplePageHeader>
    <span slot="title">Personal Profile</span>
    <span slot="description">
      Initial onboarding information from merchant about his business
      and goals to understand how can we help him exactly.
    </span>
    <PictureProfileAndPeople slot="picture" />
  </SimplePageHeader>

  <UiPanel>
    <section class="section">
      <UiHeader level="3" :hasMargin="true">About merchant</UiHeader>
      <div class="columns">
        <UiTextFieldReadonly
          label="First name"
          :value="profile.personal.first_name"
        />
        <UiTextFieldReadonly
          label="Position or role"
          :value="profile.personal.position"
        />
      </div>
      <div class="columns">
        <UiTextFieldReadonly
          label="Last name"
          :value="profile.personal.last_name"
        />
      </div>
    </section>

    <section class="section">
      <UiHeader level="3" :hasMargin="true">How can we help</UiHeader>
      <UiTextFieldReadonly
        label="Merhant’s interested in"
        :value="helpText"
      />
    </section>

    <section class="section">
      <UiHeader level="3" :hasMargin="true">About company</UiHeader>
      <div class="columns">
        <UiTextFieldReadonly
          label="Company name"
          :value="profile.company.company_name"
        />
        <UiTextFieldReadonly
          label="Website"
          :value="websiteText"
        />
      </div>
      <div class="columns">
        <UiTextFieldReadonly
          label="Annual income"
          :value="annualIncomeText"
        />
        <UiTextFieldReadonly
          label="Number of employees"
          :value="employeesNumberText"
        />
      </div>
    </section>

  </UiPanel>
</div>
</template>

<style lang="scss" scoped>
.columns {
  display: flex;

  & > * {
    width: 50%;
  }
}

.section {
  padding-bottom: 20px;

  & + & {
    border-top: 1px solid #e3e5e6;
    padding-top: 32px;
  }
}
</style>
