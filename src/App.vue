<script>
export default {
  name: 'App',
};
</script>

<template>
  <div class="app">
    <router-view></router-view>
  </div>
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
</style>
