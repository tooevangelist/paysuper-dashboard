<script>
import { get, find } from 'lodash-es';
import MerchantAdminModal from '@/components/MerchantAdminModal.vue';
import { showErrorMessage } from '@/helpers/notifications';

export default {
  name: 'MerchantAdminLicenseAgreement',
  components: { MerchantAdminModal },
  props: {
    agreement: {
      required: true,
      type: Object,
    },
    merchantStatus: {
      default: 'new',
      type: String,
    },
  },
  data() {
    return {
      newStatus: this.merchantStatus,
      modalOpened: false,
      modalType: 'contact',
    };
  },
  computed: {
    statuses() {
      if (this.merchantStatus === 'signed') {
        return [{ color: 'green', label: 'Signed', value: 'signed' }];
      }
      if (this.merchantStatus === 'rejected') {
        return [{ color: 'red', label: 'Rejected', value: 'rejected' }];
      }
      return [
        { color: 'purple', label: 'Signing', value: 'signing' },
        { color: 'red', label: 'Rejected', value: 'rejected' },
      ];
    },
    actualStatusColor() {
      return get(find(this.statuses, { value: this.newStatus }), 'color', 'purple');
    },
    isNoAgreement() {
      return this.merchantStatus === 'new';
    },
    statusFrom() {
      return find(this.statuses, { value: this.merchantStatus });
    },
    statusTo() {
      return find(this.statuses, { value: this.newStatus });
    },
  },
  methods: {
    sendMessage(message) {
      if (this.modalType === 'changeStatus') {
        this.changeStatus(message);
      } else {
        this.$emit('sendMessage', message);
      }
      this.modalOpened = false;
    },
    openChangeStatusModal(status) {
      if (status !== 'rejected') {
        showErrorMessage('You can change status to rejected only', { position: 'bottom-center' });
        return;
      }
      this.newStatus = status;
      this.modalType = 'changeStatus';
      this.modalOpened = true;
    },
    changeStatus(message) {
      this.$emit('changeStatus', { status: this.newStatus, message });
    },
    openContactModal() {
      this.modalType = 'contact';
      this.modalOpened = true;
    },
    closeModal() {
      if (this.modalType === 'changeStatus') {
        this.newStatus = this.merchantStatus;
      }
      this.modalOpened = false;
    },
    uploadDocument() {
      this.$emit('uploadDocument');
    },
    openLicense() {
      this.$emit('openLicense');
    },
  },
};
</script>

<template>
<UiPanel>
  <section
    v-if="!isNoAgreement"
    class="section"
  >
    <UiHeader level="3" :hasMargin="true">
      PDF file
    </UiHeader>
    <UiText>
      When merchant signs the license agreement it can be dowloaded here
      for future reference and sending it to risk manager for KYC.
    </UiText>
    <div class="agreement">
      <IconFile v-if="agreement.metadata.size" />
      <IconFileLoader v-else />
      <div class="agreement-text">
        <div class="first-line">License Agreement.{{ agreement.metadata.extension }}</div>
      </div>
    </div>
    <div class="links">
      <a
        v-if="agreement.metadata.size"
        class="link"
        :href="agreement.url"
        @click.prevent="uploadDocument"
      >
        <IconDownload class="icon" />
        DOWNLOAD
      </a>
      <div
        v-if="merchantStatus === 'signing'"
        class="link"
        @click="openLicense"
      >
        <IconPen class="icon" />
        E-SIGN
      </div>
    </div>
  </section>
  <section class="section">
    <UiHeader level="3" :hasMargin="true">
      Status
    </UiHeader>
    <UiText>
      Choose the actual status for every step of onboarding procedure.
      Merchant will get different notifications depending on the LA request status.
    </UiText>
    <div
      v-if="isNoAgreement"
      class="no-agreement"
    >
      No agreement
    </div>
    <UiSelectAsButton
      v-else
      tipInnerPosition="left"
      textColor="white"
      :color="actualStatusColor"
      :isRounded="true"
      :options="statuses"
      :value="merchantStatus"
      @input="openChangeStatusModal"
    />
  </section>
  <section class="footer">
    <div
      class="link"
      @click="openContactModal"
    >
      <IconEdit class="icon" />
      Contact merchant
    </div>
  </section>
  <MerchantAdminModal
    v-if="modalOpened"
    :statusFrom="statusFrom"
    :statusTo="statusTo"
    :type="modalType"
    @close="closeModal"
    @send="sendMessage"
  />
</UiPanel>
</template>

<style lang="scss" scoped>
.section {
  padding-bottom: 32px;
  margin-bottom: 32px;
  border-bottom: 1px solid #e8eaeb;
}
.footer {
  display: flex;
  flex-basis: 100%;
  justify-content: flex-end;
}
.agreement {
  display: flex;
  margin-bottom: 16px;
}
.no-agreement {
  display: inline-flex;
  align-items: center;
  border: 1px solid #e3e5e6;
  border-radius: 16px;
  padding: 0 16px;
  height: 32px;
  color: #919699;
  letter-spacing: 0.1px;
  font-family: Roboto;
  font-weight: 500;
  font-size: 14px;
  cursor: default;
}
.link {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  color: #3d7bf5;
  transition: color 0.2s ease-out;
  line-height: 24px;

  & > svg {
    transition: fill 0.2s ease-out;
  }

  &:hover {
    color: rgba(#3d7bf5, 0.85);

    & > svg {
      fill: rgba(#3d7bf5, 0.85);
    }
  }

  &:active {
    color: #3d7bf5;

    & > svg {
      fill: #3d7bf5;
    }
  }

  & ~ & {
    margin-left: 20px;
    padding-left: 20px;
    border-left: 1px solid #e3e5e6;
  }
}
.agreement-text {
  font-family: Roboto;
  padding-left: 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  margin-bottom: 2px;
  color: #000;
}
.icon {
  margin-right: 8px;
  fill: #3d7bf5;
}
</style>
