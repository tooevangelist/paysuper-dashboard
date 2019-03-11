<template>
  <div>
    <iframe
      :src="docUrl"
      frameborder="0"
      width="100%"
      style="position: absolute; height: 100vh; border: none"
    ></iframe>
  </div>
</template>

<script>

export default {
  computed: {
    docUrl() {
      return `${process.env.VUE_APP_P1PAYAPI_URL}/docs`;
    },
  },
};
</script>
