<script>
import ClickOutside from 'vue-click-outside';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },

  /**
   * We can't just close suggest on blur
   * if we do so, the tip will be closed before a click is handled by suggest item
   * So we're closing th suggest on the click to outside
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
      const isEmpty = !this.inputValue && this.inputValue !== 0;
      return [
        'input',
        isEmpty ? '_empty' : '',
        this.isVisibleError ? '_error' : '',
        this.disabled ? '_disabled' : '',
        this.required ? '_required' : '',
      ];
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

        if (value) {
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
  <ul class="autocomplete-results" v-if="isOpenAutocomplete && resultsAutocomplete.length > 0">
    <li
      v-for="(item, i) in resultsAutocomplete"
      :key="i"
      @click="setResult(item.value)"
      class="autocomplete-result"
      >
      {{ item.label }}
    </li>
  </ul>
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

.suggest {
  &:empty {
    display: none;
  }
}
</style>
