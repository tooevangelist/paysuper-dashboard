export default function getAdminMainNavItems() {
  return [
    {
      title: 'Merchants',
      additional: 'Description',
      icon: 'IconBlank',
      link: '/dashboard',
      isAvailable: false,
    },
    {
      title: 'Agreement requests',
      additional: 'Description',
      icon: 'IconBlank',
      link: '/merchants',
      routeNames: ['MerchantsList'],
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
