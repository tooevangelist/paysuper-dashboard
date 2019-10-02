<script>
import { includes, debounce } from 'lodash-es';
import TextareaAutosize from 'vue-textarea-autosize/src/components/TextareaAutosize.vue';

export default {
  name: 'MerchantAdminModal',
  components: { TextareaAutosize },
  props: {
    statusFrom: {
      default: () => ({}),
      type: Object,
    },
    statusTo: {
      default: () => ({}),
      type: Object,
    },
    type: {
      default: 'contact',
      type: String,
      validator(value) {
        return includes(['contact', 'changeStatus'], value);
      },
    },
  },
  data() {
    return {
      message: '',
    };
  },
  computed: {
    isChangeStatus() {
      return this.type === 'changeStatus';
    },
    headerText() {
      return this.isChangeStatus ? 'Confirm transition' : 'Contact merchant';
    },
  },
  methods: {
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
    {{ headerText }}
  </UiHeader>
  <div
    v-if="isChangeStatus"
    class="status-transition"
  >
    <UiLabelTag
      v-if="statusFrom !== undefined"
      :color="statusFrom.color"
      v-text="statusFrom.label"
    />
    <IconArrowDown class="arrow" />
    <UiLabelTag
      v-if="statusTo !== undefined"
      :color="statusTo.color"
      v-text="statusTo.label"
    />
  </div>
  <UiScrollbarBox class="content" ref="scrollbar">
    <TextareaAutosize
      class="textarea"
      rows="1"
      maxlength="500"
      ref="textarea"
      placeholder="Message *"
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
  justify-content: center;
  margin-bottom: 16px;
}
.arrow {
  transform: rotate(-90deg);
  margin: 0 12px;
  fill: #000;
}
.textarea {
  font-family: 'Roboto', sans-serif;
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
