<script>
import { includes } from 'lodash-es';
import { directive as clickaway } from 'vue-clickaway';
import { TheMask } from 'vue-the-mask';

export default {
  name: 'UiComplexTableCell',
  components: {
    TheMask,
  },
  directives: {
    clickaway,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    align: {
      default: 'center',
      type: String,
      validator(value) {
        return includes(['left', 'right', 'center'], value);
      },
    },
    isCollapsed: {
      default: false,
      type: Boolean,
    },
    isEditable: {
      default: false,
      type: Boolean,
    },
    isInactive: {
      default: false,
      type: Boolean,
    },
    hasFocus: {
      default: false,
      type: Boolean,
    },
    hasChanges: {
      default: false,
      type: Boolean,
    },
    hasError: {
      default: false,
      type: Boolean,
    },
    maxlength: {
      default: 6,
      type: Number,
    },
    value: {
      type: [String, Number],
      default: '',
    },
    mask: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isEditing: false,
      hasMouseDown: false,

      maskTokens: {
        '#': { pattern: /\d/ },
        N: { pattern: /[\d,]/ },
        X: { pattern: /[0-9a-zA-Z]/ },
        S: { pattern: /[a-zA-Z]/ },
        A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
        a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
        '!': { escape: true },
        U: { pattern: /[a-zA-Z\s]/, transform: v => v.toLocaleUpperCase() },
      },
    };
  },
  computed: {
    isHead() {
      return this.$parent.isHead || false;
    },
    isPainted() {
      return this.$parent.isPainted || false;
    },
  },

  watch: {
    hasFocus(value) {
      if (value) {
        this.$refs.focusHolder.focus();
      } else {
        this.isEditing = false;
      }
    },
  },

  methods: {
    editField() {
      if (this.isEditable) {
        this.isEditing = true;
        this.$nextTick(() => {
          if (this.$refs.input.$el) {
            this.$refs.input.$el.focus();
          } else {
            this.$refs.input.focus();
          }
        });
      }
    },
    focusField() {
      if (!this.isEditable) {
        return;
      }
      this.$emit('toggleFocus', true);
    },

    unfocusField() {
      if (!this.isEditable) {
        return;
      }
      this.$emit('toggleFocus', false);
    },
    handleInputKeyEnter() {
      if (this.isEditable) {
        this.isEditing = false;
        this.$refs.focusHolder.focus();
      }
    },
    handleFocusHandlerBlur() {
      if (!this.isEditing && !this.hasMouseDown) {
        this.unfocusField();
      }
    },
  },
};
</script>

<template>
<div
  class="complex-table-cell"
  :class="[
    `_${align}`,
    {
      '_head': isHead,
      '_painted': isPainted,
      '_collapsed': isCollapsed,
      '_editable': isEditable,
      '_editing': isEditing,
      '_inactive': isInactive,
      '_focused': hasFocus,
      '_changes': hasChanges,
      '_error': hasError,
    }
  ]"
  @dblclick="editField"
  @click="focusField"
  @mousedown="hasMouseDown = true"
  @mouseup="hasMouseDown = false"
  v-clickaway="unfocusField"
>
  <slot />
  <template v-if="isEditing">
    <TheMask
      v-if="mask"
      class="input"
      type="text"
      ref="input"
      :mask="mask"
      :tokens="maskTokens"
      :maxlength="maxlength"
      :value="value"
      @change.native="$emit('change', $event.target.value)"
      @keyup.native.enter="handleInputKeyEnter"
    />
    <input
      v-else
      class="input"
      type="text"
      ref="input"
      :maxlength="maxlength"
      :value="value"
      @change="$emit('change', $event.target.value)"
      @keyup.enter="handleInputKeyEnter"
    />
  </template>
  <button
    v-if="isEditable"
    class="focus-holder"
    type="button"
    ref="focusHolder"
    @keyup.enter="editField"
    @keydown.up="$emit('moveFocus', 'up')"
    @keydown.down="$emit('moveFocus', 'down')"
    @keydown.left="$emit('moveFocus', 'left')"
    @keydown.right="$emit('moveFocus', 'right')"
    @blur="handleFocusHandlerBlur"
    tabindex="-1"
  ></button>
</div>
</template>

<style lang="scss" scoped>
.complex-table-cell {
  display: table-cell;
  padding: 0 3px;
  height: 40px;
  color: #000;
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
  border-top: 1px solid #e3e5e6;
  border-bottom: 1px solid #e3e5e6;
  text-align: center;
  background: #fff;
  position: relative;

  & + & {
    border-left: 1px solid #e3e5e6;
  }

  &._collapsed {
    border-top: 0;
    border-bottom: 0;
  }

  &:not(._collapsed):not(._error)._painted {
    background: #f7f9fa;
  }

  &._inactive {
    color: #c6cacc;
  }
  &._focused {
    box-shadow: inset 0 0 0 2px #3d7bf5;
  }

  &._left {
    text-align: left;
  }

  &._center {
    text-align: center;
  }

  &._right {
    text-align: right;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    display: none;
  }
  &::before {
    background: #3d7bf5;
  }
  &::after {
    background: #ea3d2f;
  }

  &._changes {
    &::before {
      display: block;
    }
  }
  &._error {
    &._editable {
      background: #fdefee;
    }

    &::after {
      display: block;
    }
  }

  &._changes._error {
    &::before {
      left: 10px;
    }
  }

  &._head {
    color: #919699;
    border-right: none;
    border-left: none;
    border-top: none;
    font-size: 12px;
    line-height: 16px;
  }
}

.input {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  position: absolute;
  top: -1px;
  left: -1px;
  bottom: -1px;
  z-index: 100;
  width: calc(100% + 2px);
  background: #fff;
  border: 0;
  outline: none;
  box-shadow: 0px 2px 4px rgba(8, 35, 48, 0.24),
    0px 4px 8px rgba(8, 35, 48, 0.08);
  text-align: center;
}

.focus-holder {
  position: absolute;
  width: 1px;
  height: 1px;
  bottom: 0;
  right: 0;
  padding: 0;
  opacity: 0;
}
</style>
