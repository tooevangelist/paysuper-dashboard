
import axios from 'axios';
import { get } from 'lodash-es';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';

function getDefaultProfileData() {
  return {
    personal: {
      first_name: '',
      last_name: '',
      position: '',
    },
    help: {
      product_promotion_and_development: false,
      released_game_promotion: false,
      international_sales: false,
      other: false,
    },
    company: {
      company_name: '',
      website: '',
      annual_income: null,
      number_of_employees: null,
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

export default function createUserStore({ config }) {
  return {
    state: {
      profile: null,
      currentStepCode: 'personal',
    },

    mutations: {
      profile(state, value) {
        state.profile = value;
      },
      currentStepCode(state, value) {
        state.currentStepCode = value;
      },
    },

    actions: {
      async initState({ dispatch }) {
        return dispatch('fetchProfile');
      },

      async fetchProfile({ rootState, commit }) {
        const defaultProfile = getDefaultProfileData();
        try {
          const response = await axios.get(`${config.apiUrl}/admin/api/v1/user/profile`, {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          });
          const profile = mergeApiValuesWithDefaults(defaultProfile, response.data);
          if (profile.last_step) {
            commit('currentStepCode', profile.last_step);
          }
          commit('profile', profile);
        } catch (error) {
          if (get(error, 'response.status') !== 404) {
            console.error(error);
          }
          commit('profile', defaultProfile);
        }
      },

      async updateProfile({ rootState }, props) {
        try {
          await axios.patch(
            `${config.apiUrl}/admin/api/v1/user/profile`,
            props,
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );
        } catch (error) {
          console.error(error);
          throw new Error(
            get(error, 'response.data.message', 'Unknown error'),
          );
        }
      },

      setCurrentStepCode({ commit }, value) {
        commit('currentStepCode', value);
      },
    },

    namespaced: true,
  };
}
