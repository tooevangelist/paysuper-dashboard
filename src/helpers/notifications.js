import Vue from 'vue';
import { extend } from 'lodash-es';
import getMessageFromError from '@/helpers/getMessageFromError';

export function notify(type, message, opts = {}) {
  let options = {
    position: 'top-right',
    type,
    duration: 5000,
  };

  options = extend({}, options, opts);

  const toast = Vue.toasted.show(message, options);

  toast.el.addEventListener('click', () => {
    toast.goAway(0);
  });
}

export function showSuccessMessage(message, opts = {}) {
  notify('success', message, opts);
}

export function showErrorMessage(error, opts = {}) {
  let message = getMessageFromError(error);
  if (!message) {
    message = 'Unknown error. Try request later.';
    console.error(error);
  }
  notify('error', message, opts);
}
