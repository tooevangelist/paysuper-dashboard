<template>
<div id="p1payone-form"></div>
</template>

<script>
import axios from 'axios';

export default {
  async created() {
    const { data } = await axios.get('https://static.protocol.one/paysuper/sdk/dev/paysuper.js');
    const script = document.createElement('script');
    script.innerHTML = data;
    document.head.appendChild(script);
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

    const paySuper = new window.PaySuper({
      formUrl: '/payform-page/',
      ...request,
    });
    paySuper.renderModal();
  },
};
</script>
