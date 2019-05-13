<script>
import UploadItem from './UploadItem.vue';
import { OpenFileDialog, UploadImage } from '@/helpers/uploader';

export default {
  components: { UploadItem },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  computed: {
    filled() {
      return Object
        .keys(this.value)
        .filter(a => this.value[a]);
    },
  },
  methods: {
    selectLang(lang) {
      this.lang = lang;
    },
    clickRemove() {
      this.$emit('change', this.value);
    },
    uploadFile(file) {
      UploadImage(file, { width: 1920, height: 800 }, (urls) => {
        console.log(11111, 'urls', urls);
      });
    },
    selectFile() {
      OpenFileDialog('image/*', this.uploadFile.bind(this));
    },
  },
};
</script>

<template>
<div class="cover-image">
  <UploadItem
    upload-text="Upload"
    replace-text="Replace"
    remove-text="Remove"
    :source="value"
    @click="selectFile"
    @dropFile="uploadFile"
    @clickRemove="clickRemove"
  />
</div>
</template>

<style scoped lang="scss">
.cover-image {
  margin-bottom: 30px;
}
.langs-bar {
  margin-bottom: 8px;
}
</style>
