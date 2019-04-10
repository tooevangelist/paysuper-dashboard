<script>
import { includes } from 'lodash-es';
import {
  UiButton, UiHeader,
} from '@protocol-one/ui-kit';
import FileDownload from '@/components/FileDownload.vue';
import StatusIcon from '@/components/StatusIcon.vue';

export default {
  name: 'MerchantFormCompanyInfo',

  components: {
    UiButton,
    UiHeader,
    FileDownload,
    StatusIcon,
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

  methods: {
    includes,
  },
};
</script>

<template>
  <div class="merchant-form-agreement">
    <UiHeader level="2" :hasMargin="true">
      Licence agreement
    </UiHeader>

    <template v-if="includes([0, 1, 2], merchant.status)">
      <FileDownload
        class="file-download"
        :name="agreementDocument.metadata.name"
        :size="agreementDocument.metadata.size"
        :extension="agreementDocument.metadata.extension"
        :url="agreementDocument.url"
      />

      <div class="description">
        <p>
          Here is our typical agreement form.
          You could e-sign agreement with Pay Super or use good old paper signing via mail delivery.
        </p>
        <template v-if="!merchant.agreement_type">
          <p>
            Before asking us for agreement please make sure you fill in
            all the company information fields correctly.
          </p>
          <p>
            Our manager will check all information and notify you as soon as the agreement is ready.
          </p>
        </template>
        <template v-else>
          <p>
            You have requested an agreement from us to sign.
            We study information about your company.
          </p>
          <p>
            If you want to make changes, feel free to revoke the application for an agreement.
          </p>
        </template>
      </div>

      <div class="controls">
        <template v-if="!merchant.agreement_type">
          <UiButton
            class="controls__button"
            @click="$emit('requestAgreementChange', {action: 'setAgreementType', value: 'electro'})"
          >
            Ask for e-agreement
          </UiButton>
          <UiButton
            class="controls__button"
            @click="$emit('requestAgreementChange', {action: 'setAgreementType', value: 'paper'})"
          >
            Ask for paper agreement
          </UiButton>
        </template>
        <template v-else>
          <UiButton
            @click="$emit('requestAgreementChange', {action: 'revokeSigning'})"
            :isTransparent="true"
          >
            Revoke
          </UiButton>
        </template>
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
        <div
          class="signed-row"
          v-if="merchant.has_psp_signature"
        >
          <StatusIcon status="complete" />
          <span class="signed-row__text">Physically signed by Pay Super</span>
        </div>

        <template v-if="merchant.agreement_sent_via_mail">
          <div class="signed-row">
            <StatusIcon status="complete" />
            <span class="signed-row__text">
              Sent to you via mail.
              <a
                v-if="merchant.mail_tracking_link"
                :href="merchant.mail_tracking_link"
                target="_blank"
              >
                Tracking info.
              </a>
            </span>
          </div>

          <div class="signed-row">
            <StatusIcon status="waiting" />
            <span class="signed-row__text">Waiting our hard copy</span>
          </div>
        </template>
      </template>

      <!-- e-sign -->
      <template v-if="merchant.agreement_type === 2">
        <div
          class="signed-row"
          v-if="merchant.has_psp_signature"
        >
          <StatusIcon status="complete" />
          <span class="signed-row__text">E-signed by Pay Super</span>
        </div>
        <div
          class="signed-row"
          v-if="merchant.has_merchant_signature"
        >
          <StatusIcon status="complete" />
          <span class="signed-row__text">E-signed by {{merchant.name}}</span>
        </div>

        <div class="controls">
          <UiButton
            class="controls__button"
            v-if="!merchant.has_merchant_signature"
            @click="$emit('requestAgreementChange', {action: 'setMerchantSignature', value: true})"
          >
            E-sign
          </UiButton>
        </div>
      </template>

    </template>

    <!-- <div class="signed-row">
      <StatusIcon status="complete" />
      <span class="signed-row__text">E-signed by Pay Super</span>
    </div> -->

  </div>
</template>

<style lang="scss" scoped>
.merchant-form-agreement {
  width: 528px;
}

.file-download {
  margin: 30px 0 20px;
}

.description {
  // font-family: Lato;
  font-size: 16px;
  line-height: 20px;
  color: #b1b1b1;
  width: 450px;

  p {
    margin-bottom: 20px;
  }
}

.controls {
  &__button {
    margin-right: 30px;
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
</style>
