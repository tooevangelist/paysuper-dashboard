import LicenseAgreementStore from './LicenseAgreementStore';

export default function createCompanyStore() {
  return {
    namespaced: true,
    actions: {
      initState() {},
    },
    modules: {
      LicenseAgreement: LicenseAgreementStore(),
    },
  };
}
