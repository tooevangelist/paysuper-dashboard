<script>
import { includes } from 'lodash-es';

export default {
  name: 'LayoutHeader',
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
      statuses: {
        test: {
          title: 'Test Mode',
          text: 'You can sell products only after the signing of License Agreement and then your account will be “Active”',
        },
        active: {
          title: 'Active',
          text: '',
        },
      },
      infoItems: [
        { link: '#', icon: 'IconSupport', text: 'Support' },
        { link: '#', icon: 'IconQuestion', text: 'FAQ' },
        { link: '#', icon: 'IconDocumentation', text: 'Documentation' },
        { link: '#', icon: 'IconPen', text: 'Leave Feedback' },
      ],
    };
  },
  computed: {
    currentStatus() {
      return this.statuses[this.status] || {};
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
        @click="hasStatusOpened = !hasStatusOpened"
      >
        {{ currentStatus.title }}
        <IconQuestion
          v-if="status === 'test'"
          class="icon-question"
        />

        <UiTip
          innerPosition="left"
          position="bottom"
          width="calc(100vw - 100px)"
          maxWidth="280px"
          :visible="hasStatusOpened"
        >
          <div class="status-box">
            <div class="status-title">{{ currentStatus.title }}</div>
            <div class="status-text">{{ currentStatus.text }}</div>
          </div>
        </UiTip>
      </div>
    </div>
  </div>

  <div class="right">
    <a href="#" class="feedback">Leave Feedback About This Page</a>
    <a href="#" class="right-icon">
      <IconSettings />
    </a>
    <span
      class="right-icon"
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
    </span>
    <a href="#" class="right-icon">
      <IconNotify />
    </a>
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
  cursor: pointer;
  transition: color 0.2s ease-out;

  &._test {
    color: #f3aa18;
  }
  &._active {
    color: #2fa84f;
  }
  &._opened {
    color: #919699;
  }
}
.icon-question {
  fill: #f3aa18;
  margin-left: 6px;
  transition: fill 0.2s ease-out;

  .status._opened & {
    fill: #919699;
  }
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
.feedback {
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.4px;
  padding: 0 16px 0 0;
  border-right: 1px solid #e3e5e6;
}
.right-icon {
  width: 40px;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: 16px;
  background-color: transparent;
  transition: background-color 0.2s ease-out;
  cursor: pointer;
  position: relative;

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
</style>
