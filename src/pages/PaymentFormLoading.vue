<template>
  <div>
    <div id="p1payone-form"></div>
  </div>
</template>

<script>

export default {
  async created() {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://static.protocol.one/paysuper/form/dev/paysuper-form.js');
    document.head.appendChild(script);
  },
};
</script>
