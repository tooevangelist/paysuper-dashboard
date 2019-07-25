<script>
import SmartListItem from '@/components/SmartListItem.vue';

export default {
  name: 'AgreementProgressWidget',

  components: {
    SmartListItem,
  },

  data() {
    return {
      steps: [
        {
          title: '1. Complete “Account Info” about your сompany in “Settings” section',
          status: 'complete',
        },
        {
          title: '2. Complete “Contacts” about your company in “Settings” section',
          status: 'complete',
        },
        {
          title: '3. Complete “Banking Info” about your сompany in “Settings” section',
          status: 'complete',
        },
        {
          title: '4. Complete “Payment Methods” in “Settings” section',
          status: 'complete',
        },
        {
          title: '5. Complete “License Agreement” in “Settings” section',
          status: 'default',
          notice: 'Correct Company Info',
        },
        {
          title: '6. Create a project in “Projects” section',
          status: 'default',
          notice: 'Perform this Step',
        },
        {
          title: '7. Get your first Payout',
          status: 'locked',
          notice: 'After Previous Steps',
        },
      ],
    };
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
    v-for="(step, index) in steps"
    :key="index"
    :status="step.status"
    :notice="step.notice"
    :title="step.title"
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
