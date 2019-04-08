import axios from 'axios';

export default function createUserStore({ config }) {
  return {
    state: () => ({
      payout: null,
      product: null,
    }),

    mutations: {
      payout(state, value) {
        state.payout = value;
      },
    },

    actions: {
      initState() { },

      async fetchPayout({ commit, rootState }, { from, to }) {
        const url = `${config.apiUrl}/api/v1/s/order/accounting_payment?from=${from}&to=${to}`;

        const response = await axios.get(
          url,
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
        commit('payout', response.data);
      },
    },

    namespaced: true,
  };
}
