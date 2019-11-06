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
    label: {
      default: '',
      type: String,
    },
    required: {
      default: false,
      type: Boolean,
    },
    errorText: {
      default: '',
      type: String,
    },
    hasError: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      isDragOver: false,
      errorMessage: '',
    };
  },
  computed: {
    /**
     * Error is visible if it exists and error text isn't empty
     * @return {boolean}
     */
    isVisibleError() {
      return !!(this.hasError && this.errorText);
    },
    /**
     * Classes for input
     * @return {Array<string>}
     */
    inputClasses() {
      const isEmpty = !this.value && this.value !== 0;
      return [
        isEmpty ? '_empty' : '',
        this.isVisibleError ? '_error' : '',
        this.required ? '_required' : '',
      ];
    },
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
<div class="cover-image-upload"
    :class="inputClasses"
  >
  <label
    class="label"
    :title="label"
  >
    <slot name="label">{{ label }}</slot>
  </label>
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
          {{ errorMessage }}
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
  <span
    v-if="isVisibleError"
    class="error"
    :title="errorText"
    >
    {{ errorText }}
  </span>
</div>
</template>

<style scoped lang="scss">
$hover-text-color: #3d7bf5;
$error-text-color: #ea3d2f;
$secondary-input-color: #5e6366;
$primary-input-size: 16px;

.cover-image-upload {
  padding: 24px 0;
  position: relative;
  &._error {
    border-color: rgba($error-text-color, 0.48);
    color: $error-text-color;
    &:focus ~ .label {
      color: $error-text-color;
    }
  }
  &._required .label {
    &:after {
      content: "*";
    }
  }
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
.label {
  position: absolute;
  left: 0;
  top: 6px;
  width: 100%;
  margint: 0 0 0 12px;
  font-size: 12px;
  line-height: 16px;
  color: $secondary-input-color;
  &:after {
    color: #ea3d2f;
  }
}
</style>
