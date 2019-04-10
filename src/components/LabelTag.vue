<template>
  <div class="label-tag" :class="`_color-${color}`">
    <slot></slot>
  </div>
</template>

<script>
import { includes } from 'lodash-es';

export default {
  name: 'LabelTag',

  props: {
    color: {
      type: String,
      default: 'gray',
      validator(value) {
        return includes(['gray', 'blue', 'green', 'orange', 'purple', 'aqua'], value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.label-tag {
  height: 28px;
  min-width: 80px;
  box-sizing: border-box;
  padding: 0 5px;
  color: #fff;
  font-family: Lato;
  font-size: 14px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;

  &._color-gray {
    background-color: #b1b1b1;
  }
  &._color-blue {
    background-color: #0084ff;
  }
  &._color-green {
    background-color: #009d19;
  }
  &._color-orange {
    background-color: #ffa338;
  }
  &._color-purple {
    background-color: #8077e7;
  }
  &._color-aqua {
    background-color: #3acfcf;
  }
}
</style>
