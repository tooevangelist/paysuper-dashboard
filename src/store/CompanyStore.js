import axios from 'axios';
import { get, size, some } from 'lodash-es';
import AccountInfoStore from './AccountInfoStore';
import BankingInfoStore from './BankingInfoStore';
import ContactsStore from './ContactsStore';
import LicenseAgreementStore from './LicenseAgreementStore';

export default function createCompanyStore() {
  return {
    namespaced: true,
    state: {
      completeStepsCount: 0,
      status: 'draft',
      steps: {
        company: false,
        contacts: false,
        banking: false,
        tariff: false,
      },
    },
    getters: {
      isStepsOnboardingComplete(state) {
        return size(state.steps) === 4 && !some(state.steps, step => step === false);
      },
    },
    mutations: {
      completeStepsCount(state, data) {
        state.completeStepsCount = data;
      },
      status(state, data) {
        state.status = data;
      },
      steps(state, data) {
        state.steps = data;
      },
    },
    actions: {
      async initState({ commit, rootState }) {
        const { accessToken, Merchant } = rootState.User;
        const merchantId = get(Merchant, 'merchant.id', 0);

        if (merchantId) {
          const response = await axios.get(
            `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/status`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );

          if (response.data) {
            commit('completeStepsCount', get(response, 'data.complete_steps_count', 0));
            commit('status', get(response, 'data.status', ''));
            commit(
              'steps',
              get(response, 'data.steps', {
                company: false,
                contacts: false,
                banking: false,
                tariff: false,
              }),
            );
          }
        }
      },
      completeStep({ commit, state }, stepName) {
        commit('steps', {
          ...state.steps,
          [stepName]: true,
        });
        commit('completeStepsCount', state.completeStepsCount + 1);
      },
    },
    modules: {
      AccountInfo: AccountInfoStore(),
      BankingInfo: BankingInfoStore(),
      Contacts: ContactsStore(),
      LicenseAgreement: LicenseAgreementStore(),
    },
  };
}
