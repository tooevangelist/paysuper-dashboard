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
    };
  },

  computed: {
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

    <div class="controls">
      <UiButton class="controls__button">Ask for e-agreement</UiButton>
      <UiButton class="controls__button">Ask paper agreement</UiButton>
    </div>

    <div class="signed-row">
      <StatusIcon status="complete" />
      <span class="signed-row__text">E-signed by Pay Super</span>
    </div>

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
  color: #B1B1B1;
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

  &__text {
    margin-left: 10px;
  }
}
</style>
