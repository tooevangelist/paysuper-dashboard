<script>
import { mapState, mapActions } from 'vuex';
import { PageNavbar } from '@protocol-one/ui-kit';
import IconLogo from './IconLogo.vue';

export default {
  name: 'Page',

  components: { IconLogo, PageNavbar },

  data() {
    return {
      logoLink: {
        router: true,
        url: '/',
      },
      merchant: null,
      user: null,
    };
  },

  computed: {
    ...mapState('User', ['isAuthorised']),
    // ...mapState('merchant', ['merchant']),

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
          url: '/projects',
          router: true,
          name: 'projects',
        },
      ];

      // if (this.merchant && this.merchant.status >= 1) {
      links = [
        ...links,
        {
          label: 'Transactions search',
          url: '/transactions',
          router: true,
          name: 'transactions',
        },
        {
          label: 'Revenue',
          url: '/revenue',
          router: true,
          name: 'revenue',
        },
      ];
      // }

      return links.map((item) => {
        if (item.name === this.$route.name) {
          return {
            ...item,
            isActive: true,
          };
        }

        return item;
      });
    },
  },

  methods: {
    ...mapActions('User', ['logout']),

    async handleLogout() {
      await this.logout();
      this.$router.push({ path: '/login' });
    },
  },
};
</script>

<template>
  <div class="main-wrapper">
    <PageNavbar
      title="Pay Super"
      :navigationLinks="navigationLinks"
      :logoLink="logoLink"
      :isAuthorised="isAuthorised"
      :userName="'test'"
      @logout="handleLogout"
    >
      <IconLogo slot="logo" />
    </PageNavbar>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-wrapper {
  margin-left: 80px;
  background: #fff;
}
</style>
