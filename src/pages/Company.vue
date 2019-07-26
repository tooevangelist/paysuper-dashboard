<script>
import SmartListItem from '@/components/SmartListItem.vue';

export default {
  name: 'Company',
  components: {
    SmartListItem,
  },
  data() {
    return {
      steps: [
        {
          title: 'Account Info',
          notice: 'Incomplete',
          noticeStatus: 'warning',
        },
        {
          title: 'Contacts',
          notice: 'Incomplete',
          noticeStatus: 'warning',
        },
        {
          title: 'Banking Info',
          notice: 'Incomplete',
          noticeStatus: 'warning',
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
    v-for="(step, index) in steps"
    :key="index"
    class="item"
    v-bind="step"
  />
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
  max-width: 566px;
  margin-bottom: 32px;
}
.item {
  margin-bottom: 8px;
}
</style>
