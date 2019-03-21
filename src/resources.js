import Vue from 'vue';
import { extend } from 'lodash-es';
import config from './config';


function showToasted(type, message, opts = {}) {
  let options = {
    theme: 'primary',
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

function getErrorMessage(e) {
  let message = 'Unknown error. Try request later.';

  if (e.response && e.response.data
    && typeof e.response.data === 'object') {
    const keys = Object.keys(e.response.data);
    message = e.response.data[keys[0]];
  }

  return message;
}

export default {
  config,
  notifications: {
    showSuccessMessage(message, opts = {}) {
      showToasted('success', message, opts);
    },

    showErrorMessage(message, opts = {}) {
      const isMessageObject = typeof message !== 'string';
      showToasted(
        'error',
        isMessageObject ? getErrorMessage(message) : message,
        opts,
      );
    },
  },
};
