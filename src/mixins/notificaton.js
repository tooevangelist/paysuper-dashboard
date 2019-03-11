import { extend } from 'lodash-es';

export default {
  methods: {
    success(message, opts = {}) {
      this.notify('success', message, opts);
    },
    error(message, opts = {}) {
      this.notify('error', message, opts);
    },

    showSuccessMessage(message, opts = {}) {
      this.notify('success', message, opts);
    },
    showErrorMessage(message, opts = {}) {
      this.notify('error', message, opts);
    },
    getErrorMessage(e) {
      let message = 'Unknown error. Try request later.';

      if (e.response && e.response.data
        && typeof e.response.data === 'object') {
        const keys = Object.keys(e.response.data);
        message = e.response.data[keys[0]];
      }

      return message;
    },
    notify(type, message, opts = {}) {
      let options = {
        theme: 'primary',
        position: 'top-right',
        type,
        duration: 5000,
      };

      options = extend({}, options, opts);

      const toast = this.$toasted.show(message, options);

      toast.el.addEventListener('click', () => {
        toast.goAway(0);
      });
    },
  },
};
