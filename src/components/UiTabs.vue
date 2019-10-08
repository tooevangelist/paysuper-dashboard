<script>
export default {
  name: 'UiTabs',

  props: {
    items: {
      type: Array,
      default: () => ([
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
        { label: 'Three', value: 'three' },
      ]),
    },

    currentItemIndex: {
      type: Number,
      default: 0,
    },
  },

  model: {
    prop: 'currentItemIndex',
    event: 'change',
  },
};
</script>

<template>
<div class="ui-tabs">
  <span
    class="button"
    v-for="(item, index) in items"
    :class="{
      '_current': index === currentItemIndex,
      '_error': item.hasError,
    }"
    :key="index"
    @click="$emit('change', index)"
  >
    {{ item.label }}
  </span>
</div>
</template>

<style lang="scss" scoped>
.ui-tabs {
  border-bottom: 1px solid #e3e5e6;
  padding-bottom: 3px;
}

.button {
  font-family: Roboto;
  font-size: 14px;
  line-height: 22px;
  color: #000000;
  cursor: pointer;
  height: 40px;
  padding: 0 11px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &._current {
    &::after {
      position: absolute;
      content: "";
      height: 3px;
      background: #3d7bf5;
      bottom: -4px;
      left: 0;
      right: 0;
    }
  }
  &._error {
    &::before {
      position: absolute;
      content: "";
      height: 3px;
      width: 3px;
      border-radius: 50%;
      background: #ea3d2f;
      top: 9px;
      right: 7px;
    }
  }
}
</style>
