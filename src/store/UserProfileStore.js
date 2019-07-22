
export default function createUserStore() {
  return {
    state: {
      profile: null,
    },

    mutations: {
      profile(state, value) {
        state.profile = value;
      },
    },

    actions: {
      initState({ commit }) {
        commit('profile', {
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
        });
      },
    },

    namespaced: true,
  };
}
