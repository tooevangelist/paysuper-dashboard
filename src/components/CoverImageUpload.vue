<script>
import { OpenFileDialog } from '@/helpers/uploader';
import getMessageFromError from '@/helpers/getMessageFromError';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    uploadImage: {
      required: true,
      type: Function,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isDragOver: false,
      errorMessage: '',
    };
  },
  methods: {
    async uploadFile(file) {
      try {
        const { url } = await this.uploadImage(file);
        this.$emit('change', url);
      } catch (error) {
        let message = getMessageFromError(error);
        if (!message) {
          message = 'Unknown error';
          console.error(error);
        }
        this.errorMessage = message;
      }
    },
    dropFile(event) {
      event.stopPropagation();
      event.preventDefault();
      this.isDragOver = false;
      this.uploadFile(event.dataTransfer.files[0]);
    },
    removeImage() {
      this.$emit('change', '');
    },
    selectFile() {
      OpenFileDialog('image/*', this.uploadFile);
    },
    handleAreaClick() {
      if (this.errorMessage) {
        this.errorMessage = '';
      } else {
        this.selectFile();
      }
    },
  },
};
</script>

<template>
<div class="cover-image-upload">
  <div class="title">Cover</div>
  <div class="box">
    <div
      v-if="!value || errorMessage"
      class="info"
      :class="{ '_dragover': isDragOver, '_error': errorMessage }"
      @click="handleAreaClick"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop.prevent="dropFile"
    >
      <template v-if="errorMessage">
        <IconWarning class="info-icon" />
        <div class="description">
          {{errorMessage}}
        </div>
      </template>
      <template v-else>
        <IconUpload class="info-icon" />
        <div class="description">
          Click to upload an image here - .png, .jpg, .jpeg,<br>
          max size 30Mb, min 200x300px; max 1000x1500px
        </div>
      </template>

    </div>
    <div
      v-else
      class="image"
      :style="{backgroundImage: `url(${value})`}"
    >
      <span
        class="delete-button"
        @click="removeImage"
      >
        <IconDelete />
        Delete
      </span>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
$hover-text-color: #3d7bf5;
$error-text-color: #ea3d2f;
.cover-image-upload {
}

.title {
  font-size: 12px;
  line-height: 16px;
  color: #5e6366;
  padding-left: 12px;
  margin-bottom: 8px;
}

.box {
  width: 400px;
  height: 160px;
}

.image,
.info {
  height: 100%;
  width: 100%;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed rgba(#c6cacc, 0.48);
  color: #919699;
  cursor: pointer;

  &._error {
    border-color: rgba($error-text-color, 0.48);
    color: $error-text-color;
  }

  &:not(._error) {
    &:hover,
    &._dragover {
      border-color: rgba($hover-text-color, 0.48);
      color: $hover-text-color;

      .info-icon {
        fill: $hover-text-color;
      }
    }
  }
}

.info-icon {
  margin-bottom: 11px;
}

.description {
  text-align: center;
  font-size: 12px;
  line-height: 16px;
}

.image {
  background-size: contain;
  background-color: #000;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}

.delete-button {
  background: rgba(#000, 0.6);
  height: 32px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  color: #fff;
  position: absolute;
  right: 8px;
  border-radius: 4px;
  bottom: 0;
  cursor: pointer;

  & > svg {
    margin: 0 8px 2px 0;
  }
}
</style>
