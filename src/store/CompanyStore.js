import AccountInfoStore from './AccountInfoStore';
import BankingInfoStore from './BankingInfoStore';
import ContactsStore from './ContactsStore';
import LicenseAgreementStore from './LicenseAgreementStore';
import TariffStore from './TariffStore';

export default function createCompanyStore() {
  return {
    namespaced: true,
    actions: {
      initState() {},
    },
    modules: {
      AccountInfo: AccountInfoStore(),
      BankingInfo: BankingInfoStore(),
      Contacts: ContactsStore(),
      LicenseAgreement: LicenseAgreementStore(),
      Tariff: TariffStore(),
    },
  };
}
