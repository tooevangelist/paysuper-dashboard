export default {
  data() {
    return {

    };
  },
  methods: {
    isUrl(value) {
      // eslint-disable-next-line
      return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(value);
    },
    isEmail(value) {
      // eslint-disable-next-line
      return /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/gm.test(value);
    },
  },
};
