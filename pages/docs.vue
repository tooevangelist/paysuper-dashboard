<template>
  <div>
    <iframe
      :src="docUrl"
      frameborder="0"
      width="100%"
      style="position: absolute; height: 100%; border: none"
    ></iframe>
  </div>
</template>

<script>

export default {
  layout: 'login',
  computed: {
    docUrl() {
      return `${process.env.apiServerUrl}/docs`;
    },
  },
};
</script>
