<script>
import { get, find } from 'lodash-es';
import StatusIcon from '@/components/StatusIcon.vue';
import FileDownload from '@/components/FileDownload.vue';
import MerchantStatusChanger from '@/components/MerchantStatusChanger.vue';

export default {
  name: 'MerchantAdminLicenseAgreement',
  components: { MerchantStatusChanger },
  props: {
    agreement: {
      default: () => ({}),
      type: Object,
    },
    document: {
      default: () => ({}),
      type: Object,
    },
    merchantStatus: {
      default: 0,
      type: Number,
    },
  },
  data() {
    return {
      currentStatus: 'new',
      modalOpened: false,
    };
  },
  computed: {
    statuses() {
      return [
        { color: 'blue', label: 'New', value: 'new' },
        { color: 'purple', label: 'Singing', value: 'singing' },
        { color: 'green', label: 'Singed', value: 'singed' },
        { color: 'red', label: 'Rejected', value: 'rejected' },
      ];
    },
    currentStatusColor() {
      return get(find(this.statuses, { value: this.currentStatus }), 'color', 'blue');
    },
    isNoAgreement() {
      return this.merchantStatus === 0;
    },
  },
  methods: {
    changeStatus(status) {
      this.currentStatus = status;
      this.$emit('changeStatus', status);
    },
    openContactModal() {
      this.modalOpened = true;
      console.error('open contact modal');
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
        DOWNLOAD
      </a>
      <div
        v-if="merchantStatus === 3"
        class="link"
        @click="openLicense"
      >
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
      :color="currentStatusColor"
      :isRounded="true"
      :options="statuses"
      :value="currentStatus"
      @input="changeStatus"
    />
  </section>
  <section class="footer">
    <div
      class="link"
      @click="openContactModal"
    >
      <IconEdit class="icon-edit" />
      Contact merchant
    </div>
  </section>
  <MerchantStatusChanger v-if="modalOpened" />
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
  margin-right: 48px;
  border-right: 1px solid #e3e5e6;
}
.no-agreement{
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
.icon-edit {
  margin-right: 8px;
}
</style>
