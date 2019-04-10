<script>
import { find } from 'lodash-es';
import {
  UiHeader,
  UiButton,
  UiSelect,
  UiModal,
  UiTextarea,
} from '@protocol-one/ui-kit';
import MerchantStatusTransitionLabel from '@/components/MerchantStatusTransitionLabel.vue';

export default {
  name: 'MerchantStatusChanger',

  components: {
    UiHeader,
    UiButton,
    UiSelect,
    UiModal,
    UiTextarea,
    MerchantStatusTransitionLabel,
  },

  props: {
    status: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      isConfirmDialogOpen: false,
      message: '',
      statusValue: '',
      statusPrevValue: '',
    };
  },

  computed: {
    statusList() {
      const result = [];
      if (this.status === 1) {
        result.push({
          label: 'New',
          value: 'new',
          code: 1,
        });
      }

      return [
        ...result,
        {
          label: 'Checking',
          value: 'checking',
          code: 2,
        },
        {
          label: 'Rejected',
          value: 'rejected',
          code: 0,
        },
      ];
    },

    statusCode() {
      return find(this.statusList, { value: this.statusValue }).code;
    },

    statusPrevCode() {
      if (!this.statusPrevValue) {
        return '';
      }
      return find(this.statusList, { value: this.statusPrevValue }).code;
    },
  },

  created() {
    this.statusValue = find(this.statusList, { code: this.status }).value;
  },

  methods: {
    openConfigDialog(statusName) {
      this.statusPrevValue = this.statusValue;
      this.statusValue = statusName;
      this.isConfirmDialogOpen = true;
    },

    cancelDialog() {
      this.statusValue = this.statusPrevValue;
      this.statusPrevValue = '';
      this.isConfirmDialogOpen = false;
    },

    setNewStatus() {
      this.isConfirmDialogOpen = false;
      const { code } = find(this.statusList, { value: this.statusValue });
      this.$emit('statusChange', {
        code,
        message: this.message,
      });
    },
  },
};
</script>

<template>
  <div class="merchant-status-changer">

    <UiSelect
      class="select"
      label="Status"
      :value="statusValue"
      :options="statusList"
      @input="openConfigDialog"
    />

    <UiModal
      v-if="isConfirmDialogOpen"
      :hasCloseButton="true"
      @close="cancelDialog"
    >
      <div class="dialog" slot="main">
        <UiHeader level="2" :hasMargin="true">Confirm transition</UiHeader>
        <MerchantStatusTransitionLabel
          :codeFrom="statusPrevCode"
          :codeTo="statusCode"
        />
        <UiTextarea
          class="dialog__textarea"
          label="Optional message"
          v-model="message"
        />
        <div class="dialog__controls">
          <UiButton
            class="dialog__button"
            :isTransparent="true"
            @click="cancelDialog"
          >Cancel</UiButton>
          <UiButton
            class="dialog__button"
            @click="setNewStatus"
          >Confirm</UiButton>
        </div>
      </div>
    </UiModal>

  </div>
</template>

<style lang="scss" scoped>
.merchant-status-changer {
  display: inline-flex;
}

.select {
  width: 130px;
}

.dialog {
  width: 470px;

  &__textarea {
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
