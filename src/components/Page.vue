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
      const links = [
        {
          label: 'Dashboard',
          url: '/dashboard',
          router: true,
          name: ['dashboard'],
        },
        {
          label: 'Transactions',
          url: '/transactions',
          name: ['transactions', 'transactions-card'],
        },
        {
          label: 'Projects',
          url: '/projects',
          name: ['projects', 'projects-card'],
        },
        {
          label: 'Payout',
          url: '/payout',
          name: ['payout'],
        },
        {
          label: 'Agreement Requests',
          url: '/agreement-requests',
          name: ['AgreementRequestsList'],
        },
        {
          label: 'Merchants',
          url: '/merchants',
          name: [
            'merchants',
            'MerchantAdminForm',
            'MerchantAdminPaymentMethod',
            'MerchantHistory',
          ],
        },
        {
          label: 'Company',
          url: '/company',
          name: ['company'],
        },
      ];

      // if (this.merchant &this.merchant.status >= 1) {
      // links = [
      //   ...links,
      //   {
      //     label: 'Revenue',
      //     url: '/revenue',
      //     router: true,
      //     name: ['revenue'],
      //   },
      // ];
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
    ...mapActions(['setIsLoading']),

    async handleLogout() {
      this.setIsLoading(true);
      await this.logout();
      this.setIsLoading(false);
      this.$router.push({ path: '/' });
    },
  },
};
</script>

<template>
  <div class="template-page">
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

<style lang="scss">
@import url("//static.protocol.one/common/fonts/Lato.css");
@import "@/assets/scss/_custom.scss";
.page-body {
  margin: 0;
  font-family: Lato, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.25;

  * {
    box-sizing: border-box;
  }
}
.page-body,
.page-html {
  display: flex;
  flex-direction: column;
}
.template-page {
  a {
    text-decoration: none;
    color: #2f6ecd;

    &:hover {
      text-decoration: underline;
    }
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
.template-page {
  margin-left: 80px;
  background: #fff;
}

.page-content {
  > * {
    min-height: 100vh;
  }
}
</style>
