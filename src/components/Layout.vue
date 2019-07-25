<script>
import LayoutAside from '@/components/LayoutAside.vue';
import LayoutHeader from '@/components/LayoutHeader.vue';

export default {
  name: 'Layout',
  components: {
    LayoutAside,
    LayoutHeader,
  },
};
</script>

<template>
<div class="template-layout">
  <LayoutHeader projectName="CD Projects" />

  <main class="main">
    <aside class="aside">
      <LayoutAside />
    </aside>

    <section class="content">
      <slot />
    </section>
  </main>
</div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500|Roboto:400,500&display=swap");

body,
html {
  display: flex;
  flex-direction: column;
}

.template-layout {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #5e6366;

  a {
    display: inline-block;
    text-decoration: none;
    color: #78909c;
    transition: color 0.2s ease-out;

    &:hover {
      text-decoration: none;
      color: #3d7bf5;
    }
  }
  *,
  *::before,
  *::after {
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
}
</style>

<style lang="scss" scoped>
.template-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
}
.main {
  display: flex;
  justify-content: space-between;
  padding-bottom: 64px;
}
.aside {
  position: relative;
  min-width: 240px;
  max-width: 320px;
  flex-basis: 20%;
}
.content {
  position: relative;
  flex-basis: 80%;
  flex-grow: 1;
}
</style>
