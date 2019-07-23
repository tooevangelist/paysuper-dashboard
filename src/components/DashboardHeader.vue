<script>
import { includes } from 'lodash-es';

export default {
  name: 'DashboardHeader',
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
      statusNames: {
        test: 'Test Mode',
        active: 'Active',
      },
    };
  },
};
</script>

<template>
<UiPageHeader>
  <template slot="left">
    <a href="#" class="logo">
      <IconDashboardLogo />
    </a>

    <div class="project">
      <a href="#" class="name">{{ projectName }}</a>
      <div
        :class="['status', `_${status}`, { '_opened': hasStatusOpened }]"
        @click="hasStatusOpened = !hasStatusOpened"
      >
        {{ statusNames[status] }}
        <IconQuestion
          v-if="status === 'test'"
          class="icon-question"
        />
      </div>
    </div>
  </template>
  <template slot="right">
    <a href="#" class="feedback">Leave Feedback About This Page</a>
    <a href="#" class="right-icon">
      <IconSettings />
    </a>
    <a href="#" class="right-icon">
      <IconInfo />
    </a>
    <a href="#" class="right-icon">
      <IconNotify />
    </a>
    <a href="#" class="right-icon icon-user">
      <IconUser />
    </a>
  </template>
</UiPageHeader>
</template>

<style lang="scss" scoped>
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

  &:hover {
    background-color: #f1f3f4;
  }
}
.icon-user {
  border: 1px solid #c6cacc;
}
</style>
