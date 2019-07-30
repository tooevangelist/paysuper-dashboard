<script>
export default {
  name: 'LayoutAside',
  props: {
    currentItem: {
      default: 'dashboard',
      type: String,
    },
    items: {
      default: () => ({}),
      type: Object,
    },
  },
};
</script>

<template>
<div class="layout-aside">
  <RouterLink
    v-for="(item, key) in items"
    :key="key"
    :class="['item', { '_not-available': !item.isAvailable, '_current': currentItem === key }]"
    :to="item.link"
    @click="$emit('changeNavigation', key)"
  >
    <div class="icon">
      <component :is="item.icon" />
    </div>
    <div class="text">
      <div class="title">{{ item.title }}</div>
      <div class="additional">
        {{ item.isAvailable ? item.additional : 'Need license agreement' }}
      </div>
    </div>
  </RouterLink>
</div>
</template>

<style lang="scss" scoped>
.layout-aside {
  display: flex;
  flex-direction: column;
}
.item {
  display: flex;
  align-content: center;
  align-items: center;
  padding: 8px 12px;
  transition: background-color 0.2s ease-out;

  & ~ & {
    margin-top: 8px;
  }

  &:hover,
  &._current:hover {
    background-color: #e6efff;
  }

  &._current {
    background-color: #f7f9fa;
  }
  &._not-available {
    pointer-events: none;
    opacity: 0.25;
  }
}
.icon {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;

  & > svg {
    transition: fill 0.2s ease-out;
  }

  .item:hover & > svg {
    fill: #3d7bf5;
  }
}
.title {
  font-family: Quicksand;
  color: #000;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.44px;
  transition: color 0.2s ease-out;

  .item:hover & {
    color: #3d7bf5;
  }
}
.additional {
  color: #5e6366;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  transition: color 0.2s ease-out;

  .item:hover & {
    color: #3d7bf5;
  }
}
</style>
