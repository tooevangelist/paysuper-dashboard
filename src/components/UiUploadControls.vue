<script>
export default {
  name: 'UiUploadControls',

  props: {
    title: {
      type: String,
      default: 'items',
    },
    isFilled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
<div
  class="ui-upload-controls"
  @click="$emit('click', $event)"
>
  <span
    class="upload-button"
    @click="$emit('upload', $event)"
  >
    <IconUpload />
    {{ isFilled ? 'Update' : 'Upload' }} {{ title }}
  </span>
  <span
    v-if="isFilled"
    class="delete-button"
    @click="$emit('delete', $event)"
  >
    <IconDelete />
    Delete
  </span>
</div>
</template>

<style lang="scss" scoped>
.ui-upload-controls {
  font-size: 14px;
  line-height: 22px;
}

.upload-button,
.delete-button {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;

  & > svg {
    margin: 0 8px 0 0;
  }
}

.upload-button {
  color: #3d7bf5;

  & > svg {
    fill: #3d7bf5;
  }
}

.delete-button {
  color: #ea3d2f;

  &::before {
    content: "";
    width: 1px;
    height: 16px;
    background: #e3e5e6;
    margin: 0 16px;
  }
}
</style>
