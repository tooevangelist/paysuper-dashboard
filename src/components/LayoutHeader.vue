<script>
import { includes } from 'lodash-es';
import { directive as clickaway } from 'vue-clickaway';
import Notifications from '@/components/Notifications.vue';

export default {
  name: 'LayoutHeader',
  directives: {
    clickaway,
  },
  components: {
    Notifications,
  },
  props: {
    projectName: {
      required: true,
      type: String,
    },
    status: {
      default: 'test',
      type: String,
      validator(val) {
        return includes(['test', 'active'], val);
      },
    },
  },
  data() {
    return {
      hasStatusOpened: false,
      hasInfoOpened: false,
      hasNotificationsOpened: false,
      statusesTitles: {
        test: 'Test Mode',
        active: 'Active',
      },
      infoItems: [
        { link: '#', icon: 'IconSupport', text: 'Support' },
        { link: '#', icon: 'IconQuestion', text: 'FAQ' },
        { link: '#', icon: 'IconDocumentation', text: 'Documentation' },
        { link: '#', icon: 'IconPen', text: 'Leave Feedback' },
      ],
      notifications: [
        {
          id: 1,
          image: '',
          sender: 'Pay Super',
          text: `
            We've got your license agreement signing request.
            If we will need your further assistance, proceeding this request,
            our onboarding manager will contact you directly.
          `,
          timestamp: 1564549028934,
        },
        {
          id: 2,
          image: '',
          sender: 'Pay Super',
          text: `
            Your license agreement signing request is confirmed and document is signed by Pay Super
          `,
          timestamp: 1564549028934,
        },
      ],
    };
  },
  methods: {
    hideInfoBlock() {
      this.hasInfoOpened = false;
    },
    hideNotificationsBlock() {
      this.hasNotificationsOpened = false;
    },
    hideStatusBlock() {
      this.hasStatusOpened = false;
    },
  },
};
</script>

<template>
<div class="layout-header">
  <div class="left">
    <a href="#" class="logo">
      <IconLayoutLogo />
    </a>

    <div class="project">
      <a href="#" class="name">{{ projectName }}</a>
      <div
        :class="['status', `_${status}`, { '_opened': hasStatusOpened }]"
        v-clickaway="hideStatusBlock"
        @click="hasStatusOpened = !hasStatusOpened"
      >
        {{ statusesTitles[status] }}
        <template v-if="status === 'test'">
          <IconQuestion class="icon-question" />

          <UiTip
            innerPosition="left"
            position="bottom"
            width="calc(100vw - 100px)"
            maxWidth="280px"
            :visible="hasStatusOpened"
          >
            <div class="status-box">
              <div class="status-title">Test Mode</div>
              <div class="status-text">
                You can start your sales only after License Agreement will be signed by both
                our sides and your account become “<span class="filled-text">Active</span>”.
              </div>
            </div>
          </UiTip>
        </template>
      </div>
    </div>
  </div>

  <div class="right">
    <a href="#" class="feedback">Feedback about this page?</a>
    <a href="#" class="right-icon">
      <IconSettings />
    </a>

    <div
      :class="['right-icon', { '_active': hasInfoOpened }]"
      v-clickaway="hideInfoBlock"
      @click="hasInfoOpened = !hasInfoOpened"
    >
      <IconInfo />

      <UiTip
        innerPosition="right"
        position="bottom"
        width="calc(100vw - 140px)"
        maxWidth="220px"
        :visible="hasInfoOpened"
      >
        <div class="info-box">
          <a
            v-for="(item, index) in infoItems"
            :key="index"
            class="info-item"
            :href="item.link"
          >
            <component :is="item.icon" class="info-icon" />
            <div class="info-text">{{ item.text }}</div>
          </a>
        </div>
      </UiTip>
    </div>

    <div
      :class="['right-icon', { '_active': hasNotificationsOpened }]"
      v-clickaway="hideNotificationsBlock"
    >
      <div
        class="notify-icon"
        @click="hasNotificationsOpened = !hasNotificationsOpened"
      >
        <IconNotify />
        <div
          v-if="notifications.length"
          class="notify-count"
        >
          {{ notifications.length }}
        </div>
      </div>

      <UiTip
        innerPosition="right"
        position="bottom"
        width="calc(100vw - 140px)"
        maxWidth="400px"
        :visible="hasNotificationsOpened"
      >
        <Notifications :items="notifications" />
      </UiTip>
    </div>

    <a href="#" class="right-icon icon-user">
      <IconUser />
    </a>
  </div>
</div>
</template>

<style lang="scss" scoped>
.layout-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  width: 100%;
  padding: 4px 16px;
  background: #fff;
  box-shadow: 0px 1px 2px rgba(8, 35, 48, 0.24), 0px 2px 6px rgba(8, 35, 48, 0.16);
  flex-wrap: wrap;
  align-content: stretch;
  z-index: 20;
}
.left,
.right {
  display: flex;
  align-content: center;
  align-items: center;
  padding: 8px 0;
}
.left {
  margin-right: 16px;
}
.logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #c6cacc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  text-decoration: none;
}
.project {
  display: flex;
  flex-direction: column;
}
.name {
  color: #5e6366;
  font-family: Quicksand;
  font-weight: 500;
  letter-spacing: 0.44px;
  font-size: 16px;
  line-height: 24px;
  text-decoration: none;
}
.status {
  position: relative;
  display: flex;
  align-content: center;
  align-items: center;
  font-family: Roboto;
  letter-spacing: 0.4px;
  font-size: 12px;
  line-height: 16px;
  transition: color 0.2s ease-out;

  &._test {
    color: #f3aa18;
    cursor: pointer;
  }
  &._active {
    color: #2fa84f;
  }
}
.icon-question {
  fill: #f3aa18;
  margin-left: 6px;
  transition: fill 0.2s ease-out;
}
.status-box {
  padding: 24px;
}
.status-title {
  font-family: Quicksand;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0.15px;
  color: #f3aa18;
}
.status-text {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #3E4345;
  margin-top: 16px;
}
.filled-text {
  color: #069697;
}
.feedback {
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.4px;
  padding: 0 16px 0 0;
  border-right: 1px solid #e3e5e6;
}
.right-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  margin-left: 16px;
  background-color: transparent;
  transition: background-color 0.2s ease-out;
  cursor: pointer;
  position: relative;

  &._active,
  &:hover {
    background-color: #f1f3f4;
  }
}
.icon-user {
  border: 1px solid #c6cacc;
}
.info-box {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
}
.info-item {
  display: flex;
  height: 40px;
  background-color: transparent;
  align-content: center;
  align-items: center;
  transition: background-color 0.2s ease-out, color 0.2s ease-out;
  color: #000;
  cursor: pointer;

  &:hover {
    background-color: rgba(#3d7bf5, 0.1);
  }
}
.info-icon {
  margin-left: 20px;
  margin-right: 22px;
  width: 16px;
  height: 16px;

  .info-item:hover & {
    fill: #3d7bf5;
  }
}
.notify-icon {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.notify-count {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -4px;
  right: -2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background-color: #3d7bf5;
}
</style>
