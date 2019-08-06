<script>
export default {
  name: 'FilterSearchInput',

  model: {
    prop: 'value',
    event: 'input',
  },

  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },

  data() {
    return {
      isExpanded: Boolean(this.value),
    };
  },

  methods: {
    expandInput() {
      this.isExpanded = true;
      this.$refs.input.focus();
    },
  },
};
</script>

<template>
<div
  class="filter-search-input"
  :class="{ '_expanded': isExpanded }"
  @click="expandInput"
>
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
  <span class="icon">
    <IconLens />
  </span>
</div>
</template>

<style lang="scss" scoped>
$hover-background-color: #e6efff;

.filter-search-input {
  display: inline-flex;
  height: 40px;
  border: 1px solid #e3e5e6;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  padding-right: 38px;
  overflow: hidden;
  transition: width 0.3s ease;
  background: #fff;

  &:not(._expanded) {
    width: 40px;
    cursor: pointer;

    &:hover {
      background: $hover-background-color;
      border-color: $hover-background-color;
    }
  }

  &._expanded {
    width: 240px;
  }
}

.input {
  border: 0;
  padding: 0 0 0 12px;
  outline: none;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  flex-grow: 1;
  opacity: 0;

  &::placeholder {
    color: #c6cacc;
  }

  .filter-search-input._expanded & {
    opacity: 1;
  }
}

.icon {
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 5;

  .filter-search-input:not(._expanded) & {
    &:hover > svg {
      fill: #3d7bf5;
    }
  }
}
</style>
