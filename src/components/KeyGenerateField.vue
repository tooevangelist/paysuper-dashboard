<script>
import randomString from 'random-string';
import copyTextToClipboard from '@/helpers/copyTextToClipboard';

export default {
  name: 'KeyGenerateField',

  model: {
    prop: 'value',
    event: 'input',
  },

  props: {
    label: {
      default: 'Key',
      type: String,
    },
    required: {
      default: false,
      type: Boolean,
    },
    value: {
      type: [String, Number],
      default: '',
    },
    errorText: {
      default: '',
      type: String,
    },
    hasError: {
      default: false,
      type: Boolean,
    },
  },

  data() {
    return {
    };
  },

  computed: {
    isVisibleError() {
      return !!(this.hasError && this.errorText);
    },
  },

  methods: {
    generateKey() {
      const value = randomString({
        length: 15,
        special: true,
        exclude: ['`', '/', '\\'],
      });
      this.$emit('input', value);
    },

    copyToClipboard() {
      copyTextToClipboard(this.value);
    },
  },
};
</script>

<template>
<div
  class="key-generate-field"
  :class="{ '_error': isVisibleError }"
>
  <div
    class="title"
    :class="{ '_required': required }"
  >{{label}}</div>
  <div class="wrapper">
    <button
      class="generate-button"
      type="button"
      @click="generateKey"
    >
      <IconRefresh />
    </button>
    <div
      class="input-holder"
    >
      <button
        class="copy-button"
        type="button"
        @click="copyToClipboard"
      >
        <IconCopy />
      </button>
      <input
        class="input"
        type="text"
        placeholder="Search"
        ref="input"
        :value="value"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
        @input="$emit('input', $event.target.value)"
      >
    </div>
  </div>
  <div
    v-if="isVisibleError"
    class="error"
    :title="errorText"
  >
    {{ errorText }}
  </div>
</div>
</template>

<style lang="scss" scoped>
$hover-background-color: #e6efff;

.key-generate-field {
  position: relative;
  padding: 6px 0 24px;
}
.title {
  font-size: 12px;
  line-height: 16px;
  color: #5e6366;
  padding-left: 12px;
  margin-bottom: 8px;

  &._required::after {
    content: "*";
    color: #ea3d2f;
  }

  .key-generate-field._error & {
    color: #ea3d2f;
  }
}

.wrapper {
  display: flex;
}

.copy-button,
.generate-button {
  background: transparent;
  border: 0;
  outline: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.copy-button {
  width: 38px;
  height: 38px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;

  & > svg {
    transition: fill 0.15s ease-out;
  }

  &:hover {
    & > svg {
      fill: #3d7bf5;
    }
  }
}

.generate-button {
  height: 40px;
  width: 40px;
  border: 1px solid #e3e5e6;
  box-sizing: border-box;
  border-radius: 4px;
  margin-right: 4px;
}

.input-holder {
  display: flex;
  height: 40px;
  border: 1px solid #e3e5e6;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  padding-left: 38px;
  overflow: hidden;
  width: 240px;
}

.input {
  border: 0;
  padding: 0 12px 0 0;
  outline: none;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  flex-grow: 1;

  &::placeholder {
    color: #c6cacc;
  }
}

.error {
  bottom: 0;
  left: 12px;
  color: #ea3d2f;
  display: block;
  font-size: 12px;
  position: absolute;
}
</style>
