<script>
import Page from '@/components/Page.vue';

export default {
  name: 'App',
  components: {
    Page,
  },
  computed: {
    layoutComponentName() {
      if (this.$route.meta && this.$route.meta.layout) {
        return this.$route.meta.layout;
      }
      return 'div';
    },
  },
};
</script>

<template>
  <component class="app" :is="layoutComponentName">
    <router-view></router-view>
  </component>
</template>

<style lang="scss">
@import "@/assets/scss/_custom.scss";
body {
  margin: 0;
}

* {
  box-sizing: border-box;
}

p {
  margin: 0;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

label {
  margin: 0;
}
</style>
