<script>
import {
  UiHeader,
  UiButton,
  UiTextField,
  UiModal,
  UiTextarea,
} from '@protocol-one/ui-kit';
import ExtendingMenu from '@/components/ExtendingMenu.vue';

export default {
  name: 'MerchantExtendingMenu',

  components: {
    UiHeader,
    UiButton,
    UiTextField,
    UiModal,
    UiTextarea,
    ExtendingMenu,
  },

  props: {
    merchant: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      isSendNotificationDialogOpen: false,
      title: '',
      message: '',
    };
  },

  computed: {
    items() {
      return [
        {
          url: `/merchants/${this.merchant.id}/history`,
          label: 'Show history',
        },
        {
          handler: this.openSendNotificationDialog,
          label: 'Send notification',
        },
      ];
    },
  },

  methods: {
    openSendNotificationDialog() {
      this.isSendNotificationDialogOpen = true;
    },
    closeSendNotificationDialog() {
      this.isSendNotificationDialogOpen = false;
    },

    sendNotification() {
      this.$emit('sendNotification', {
        title: this.title,
        message: this.message,
      });
      this.closeSendNotificationDialog();
    },
  },

};
</script>

<template>
  <div class="merchant-extending-menu">
    <ExtendingMenu :items="items" />

    <UiModal
      v-if="isSendNotificationDialogOpen"
      :hasCloseButton="true"
      @close="closeSendNotificationDialog"
      @click.native.prevent=""
    >
      <div class="dialog" slot="main">
        <UiHeader level="2" :hasMargin="true">Send notification</UiHeader>
        <UiTextField
          class="dialog__title"
          label="Title"
          v-model="title"
        />
        <UiTextarea
          class="dialog__message"
          label="Optional message"
          v-model="message"
        />
        <div class="dialog__controls">
          <UiButton
            class="dialog__button"
            :isTransparent="true"
            @click="closeSendNotificationDialog"
          >Cancel</UiButton>
          <UiButton
            class="dialog__button"
            @click="sendNotification"
          >Send</UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<style lang="scss" scoped>
.merchant-extending-menu {
  display: inline-flex;
}
.dialog {
  width: 470px;

  &__title {
    width: 100%;
  }

  &__message {
    width: 100%;
  }

  &__controls {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
  }

  &__button {
    margin-left: 16px;
  }
}
</style>
