import { extend } from 'lodash-es';

export default {
  methods: {
    $_Notifications_showSuccessMessage(message, opts = {}) {
      this.$_Notifications_notify('success', message, opts);
    },
    $_Notifications_showErrorMessage(message, opts = {}) {
      this.$_Notifications_notify('error', message, opts);
    },
    $_Notifications_getErrorMessage(e) {
      let message = 'Unknown error. Try request later.';

      if (e.response && e.response.data
        && typeof e.response.data === 'object') {
        const keys = Object.keys(e.response.data);
        message = e.response.data[keys[0]];
      }

      return message;
    },
    $_Notifications_notify(type, message, opts = {}) {
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
