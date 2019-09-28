<template>
  <div>
    <div id="p1payone-form"></div>
  </div>
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
    window.PAYSUPER_ORDER_PARAMS = {
      currency: 'EUR',
      project: '5cd5624a06ae110001509186',
      amount: 100,
      type: 'simple',
    };

    const { data } = await axios.get('https://static.protocol.one/paysuper/form/dev/paysuper-form.js');
    const script = document.createElement('script');
    script.innerHTML = data;
    document.head.appendChild(script);
  },
};
</script>
