const merchantPagesMeta = {
  layout: 'Layout',
  isAuthRequired: true,
  specialNav: {
    backLink() {
      return {
        url: '/merchants/',
        label: 'Back to list',
      };
    },
  },
  mainNav: () => import('@/components/LayoutMainNavMerchant.vue'),
};

const routes = [
  {
    path: '/',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/transactions/',
    component: () => import('@/pages/TransactionsList.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'transactions',
  },
  {
    path: '/transactions/:id',
    component: () => import('@/pages/TransactionCard.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'transactions-card',
  },
  {
    path: '/projects/',
    component: () => import('@/pages/ProjectsListPage.vue'),
    meta: { layout: 'Layout', isAuthRequired: true },
    name: 'ProjectsList',
  },
  {
    path: '/projects/:id',
    component: () => import('@/pages/ProjectCardPage.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/ProjectCardFormPage.vue'),
        meta: {
          layout: 'Layout',
          isAuthRequired: true,
          specialNav: {
            backLink() {
              return {
                url: '/projects/',
                label: 'Back to projects',
              };
            },
          },
          mainNav: () => import('@/components/LayoutMainNavProject.vue'),
        },
        name: 'ProjectCard',
      },
      {
        path: 'product/:productId',
        component: () => import('@/pages/ProjectCardProductPage.vue'),
        meta: { layout: 'Layout', isAuthRequired: true },
        name: 'ProjectCardProduct',
      },
    ],
  },
  {
    path: '/taxes/',
    component: () => import('@/pages/TaxesListPage.vue'),
    meta: { layout: 'Layout', isAuthRequired: true },
    name: 'TaxesList',
  },
  {
    path: '/taxes/:id',
    component: () => import('@/pages/TaxesCardPage.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/TaxesCardCountryPage.vue'),
        meta: { layout: 'Layout', isAuthRequired: true },
        name: 'TaxesCardCountryPage',
      },
      {
        path: 'period/:periodId',
        component: () => import('@/pages/TaxesCardPeriodPage.vue'),
        meta: { layout: 'Layout', isAuthRequired: true },
        name: 'TaxesCardPeriodPage',
      },
    ],
  },
  {
    path: '/merchants/',
    component: () => import('@/pages/MerchantsListPage.vue'),
    meta: { layout: 'Layout', isAuthRequired: true },
    name: 'MerchantsList',
  },
  {
    path: '/merchants/:id',
    component: () => import('@/pages/MerchantAdminPage.vue'),
    redirect: { name: 'MerchantAdminPersonalProfile' },
    children: [
      {
        path: 'personal-profile/',
        component: () => import('@/pages/MerchantAdminPersonalProfilePage.vue'),
        meta: merchantPagesMeta,
        name: 'MerchantAdminPersonalProfile',
      },
      {
        path: 'company-info/',
        component: () => import('@/pages/MerchantAdminCompanyInfoPage.vue'),
        meta: merchantPagesMeta,
        name: 'MerchantAdminCompanyInfo',
      },
      {
        path: 'payment-methods/',
        component: () => import('@/pages/MerchantAdminPaymentMethodsPage.vue'),
        meta: merchantPagesMeta,
        name: 'MerchantAdminPaymentMethods',
      },
      {
        path: 'history/',
        component: () => import('@/pages/MerchantAdminHistoryPage.vue'),
        meta: merchantPagesMeta,
        name: 'MerchantAdminHistory',
      },
    ],
  },
  {
    path: '/agreement-requests/',
    component: () => import('@/pages/AgreementRequestsListPage.vue'),
    meta: { layout: 'Layout', isAuthRequired: true },
    name: 'AgreementRequestsList',
  },
  {
    path: '/dashboard/',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { layout: 'Layout', isAuthRequired: true },
    name: 'Dashboard',
  },
  {
    path: '/company/',
    component: () => import('@/pages/Company.vue'),
    meta: { layout: 'Layout', isAuthRequired: true },
    name: 'company',
  },
  {
    path: '/revenue/',
    component: () => import('@/pages/revenue.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'revenue',
  },
  {
    path: '/payout/',
    component: () => import('@/pages/payout.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'payout',
  },
  {
    path: '/demo/',
    component: () => import('@/pages/demo.vue'),
  },
  {
    path: '/docs/',
    component: () => import('@/pages/docs.vue'),
  },
  {
    path: '/eula/',
    component: () => import('@/pages/eula.vue'),
  },
  {
    path: '/oauth/',
    component: () => import('@/pages/oauth.vue'),
  },
  {
    path: '/payment_finished/',
    component: () => import('@/pages/payment_finished.vue'),
  },
  {
    path: '/privacy_policy/',
    component: () => import('@/pages/privacy_policy.vue'),
  },
  {
    path: '/login/',
    component: () => import('@/pages/login.vue'),
  },

  {
    path: '/payform-sdk/',
    component: () => import('@/pages/PaymentFormSdk.vue'),
  },
  {
    path: '/payform-page/',
    component: () => import('@/pages/PaymentFormPage.vue'),
  },
  {
    path: '/payform-loading/',
    component: () => import('@/pages/PaymentFormLoading.vue'),
  },
  {
    path: '/profile/',
    component: () => import('@/pages/UserProfile.vue'),
    meta: { layout: 'PageShallow', isAuthRequired: true },
  },
  {
    path: '/sign-up/',
    component: () => import('@/pages/SignUp.vue'),
    meta: { layout: 'PageShallow' },
  },
  {
    path: '/confirm_email/',
    component: () => import('@/pages/ConfirmEmail.vue'),
  },
  {
    path: '/icons/',
    component: () => import('@/pages/IconsPage.vue'),
  },

  {
    path: '*',
    name: 'notFound',
    component: () => import('@/pages/Error404Page.vue'),
  },
];

export default routes;
