<script>
import { mapState } from 'vuex';
import { reduce } from 'lodash-es';
import PictureWelcomeSheets from '@/components/PictureWelcomeSheets.vue';
import SmartListItem from '@/components/SmartListItem.vue';

export default {
  name: 'AgreementProgressWidget',
  components: {
    PictureWelcomeSheets,
    SmartListItem,
  },
  computed: {
    ...mapState('User/Merchant', [
      'onboardingCompleteStepsCount',
      'onboardingSteps',
      'merchant',
      'hasProjects',
    ]),

    status() {
      return this.merchant.status;
    },
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
          : this.isLicenseLocked
            ? 'locked'
            : this.status === 3 ? 'waiting' : 'default',
        notice: this.status === 4
          ? ''
          : this.licenseNotice,
      };
    },
    isProjectLocked() {
      return this.status < 4;
    },
    projectStatus() {
      return {
        status: this.hasProjects
          ? 'complete'
          : this.isProjectLocked ? 'locked' : 'default',
        notice: this.hasProjects
          ? ''
          : this.isProjectLocked ? 'After Previous Steps' : 'Incomplete',
      };
    },
    listItems() {
      return [
        {
          title: '1. Complete “Account Info” about your сompany in “Settings” section',
          performText: 'Provide your official and public company names as well as your official site WEB address, so we could understand your company is related to a video games industry.',
          ...this.companyInfoStatuses.company,
        },
        {
          title: '2. Complete “Contacts” about your company in “Settings” section',
          performText: 'Identify your company’s official representative person. He or she will be mentioned in legal documentation, signing documents, resolving banking and payment issues and will participate in possible disputes with your customers.',
          ...this.companyInfoStatuses.contacts,
        },
        {
          title: '3. Complete “Banking Info” about your сompany in “Settings” section',
          performText: 'Enter your bank account details here to receive your payouts. First specify the SWIFT-code and we will fill-in your bank details automatically.',
          ...this.companyInfoStatuses.banking,
        },
        {
          title: '4. Complete “Payment Methods” in “Settings” section',
          performText: 'Choose payout currency and the main operational region, where you plan your main sales volume. This important choice will define your future money flow rates and commissions, so check the variants below carefully, since you will not be able to change these parameters in future.',
          ...this.paymentMethodsStatus,
        },
        {
          title: '5. Complete “License Agreement” in “Settings” section',
          performText: 'Here you can initiate a License Agreement signing procedure. Please double-check your Company info and Payment Methods above, since it will be mentioned in this document. For e-signing we use “Hellosign” service, which provides legally binding electronic signatures.',
          ...this.licenseStatus,
        },
        {
          title: '6. Create a project in “Projects” section',
          performText: 'There is your full list of projects here. Setup every parameter, add products, proceed with technical S2S integration to activate every project sales.',
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
      <PictureWelcomeSheets />
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
  <div
    v-for="(item, index) in listItems"
    :key="index"
    >
    <SmartListItem
      v-if="item.status !== 'complete'"
      class="item"
      v-bind="item"
      :expandable="true"
      :isExpanded="listItems[key]"
      @toggle="listItems[key] = $event"
    >
      <div class="perform" v-if="item.status === 'default'">
        <div class="perform__text">
          {{ item.performText }}
        </div>
        <div class="perform__button">
          <RouterLink to="/company" >
            <UiButton>
              PERFORM THIS STEP
            </UiButton>
          </RouterLink>
        </div>
      </div>
    </SmartListItem>
  </div>
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
    font-weight: 400;
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

.perform {
  &__text {
    color: #5E6366;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 8px;
  }
}
</style>
