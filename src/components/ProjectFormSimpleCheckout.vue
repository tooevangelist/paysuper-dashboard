<script>
import {
  Select, TextField, Header, SwitchBox,
} from '@protocol-one/ui-kit';

import { mapState } from 'vuex';

export default {
  name: 'ProjectForm',

  components: {
    Select,
    TextField,
    Header,
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
    };
  },

  computed: {
    ...mapState('Dictionaries', ['currencies']),

    isSimpleCheckout: {
      get() {
        return this.project.callback_protocol === 'default';
      },

      set(value) {
        this.project.callback_protocol = value ? 'default' : 'empty';
      },
    },
  },
};
</script>

<template>
  <div class="project-form-simple-checkout">
    <Header level="2" :hasMargin="true">
      Simple checkout
      <SwitchBox class="switch-box" v-model="isSimpleCheckout" />
    </Header>

    <div class="field-row">
      <Select v-model="project.name" :options="currencies" label="Default request currency" />
    </div>

    <div class="field-row">
      <Select v-model="project.name" :options="currencies" label="Limits currency" />
    </div>

    <div class="field-row">
      <div class="field-item">
        <TextField v-model="project.url_process_payment" label="Minimal amount allowed" />
      </div>
      <div class="field-item">
        <TextField v-model="project.url_process_payment" label="Maximal amount allowed" />
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.project-form-simple-checkout {
  width: 528px;
}

.field-row {
  display: flex;
  align-items: center;
}

.field-item {
  flex-grow: 1;

  & + & {
    margin-left: 30px;
  }
}

.switch-box {
  margin-left: 16px;
}

.textarea {
  width: 100%;
}

.generate-button {
  margin-left: 30px;
}
</style>
