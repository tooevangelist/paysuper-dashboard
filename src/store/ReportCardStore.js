import axios from 'axios';

export default function createReportCardStore() {
  return {
    state: {
      report: null,
      reportId: null,
    },

    mutations: {
      reportId(state, data) {
        state.transactionId = data;
      },
      setReport(state, data) {
        state.report = data;
      },
    },

    actions: {
      async initState({ dispatch, commit }, { reportId }) {
        commit('reportId', reportId);
        await dispatch('fetchReportData', reportId);
      },

      async fetchReportData({ commit, rootState }, id) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/royalty_reports/${id}`);
        commit('setReport', response.data);
      },
    },

    namespaced: true,
  };
}
