<script>
import { get, find, startCase } from 'lodash-es';
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
<UiButton
  v-clickaway="hide"
  :class="['select-as-button', { '_opened': isOpened }]"
  color="transparent-gray"
  :isTransparent="true"
  @click.self="toggle"
>
  <span
    class="selected"
    @click="toggle"
  >
    <IconArrowDown />

    {{ label }}
  </span>

  <div
    class="list"
    @click="hide"
  >
    <div
      class="item"
      v-for="(option, index) in options"
      :key="index"
      :class="{ '_selected': option.value === value }"
      @click="emitChange(option.value)"
    >{{ option.label }}</div>
  </div>
</UiButton>
</template>

<style scoped lang="scss">
$normal-text-color: #78909c;
$selected-text-color: #c6cacc;
$hover-text-color: #3d7bf5;
$hover-background-color: rgba($hover-text-color, 0.08);

button.base-button.select-as-button {
  padding-left: 16px;
  padding-right: 16px;
}

.selected {
  font-size: 12px;
  line-height: 16px;
  color: $normal-text-color;
  cursor: pointer;
  display: flex;
  align-items: center;
  letter-spacing: 0.4px;

  svg {
    margin-right: 9px;
    fill: $normal-text-color;
  }

  .select-as-button._opened & svg {
    transform: rotateX(180deg);
  }
}

.list {
  position: absolute;
  border-radius: 4px;
  padding: 5px 0;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease-out;
  z-index: 20;
  cursor: auto;
  right: 0;
  text-align: left;
  transform: translate3d(0, 20px, 0);
  top: 100%;
  width: 200px;
  background-color: #fff;
  box-shadow: 0px 8px 16px rgba(8, 35, 48, 0.1), 0px 24px 32px rgba(8, 35, 48, 0.06);

  .select-as-button._opened & {
    pointer-events: auto;
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.item {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  cursor: pointer;
  padding: 5px 20px;
  transition: all 0.2s ease-out;

  &:hover:not(._selected) {
    background: $hover-background-color;
    color: $hover-text-color;
  }

  &._selected {
    color: $selected-text-color;
    cursor: default;
  }
}
</style>
