<script>
import AccountInfo from '@/components/AccountInfo.vue';
import Contacts from '@/components/Contacts.vue';
import SmartListItem from '@/components/SmartListItem.vue';

export default {
  name: 'Company',
  components: {
    AccountInfo,
    Contacts,
    SmartListItem,
  },
  data() {
    return {
      steps: [
        {
          title: 'Account Info',
          notice: 'Incomplete',
          noticeStatus: 'warning',
          componentName: 'AccountInfo',
        },
        {
          title: 'Contacts',
          notice: 'Incomplete',
          noticeStatus: 'warning',
          componentName: 'Contacts',
        },
        {
          title: 'Banking Info',
          notice: 'Incomplete',
          noticeStatus: 'warning',
          componentName: 'BankingInfo',
        },
        {
          title: 'Payment Methods',
          status: 'locked',
          notice: 'After Previous Steps',
        },
        {
          title: 'License Agreement',
          status: 'locked',
          notice: 'After Previous Steps',
        },
      ],
    };
  },
};
</script>

<template>
<div class="company">
  <div class="title">Company</div>
  <div class="info">
    Please fill-in carefully official credentials of your company, because these data will be used
    in our future License Agreement formation. If you change any of these data in future after we
    sign license agreement please notify our support team about it.
  </div>

  <SmartListItem
    class="item"
    v-for="(step, index) in steps"
    v-bind="step"
    :key="index"
    :expandable="true"
  >
    <component v-if="step.componentName" :is="step.componentName" />
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
.info {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #5e6366;
  max-width: 548px;
  margin-bottom: 32px;
}
.item {
  margin-bottom: 8px;
}
</style>
