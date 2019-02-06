import $ from 'jquery';

export default {
  methods: {
    success(message, opts = {}) {
      this.notify('success', message, opts);
    },
    error(message, opts = {}) {
      this.notify('error', message, opts);
    },
    getError(e) {
      let message = 'Unknown error. Try request later.';

      if (e.hasOwnProperty('response') && e.response.hasOwnProperty('data')
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

      options = $.extend({}, options, opts);

      const toast = this.$toast.show(message, options);

      toast.el.addEventListener('click', () => {
        toast.goAway(0);
      });
    },
  },
};
