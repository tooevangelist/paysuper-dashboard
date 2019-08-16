<script>
import { mapState } from 'vuex';
import { reduce } from 'lodash-es';
import SmartListItem from '@/components/SmartListItem.vue';

export default {
  name: 'AgreementProgressWidget',
  components: {
    SmartListItem,
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
    projectStatus() {
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
          title: '1. Complete “Account Info” about your сompany in “Settings” section',
          ...this.companyInfoStatuses.company,
        },
        {
          title: '2. Complete “Contacts” about your company in “Settings” section',
          ...this.companyInfoStatuses.contacts,
        },
        {
          title: '3. Complete “Banking Info” about your сompany in “Settings” section',
          ...this.companyInfoStatuses.banking,
        },
        {
          title: '4. Complete “Payment Methods” in “Settings” section',
          ...this.paymentMethodsStatus,
        },
        {
          title: '5. Complete “License Agreement” in “Settings” section',
          ...this.licenseStatus,
        },
        {
          title: '6. Create a project in “Projects” section',
          ...this.projectStatus,
        },
      ];
    },
  },
};
</script>

<template>
<div>
  <div class="welcome">
    <span class="welcome-icon">
      <IconWelcomeSheets />
    </span>
    <div class="welcome-texts">
      <UiHeader class="title" level="3">Welcome to Pay Super!</UiHeader>
      <p>
        This short list of actions is all you need to start your successful sales.
        Our KYC procedure is short and we ask you to fill-in some organisational info,
        send us e-request for License Agreement e-signing and that’s all.
        Follow this step-by-step guide below and get your first payouts in a week.
      </p>
    </div>
  </div>
  <SmartListItem
    class="item"
    v-for="(item, index) in listItems"
    :key="index"
    v-bind="item"
  />
</div>
</template>

<style lang="scss" scoped>
.welcome {
  display: flex;
  margin-bottom: 36px;
}
.welcome-texts {
  max-width: 566px;

  p {
    font-size: 14px;
    line-height: 20px;
    color: #5e6366;
  }
}
.welcome-icon {
  display: block;
  width: 212px;
  margin-right: 24px;
  padding-left: 27px;
  box-sizing: border-box;

  svg {
    vertical-align: top;
  }
}

.title {
  margin-bottom: 4px;
}
.item {
  margin-bottom: 8px;
}
</style>
