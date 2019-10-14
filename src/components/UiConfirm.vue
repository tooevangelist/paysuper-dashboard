<script>
import { includes } from 'lodash-es';

export default {
  name: 'UiConfirm',

  props: {
    title: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: '450px',
    },
    buttonColor: {
      type: String,
      default: 'red',
      validator(value) {
        return includes([
          'blue',
          'orange',
          'purple',
          'green',
          'gray',
          'light-gray',
          'red',
          'transparent-gray',
        ], value);
      },
    },
    buttonText: {
      type: String,
      default: 'OK',
    },
  },
};
</script>

<template>
  <UiModal :width="width">
    <UiHeader
      slot="header"
      level="3"
      align="center"
    >
      {{ title }}
    </UiHeader>

    <div class="content">
      <slot></slot>
    </div>

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
        :color="buttonColor"
        @click="$emit('confirm')"
      >
        {{ buttonText }}
      </UiButton>
    </div>

  </UiModal>
</template>

<style scoped>
.content {
  font-size: 16px;
  text-align: center;
  margin-bottom: 24px;
}

.controls {
  display: flex;
  justify-content: flex-end;
}

.close-button {
  width: 128px;
}

.submit-button {
  width: 256px;
  margin-left: 16px;
}
</style>
