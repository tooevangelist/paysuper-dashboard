import axios from 'axios';

export default function createPayoutPageStore() {
  return {
    state: {
      payout: null,
      payoutId: null,
      refunds: null,
      reports: null,
    },

    mutations: {
      payoutId(state, data) {
        state.payoutId = data;
      },
      setPayout(state, data) {
        state.payout = data;
      },
      refund(state, data) {
        state.refunds = data;
      },
      reports(state, data) {
        state.reports = data;
      },
    },

    actions: {
      async initState({ dispatch, commit }, { payoutId }) {
        commit('payoutId', payoutId);
        await dispatch('fetchPayoutData', payoutId);
        await dispatch('fetchPayoutReports');
      },

      async fetchPayoutData({ commit }, id) {
        const response = await axios
          .get(`{apiUrl}/admin/api/v1/payout_documents/${id}`);
        commit('setPayout', response.data);
      },

      async fetchPayoutReports({ commit, state }) {
        const response = await axios
          .get(`{apiUrl}/admin/api/v1/payout_documents/${state.payoutId}/reports`);

        commit('reports', response.data);
      },
    },

    namespaced: true,
  };
}
