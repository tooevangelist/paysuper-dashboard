<script>
import { includes } from 'lodash-es';

export default {
  name: 'SmartListItem',

  props: {
    title: {
      type: String,
      default: '',
    },
    notice: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'default',
      validator(value) {
        return includes(['default', 'waiting', 'complete', 'locked'], value);
      },
    },

    noticeStatus: {
      type: String,
      default: 'default',
      validator(value) {
        return includes(['default', 'waiting', 'warning'], value);
      },
    },

    expandable: {
      type: Boolean,
      default: false,
    },

    isExpanded: {
      type: Boolean,
      default: false,
    },

    link: {
      type: [Object, String],
    },
  },

  data() {
    return {
      isExpandedInner: this.isExpanded,
    };
  },

  computed: {
    isRouterLink() {
      if (this.link && this.link.router !== false) {
        return true;
      }
      return false;
    },
    tagName() {
      if (!this.link) {
        return 'div';
      }

      if (this.isRouterLink) {
        return 'RouterLink';
      }

      return 'a';
    },

    url() {
      if (!this.link) {
        return undefined;
      }
      return typeof this.link === 'string' ? this.link : this.link.url;
    },
  },

  watch: {
    isExpanded(value) {
      this.isExpandedInner = value;
    },
  },

  methods: {
    handleClick() {
      if (this.expandable) {
        this.isExpandedInner = !this.isExpandedInner;
      }
    },
  },
};
</script>

<template>
<component
  class="smart-list-item"
  :class="[
    `_status-${status}`,
    `_notice-status-${noticeStatus}`,
    { '_clickable': expandable || url },
    { '_expanded': isExpandedInner }
  ]"
  :is="tagName"
  :to="isRouterLink ? url : undefined"
  :href="url"
>
  <div
    class="head"
    @click="handleClick"
  >
    <div class="title">
      <span class="icon-holder">
        <IconParagraphPointer class="icon" v-if="status === 'default'" />
        <IconClock class="icon" v-if="status === 'waiting'" />
        <IconCheckInCircle class="icon" v-if="status === 'complete'" />
        <IconShadyLock class="icon" v-if="status === 'locked'" />
      </span>
      <span class="text">
        {{title}}
        <slot name="title"></slot>
      </span>
    </div>
    <span class="notice">
      {{notice}}
      <slot name="notice"></slot>
    </span>
  </div>
  <div class="body" v-if="isExpandedInner">
    <slot name="body"></slot>
  </div>
</component>
</template>

<style lang="scss" scoped>
.smart-list-item {
  border-radius: 4px;
  display: block;
  border: 1px solid transparent;

  &._status-default {
    background: #fff;
    border-color: #e3e5e6;
  }

  &._status-waiting {
    background: #fcf3d7;
  }

  &._status-complete {
    background: #dcf7e3;
  }

  &._status-locked {
    background: #f1f3f4;
  }
}

.head {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .smart-list-item._status-default._clickable & {
    cursor: pointer;
  }
}

.title {
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: color 0.1s ease;

  .smart-list-item._status-default & {
    color: #000000;
  }
  .smart-list-item._status-default._expanded & {
    color: #c6cacc;
  }

  .smart-list-item._status-waiting & {
    color: #f3aa18;
  }

  .smart-list-item._status-complete & {
    color: #069697;
  }

  .smart-list-item._status-locked & {
    color: #c6cacc;
  }
}

.icon-holder {
  width: 32px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  transition: transform 0.15s ease;

  .smart-list-item._expanded & {
    fill: #c6cacc;
    transform: rotate(90deg);
  }
}

.text {
  margin-top: 1px;
}

.notice {
  padding-right: 35px;
  transition: color 0.1s ease;

  .smart-list-item._status-default & {
    color: #3d7bf5;
  }
  .smart-list-item._status-default._expanded & {
    color: #c6cacc;
  }

  .smart-list-item._status-waiting & {
    color: #f3aa18;
  }

  .smart-list-item._status-complete & {
    color: #069697;
  }

  .smart-list-item._status-locked & {
    color: #919699;
  }

  .smart-list-item._notice-status-waiting & {
    color: #f3aa18;
  }

  .smart-list-item._notice-status-warning & {
    color: #ea3d2f;
  }
}

.body {
  padding: 8px 24px 24px 32px;
  font-size: 14px;
  line-height: 20px;
  color: #3e4345;
}
</style>
