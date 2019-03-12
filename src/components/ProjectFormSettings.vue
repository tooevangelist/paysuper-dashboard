<script>
import {
  Button, TextField, Header, UiTextarea, SwitchBox,
} from '@protocol-one/ui-kit';

export default {
  name: 'ProjectForm',

  components: {
    TextField,
    Button,
    Header,
    UiTextarea,
    SwitchBox,
  },

  props: {
    project: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      test11: false,
    };
  },

  computed: {
    createInvoiceAllowedUrls: {
      get() {
        return this.project.create_invoice_allowed_urls.join('\n');
      },

      set(value) {
        this.project.create_invoice_allowed_urls = value ? value.split('\n') : [];
      },
    },
  },
};
</script>

<template>
  <div class="project-form-settings">
    <Header level="2" :hasMargin="true">Settings</Header>

    <div class="field-row">
      <TextField v-model="project.name" label="Project name" />
    </div>

    <div class="field-row">
      <TextField v-model="project.url_check_account" label="Validation request URL" />
    </div>

    <div class="field-row">
      <TextField v-model="project.url_process_payment" label="Payment notifications URL" />
    </div>

    <div class="field-row">
      <TextField v-model="project.url_redirect_fail" label="Failed attempt redirect URL" />
    </div>

    <div class="field-row">
      Restrict payment attempts {{test11}}
    <SwitchBox class="switch-box" v-model="test11" />
    </div>

    <div class="field-row">
      <UiTextarea label="Allowed URLs" v-model="createInvoiceAllowedUrls" />
      <!--
        Request for creation order will be possible only from the URLs specified here.
        List URLs through comma.
      -->
    </div>

    <div class="field-row">
      <TextField v-model="project.secret_key" label="Secret key" />
      <Button>Generate</Button>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.field-row {
  display: flex;
  align-content: center;
}

.switch-box {
  margin-left: 16px;
}
</style>
