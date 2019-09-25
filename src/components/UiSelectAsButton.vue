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
  v-bind="$attrs"
  :class="['select-as-button', { '_opened': isOpened }]"
  @click.self="toggle"
>
  <span
    class="selected"
    @click="toggle"
  >
    <IconArrowDown />

    {{ label }}
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
</UiButton>
</template>

<style scoped lang="scss">
$normal-text-color: #78909c;
$selected-text-color: #c6cacc;
$hover-text-color: #3d7bf5;
$hover-background-color: rgba($hover-text-color, 0.08);

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
