<script>
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
  },

  data() {
    return {
      fakeStatus: this.merchant.status,
      statusesScheme: {
        1: {
          name: 'agreementRequested',
          chronology: [
            { code: 'complete', text: 'Agreement requested' },
            { code: 'waiting', text: 'Waiting for the review' },
          ],
        },
        2: {
          name: 'onReview',
          chronology: [
            { code: 'complete', text: 'Review started' },
            { code: 'waiting', text: 'Waiting for the review to complete' },
          ],
        },
        3: {
          name: 'approved',
          chronology: [
            { code: 'complete', text: 'Agreement request approved' },
            { code: 'waiting', text: 'Waiting for dunno what' },
          ],
        },
        4: {
          name: 'rejected',
          chronology: [
            { code: 'incomplete', text: 'Agreement request rejected. <a href="#">Details</a>' },
          ],
        },
        5: {
          name: 'agreementSigning',
          chronology: [
            { code: 'complete', text: 'Agreement request approved' },
            { code: 'waiting', text: 'Waiting for Pay Super to sign' },
          ],
        },
        6: {
          name: 'agreementSigned',
          chronology: [
            { code: 'waiting', text: 'Signed by Pay Super' },
          ],
        },
      },
    };
  },

  computed: {
    chronology() {
      if (!this.statusesScheme[this.fakeStatus]) {
        return null;
      }
      return this.statusesScheme[this.fakeStatus].chronology;
    },

    fakeStatusMirror: {
      get() {
        return this.fakeStatus;
      },
      set(value) {
        this.fakeStatus = Number(value);
      },
    },
  },

  methods: {

  },
};
</script>

<template>
  <div class="merchant-form-agreement">
    <UiHeader level="2" :hasMargin="true">Licence agreement</UiHeader>

    <FileDownload
      class="file-download"
      name="Pay Super - License agreement - form.pdf"
      size="2,56 Mb"
      extention="pdf"
      url="#"
    />

    <div class="description">
      <p>
        Here is our typical agreement form.
        You could e-sign agreement with Pay Super or use good old paper signing via mail delivery.
      </p>
      <p>
        Before asking us for agreement please make sure you fill in
        all the company information fields correctly.
      </p>
      <p>
        Our manager will check all information and notify you as soon as the agreement is ready.
      </p>
    </div>

    <input type="number" v-model="fakeStatusMirror" >
    <div>from 0 to 6</div>
    <div v-if="statusesScheme[fakeStatus]">{{statusesScheme[fakeStatus].name}}</div>

    <template v-if="chronology">
      <div class="signed-row" v-for="(item, index) in chronology" :key="index">
        <StatusIcon :status="item.code" />
        <span class="signed-row__text" v-html="item.text"></span>
      </div>
    </template>

    <div
      class="controls"
      v-if="!fakeStatus || fakeStatus === 4"
    >
      <UiButton
        class="controls__button"
        @click="$emit('requestStatusChange', 'agreementRequested')"
      >
        Ask for e-agreement
      </UiButton>
      <UiButton
        class="controls__button"
        @click="$emit('requestStatusChange', 'agreementRequested')"
      >
        Ask for paper agreement
      </UiButton>
      <!-- <UiButton class="controls__button">Ask for e-agreement</UiButton> -->
      <!-- <UiButton class="controls__button">Ask paper agreement</UiButton> -->
    </div>

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
