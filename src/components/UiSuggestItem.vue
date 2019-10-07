<script>
export default {
  name: 'UiSuggestItem',
};
</script>

<template>
<div
  class="ui-suggest-item"
  @click="$emit('click', $event)"
>
  <slot></slot>
</div>
</template>

<style lang="scss" scoped>
.ui-suggest-item {
  font-size: 14px;
  line-height: 20px;
  color: #367bf5;
  cursor: pointer;
  padding: 0 16px;
  height: 40px;
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;
  background: #e6efff;
  border-radius: 4px;

  & + & {
    margin-top: 2px;
  }

  &:hover {
    background: #daf5f2;
    color: #069697;
  }
}
</style>
