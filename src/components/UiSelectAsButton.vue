<script>
import { find, get, startCase } from 'lodash-es';
import { directive as clickaway } from 'vue-clickaway';

export default {
  directives: {
    clickaway,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    isOnlyIcon: {
      default: false,
      type: Boolean,
    },
    iconName: {
      default: 'IconArrowDown',
      type: String,
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
    value: {
      default: '',
      type: [String, Number],
    },
  },
  data() {
    return {
      innerValue: this.value,
      isOpened: false,
    };
  },
  computed: {
    label() {
      return get(
        find(this.options, ({ value }) => value === this.innerValue),
        'label',
        startCase(this.innerValue),
      );
    },
    componentName() {
      return this.isOnlyIcon ? 'div' : 'UiButton';
    },
  },
  methods: {
    hide() {
      this.isOpened = false;
    },
    show() {
      this.isOpened = true;
    },
    toggle() {
      if (this.isOpened) {
        this.hide();
      } else {
        this.show();
      }
    },
    emitChange(value) {
      this.$emit('input', value);
      this.innerValue = value;
      this.hide();
    },
  },
  watch: {
    value(value) {
      this.innerValue = value;
    },
  },
};
</script>

<template>
<component
  v-clickaway="hide"
  v-bind="$attrs"
  :is="componentName"
  :class="[
    'select-as-button',
    { '_opened': isOpened, '_is-only-icon': isOnlyIcon },
  ]"
  @click.self="toggle"
>
  <span
    class="selected"
    @click="toggle"
  >
    <component :is="iconName" class="icon" />

    <template v-if="!isOnlyIcon">
      {{ label }}
    </template>
  </span>

  <UiTip
    innerPosition="right"
    position="bottom"
    :margin="2"
    :closeDelay="0"
    :visible="isOpened"
    :stayOpenedOnHover="false"
  >
    <div class="list">
      <div
        v-for="(option, index) in options"
        class="item"
        :key="index"
        :class="{ '_selected': option.value === value }"
        @click="emitChange(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
  </UiTip>
</component>
</template>

<style scoped lang="scss">
$normal-text-color: #78909c;
$selected-text-color: #c6cacc;
$hover-text-color: #3d7bf5;
$hover-background-color: rgba($hover-text-color, 0.08);

.select-as-button {
  position: relative;
}
.selected {
  font-size: 12px;
  line-height: 16px;
  color: $normal-text-color;
  cursor: pointer;
  display: flex;
  align-items: center;
  letter-spacing: 0.4px;
  overflow: hidden;

  ._is-only-icon & {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    justify-content: center;
  }
  ._is-only-icon._opened &,
  ._is-only-icon &:hover {
    background-color: #f1f3f4;
  }
}
.icon {
  margin-right: 9px;
  fill: $normal-text-color;

  ._is-only-icon & {
    margin-right: 0;
    width: 16px;
    height: 16px;
  }

  ._opened & {
    transform: rotateX(180deg);
  }
}
.list {
  border-radius: 4px;
  padding: 6px 0;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}
.item {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  cursor: pointer;
  padding: 8px 16px;
  height: 36px;
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;

  &:not(._selected):hover {
    background: $hover-background-color;
    color: $hover-text-color;

    .icon > svg {
      fill: $hover-text-color;
    }
  }

  &._selected {
    color: $selected-text-color;
    cursor: default;
  }
}
</style>
