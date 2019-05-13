<script>
import {
  UiLangsBar,
  UiTextField,
} from '@protocol-one/ui-kit';
import { omit, pickBy, map } from 'lodash-es';

export default {
  name: 'LangTextField',

  components: {
    UiLangsBar,
    UiTextField,
  },

  model: {
    prop: 'value',
    event: 'input',
  },

  props: {
    additionalInfo: {
      default: '',
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    errorText: {
      default: '',
      type: String,
    },
    hasError: {
      default: false,
      type: Boolean,
    },
    label: {
      default: '',
      type: String,
    },
    required: {
      default: false,
      type: Boolean,
    },
    type: {
      default: 'text',
      type: String,
    },
    value: {
      required: true,
    },
  },

  data() {
    return {
      selectedLang: 'en',
    };
  },

  computed: {
    selectedValue() {
      return this.value[this.selectedLang];
    },
    filledList() {
      return map(pickBy(this.value, value => value), (key, value) => value);
    },
  },

  methods: {
    updateValue(value) {
      this.value[this.selectedLang] = value;
    },
    omit,
  },
};
</script>

<template>
  <div class="lang-text-field">
    <UiTextField
      v-bind="omit($props, ['value'])"
      @input="updateValue"
      :value="selectedValue"
    ></UiTextField>
    <UiLangsBar
      :list="['en', 'ru']"
      :selectedLang="selectedLang"
      :filledList="filledList"
      @change="selectedLang = $event"
    ></UiLangsBar>
  </div>
</template>

<style lang="scss" scoped>
.lang-text-field {
  width: 100%;
  margin-bottom: 24px;
}
</style>
