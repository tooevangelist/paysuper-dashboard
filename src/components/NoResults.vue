<script>
import { includes } from 'lodash-es';

export default {
  name: 'NoResults',

  props: {
    type: {
      type: String,
      default: 'no-results',
      validator(value) {
        return includes(['no-results', 'add-new'], value);
      },
    },
  },
};
</script>

<template>
  <div class="no-results" :class="`_type-${type}`">
    <div class="icon">
      <IconComputer
        v-if="type === 'no-results'"
        width="100"
        height="72"
      />
      <IconAddNewEntity v-if="type === 'add-new'" />
    </div>
    <p>
      <span v-if="!$slots.default && type === 'no-results'">No results</span>
      <slot></slot>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.no-results {
  padding: 50px 0;
  width: 100%;

  p {
    font-size: 14px;
    line-height: 20px;
    color: #c6cacc;
    text-align: center;
  }
}

.icon {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;

  .no-results._type-add-new & {
    padding-right: 20px;
  }
}
</style>
