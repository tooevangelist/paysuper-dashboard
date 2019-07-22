<template>
<div class="ui-radio">
  <label class="wrapper">
    <div class="radio">
      <input
        v-bind="{ checked, disabled }"
        class="input"
        type="radio"
        @change="emitChange"
        :checked="isRadioChecked"
      >
      <div :class="radioClasses">

      </div>
    </div>
    <div class="text">
      <slot></slot>
    </div>
  </label>
</div>
</template>

<script>
import { includes } from 'lodash-es';

export default {
  model: {
    prop: 'matchValue',
    event: 'change',
  },
  props: {
    value: {
      type: String,
    },
    matchValue: {
      type: String,
    },
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
  },
  computed: {
    /**
     * Classes for radio
     * @return {Array<string>}
     */
    radioClasses() {
      return ['label', `_${this.size}`, this.disabled ? '_disabled' : ''];
    },

    isRadioChecked() {
      if (this.value && this.matchValue) {
        return this.value === this.matchValue;
      }

      return this.checked;
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

      this.$emit('change', this.value ? this.value : event.target.checked);
    },
  },
};
</script>

<style scoped lang="scss">
$checked-radio-color: #3d7bf5;
$disabled-radio-color: #e1e1e1;

.ui-radio {
  display: inline-flex;
  position: relative;
  padding-left: 12px;
}

.wrapper {
  display: flex;
  cursor: pointer;
}

.radio {
  margin-top: 3px;
}

.svg-checked {
  display: none;
}

.text:not(:empty) {
  margin-left: 12px;
}
.input {
  height: 0;
  position: absolute;
  visibility: hidden;
  width: 0;

  &:checked + .label {
    border-color: $checked-radio-color;
    background: $checked-radio-color;
    box-shadow: inset 0 0 0 2.5px #fff;
  }
}
.label {
  cursor: pointer;
  display: block;
  height: 16px;
  width: 16px;
  border: 2px solid #78909c;
  border-radius: 50%;

  &._disabled {
    border-color: $disabled-radio-color;
    background: $disabled-radio-color;
  }
}
</style>
