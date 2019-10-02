// import axios from 'axios';
// import { get } from 'lodash-es';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';

function mapDataApiToForm(data = {}) {
  const defaultData = {
    personal: {
      first_name: 'John',
      last_name: 'Doe',
      position: 'CEO',
    },
    help: {
      product_promotion_and_development: false,
      released_game_promotion: true,
      international_sales: false,
      other: true,
    },
    company: {
      company_name: 'CD Projects',
      website: 'http://www.cdprojects.com',
      annual_income: {
        from: 10000,
        to: 100000,
      },
      number_of_employees: {
        from: 51,
        to: 100,
      },
      kind_of_activity: '',
      monetization: {
        paid_subscription: false,
        in_game_advertising: false,
        in_game_purchases: false,
        premium_access: false,
        other: false,
      },
      platforms: {
        pc_mac: false,
        game_console: false,
        mobile_device: false,
        web_browser: false,
        other: false,
      },
    },
    last_step: '',
    created_at: null,
    updated_at: null,
    status: 0,
  };

  const newData = mergeApiValuesWithDefaults(defaultData, data);

  if (newData.country) {
    newData.country = newData.country.code_a2;
  }

  return newData;
}

export default function createUserStore() {
  return {
    state: {
      profile: null,
    },
    getters: {
      status(state) {
        return state.profile.status;
      },
    },
    mutations: {
      profile(state, value) {
        state.profile = value;
      },
    },
    actions: {
      async initState({ dispatch }, merchantId) {
        return dispatch('fetchProfile', merchantId);
      },

      // async fetchProfile({ commit, rootState }, merchantId) {
      async fetchProfile({ commit }) {
        // const { accessToken } = rootState.User;
        // const { apiUrl } = rootState.config;

        // try {
        //   const response = await axios.get(
        //    `${apiUrl}/admin/api/v1/merchants/${merchantId}/profile`,
        //   ).catch(console.warn);

        //   commit('profile', mapDataApiToForm(get(response, 'data', {})));
        // } catch (error) {
        //   commit('profile', mapDataApiToForm());
        // }
        commit('profile', mapDataApiToForm());
      },
    },
    namespaced: true,
  };
}
