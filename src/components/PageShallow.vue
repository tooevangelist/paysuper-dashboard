<script>
import LocaleSwitcher from '@/components/LocaleSwitcher.vue';

export default {
  name: 'PageShallow',

  components: {
    LocaleSwitcher,
  },
};
</script>

<template>
<div class="page-shallow">
  <div class="header">
    <h1 class="title">Pay Super</h1>
    <LocaleSwitcher />
  </div>
  <main class="content">
    <slot></slot>
  </main>
  <div class="footer">
    <a class="footer__link" href="#">Terms of Use</a>
    <a class="footer__link" href="#">Agreement</a>
  </div>
</div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500|Roboto&display=swap");

body {
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #3e4345;
}
</style>


<style lang="scss" scoped>
.page-shallow {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 24px;
}

.title {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  font-family: "Quicksand", sans-serif;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 25px;
}

.footer {
  background: #f7f9fa;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;

  &__link {
    color: #919699;
    font-size: 14px;
    line-height: 20px;
    margin: 0 16px;
  }
}
</style>
