export default {
    data: function () {
        return {

        }
    },
    methods: {
        isUrl: function (value) {
            return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(value);
        },
        isEmail: function (value) {
            return /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/gm.test(value);
        }
    }
}