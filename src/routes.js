const routes = [
  {
    path: '/',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/transactions/',
    component: () => import('@/pages/transactions/index.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'transactions',
  },
  {
    path: '/transactions/:id',
    component: () => import('@/pages/transactions/_id.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'transactions-card',
  },
  {
    path: '/projects/',
    component: () => import('@/pages/projects/index.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'projects',
  },
  {
    path: '/projects/:id',
    component: () => import('@/pages/projects/card.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'projects-card',
  },
  {
    path: '/merchants/',
    component: () => import('@/pages/MerchantsList.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'merchants',
  },
  {
    path: '/merchants/:id',
    component: () => import('@/pages/MerchantsCard.vue'),
    meta: { layout: 'Page', isAuthRequired: true },
    name: 'merchants-card',
    children: [
      {
        path: '',
        component: () => import('@/pages/MerchantsCardForm.vue'),
        meta: { layout: 'Page', isAuthRequired: true },
        name: 'merchants-card-form',
      },
      {
        path: 'paymentMethod/:paymentMethodID',
        component: () => import('@/pages/MerchantsCardPaymentMethod.vue'),
        meta: { layout: 'Page', isAuthRequired: true },
        name: 'merchants-card-payment-method',
      },
    ],
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
    path: '*',
    name: 'notFound',
    component: () => import('@/pages/404.vue'),
  },
];

export default routes;
