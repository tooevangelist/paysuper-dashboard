<script>
import { includes, uniqueId } from 'lodash-es';

export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: {
      default: false,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    size: {
      default: 'default',
      type: String,
      validator(value) {
        return includes(['default'], value);
      },
    },
    label: {
      default: '',
      type: String,
    },
  },
  computed: {
    /**
     * Classes for switch
     * @return {Array<string>}
     */
    switchClasses() {
      return ['label', `_${this.size}`, this.disabled ? '_disabled' : ''];
    },
    /**
     * Unique ID for switch element
     * @return {string}
     */
    id() {
      return uniqueId('switch');
    },
  },
  methods: {
    /**
     * @param {Event} event
     */
    emitChange(event) {
      // If button has disabled we shoudn't send events
      if (this.disabled) {
        return;
      }

      this.$emit('change', event.target.checked);
    },
  },
};
</script>

<template>
<label
  class="ui-switch-box"
  :class="switchClasses"
>
  <input
    v-bind="{ checked, disabled }"
    class="input"
    type="checkbox"
    @change="emitChange"
  >
  <span class="panel"></span>
  <div class="text">
    <slot></slot>
    {{label}}
  </div>
</label>
</template>

<style scoped lang="scss">
/** @TODO - move to gui consts, fix color and typographics consts */
$switch-color: #cfcfcf;
$switch-dot-color: #fff;
$disabled-switch-color: #e1e1e1;
$checked-switch-color: #2fa84f;

.ui-switch-box {
  display: flex;
  position: relative;
  cursor: pointer;
  align-items: center;
}
.input {
  height: 0;
  position: absolute;
  visibility: hidden;
  width: 0;

  &:checked ~ .panel {
    &::before {
      background-color: rgba(#2fa84f, 0.4);
    }

    &::after {
      left: 20px;
      background-color: #2fa84f;
      box-shadow: 0px 2px 4px rgba(6, 150, 151, 0.24),
        0px 4px 8px rgba(6, 150, 151, 0.16);
    }
  }
}

.panel {
  position: relative;
  width: 40px;
  height: 40px;

  &::before {
    content: "";
    border-radius: 14px;
    position: absolute;
    top: 13px;
    left: 3px;
    display: block;
    transition: all 0.2s ease-out;
    background-color: #c6cacc;
    height: 14px;
    width: 34px;
    margin-bottom: 0;
  }

  &::after {
    content: "";
    background-color: #f7f9fa;
    border-radius: 50%;
    box-shadow: 0px 1px 2px rgba(8, 35, 48, 0.24),
      0px 2px 6px rgba(8, 35, 48, 0.16);
    left: 0px;
    position: absolute;
    top: 10px;
    transition: all 0.2s ease-out;
    height: 20px;
    width: 20px;
  }

  .ui-switch-box._disabled & {
    &::before {
      background-color: $disabled-switch-color;
      border-color: $disabled-switch-color;
    }

    &::after {
      box-shadow: none;
    }
  }
}

.text {
  font-size: 16px;
  line-height: 24px;
  color: #000000;

  &:not(:empty) {
    margin-left: 8px;
  }
}
</style>
