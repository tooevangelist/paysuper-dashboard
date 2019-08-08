<script>
export default {
  name: 'DeactivateProjectModal',
};
</script>

<template>
<UiModal width="448px">
  <UiHeader
    slot="header"
    level="3"
    align="center"
  >
    Deactivation
  </UiHeader>
  <p class="description">
    You can deactivate the project, if you want to stop all activities in it.
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
      @click="$emit('deactivate')"
    >
      DEACTIVATE
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
