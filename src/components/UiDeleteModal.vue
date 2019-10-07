<script>
export default {
  name: 'UiDeleteModal',

  props: {
    title: {
      type: String,
      default: 'Delete',
    },
    closeButtonText: {
      type: String,
      default: 'Close',
    },
    submitButtonText: {
      type: String,
      default: 'Delete',
    },
  },
};
</script>

<template>
<UiModal width="458px">
  <UiHeader
    slot="header"
    level="3"
    align="center"
  >
    {{ title }}
  </UiHeader>
  <p class="description">
    <slot />
  </p>
  <div class="controls">
    <UiButton
      class="close-button"
      color="gray"
      :isTransparent="true"
      @click="$emit('close')"
    >
      {{ closeButtonText }}
    </UiButton>
    <UiButton
      class="submit-button"
      color="red"
      @click="$emit('submit')"
    >
      {{ submitButtonText }}
    </UiButton>
  </div>
</UiModal>
</template>

<style lang="scss" scoped>
.description {
  font-size: 16px;
  line-height: 24px;
  color: #5e6366;
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
  margin-bottom: 24px;
}

.controls {
  display: flex;
}
.submit-button,
.close-button {
  text-transform: uppercase;
}
.submit-button {
  flex-grow: 1;
  margin-left: 16px;
}
.close-button {
  width: 128px;
}
</style>
