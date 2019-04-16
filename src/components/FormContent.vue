<template>
  <div class="form-content" :class="{'_styled': hasStyling}">
    <div class="main">
      <slot></slot>
    </div>
    <div class="side" v-if="hasStyling" ref="fixedContainer">
      <div class="side__inner" :class="{'_fixed': isSideFixed}" ref="fixedContent">
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

  data() {
    return {
      isSideFixed: false,
    };
  },

  mounted() {
    window.addEventListener('scroll', this.setSideIsFixed);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.setSideIsFixed);
  },

  methods: {
    getElementOffset(element) {
      const de = document.documentElement;
      const box = element.getBoundingClientRect();
      const top = box.top + window.pageYOffset - de.clientTop;
      const left = box.left + window.pageXOffset - de.clientLeft;
      return { top, left };
    },

    setSideIsFixed() {
      if (!this.$refs.fixedContainer) {
        return;
      }
      const isContainerVisible = this.$refs.fixedContainer.offsetParent;
      if (!isContainerVisible) {
        return;
      }

      const fixedBeginOfsset = 15;
      const containerOffsetTop = this.getElementOffset(this.$refs.fixedContainer).top;
      if (window.pageYOffset + fixedBeginOfsset > containerOffsetTop) {
        this.isSideFixed = true;
      } else {
        this.isSideFixed = false;
      }
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

    &._fixed {
      position: fixed;
      top: 15px;
    }
  }
}
</style>
