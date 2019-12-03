
import axios from 'axios';

export default function createPaymentReceiptStore() {
  return {
    state: {
      receipt: null,
      receiptType: '',
    },

    mutations: {
      receipt(state, value) {
        state.receipt = value;
      },
      receiptType(state, value) {
        state.receiptType = value;
      },
    },

    actions: {
      async initState({ commit, dispatch }, { receiptType, receiptId, orderId }) {
        commit('receiptType', receiptType);
        return dispatch('fetchProfile', { receiptId, orderId });
      },

      async fetchProfile({ commit }, { receiptId, orderId }) {
        const url = `{apiUrl}/api/v1/orders/receipt/${receiptId}/${orderId}`;
        const { data } = await axios.get(url);
        commit('receipt', data);
      },
    },

    namespaced: true,
  };
}
