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
    Don’t forget to save your data
  </UiHeader>
  <p class="description">
    Before leaving this section you must save your input data not to lose it.
  </p>
  <div class="controls">
    <UiButton
      class="close-button"
      color="gray"
      :isTransparent="true"
      @click="$emit('submit', false)"
    >
      DON'T SAVE
    </UiButton>
    <UiButton
      class="submit-button"
      @click="$emit('submit', true)"
    >
      SAVE
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
