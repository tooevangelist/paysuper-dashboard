<script>
import {
  find, get, includes, startCase,
} from 'lodash-es';
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
    iconComponent: {
      default: 'IconArrowDown',
      type: String,
    },
    textColor: {
      default: 'gray',
      type: String,
      validator(value) {
        return includes(['gray', 'white'], value);
      },
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
    tipInnerPosition: {
      default: 'right',
      type: String,
      validator(value) {
        return includes(['left', 'right'], value);
      },
    },
    tipPosition: {
      default: 'bottom',
      type: String,
      validator(value) {
        return includes(['bottom', 'top'], value);
      },
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
    :class="['selected', `_${textColor}`]"
    @click="toggle"
  >
    <component :is="iconComponent" class="icon" />

    <template v-if="!isOnlyIcon">
      {{ label }}
    </template>
  </span>

  <UiTip
    :position="tipPosition"
    :innerPosition="tipInnerPosition"
    :margin="2"
    :closeDelay="0"
    :visible="isOpened"
    :stayOpenedOnHover="false"
  >
    <div class="list">
      <div
        v-for="(option, index) in options"
        :key="index"
        :class="[
          'item',
          {
            '_selected': option.value === value,
            '_has-color': option.color,
            [`_${option.color}`]: option.color,
          },
        ]"
        @click="emitChange(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
  </UiTip>
</component>
</template>

<style scoped lang="scss">
$gray-text-color: #78909c;
$white-text-color: #fff;
$selected-text-color: #c6cacc;
$hover-text-color: #3d7bf5;
$hover-background-color: rgba($hover-text-color, 0.08);

.select-as-button {
  position: relative;
}
.selected {
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  letter-spacing: 0.4px;
  overflow: hidden;

  &._gray {
    color: $gray-text-color;
    & > .icon {
      fill: $gray-text-color;
    }
  }
  &._white {
    color: $white-text-color;
    & > .icon {
      fill: $white-text-color;
    }
  }

  .select-as-button._is-only-icon & {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    justify-content: center;
  }
  .select-as-button._is-only-icon._opened &,
  .select-as-button._is-only-icon &:hover {
    background-color: #f1f3f4;
  }
}
.icon {
  margin-right: 9px;

  .select-as-button._is-only-icon & {
    margin-right: 0;
    width: 16px;
    height: 16px;
  }

  .select-as-button._opened & {
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
  position: relative;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  cursor: pointer;
  padding: 8px 16px;
  height: 36px;
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;
  letter-spacing: 0.25px;

  &:not(._selected):hover {
    background: $hover-background-color;
    color: $hover-text-color;

    .icon > svg {
      fill: $hover-text-color;
    }
  }

  &._has-color {
    padding: 8px 16px 8px 32px;

    &::before {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      left: 13px;
      top: calc(50% - 3px);
    }

    &._blue {
      &::before {
        background-color: #3d7bf5;
      }
    }
    &._yellow {
      &::before {
        background-color: #f3aa18;
      }
    }
    &._purple {
      &::before {
        background-color: #7e57c2;
      }
    }
    &._green {
      &::before {
        background-color: #2fa84f;
      }
    }
    &._red {
      &::before {
        background-color: #ea3d2f;
      }
    }
    &._cyan {
      &::before {
        background-color: #069697;
      }
    }
  }

  &._selected {
    color: $selected-text-color;
    cursor: default;
  }
}
</style>
