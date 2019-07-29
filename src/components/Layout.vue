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
  beforeMount() {
    document.body.classList.add('layout-body');
    document.body.parentNode.classList.add('layout-html');
  },
  destroyed() {
    document.body.classList.remove('layout-body');
    document.body.parentNode.classList.remove('layout-html');
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
  <LayoutHeader
    class="header"
    :projectName="projectName"
  />
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
      <UiScrollbarBox class="scrollbox">
        <LayoutAside
          :currentItem="currentNavigationItem"
          :items="navigationItems"
          @changeNavigation="currentNavigationItem = $event"
        />
      </UiScrollbarBox>
    </aside>

    <section class="content">
      <UiScrollbarBox class="scrollbox">
        <div class="scrollbox-inner">
          <slot />
        </div>
      </UiScrollbarBox>
    </section>
  </main>
</div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500|Roboto:400,500&display=swap");
.layout-body {
  margin: 0;

  * {
    box-sizing: border-box;
  }
}
.layout-body,
.layout-html {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
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
    color: #78909c;
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
  height: 100vh;
}
.header {
  flex-shrink: 0;
}
.sub-header {
  margin-bottom: 8px;
  flex-shrink: 0;
}
.main {
  display: flex;
  justify-content: space-between;
  max-height: 100%;
  flex-grow: 1;
  min-height: 0;
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

  &::after {
    position: absolute;
    left: 0;
    top: 0;
    height: 28px;
    width: calc(100% - 15px);
    content: '';
    background-image: linear-gradient(
      180deg,
      rgba(#fff, 1) 0%,
      rgba(#fff, 0.95) 20%,
      rgba(#fff, 0.85) 40%,
      rgba(#fff, 0.65) 60%,
      rgba(#fff, 0) 100%
    );
    pointer-events: none;
  }
}
.scrollbox {
  height: 100%;
  width: 100%;
}
.scrollbox-inner {
  margin: 28px 6vw;
  max-width: 920px;
}
</style>
