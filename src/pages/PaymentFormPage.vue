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
      project: '5cda856f38e0e20001769886',
      amount: 20,
      currency: 'USD',
    };

    const { data } = await axios.get('https://static.protocol.one/paysuper/form/dev/paysuper-form.js');
    const script = document.createElement('script');
    script.innerHTML = data;
    document.head.appendChild(script);
  },
};
</script>
