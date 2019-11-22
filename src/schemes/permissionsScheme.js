const merchantPermissions = {
  editCompany: false, // Редактирование данных компании
  viewCompany: false, // Просмотр данных компании
  signing: false, // Подписание договора с компанией
  inviteProjectUsers: false, // Приглашение новых пользователей в проект и изменение их прав
  viewProjectUsers: false, // Просмотр пользователей проекта
  createProjects: false, // Создание проектов
  editProjects: false, // Редактирование проектов
  viewProjects: false, // Просмотр проектов
  createPaylinks: false, // Создание платежных ссылок
  viewPaylinks: false, // Просмотр платежных ссылок
  viewUsers: false, // Просмотр данных пользователей
  viewTransactions: false, // Просмотр списка транзакций
  cancelTransactions: false, // Отмена транзакции
  viewRoyaltyReports: false, // Просмотр роялти отчетов
  acceptRoyaltyReports: false, // Согласование роялти отчетов
  viewPayouts: false, // Просмотр отчетов о выплате
  createPayouts: false, // Инициация выплаты
  viewDashboard: false, // Просмотр данных дашборда
  viewDisputs: false, // Просмотр диспутов
  resolveDisputs: false, // Резолюция диспутов
  viewNotifications: false, // Получать и просматривать нотификации
};

const adminPermissions = {
  assignNewMerchantOwner: false, // Назначить нового владельца у мерчанта
  inviteProjectUsers: false, // Приглашение новых пользователей в проект
  viewProjectUsers: false, // Просмотр пользователей проекта
  viewMerchantsList: false, // Просмотр списка компаний
  viewMerchants: false, // Просмотр деталей компании
  editMerchants: false, // Редактирование компании
  approveAgreements: false, // Согласование договора
  viewCompanyProjects: false, // Просмотр проектов компании
  editCompanyProjects: false, // Редактирование проектов компании
  viewUserData: false, // Просмотр данных пользователей
  editUserData: false, // Редактирование данных пользователей
  viewPaylinks: false, // Просмотр платежных ссылок
  editPaylinks: false, // Редактирование платежных ссылок
  manageTaxReports: false, // Просмотр и загрузка данных налоговых отчетов
  viewTransactions: false, // Просмотр информации о транзакциях
  viewRoyaltyReports: false, // Просмотр роялти отчетов
  viewRoyaltyReportsEditHistory: false, // Получение информации о коррекции роялти отчетов
  viewPayouts: false, // Просмотр отчетов о выплате
  exportPayouts: false, // Экспорт отчетов
};


export default {
  system_admin: {
    ...adminPermissions,
    viewMerchantsList: true,
    viewMerchants: true,
    editMerchants: true,
  },
  merchant_owner: {
    ...merchantPermissions,
    editCompany: true,
    viewCompany: true,
    signing: true,
    inviteProjectUsers: true,
    viewProjectUsers: true,
    createProjects: true,
    editProjects: true,
    viewProjects: true,
    createPaylinks: true,
    viewPaylinks: true,
    viewUsers: true,
    viewTransactions: true,
    cancelTransactions: true,
    viewRoyaltyReports: true,
    acceptRoyaltyReports: true,
    viewPayouts: true,
    createPayouts: true,
    viewDashboard: true,
    viewDisputs: true,
    resolveDisputs: true,
    viewNotifications: true,
  },
  merchant_developer: {
    ...merchantPermissions,
    viewCompany: true,
    viewProjectUsers: true,
    createProjects: true,
    editProjects: true,
    viewProjects: true,
    createPaylinks: true,
    viewPaylinks: true,
    viewUsers: true,
    viewTransactions: true,
    cancelTransactions: true,
    viewRoyaltyReports: true,
    viewDashboard: true,
    viewDisputs: true,
  },
  merchant_accounting: {
    ...merchantPermissions,
    viewCompany: true,
    viewProjectUsers: true,
    viewProjects: true,
    viewPaylinks: true,
    viewTransactions: true,
    viewRoyaltyReports: true,
    acceptRoyaltyReports: true,
    viewPayouts: true,
    createPayouts: true,
    viewDashboard: true,
  },
  merchant_support: {
    ...merchantPermissions,
    viewProjectUsers: true,
    viewProjects: true,
    viewUsers: true,
    viewTransactions: true,
    cancelTransactions: true,
    viewDisputs: true,
    resolveDisputs: true,
  },
  merchant_view_only: {
    ...merchantPermissions,
    viewProjects: true,
    viewPaylinks: true,
    viewTransactions: true,
  },
  newbie: {},
};
