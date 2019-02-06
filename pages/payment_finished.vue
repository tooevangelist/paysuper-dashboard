<template>
  <div style="display: flex; height: 100vh;">
    <div style="margin: auto; text-align: center">
      <h2>Payment is finished successfuly</h2>
      <p>
        <b>We will try to close this page in a few seconds.</b>
      </p>
      <p>Feel free to close it by yourself.</p>
      <p>Check the payment details at the page where you've started the payment.</p>
      <p>hasOpener: {{hasOpener}}</p>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'login',
  head: {
    title: 'Payment is finished',
  },

  data() {
    return {
      hasOpener: false,
    };
  },

  mounted() {
    if (window.opener) {
      this.hasOpener = true;
      window.opener.postMessage({
        source: 'PAYONE_PAYMENT_FINISHED_PAGE',
        name: 'FINAL_SUCCESS',
      }, '*');
    }
  },
};
</script>
