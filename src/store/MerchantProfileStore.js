
// import axios from 'axios';
// import { get } from 'lodash-es';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';

function getDefaultProfileData() {
  return {
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
  };
}

export default function createUserStore() {
  return {
    state: {
      profile: null,
    },

    mutations: {
      profile(state, value) {
        const defaultProfile = getDefaultProfileData();
        const profile = mergeApiValuesWithDefaults(defaultProfile, value);
        state.profile = profile;
      },
    },

    actions: {
      async initState({ dispatch }) {
        return dispatch('fetchProfile');
      },

      async fetchProfile({ commit }) {
        try {
          // const { data } = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/user/prof`, {
          //   headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          // });
          commit('profile', {});
        } catch (error) {
          console.error(error);
          commit('profile', {});
        }
      },
    },

    namespaced: true,
  };
}
