<script>
export default {
  props: {
    hasCloseButton: {
      default: false,
      type: Boolean,
    },
    height: {
      default: '',
      type: String,
    },
    width: {
      default: '',
      type: String,
    },
    maxHeight: {
      default: '',
      type: String,
    },
    maxWidth: {
      default: '',
      type: String,
    },
  },
};
</script>

<template>
<transition name="modal">
  <div
    class="overlay"
    @click.self="$emit('close')"
  >
    <div
      class="content"
      :style="{
        height: height || undefined,
        width: width || undefined,
        maxHeight: maxHeight || undefined,
        maxWidth: maxWidth || undefined,
      }"
    >
      <div class="header">
        <slot name="header" />
      </div>
      <div class="main">
        <slot />
      </div>
      <div class="footer">
        <slot name="footer" />
      </div>

      <div
        v-if="hasCloseButton"
        class="close-button"
        @click="$emit('close')"
      >
        <IconClose width="14" height="14" />
      </div>
    </div>
  </div>
</transition>
</template>

<style scoped lang="scss">
.overlay {
  position: fixed;
  z-index: 9000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.2s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  position: relative;
  background-color: #fff;
  border: 1px solid #c6cacc;
  border-radius: 8px;
  padding: 24px;
  box-sizing: border-box;
}
.header {
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.header,
.main,
.footer {
  &:empty {
    display: none;
  }
}
.footer {
  align-items: center;
  justify-content: center;
  margin-top: 16px;
}
.close-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 16px;
  top: 22px;
  width: 32px;
  height: 32px;
  box-sizing: content-box;
  cursor: pointer;

  &:hover {
    .close-icon {
      stroke: #999;
    }
  }
}
.close-icon {
  stroke-width: 2px;
  stroke: #c4c4c4;
  transition: stroke 0.2s ease-out;
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .box,
.modal-leave-active .box {
  transform: scale(1.1);
}
</style>
