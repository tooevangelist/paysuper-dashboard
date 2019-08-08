<script>
import { directive as clickaway } from 'vue-clickaway';
import { find } from 'lodash-es';

export default {
  name: 'FilterSelect',
  directives: {
    clickaway,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    options: {
      default: () => [],
      type: Array,
      validator(value) {
        if (!value.length) {
          return true;
        }
        if (value[0].label !== undefined && value[0].value !== undefined) {
          return true;
        }
        return false;
      },
    },
  },
  data() {
    return {
      placeholder: 'Not selected',
      isMenuOpened: false,
    };
  },
  computed: {
    selectedLabel() {
      const selectedItem = find(this.options, { value: this.value });
      return selectedItem ? selectedItem.label : this.placeholder;
    },
  },
  methods: {
    closeMenu() {
      this.isMenuOpened = false;
    },
  },
};
</script>

<template>
<div
  class="filter-select"
  :class="{ '_opened': isMenuOpened}"
>
  <span
    class="selected"
    v-clickaway="closeMenu"
    @click="isMenuOpened = !isMenuOpened"
  >
    <IconArrowDown class="icon" />
    {{selectedLabel}}
  </span>

  <UiTip
    class="menu"
    innerPosition="right"
    position="bottom"
    :closeDelay="0"
    :visible="isMenuOpened"
    :stayOpenedOnHover="false"
  >
    <div class="menu-list">
      <div
        v-for="(option, index) in options"
        class="menu-item"
        :key="index"
        :class="{ '_selected': option.value === value}"
        @click="$emit('input', option.value)"
      >
        {{option.label}}
      </div>
    </div>
  </UiTip>
</div>
</template>

<style lang="scss" scoped>
$hover-text-color: #3d7bf5;
$hover-background-color: #e6efff;
$opened-background-color: #f7f9fa;

.filter-select {
  display: inline-flex;
  height: 40px;
  border: 1px solid #e3e5e6;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  background: #fff;
  min-width: 120px;
  transition: all 0.2s ease;

  &._opened {
    background: $opened-background-color;
    border-color: $opened-background-color;
  }
}

.selected {
  color: #78909c;
  font-size: 12px;
  line-height: 16px;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 11px;
  box-sizing: border-box;
  width: 100%;
  cursor: pointer;
}

.icon {
  margin-right: 7px;

  .filter-select._opened & {
    transform: rotate(180deg);
  }
}

.menu {
  top: calc(100% + 4px);
}

.menu-list {
  border-radius: 4px;
  padding: 6px 0;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.menu-item {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  cursor: pointer;
  padding: 0 16px;
  height: 32px;
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;

  &:not(._selected):hover {
    background: $hover-background-color;
    color: $hover-text-color;

    .menu-icon > svg {
      fill: $hover-text-color;
    }
  }

  &._selected {
    color: #c6cacc;
    cursor: default;
  }
}
</style>
