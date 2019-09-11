<script>
import { mapGetters, mapState } from 'vuex';
import { reduce } from 'lodash-es';
import AccountInfo from '@/components/AccountInfo.vue';
import BankingInfo from '@/components/BankingInfo.vue';
import Contacts from '@/components/Contacts.vue';
import LicenseAgreement from '@/components/LicenseAgreement.vue';
import PaymentMethods from '@/components/PaymentMethods.vue';
import PictureCompanyPage from '@/components/PictureCompanyPage.vue';
import SmartListItem from '@/components/SmartListItem.vue';
import CompanyStore from '@/store/CompanyStore';

export default {
  name: 'Company',
  components: {
    AccountInfo,
    BankingInfo,
    Contacts,
    LicenseAgreement,
    PaymentMethods,
    PictureCompanyPage,
    SmartListItem,
  },
  async asyncData({ store, registerStoreModule }) {
    try {
      await registerStoreModule('Company', CompanyStore);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
  data() {
    return {
      expandItems: {
        account: false,
        contacts: false,
        banking: false,
        tariff: false,
        license: false,
      },
    };
  },
  computed: {
    ...mapState('User/Merchant', ['onboardingCompleteStepsCount', 'onboardingSteps']),
    ...mapGetters('Company/LicenseAgreement', ['status']),

    isCompanyInfoLocked() {
      return this.onboardingCompleteStepsCount > 2;
    },
    companyInfoStatuses() {
      return reduce(['company', 'contacts', 'banking'], (res, item) => ({
        ...res,
        [item]: {
          status: this.onboardingSteps[item]
            ? 'complete'
            : this.isCompanyInfoLocked ? 'locked' : 'default',
          notice: this.onboardingSteps[item] ? '' : 'Incomplete',
          noticeStatus: this.onboardingSteps[item] ? 'default' : 'warning',
        },
      }), {});
    },
    isPaymentMethodsLocked() {
      return this.onboardingCompleteStepsCount < 3 || this.status !== 0;
    },
    paymentMethodsStatus() {
      return {
        status: this.onboardingSteps.tariff
          ? 'complete'
          : this.isPaymentMethodsLocked ? 'locked' : 'default',
        notice: this.onboardingSteps.tariff
          ? ''
          : this.isPaymentMethodsLocked ? 'After Previous Steps' : 'Incomplete',
      };
    },
    isLicenseLocked() {
      return this.onboardingCompleteStepsCount < 4;
    },
    licenseNotice() {
      return this.isLicenseLocked
        ? 'After Previous Steps'
        : this.status < 3 ? 'Not Signed' : 'Checking agreement…';
    },
    licenseStatus() {
      return {
        status: this.status === 4
          ? 'complete'
          : this.isLicenseLocked ? 'locked' : 'default',
        notice: this.status === 4
          ? ''
          : this.licenseNotice,
      };
    },
    listItems() {
      return {
        account: {
          title: 'Account Info',
          componentName: 'AccountInfo',
          ...this.companyInfoStatuses.company,
        },
        contacts: {
          title: 'Contacts',
          componentName: 'Contacts',
          ...this.companyInfoStatuses.contacts,
        },
        banking: {
          title: 'Banking Info',
          componentName: 'BankingInfo',
          ...this.companyInfoStatuses.banking,
        },
        tariff: {
          title: 'Payment Methods',
          componentName: 'PaymentMethods',
          ...this.paymentMethodsStatus,
        },
        license: {
          title: 'License Agreement',
          componentName: 'LicenseAgreement',
          ...this.licenseStatus,
        },
      };
    },
  },
  methods: {
    submited(key) {
      this.expandItems[key] = false;
      this.$appEvents.$emit('updateContentScroll');
    },
  },
};
</script>

<template>
<div class="company">
  <div class="wrapper">
    <div class="left">
      <div class="title">Company</div>

      <div class="info">
        Add the official credentials of your company. Please fill-in carefully,
        because these data will be used in our future License Agreement formation.
        If you decide to change any of these data in future after we sign license agreement
        please notify our support team about it.
      </div>
    </div>

    <PictureCompanyPage class="right" />
  </div>

  <SmartListItem
    class="item"
    v-for="(item, key) in listItems"
    v-bind="item"
    :key="key"
    :expandable="true"
    :isExpanded="expandItems[key]"
    @toggle="expandItems[key] = $event"
  >
    <component
      v-if="item.componentName"
      :is="item.componentName"
      @hasSubmit="submited(key)"
    />
  </SmartListItem>
</div>
</template>

<style lang="scss" scoped>
.company {
  padding: 12px 0;
}
.title {
  font-family: Quicksand;
  font-size: 34px;
  line-height: 42px;
  letter-spacing: 0.25px;
  margin-bottom: 12px;
  color: #000;
}
.wrapper {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
}
.left {
  margin-right: 48px;
}
.right {
  flex-basis: 28%;
  display: none;

  @media screen and (min-width: 768px) {
    display: block;
  }
}
.info {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #5e6366;
  max-width: 448px;
  margin-bottom: 32px;
}
.item {
  margin-bottom: 8px;
}
</style>
