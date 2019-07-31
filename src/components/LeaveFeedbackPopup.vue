<script>
import { TextareaAutosize } from 'vue-textarea-autosize';
import { debounce } from 'lodash-es';

export default {
  name: 'LeaveFeedbackPopup',

  props: {
    isSuccess: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    TextareaAutosize,
  },

  data() {
    return {
      message: '',
    };
  },

  methods: {
    /**
     * To fix the issue with scrollbar is not going away
     * after the textarea is cleared
     */
    handleTextareaInput() {
      const updateScrollbar = debounce(() => {
        if (this.$refs.scrollbar) {
          this.$refs.scrollbar.update();
        }
      }, 300);

      updateScrollbar();
    },
  },
};
</script>

<template>
<div class="leave-feedback-popup">
  <template v-if="isSuccess">
    <UiHeader level="3" align="center" :hasMargin="true">Thanks!</UiHeader>
    <p class="text">We really appreciate your feedback.</p>
  </template>
  <template v-else>
    <UiHeader level="3" align="center" :hasMargin="true">Leave Feedback</UiHeader>
    <UiScrollbarBox class="content" ref="scrollbar">
      <TextareaAutosize
        class="textarea"
        rows="1"
        v-model="message"
        @input="handleTextareaInput"
      />
    </UiScrollbarBox>
    <div class="controls">
      <UiButton
        color="gray"
        :isTransparent="true"
        @click="$emit('close')"
      >CLOSE</UiButton>
      <UiButton @click="$emit('send', message)">SEND</UiButton>
    </div>
  </template>
</div>
</template>

<style lang="scss" scoped>
.leave-feedback-popup {
  padding: 24px;
  min-height: 160px;
  box-sizing: border-box;
}

.content {
  max-height: 100px;
  margin-bottom: 24px;
}

.textarea {
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.44px;
  color: #5e6366;
  border: 0;
  width: calc(100% - 20px);
  outline: none;
  padding: 0;
}

.controls {
  display: flex;

  & > * {
    flex-grow: 1;

    &:first-child {
      margin-right: 16px;
    }
  }
}

.text {
  font-size: 16px;
  line-height: 24px;
  color: #000000;
}
</style>
