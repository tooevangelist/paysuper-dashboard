import $ from 'jquery'

export default {
    methods: {
        success: function (message, opts = {}) {
            this.notify('success', message, opts);
        },
        error: function (message, opts = {}) {
            this.notify('error', message, opts);
        },
        getError: function (e) {
            let message = 'Unknown error. Try request later.';

            if (e.hasOwnProperty('response') && e['response'].hasOwnProperty('data')
                && typeof e['response']['data'] === 'object') {
                let keys = Object.keys(e['response']['data']);
                message = e['response']['data'][keys[0]];
            }

            return message;
        },
        notify: function (type, message, opts = {}) {
            let options = {
                theme: 'primary',
                position: 'top-right',
                type: type,
                duration : 5000
            };

            options = $.extend({}, options, opts);

            let toast = this['$toast'].show(message, options);

            toast.el.addEventListener('click', function () {
                toast.goAway(0);
            });
        }
    }
};