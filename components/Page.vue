<template>
  <div class="main-wrapper">
    <PageNavbar
      title="Pay Super"
      :navigationLinks="navigationLinks"
      :logoLink="logoLink"
    >
      <IconLogo slot="logo" />
    </PageNavbar>
    <div>
      <PageHeader>
        <slot slot="title" name="header-title"></slot>
        <slot slot="search" name="header-search"></slot>
        <slot slot="hint" name="header-hint"></slot>
        <slot slot="right" name="header-right"></slot>
      </PageHeader>
      <main class="main">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { PageNavbar, PageHeader } from '@protocol-one/ui-kit';

import IconLogo from '@/components/IconLogo.vue';

export default {
  components: { IconLogo, PageHeader, PageNavbar },

  data() {
    return {
      logoLink: {
        router: true,
        url: '/',
      },
    };
  },

  computed: {
    ...mapState('merchant', ['merchant']),

    navigationLinks() {
      let links = [
        {
          label: 'Dashboard',
          url: '/dashboard',
          router: true,
          name: 'dashboard',
        },
        {
          label: 'Merchant',
          url: '/merchant',
          router: true,
          name: 'merchant',
        },
        {
          label: 'Projects',
          url: '/project',
          router: true,
          name: 'project',
        },
      ];

      if (this.merchant && this.merchant.status >= 1) {
        links = [
          ...links,
          {
            label: 'Orders',
            url: '/order',
            router: true,
            name: 'order',
          },
          {
            label: 'Revenue',
            url: '/revenue',
            router: true,
            name: 'revenue',
          },
        ];
      }

      return links.map((item) => {
        if (item.name === this.$nuxt.$route.name) {
          return {
            ...item,
            isActive: true,
          };
        }

        return item;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  margin-left: 80px;
  background: #fff;
}
</style>

