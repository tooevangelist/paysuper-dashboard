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
    component: () => import('@/pages/ProjectsList.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'projects',
  },
  {
    path: '/projects/:id',
    component: () => import('@/pages/ProjectCard.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    children: [
      {
        path: '',
        component: () => import('@/pages/ProjectCardForm.vue'),
        meta: { layout: 'Page', isAuthRequired: true },
        name: 'projects-card',
      },
      {
        path: 'product/:productId',
        component: () => import('@/pages/ProjectCardProduct.vue'),
        meta: { layout: 'Page', isAuthRequired: true },
        name: 'ProjectCardProduct',
      },
    ],
  },
  {
    path: '/merchants/',
    component: () => import('@/pages/MerchantsList.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'merchants',
  },
  {
    path: '/merchants/:id',
    component: () => import('@/pages/MerchantAdminCard.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    children: [
      {
        path: '',
        component: () => import('@/pages/MerchantAdminCardForm.vue'),
        meta: { layout: 'Page', isAuthRequired: true },
        name: 'MerchantAdminCardForm',
      },
      {
        path: 'paymentMethod/:paymentMethodId',
        component: () => import('@/pages/MerchantAdminCardPaymentMethod.vue'),
        meta: { layout: 'Page', isAuthRequired: true },
        name: 'MerchantAdminCardPaymentMethod',
      },
      {
        path: 'history',
        component: () => import('@/pages/MerchantAdminCardHistory.vue'),
        meta: { layout: 'Page', isAuthRequired: true },
        name: 'MerchantAdminCardHistory',
      },
    ],
  },
  {
    path: '/agreement-requests/',
    component: () => import('@/pages/AgreementRequestsList.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'AgreementRequestsList',
  },
  {
    path: '/dashboard/',
    component: () => import('@/pages/dashboard.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'dashboard',
  },
  {
    path: '/company/',
    component: () => import('@/pages/Company.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
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
    path: '/payform-test/',
    component: () => import('@/pages/PaymentFormTest.vue'),
  },
  {
    path: '/payform-loading/',
    component: () => import('@/pages/PaymentFormLoading.vue'),
  },

  {
    path: '*',
    name: 'notFound',
    component: () => import('@/pages/404.vue'),
  },
];

export default routes;
