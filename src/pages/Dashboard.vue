<script>
import DashboardAside from '@/components/DashboardAside.vue';
import DashboardHeader from '@/components/DashboardHeader.vue';

export default {
  components: {
    DashboardAside,
    DashboardHeader,
  },
};
</script>

<template>
<div class="dashboard">
  <DashboardHeader projectName="CD Projects" />

  <main class="main">
    <aside class="aside">
      <DashboardAside />
    </aside>

    <section class="content">
      <RouterView />
    </section>
  </main>
</div>
</template>

<style lang="scss" scoped>
.dashboard {
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
