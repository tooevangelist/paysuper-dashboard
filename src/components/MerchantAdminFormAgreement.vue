<script>
import {
  UiButton,
  UiHeader,
  UiCheckbox,
  UiTextField,
} from '@protocol-one/ui-kit';
import moment from 'moment';
import StatusIcon from '@/components/StatusIcon.vue';
import FileDownload from '@/components/FileDownload.vue';
import MerchantStatusChanger from '@/components/MerchantStatusChanger.vue';
import LabelTag from '@/components/LabelTag.vue';
import MerchantExtendingMenu from '@/components/MerchantExtendingMenu.vue';

export default {
  name: 'MerchantFormCompanyInfo',

  components: {
    UiButton,
    UiHeader,
    UiCheckbox,
    UiTextField,
    StatusIcon,
    FileDownload,
    MerchantStatusChanger,
    LabelTag,
    MerchantExtendingMenu,
  },

  props: {
    merchant: {
      required: true,
      type: Object,
    },
    agreementDocument: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isPreSigned: this.merchant.has_psp_signature,
      mailTrackingLink: '',
    };
  },

  methods: {
    requestAgreementGeneration() {
      this.$emit('requestAgreementChange', {
        action: 'generateAgreement',
        isPreSigned: this.isPreSigned,
      });
    },

    formatDate(date) {
      return moment.unix(date).format('D MMM YYYY, HH:MM');
    },
  },
};
</script>

<template>
  <div class="merchant-admin-form-agreement">
    <div class="header-line">
      <template v-if="merchant.agreement_type">
        <div class="header-line__date">
          {{formatDate(merchant.updated_at.seconds)}}
        </div>

        <MerchantStatusChanger
          v-if="merchant.status === 1 || merchant.status === 2"
          :status="merchant.status"
          @statusChange="$emit('requestAgreementChange', {
            action: 'setStatus',
            value: $event.code,
            message: $event.message
          })"
        />

        <LabelTag
          v-if="merchant.status === 3"
          color="aqua"
          v-text="'Signing'"
        />
        <LabelTag
          v-if="merchant.status === 4"
          color="green"
          v-text="'Signed'"
        />
        <MerchantExtendingMenu
          class="header-line__menu"
          :merchant="merchant"
          @sendNotification="$emit('sendNotification', $event)"
        />
      </template>
      <template v-else>
        Agreement is not requested yet.
      </template>
    </div>
    <UiHeader level="2" :hasMargin="true">Licence agreement</UiHeader>

    <template v-if="
      merchant.agreement_type &&
      (
        merchant.status === 1 ||
        merchant.status === 2
      )
    ">
      <p class="status-description">
        Merchant asked for
        <template v-if="merchant.agreement_type === 1">paper signing</template>
        <template v-if="merchant.agreement_type === 2">e-signing</template>
      </p>

      <div class="checkbox-row" v-if="merchant.status === 2">
        <label class="checkbox" v-if="merchant.agreement_type === 2">
          <UiCheckbox
            class="checkbox__field"
            :checked="isPreSigned"
            @change="isPreSigned = $event"
          />
          <span class="checkbox__text">Pre-signed</span>
        </label>

        <UiButton @click="requestAgreementGeneration">
          Generate
        </UiButton>
      </div>

    </template>

    <template v-if="merchant.status === 3 || merchant.status === 4">
      <FileDownload
        class="file-download"
        :name="agreementDocument.metadata.name"
        :size="agreementDocument.metadata.size"
        :extension="agreementDocument.metadata.extension"
        :url="agreementDocument.url"
      />

      <!-- paper sign -->
      <template v-if="merchant.agreement_type === 1">
        <div class="signed-row" v-if="merchant.has_psp_signature">
          <StatusIcon status="complete" />
          <span class="signed-row__text">Physically signed by Pay Super</span>
        </div>

        <div class="signed-row" v-if="merchant.agreement_sent_via_mail">
          <StatusIcon status="complete" />
          <span class="signed-row__text">Sent by mail by Pay Super</span>
        </div>

        <div class="signed-row" v-if="merchant.has_merchant_signature">
          <StatusIcon status="complete" />
          <span class="signed-row__text">Physically signed by {{merchant.name}}</span>
        </div>


        <div class="checkbox-row">
          <label class="checkbox">
            <UiCheckbox
              class="checkbox__field"
              :disabled="merchant.agreement_sent_via_mail"
              :checked="merchant.has_psp_signature"
              @change="$emit('requestAgreementChange', {
                action: 'setPspSignature',
                value: $event
              })"
            />
            <span class="checkbox__text">Phisicaly signed by Pay Super</span>
          </label>
        </div>

        <template v-if="merchant.has_psp_signature">
          <div class="checkbox-row">
            <label class="checkbox">
              <UiCheckbox
                class="checkbox__field"
                :disabled="merchant.agreement_sent_via_mail"
                :checked="merchant.agreement_sent_via_mail"
                @change="$emit('requestAgreementChange', {
                  action: 'setSentViaEmail',
                  value: $event
                })"
              />
              <span class="checkbox__text">Sent via mail</span>
            </label>
          </div>
          <div>
            <UiTextField
              class="mail-tracking-link-field"
              label="Mail traking Link"
              v-model="mailTrackingLink"
              @input="$emit('requestAgreementChange', {
                action: 'setMailTrackingLink',
                value: mailTrackingLink
              })"
            />
          </div>
        </template>

        <div class="checkbox-row">
          <label class="checkbox">
            <UiCheckbox
              class="checkbox__field"
              :checked="merchant.has_merchant_signature"
              @change="$emit('requestAgreementChange', {
                action: 'setMerchantSignature',
                value: $event
              })"
            />
            <span class="checkbox__text">Merchan’t signature approved</span>
          </label>
        </div>

      </template>

      <!-- e-sign -->
      <template v-if="merchant.agreement_type === 2">
        <div class="signed-row" v-if="merchant.has_psp_signature">
          <StatusIcon status="complete" />
          <span class="signed-row__text">E-signed by Pay Super</span>
        </div>

        <div class="signed-row" v-if="merchant.has_merchant_signature">
          <StatusIcon status="complete" />
          <span class="signed-row__text">E-signed by {{merchant.name}}</span>
        </div>

        <div class="controls">
          <UiButton
            class="controls__button"
            v-if="!merchant.has_psp_signature"
            @click="$emit('requestAgreementChange', {action: 'setPspSignature', value: true})"
          >E-sign</UiButton>
          <UiButton
            class="controls__button"
            @click="$emit('requestAgreementChange', {action: 'revokeSigning'})"
          >Revoke</UiButton>
        </div>
      </template>
    </template>

  </div>
</template>

<style lang="scss" scoped>
.merchant-admin-form-agreement {
  width: 528px;
}

.header-line {
  height: 80px;
  margin-top: -10px;
  display: flex;
  align-items: center;
  color: #0c2441;

  &__date {
    margin-right: 30px;
  }

  &__menu {
    margin-left: 20px;
  }
}

.file-download {
  margin: 30px 0 20px;
}

.status-description {
  font-size: 16px;
  line-height: 20px;
  color: #b1b1b1;
  margin: 10px 0;
}

.controls {
  &__button {
    margin-right: 30px;
  }
}

.checkbox-row {
  display: flex;
  align-items: center;
}

.checkbox {
  display: flex;
  align-items: center;
  min-height: 40px;
  cursor: pointer;
  margin-right: 30px;

  &__field {
    margin-right: 16px;
  }
}

.signed-row {
  display: flex;
  align-items: center;
  margin: 12px 0;

  &__text {
    margin-left: 10px;
  }
}

.mail-tracking-link-field {
  width: 300px;
}
</style>
