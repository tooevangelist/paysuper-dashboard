<script>
import CoverImageUpload from '@/components/CoverImageUpload.vue';

export default {
  name: 'NewProjectModal',

  components: {
    CoverImageUpload,
  },

  props: {
    uploadImage: {
      required: true,
      type: Function,
    },
  },

  data() {
    return {
      name: '',
      image: '',
    };
  },

  computed: {
    isSubmit() {
      return this.name.length > 2 && this.image !== '';
    },
  },
};
</script>

<template>
<UiModal
  width="448px"
  :hasCloseButton="true"
  @close="$emit('close')"
>
  <UiHeader
    slot="header"
    level="3"
    align="center"
  >
    New Project
  </UiHeader>
  <UiTextField
    label="Project Name"
    :required="true"
    v-model="name"
  />
  <CoverImageUpload
    class="cover-uploader"
    :uploadImage="uploadImage"
    label="Cover"
    :required="true"
    v-model="image"
  />
  <UiButton
    class="create-button"
    :disabled="!isSubmit"
    @click="$emit('submit', { name, image })"
  >
    CREATE
  </UiButton>
</UiModal>
</template>

<style lang="scss" scoped>
.create-button {
  width: 100%;
}
</style>
