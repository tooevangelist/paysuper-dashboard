<script>
import LayoutAside from '@/components/LayoutAside.vue';
import LayoutHeader from '@/components/LayoutHeader.vue';
import LayoutSubHeader from '@/components/LayoutSubHeader.vue';

export default {
  name: 'Layout',
  components: {
    LayoutAside,
    LayoutHeader,
    LayoutSubHeader,
  },
  data() {
    return {
      navigationItems: {
        dashboard: {
          additional: 'Homepage for main controls',
          icon: 'IconDashboard',
          link: '/dashboard',
          title: 'Dashboard',
          isAvailable: true,
        },
        projects: {
          additional: 'Organise your products for sales',
          icon: 'IconFolder',
          link: '/projects',
          title: 'Projects',
          isAvailable: false,
        },
        reports: {
          additional: 'Your weekly royalty reports',
          icon: 'IconBlank',
          link: '/reports',
          title: 'Reports',
          isAvailable: false,
        },
        payouts: {
          additional: 'Need license agreement',
          icon: 'IconCash',
          link: '/payouts',
          title: 'Payouts',
          isAvailable: false,
        },
        transaction: {
          additional: 'Full list of customer transactions',
          icon: 'IconCoin',
          link: '/transaction',
          title: 'Transaction Search',
          isAvailable: false,
        },
        intagrations: {
          additional: 'Technical integrations',
          icon: 'IconRepeat',
          link: '/intagrations',
          title: 'Intagrations',
          isAvailable: false,
        },
        customers: {
          additional: 'Need license agreement',
          icon: 'IconExcited',
          link: '/customers',
          title: 'Customers',
          isAvailable: false,
        },
      },
      currentNavigationItem: 'dashboard',
      period: [1534784400000, 1537462800000],
      projectName: 'CD Projects',
    };
  },
  methods: {
    periodChange(period) {
      this.period = period;
    },
  },
};
</script>

<template>
<div class="template-layout">
  <LayoutHeader :projectName="projectName" />
  <LayoutSubHeader
    class="sub-header"
    currentStepName="Account Info"
    :currentStep="4"
    :period="period"
    :stepsCount="6"
    @periodChange="periodChange"
  />

  <main class="main">
    <aside class="aside">
      <UiScrollbarBox>
        <LayoutAside
          :currentItem="currentNavigationItem"
          :items="navigationItems"
          @changeNavigation="currentNavigationItem = $event"
        />
      </UiScrollbarBox>
    </aside>

    <section class="content">
      <UiScrollbarBox>
        <slot />
      </UiScrollbarBox>
    </section>
  </main>
</div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500|Roboto&display=swap");

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

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  a {
    display: inline-block;
    text-decoration: none;
    color: #78909C;
    transition: color 0.2s ease-out;

    &:hover {
      text-decoration: none;
      color: #3d7bf5;
    }
  }
  input {
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    line-height: 20px;
    color: #000;
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
.sub-header {
  margin-bottom: 8px;
}
.main {
  display: flex;
  justify-content: space-between;
  padding-bottom: 64px;
}
.aside {
  position: relative;
  min-width: 260px;
  max-width: 320px;
  flex-basis: 20%;
}
.content {
  position: relative;
  flex-basis: 80%;
  flex-grow: 1;
}
</style>
