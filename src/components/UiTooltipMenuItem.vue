<script>
import { includes } from 'lodash-es';

export default {
  name: 'UiTooltipMenuItem',

  props: {
    isCurrent: {
      type: Boolean,
      default: false,
    },

    iconComponent: {
      default: '',
      type: String,
    },

    type: {
      default: 'default',
      type: String,
      validator(value) {
        return includes(['default', 'delete'], value);
      },
    },
  },
};
</script>

<template>
<div
  class="simple-menu-item"
  :class="[`_type-${type}`, { '_current': isCurrent}]"
  @click="$emit('click', $event)"
>
  <span class="menu-icon" v-if="iconComponent">
    <component :is="iconComponent"></component>
  </span>

  <slot></slot>
</div>
</template>

<style lang="scss" scoped>
$hover-text-color: #3d7bf5;
$hover-background-color: rgba($hover-text-color, 0.1);
$hover-delete-text-color: #ea3d2f;
$hover-delete-background-color: rgba($hover-delete-text-color, 0.08);

.simple-menu-item {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  cursor: pointer;
  padding: 0 16px;
  height: 32px;
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;

  &:first-child {
    margin-top: 8px;
  }
  &:last-child {
    margin-bottom: 8px;
  }

  &._type-delete {
    color: $hover-delete-text-color;

    .menu-icon > svg {
      fill: $hover-delete-text-color;
    }
  }

  &:hover:not(._current) {
    &:not(._type-delete) {
      background: $hover-background-color;
      color: $hover-text-color;

      .menu-icon > svg {
        fill: $hover-text-color;
      }
    }

    &._type-delete {
      background: $hover-delete-background-color;

      .menu-icon > svg {
        fill: $hover-delete-text-color;
      }
    }
  }

  &._current {
    color: #c6cacc;
    cursor: default;
  }
}

.menu-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding-bottom: 1px;
  margin-right: 4px;
  margin-left: -8px;
}
</style>
