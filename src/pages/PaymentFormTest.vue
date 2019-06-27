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
    let request = {
      project: '5cd5620f06ae110001509185',
      products: ['5cda8d3938e0e2000176988b', '5cda8e6738e0e2000176988c'],
    };
    if (this.$route.query.productsCount) {
      request.products = request.products.slice(0, this.$route.query.productsCount);
    }
    if (this.$route.query.pay) {
      const [amount, currency] = this.$route.query.pay.split('-');
      request = {
        project: '5cda856f38e0e20001769886',
        amount: Number(amount),
        currency,
      };
    }
    try {
      const { data } = await axios.post(
        'https://p1payapi.tst.protocol.one/api/v1/order',
        request,
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

    const script = document.createElement('script');
    script.setAttribute('src', 'https://static.protocol.one/paysuper/form/dev/paysuper-form.js');
    document.head.appendChild(script);
  },
};
</script>
