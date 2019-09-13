<template>
<div class="ui-radio" :class="{ '_disabled': disabled }">
  <label class="wrapper">
    <div class="radio">
      <input
        v-bind="{ checked, disabled }"
        class="input"
        type="radio"
        @change="emitChange"
        :checked="isRadioChecked"
      >
      <IconCircle class="icon icon-default" />
      <IconRadioChecked class="icon icon-checked" />
      <IconForbiddenCircle class="icon icon-disabled" />
    </div>
    <div class="text">
      <slot></slot>
    </div>
  </label>
</div>
</template>

<script>
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
  },
  computed: {
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
  display: block;
  position: relative;
  padding-left: 12px;
}

.wrapper {
  display: inline-flex;
  vertical-align: top;

  .ui-radio:not(._disabled) & {
    cursor: pointer;
  }
}

.radio {
  margin-top: 3px;
}

.svg-checked {
  display: none;
}

.text:not(:empty) {
  margin-left: 12px;
  font-size: 16px;
  line-height: 24px;
  color: #000000;

  .ui-radio._disabled & {
    color: #919699;
  }
}
.input {
  height: 0;
  position: absolute;
  visibility: hidden;
  width: 0;

  &:checked {
    & ~ .icon-checked {
      display: block;
    }
    & ~ .icon-default {
      display: none;
    }
  }
}
.icon {
  display: block;
  height: 16px;
  width: 16px;
}
.icon-default {
  .ui-radio._disabled & {
    display: none;
  }
}
.icon-checked {
  display: none;
}
.icon-disabled {
  display: none;

  .ui-radio._disabled & {
    display: block;
  }
}
</style>
