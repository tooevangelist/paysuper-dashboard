export default function getAdminMainNavItems() {
  return [
    {
      title: 'Merchants',
      additional: 'Description',
      icon: 'IconBlank',
      link: '/merchants',
      routeNames: ['MerchantsList'],
      isAvailable: true,
    },
    {
      title: 'Agreement requests',
      additional: 'Description',
      icon: 'IconBlank',
      link: '/agreement-requests',
      routeNames: ['AgreementRequestsList'],
      isAvailable: true,
    },
    {
      title: 'Section',
      additional: 'Description',
      icon: 'IconBlank',
      link: '/reports',
      isAvailable: false,
    },
  ];
}
