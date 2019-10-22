
const projectPagesMeta = {
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
};

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
    meta: { layout: 'Layout', isAuthRequired: true },
    name: 'transactions',
  },
  {
    path: '/transactions/:transactionId',
    component: () => import('@/pages/TransactionCard.vue'),
    meta: { layout: 'Layout', isAuthRequired: true },
    name: 'transactionsCard',
  },
  {
    path: '/projects/',
    component: () => import('@/pages/ProjectsListPage.vue'),
    meta: { layout: 'Layout', isAuthRequired: true },
    name: 'ProjectsList',
  },
  {
    path: '/projects/:id',
    component: () => import('@/pages/ProjectPage.vue'),
    redirect: { name: 'ProjectSettings' },
    children: [
      {
        path: 'virtual-currency/',
        component: () => import('@/pages/ProjectVirtualCurrencyPage.vue'),
        meta: {
          ...projectPagesMeta,
          topControls: () => import('@/components/LayoutTopControlsProjectSalesOptions.vue'),
        },
        name: 'ProjectVirtualCurrency',
      },
      {
        path: 'virtual-items/',
        component: () => import('@/pages/ProjectVirtualItemsPage.vue'),
        meta: {
          ...projectPagesMeta,
          topControls: () => import('@/components/LayoutTopControlsProjectSalesOptions.vue'),
        },
        name: 'ProjectVirtualItems',
      },
      {
        path: 'virtual-items/:itemId/',
        component: () => import('@/pages/ProjectVirtualItemEditPage.vue'),
        meta: projectPagesMeta,
        name: 'ProjectVirtualItemEdit',
      },
      {
        path: 'game-keys/',
        component: () => import('@/pages/ProjectKeyProductsListPage.vue'),
        meta: {
          ...projectPagesMeta,
          topControls: () => import('@/components/LayoutTopControlsProjectSalesOptions.vue'),
        },
        name: 'ProjectKeyProductsList',
      },
      {
        path: 'game-keys/:keyProductId',
        component: () => import('@/pages/ProjectKeyProductPage.vue'),
        meta: projectPagesMeta,
        name: 'ProjectKeyProduct',
      },
      {
        path: 'settings/',
        component: () => import('@/pages/ProjectSettingsPage.vue'),
        meta: projectPagesMeta,
        name: 'ProjectSettings',
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
        path: 'license-agreement/',
        component: () => import('@/pages/MerchantAdminLicenseAgreementPage.vue'),
        meta: merchantPagesMeta,
        name: 'MerchantAdminLicenseAgreement',
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
    component: () => import('@/pages/LoginPage.vue'),
    name: 'Login',
  },
  {
    path: '/payform-sdk/',
    component: () => import('@/pages/PaymentFormSdk.vue'),
    meta: { layout: 'PageShallow', isStoreInitDisabled: true },
  },
  {
    path: '/payform-page/',
    component: () => import('@/pages/PaymentFormPage.vue'),
    meta: { layout: 'PageFormLayout', isStoreInitDisabled: true },
  },
  {
    path: '/payform-loading/',
    component: () => import('@/pages/PaymentFormLoading.vue'),
    meta: { layout: 'PageFormLayout', isStoreInitDisabled: true },
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
    path: '/receipt/:receiptType/:receiptId/:orderId',
    component: () => import('@/pages/PaymentReceiptPage.vue'),
    meta: { initStore: ['config'] },
  },
  {
    path: '/icons/',
    component: () => import('@/pages/IconsPage.vue'),
    meta: { initStore: false },
  },
  {
    path: '/ui/',
    component: () => import('@/pages/ComponentsPage.vue'),
    meta: { initStore: false },
  },

  {
    path: '*',
    name: 'notFound',
    component: () => import('@/pages/Error404Page.vue'),
  },
];

export default routes;
