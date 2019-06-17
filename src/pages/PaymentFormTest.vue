<template>
  <div>
    <div id="p1payone-form"></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  async mounted() {
    let result;
    try {
      const { data } = await axios.post(
        'https://p1payapi.tst.protocol.one/api/v1/order',
        {
          project: '5cd5620f06ae110001509185',
          products: ['5cda8d3938e0e2000176988b'],
        },
      );
      result = data;
    } catch (error) {
      this.isInited = false;
      console.error(error);
    }
    window.PAYSUPER_FORM_DATA = result;

    window.PAYSUPER_FORM_OPTIONS = {
      layout: this.$route.query.layout || 'page',
    };

    const recaptchaScript = document.createElement('script');
    recaptchaScript.setAttribute('src', 'https://static.protocol.one/paysuper/form/dev/paysuper-form.js');
    document.head.appendChild(recaptchaScript);
  },
};
</script>
