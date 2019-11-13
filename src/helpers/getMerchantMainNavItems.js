export default function getMerchantMainNavItems(permissions) {
  return [
    {
      additional: 'Homepage for main controls',
      icon: 'IconDashboard',
      link: '/dashboard',
      title: 'Dashboard',
      routeNames: ['Dashboard'],
      isAvailable: permissions.dashboard,
    },
    {
      additional: 'Organise your products for sales',
      unavailableReason: 'Need to fill banking info first',
      icon: 'IconFolder',
      link: '/projects',
      title: 'Projects',
      routeNames: ['ProjectsList'],
      isAvailable: permissions.projects,
    },
    {
      additional: 'Weekly royalty reports',
      icon: 'IconBlank',
      link: '/reports',
      title: 'Royalty reports',
      routeNames: ['RoyaltyReportsPage'],
      isAvailable: permissions.reports,
    },
    {
      additional: 'Need license agreement',
      icon: 'IconCash',
      link: '/payouts',
      title: 'Payouts',
      isAvailable: permissions.payuots,
    },
    {
      additional: 'Full list of customer transactions',
      icon: 'IconCoin',
      link: '/transactions',
      title: 'Transaction Search',
      routeNames: ['TransactionsPage'],
      isAvailable: permissions.transactions,
    },
    {
      additional: 'Technical integrations',
      icon: 'IconRepeat',
      link: '/intagrations',
      title: 'Integrations',
      isAvailable: false,
    },
    {
      additional: 'Need license agreement',
      icon: 'IconExcited',
      link: '/customers',
      title: 'Customers',
      isAvailable: false,
    },
  ];
}
