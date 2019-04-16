<template>
  <div class="form-content" :class="{'_styled': hasStyling}">
    <div class="main">
      <slot></slot>
    </div>
    <div class="side" v-if="hasStyling">
      <div class="side__inner">
        <slot name="side"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormContent',

  props: {
    hasStyling: {
      default: true,
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.form-content {
  &._styled {
    display: flex;
  }
}

.main {
  .form-content._styled & {
    width: 528px;
  }
}

.side {
  padding-left: 40px;

  &__inner {
    display: flex;
  }
}
</style>
