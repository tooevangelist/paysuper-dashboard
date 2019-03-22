<script>
import { includes } from 'lodash-es';
import { mapState, mapActions } from 'vuex';
import { UiPageNavbar } from '@protocol-one/ui-kit';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import IconLogo from '@/components/IconLogo.vue';

export default {
  name: 'Page',

  components: { IconLogo, UiPageNavbar, Loading },

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
    ...mapState(['isLoading']),
    ...mapState('User', ['isAuthorised']),
    // ...mapState('merchant', ['merchant']),

    navigationLinks() {
      let links = [
        {
          label: 'Dashboard',
          url: '/dashboard',
          router: true,
          name: ['dashboard'],
        },
        {
          label: 'Merchant',
          url: '/merchant',
          router: true,
          name: ['merchant'],
        },
        {
          label: 'Merchants (new)',
          url: '/merchants',
          router: true,
          name: ['merchants'],
        },
        {
          label: 'Projects',
          url: '/projects',
          router: true,
          name: ['projects', 'projects-card'],
        },
      ];

      // if (this.merchant && this.merchant.status >= 1) {
      links = [
        ...links,
        {
          label: 'Transactions',
          url: '/transactions',
          router: true,
          name: ['transactions'],
        },
        {
          label: 'Revenue',
          url: '/revenue',
          router: true,
          name: ['revenue'],
        },
      ];
      // }

      return links.map((item) => {
        if (includes(item.name, this.$route.name)) {
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
      this.$router.push({ path: '/' });
    },
  },
};
</script>

<template>
  <div class="main-wrapper">
    <Loading
      :active="isLoading"
      :is-full-page="true"
      :opacity="0.2"
    ></Loading>
    <UiPageNavbar
      title="Pay Super"
      :navigationLinks="navigationLinks"
      :logoLink="logoLink"
      :isAuthorised="isAuthorised"
      :userName="'test'"
      @logout="handleLogout"
    >
      <IconLogo slot="logo" />
    </UiPageNavbar>
    <div class="page-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-wrapper {
  margin-left: 80px;
  background: #fff;
}

.page-content {
  & > * {
    min-height: 100vh;
  }
}
</style>
