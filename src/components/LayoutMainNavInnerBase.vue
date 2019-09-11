<script>
import { includes, startCase } from 'lodash-es';

export default {
  name: 'LayoutMainNavInnerBase',

  props: {
    headTitle: {
      required: true,
      type: String,
    },
    headStatus: {
      type: String,
      validator(value) {
        return includes(['new', 'inactive'], value);
      },
      default: 'new',
    },
    headImage: {
      required: true,
      type: String,
    },
    items: {
      required: true,
      type: Array,
    },
    currentItemIndex: {
      required: true,
      type: Number,
    },
  },

  computed: {
    headStatusName() {
      return startCase(this.headStatus);
    },
  },
};
</script>

<template>
<div class="layout-main-nav-inner-base">
  <div class="head">
    <span
      class="head-icon"
      :style="{backgroundImage: `url(${headImage})`}"
    >
      <IconNoImage v-if="!headImage" fill="#C6CACC" />
    </span>
    <div class="head-texts">
      <UiHeader level="3">
        <div
          class="head-name"
          :class="{'_no-name': !headTitle}"
        >
          {{headTitle || 'No name'}}
        </div>
      </UiHeader>
      <div
        class="head-status"
        :class="`_${headStatus}`"
      >
        {{headStatusName}}
      </div>
    </div>
  </div>
  <div class="nav">
    <RouterLink
      v-for="(item, index) in items"
      :key="index"
      :class="['item', { '_current': currentItemIndex === index }]"
      :to="item.url"
    >
      <div class="icon">
        <component :is="item.icon" />
      </div>
      <div class="text">
        <div class="title">{{ item.title }}</div>
      </div>
    </RouterLink>
  </div>
</div>
</template>

<style lang="scss" scoped>
.layout-main-nav-inner-base {
  display: flex;
  flex-direction: column;
}

.head {
  flex-grow: 0;
  display: flex;
  align-content: center;
  align-items: center;
  padding: 8px 12px;
  background-color: #f7f9fa;
}

.head-icon {
  display: flex;
  flex-shrink: 0;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;
  border-radius: 50%;
  background-size: cover;
}

.head-texts {
  max-width: calc(100% - 44px);
}

.head-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &._no-name {
    color: #919699;
  }
}

.head-status {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: #3d7bf5;
}

.nav {
  padding-top: 10px;
}

.item {
  display: flex;
  align-content: center;
  align-items: center;
  padding: 0 12px 0 32px;
  height: 40px;
  transition: background-color 0.2s ease-out;

  &:hover:not(._current) {
    background-color: #e6efff;
  }

  &._current {
    cursor: default;
  }
}
.icon {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: 9px;

  & > svg {
    fill: #000;
    transition: fill 0.2s ease-out;
  }

  .item:hover & > svg {
    fill: #3d7bf5;
  }

  .item._current & > svg {
    fill: #c6cacc;
  }
}
.title {
  color: #000;
  font-size: 14px;
  line-height: 20px;
  transition: color 0.2s ease-out;
  margin-top: 2px;

  .item:hover & {
    color: #3d7bf5;
  }

  .item._current & {
    color: #c6cacc;
  }
}
</style>
