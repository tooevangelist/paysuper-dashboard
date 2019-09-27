<script>
import { isEmpty } from 'lodash-es';

export default {
  name: 'MerchantAdminModal',
  props: {
    statusFrom: {
      default: () => ({}),
      type: Object,
    },
    statusTo: {
      default: () => ({}),
      type: Object,
    },
  },
  data() {
    return {
      message: '',
    };
  },
  computed: {
    isChangeStatus() {
      return !isEmpty(this.statusFrom);
    },
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
<UiModal width="448px">
  <UiHeader
    slot="header"
    level="3"
    align="center"
    :hasMargin="true"
  >

  </UiHeader>
  <div
    v-if="isChangeStatus"
    class="status-transition"
  >
    <UiLabelTag
      v-if="codeFrom !== undefined"
      :color="statusFrom.color"
      v-text="statusFrom.text"
    />
    <IconBigArrow class="arrow" />
    <UiLabelTag
      v-if="codeTo !== undefined"
      :color="statusTo.color"
      v-text="statusTo.text"
    />
  </div>
  <UiScrollbarBox class="content" ref="scrollbar">
    <TextareaAutosize
      class="textarea"
      rows="1"
      maxlength="500"
      ref="textarea"
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
    <UiButton
      :disabled="message.length < 1"
      @click="$emit('send', message)"
    >SEND</UiButton>
  </div>
</UiModal>
</template>

<style lang="scss" scoped>
.content {
  max-height: 100px;
  margin-bottom: 24px;
  margin-right: -20px;
}
.status-transition {
  display: flex;
  align-items: center;
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
