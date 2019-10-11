<template>
<div id="p1payone-form"></div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      scriptData: '',
    };
  },
  async created() {
    const {
      pay,
      products,
      productsCount,
      project,
      type,
    } = this.$route.query;
    let request = {
      project: project || '5cd5620f06ae110001509185',
      products: products ? products.split(',') : ['5d848f484dd6a50001970479', '5d8c7a219e362100013de214'],
      type: type || 'product',
    };
    if (productsCount) {
      request.products = request.products.slice(0, productsCount);
    }
    if (pay) {
      const [amount, currency] = pay.split('-');
      request = {
        project: request.project,
        amount: Number(amount),
        currency,
        type: 'simple',
      };
    }
    window.PAYSUPER_ORDER_PARAMS = request;

    const { data } = await axios.get('https://static.protocol.one/paysuper/form/dev/paysuper-form.js');
    const script = document.createElement('script');
    script.innerHTML = data;
    document.head.appendChild(script);
  },
};
</script>
