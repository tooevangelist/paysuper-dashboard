<script>
export default {
  name: 'DeleteLocalizationModal',
};
</script>

<template>
<UiModal width="458px">
  <UiHeader
    slot="header"
    level="3"
    align="center"
  >
    Delete localization
  </UiHeader>
  <p class="description">
    Are you sure you want to delete?
    All texts and descriptions for this language will be lost.
  </p>
  <div class="controls">
    <UiButton
      class="close-button"
      color="gray"
      :isTransparent="true"
      @click="$emit('close')"
    >
      CLOSE
    </UiButton>
    <UiButton
      class="submit-button"
      color="red"
      @click="$emit('delete')"
    >
      DELETE
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
.submit-button {
  flex-grow: 1;
  margin-left: 16px;
}
.close-button {
  width: 128px;
}
</style>
