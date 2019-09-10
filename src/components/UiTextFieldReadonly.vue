<template>
<div class="ui-text-field-inactive">
  <span
    v-html="value"
    :class="inputClasses"
  />
  <span
    class="label"
    :title="label"
  >
    {{ label }}
  </span>
</div>
</template>

<script>
export default {
  props: {
    label: {
      default: '',
      type: String,
    },
    value: {
      default: '',
      type: [String, Number],
    },
  },
  computed: {
    /**
     * Classes for input
     * @return {Array<string>}
     */
    inputClasses() {
      const isEmpty = !this.value && this.value !== 0;
      return [
        'input',
        isEmpty ? '_empty' : '',
      ];
    },
  },
};
</script>

<style scoped lang="scss">
/** @TODO - move to gui for typographics */
$input-background-color: #fff;
$primary-input-color: #000000;
$secondary-input-color: #5e6366;

$primary-input-size: 16px;
$secondary-input-size: 12px;
$left-indent: 12px;

.ui-text-field-inactive {
  display: inline-block;
  padding: 24px 0 16px;
  position: relative;
  width: 100%;
}
.input {
  background-color: $input-background-color;
  border-width: 0;
  border-bottom-width: 1px;
  border-color: #e5e5e5;
  box-sizing: border-box;
  margin-top: 4px;
  color: $primary-input-color;
  display: block;
  font-size: $primary-input-size;
  line-height: 24px;
  outline: none;
  padding: 0 0 0 12px;
  transition: border-color 0.2s ease-out;
  width: 100%;

  &:not(._empty) ~ .label {
    color: $secondary-input-color;
    width: 50%;
    transform: translateY(-24px) scale(0.75, 0.75);
  }

  /deep/ a {
    color: #3d7bf5;
    text-decoration: none;
  }
}
.label {
  color: $secondary-input-color;
  line-height: 32px;
  margin: 0;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: $primary-input-size;
  left: 0;
  pointer-events: none;
  top: 24px;
  transform-origin: left;
  transition: transform 0.2s ease-out, color 0.2s linear, width 0.1s ease-out;
  width: 100%;
  margin-left: 12px;
}
</style>
