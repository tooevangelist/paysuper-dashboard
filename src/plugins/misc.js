import Vue from 'vue';
import { extend } from 'lodash-es';
import { showSuccessMessage, showErrorMessage } from '@/helpers/notifications';

function $navigate(path, query = {}) {
  this.$router.push({ path, query });
}

function $formatPrice(value, currency) {
  return new Intl.NumberFormat(this.$i18n.locale, { style: 'currency', currency }).format(value);
}

extend(Vue.prototype, {
  $navigate,
  $formatPrice,
  $showSuccessMessage: showSuccessMessage,
  $showErrorMessage: showErrorMessage,
});
