<template>
    <div style="display: flex; height: 100vh;">
      <div style="margin: auto; text-align: center">
        <h2>Payment is finished successfuly</h2>
        <p><b>This page will be closed in a few seconds.</b></p>
        <p>Check the payment details at the page where you've started the payment.</p>
      </div>
    </div>
</template>

<script>
    export default {
        layout: 'login',
        head: {
            title: 'Payment is finished'
        },

        mounted() {
            window.opener.postMessage({
                source: 'PAYONE_PAYMENT_FORM',
                name: 'FINAL_SUCCESS',
            }, '*');

            console.log(11111, 'say')
        }
    }
</script>