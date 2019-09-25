<script>
import SimplePageHeader from '@/components/SimplePageHeader.vue';
import PictureGameKeyWithDoor from '@/components/PictureGameKeyWithDoor.vue';

export default {
  name: 'ProjectGameKeysPage',
  components: {
    SimplePageHeader,
    PictureGameKeyWithDoor,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    uploadImage: {
      type: Function,
      required: true,
    },
  },

  methods: {
    handleSave() {
      const isValid = this.$refs.form.chekIsFormValid();
      if (isValid) {
        this.$emit('save');
      }
    },
  },
};
</script>

<template>
<div>
  <SimplePageHeader>
    <span slot="title">Game keys</span>
    <span slot="description">
      This sales method is intended to sell game keys for specific DRM platforms,
      sending your customers e-mail with a key. Key distribution allows you to sell not only games,
      but any key activated products.
    </span>
    <PictureGameKeyWithDoor slot="picture" />
  </SimplePageHeader>

  <UiPanel>
  </UiPanel>
</div>
</template>


<style lang="scss" scoped>
.controls {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  width: 140px;
}
</style>
