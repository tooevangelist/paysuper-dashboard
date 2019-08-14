import axios from 'axios';
import { camelCase, reduce, snakeCase } from 'lodash-es';
// TODO: it will be service, and must be located in DictionariesStore
import citiesByCountry from '@/citiesByCountry';

export default function createAccountInfoStore() {
  return {
    namespaced: true,
    state: {
      accountInfo: {
        address: '',
        address_additional: '',
        alternative_name: '',
        city: '',
        country: '',
        name: '',
        state: '',
        website: '',
        zip: '',
      },
    },
    getters: {
      accountInfo(state) {
        const { accountInfo } = state;

        return reduce(accountInfo, (res, item, key) => ({
          ...res,
          [camelCase(key)]: item,
        }), {});
      },
      cities(state) {
        const currentCountry = state.accountInfo.country || 'US';

        return citiesByCountry[currentCountry];
      },
    },
    mutations: {
      accountInfo(state, data) {
        state.accountInfo = data;
      },
    },
    actions: {
      async initState({ commit, rootState }) {
        const { company } = rootState.User.Merchant.merchant;

        if (company) {
          commit('accountInfo', company);
        }
      },
      async submitAccountInfo({ state, rootState }) {
        const { accessToken, Merchant } = rootState.User;
        const merchantId = Merchant.merchant.id;

        await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/${merchantId}/company`,
          { ...state.accountInfo },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      },
      updateAccountInfo({ commit }, accountInfo) {
        commit('accountInfo', reduce(accountInfo, (res, item, key) => ({
          ...res,
          [snakeCase(key)]: item,
        }), {}));
      },
    },
  };
}
