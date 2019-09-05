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
      isAvailable: false,
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
