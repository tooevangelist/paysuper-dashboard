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
      isToggleExpanded: false,
    };
  },
  computed: {
    isExpandedInner() {
      return this.isToggleExpanded && !includes(['locked'], this.status);
    },
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
  methods: {
    handleClick() {
      if (this.expandable) {
        this.isToggleExpanded = !this.isToggleExpanded;
        this.$emit('toggle', this.isToggleExpanded);
      }
    },
  },
  watch: {
    isExpanded(value) {
      this.isToggleExpanded = value;
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
    { '_expanded': this.isExpanded || isExpandedInner }
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
  <div class="body" v-show="isExpandedInner">
    <slot />
  </div>
</component>
</template>

<style lang="scss" scoped>
@mixin hoverStyle {
   &:not(._expanded):hover{
    background-color: #fff;
    border-color: #fff;
    box-shadow: 0px 1px 2px rgba(8, 35, 48, 0.24), 0px 2px 6px rgba(8, 35, 48, 0.16);
    & .text {
      color: #367BF5;
    }
   }
}
.smart-list-item {
  border-radius: 4px;
  display: block;
  border: 1px solid transparent;
  transition: background-color 0.2s ease-out, border-color 0.2s ease-out;

  &._status-default {
    background-color: #fff;
    border-color: #e3e5e6;
    @include hoverStyle;
  }

  &._status-waiting {
    background-color: #fcf3d7;
  }

  &._status-complete {
    background-color: #fff;
    border-color: #e3e5e6;
  }

  &._status-locked {
    background-color: #f1f3f4;
  }

  &._expanded {
    border-color: transparent;
    box-shadow: 0px 6px 12px rgba(8, 35, 48, 0.14), 0px 16px 24px rgba(8, 35, 48, 0.08);
  }
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 4px;

  .smart-list-item._status-default._clickable &,
  .smart-list-item._status-complete._clickable & {
    cursor: pointer;
  }
  .smart-list-item._status-waiting._clickable & {
    cursor: progress;
  }
  .smart-list-item._status-locked._clickable & {
    cursor: not-allowed;
  }
}

.title {
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: color 0.2s ease-out;

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
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
  align-self: flex-start;
}

.icon {
  transition: transform 0.2s ease-out;

  .smart-list-item._expanded:not(._status-complete) & {
    fill: #c6cacc;
    transform: rotate(90deg);
  }
}

.notice {
  padding-right: 28px;
  padding-left: 12px;
  font-size: 12px;
  line-height: 16px;
  transition: color 0.2s ease-out;

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
  padding: 8px 32px 32px;
  font-size: 14px;
  line-height: 20px;
  color: #3e4345;
}
</style>
