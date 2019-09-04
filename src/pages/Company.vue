<script>
import { mapState } from 'vuex';
import { reduce } from 'lodash-es';
import AccountInfo from '@/components/AccountInfo.vue';
import BankingInfo from '@/components/BankingInfo.vue';
import Contacts from '@/components/Contacts.vue';
import LicenseAgreement from '@/components/LicenseAgreement.vue';
import PaymentMethods from '@/components/PaymentMethods.vue';
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
    SmartListItem,
  },
  async asyncData({ store, registerStoreModule }) {
    try {
      await registerStoreModule('Company', CompanyStore);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },
  computed: {
    ...mapState('Company', ['completeStepsCount', 'steps']),
    ...mapState('User/Merchant', ['merchant']),

    isCompanyInfoLocked() {
      return this.completeStepsCount >= 3 && this.merchant.status === 0;
    },
    companyInfoStatuses() {
      return reduce(['company', 'contacts', 'banking'], (res, item) => ({
        ...res,
        [item]: {
          status: this.steps[item]
            ? 'complete'
            : this.isCompanyInfoLocked ? 'locked' : 'default',
          notice: this.steps[item] ? '' : 'Incomplete',
          noticeStatus: this.steps[item] ? 'default' : 'warning',
        },
      }), {});
    },
    isPaymentMethodsLocked() {
      return this.completeStepsCount <= 2 || this.merchant.status !== 0;
    },
    paymentMethodsStatus() {
      return {
        status: this.steps.tariff
          ? 'complete'
          : this.isPaymentMethodsLocked ? 'locked' : 'default',
        notice: this.steps.tariff
          ? ''
          : this.isPaymentMethodsLocked ? 'After Previous Steps' : 'Incomplete',
      };
    },
    isLicenseLocked() {
      return this.completeStepsCount <= 3;
    },
    licenseStatus() {
      return {
        status: this.merchant.status === 4
          ? 'complete'
          : this.isLicenseLocked ? 'locked' : 'default',
        notice: this.merchant.status === 4
          ? ''
          : this.isLicenseLocked ? 'After Previous Steps' : 'Incomplete',
      };
    },
    listItems() {
      return [
        {
          title: 'Account Info',
          componentName: 'AccountInfo',
          ...this.companyInfoStatuses.company,
        },
        {
          title: 'Contacts',
          componentName: 'Contacts',
          ...this.companyInfoStatuses.contacts,
        },
        {
          title: 'Banking Info',
          componentName: 'BankingInfo',
          ...this.companyInfoStatuses.banking,
        },
        {
          title: 'Payment Methods',
          componentName: 'PaymentMethods',
          ...this.paymentMethodsStatus,
        },
        {
          title: 'License Agreement',
          componentName: 'LicenseAgreement',
          ...this.licenseStatus,
        },
      ];
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

    <IconCompanyPage class="right" />
  </div>

  <SmartListItem
    class="item"
    v-for="(item, index) in listItems"
    v-bind="item"
    :key="index"
    :expandable="true"
  >
    <component v-if="item.componentName" :is="item.componentName" />
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
