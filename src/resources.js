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

export default {
  config,
  notifications: {
    showSuccessMessage(message, opts = {}) {
      showToasted('success', message, opts);
    },

    showErrorMessage(message, opts = {}) {
      showToasted('error', message, opts);
    },
  },
};
