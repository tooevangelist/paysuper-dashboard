<script>
import ClickOutside from 'vue-click-outside';
import { isEmpty } from 'lodash-es';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },

  /**
   * We can't just close autocomplete-results on blur
   * if we do so, the tip will be closed before a click is handled by autocomplete-results item
   * So we're closing the autocomplete-results on the click to outside
   */
  directives: {
    ClickOutside,
  },

  props: {
    additionalInfo: {
      default: '',
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    errorText: {
      default: '',
      type: String,
    },
    hasError: {
      default: false,
      type: Boolean,
    },
    label: {
      default: '',
      type: String,
    },
    required: {
      default: false,
      type: Boolean,
    },
    isLoading: {
      default: false,
      type: Boolean,
    },
    type: {
      default: 'text',
      type: String,
    },
    value: {
      default: '',
      type: [String, Number],
    },
    resultsAutocomplete: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return {
      inputValue: this.value,
      isOpenAutocomplete: false,
    };
  },
  computed: {
    /**
     * Error is visible if it exists and error text isn't empty
     * @return {boolean}
     */
    isVisibleError() {
      return !!(this.hasError && this.errorText);
    },
    /**
     * Classes for input
     * @return {Array<string>}
     */
    inputClasses() {
      const isEmptyVal = !this.inputValue && this.inputValue !== 0;
      return [
        'input',
        isEmptyVal ? '_empty' : '',
        this.isVisibleError ? '_error' : '',
        this.disabled ? '_disabled' : '',
        this.required ? '_required' : '',
      ];
    },
    isEmptyResults() {
      const empty = !isEmpty(this.resultsAutocomplete) && this.resultsAutocomplete[0].value === '';
      return empty;
    },
  },
  watch: {
    value(val) {
      this.inputValue = val;
    },
  },

  methods: {
    handleInput() {
      const prevValue = this.value || '';
      const value = this.inputValue || '';
      if (prevValue !== value) {
        this.$emit('input', value);

        if (value && value.length > 2 && !this.isEmptyResults) {
          this.isOpenAutocomplete = true;
        } else {
          this.isOpenAutocomplete = false;
        }
      }
    },

    handleBlur() {
      const value = this.inputValue;
      this.$emit('input', value);
      this.$emit('blur');
    },

    setResult(value) {
      this.inputValue = value;
      this.isOpenAutocomplete = false;
    },
  },
};
</script>

<template>
<div
  class="ui-text-field"
>
  <input
    v-model="inputValue"
    v-bind="{ ...$attrs, type, required, disabled }"
    :class="inputClasses"
    @focus="$emit('focus')"
    @blur="handleBlur"
    @input="handleInput"
  />
  <div class="box"
    v-if="isOpenAutocomplete"
    :class="{'_open': isOpenAutocomplete}"
    >
    <ul class="autocomplete-results options">
      <UiScrollbarBox class="scrollbox">
        <li class="option _empty" v-if="isLoading">
          Loading...
        </li>
        <li class="option _empty" v-if="isEmptyResults && !isLoading">
          Nothing found
        </li>
        <template v-if="!isEmptyResults && !isLoading">
          <li
            v-for="(item, i) in resultsAutocomplete"
            :key="i"
            @click="setResult(item.value)"
            class="option"
            >
            {{ item.label }}
          </li>
        </template>
      </UiScrollbarBox>
    </ul>
  </div>
  <label
    class="label"
    :title="label"
  >
    <slot name="label">{{ label }}</slot>
  </label>
  <span
    v-if="isVisibleError"
    class="error"
    :title="errorText"
  >
    {{ errorText }}
  </span>
  <span
    v-if="additionalInfo"
    class="additional"
    :title="additionalInfo"
  >
    {{ additionalInfo }}
  </span>
</div>
</template>

<style scoped lang="scss">
/** @TODO - move to gui for typographics */
$input-background-color: #fff;
$primary-input-color: #000000;
$secondary-input-color: #5e6366;
$focus-input-color: #3787ff;
$error-input-color: #ff6f6f;
$hover-option-color: rgba($focus-input-color, 0.1);
$selected-color: #c6cacc;

$primary-input-size: 16px;
$secondary-input-size: 11px;
$left-indent: 12px;

.ui-text-field {
  display: inline-block;
  padding: 24px 0 12px;
  position: relative;
  width: 100%;
}
.input {
  background-color: $input-background-color;
  border-width: 0;
  border-bottom: 1px solid #e5e5e5;
  box-sizing: border-box;
  color: $primary-input-color;
  display: block;
  font-size: $primary-input-size;
  height: 38px;
  line-height: 38px;
  outline: none;
  padding: 0 0 4px 12px;
  transition: border-color 0.2s ease-out;
  width: 100%;
  // for ios
  -webkit-appearance: none;
  border-radius: 0;

  &:focus {
    border-color: $focus-input-color;
  }

  &:focus ~ .label {
    pointer-events: auto;
    color: $focus-input-color;
  }
  &:not(:focus):not(._empty) ~ .label {
    color: $secondary-input-color;
  }

  &._error {
    &:focus ~ .label {
      color: $error-input-color;
    }

    border-color: $error-input-color;
  }

  &._disabled {
    color: $secondary-input-color;
    pointer-events: none;
  }

  &._required ~ .label {
    &:after {
      content: "*";
    }
  }
}
.additional,
.label {
  color: $secondary-input-color;
  line-height: 32px;
  margin: 0;
  position: absolute;
}
.label {
  font-size: $primary-input-size;
  left: 0;
  top: 6px;
  width: 100%;
  margin-left: 12px;
  font-size: 12px;
  line-height: 16px;

  &:after {
    color: #ea3d2f;
  }
}
.additional {
  font-size: $secondary-input-size;
  max-width: 50%;
  right: 0;
  top: 0;
}
.error {
  margin-left: $left-indent;
  color: $error-input-color;
  display: block;
  font-size: $secondary-input-size;
  line-height: $secondary-input-size;
  position: relative;
  top: $secondary-input-size/2;
}
.box {
  background-color: $input-background-color;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
  left: 0px;
  position: absolute;
  z-index: 10;
  text-overflow: ellipsis;
  top: 64px;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.2s ease-out;
  white-space: nowrap;
  width: 100%;
  border-radius: 4px;
  &._open {
    transform: scaleY(1);
  }
}
.options {
  background-color: $input-background-color;
  overflow: hidden;
  width: 100%;
  border-radius: 4px;
}
.scrollbox {
  width: 100%;
  height: 100%;
  max-height: 200px;
}
.option {
  cursor: pointer;
  display: block;
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover:not(._empty) {
     background-color: $hover-option-color;
     color: #3d7bf5;
  }

  &._current {
     color: $selected-color;
     cursor: default;
  }

  &._empty {
     color: $secondary-input-color;
  }
}
</style>
