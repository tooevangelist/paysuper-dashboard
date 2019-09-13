<script>
import { includes } from 'lodash-es';

export default {
  name: 'UiLangsBar',
  props: {
    list: {
      type: Array,
      default: () => ['en', 'ru'],
    },
    filledList: {
      type: Array,
      default: () => [],
    },
    selectedLang: {
      type: String,
      default: 'en',
    },
  },
  data() {
    return {
      currentLang: this.selectedLang,
    };
  },
  watch: {
    selectedLang(lang) {
      this.currentLang = lang;
    },
  },
  methods: {
    checkIsFilledLang(lang) {
      return includes(this.filledList, lang);
    },
    onSelect(lang) {
      this.currentLang = lang;
      this.$emit('change', lang);
    },
  },
};
</script>

<template>
<div class="ui-langs-bar">
  <button
    class="lang-button"
    v-for="lang in list"
    :key="lang"
    :class="{
      '_selected': lang === currentLang,
      '_filled': checkIsFilledLang(lang),
    }"
    @click="onSelect(lang)"
  >
    {{ lang }}
  </button>
</div>
</template>

<style scoped lang="scss">
.lang-button {
  position: relative;
  background-color: #fff;
  border: 1px solid #e3e5e6;
  border-radius: 14px;
  font-size: 14px;
  padding: 0 18px;
  outline: none;
  height: 28px;
  text-transform: uppercase;
  display: inline-flex;
  margin-bottom: 2px;

  & + & {
    margin-left: 2px;
  }

  &:after {
    content: "";
    border-radius: 50%;
    background-color: #ea3d2f;
    width: 4px;
    height: 4px;
    top: 11px;
    left: 8px;
    position: absolute;
  }

  &:hover:not(._selected) {
    color: #3d7bf5;
    background-color: #e6efff;
    border-color: #e6efff;
    cursor: pointer;

    .close-button {
      fill: #3d7bf5;
      opacity: 1;
    }
  }

  &._filled {
    &:after {
      display: none;
    }
  }
  &._selected {
    background-color: #f7f9fa;
    border-color: #f7f9fa;
  }
}

.close-button {
  position: absolute;
  top: 9px;
  right: 8px;
  opacity: 0;
}
</style>
