export default {
  data() {
    return {

    };
  },
  methods: {
    isUrl(value) {
      return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(value);
    },
    isEmail(value) {
      return /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/gm.test(value);
    },
  },
};
