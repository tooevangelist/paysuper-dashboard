import axios from 'axios';
import { camelCase, reduce, snakeCase } from 'lodash-es';

export default function createBankingStore() {
  return {
    namespaced: true,
    state: {
      bankingInfo: {
        account_number: '',
        address: '',
        correspondent_account: '',
        currency: '',
        name: '',
        swift: '',
      },
    },
    getters: {
      bankingInfo(state) {
        const { bankingInfo } = state;

        return reduce(bankingInfo, (res, item, key) => ({
          ...res,
          [camelCase(key)]: item,
        }), {});
      },
    },
    mutations: {
      bankingInfo(state, data) {
        state.bankingInfo = data;
      },
    },
    actions: {
      async initState({ commit, rootState }) {
        const { banking } = rootState.User.Merchant.merchant;

        console.error(banking);

        if (banking) {
          commit('bankingInfo', banking);
        }
      },
      async submitBankingInfo({ state, rootState }) {
        const { accessToken, Merchant } = rootState.User;
        const merchantId = Merchant.merchant.id;

        await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/banking`,
          { ...state.bankingInfo },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      },
      updateBankingInfo({ commit }, bankingInfo) {
        commit('bankingInfo', reduce(bankingInfo, (res, item, key) => ({
          ...res,
          [snakeCase(key)]: item,
        }), {}));
      },
    },
  };
}
