
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
        return dispatch('fetchProfile', { receiptType, receiptId, orderId });
      },

      async fetchProfile({ commit, rootState }, { receiptType, receiptId, orderId }) {
        const url = `${rootState.config.apiUrl}/orders/receipt/${receiptType}/${receiptId}/${orderId}`;
        const { data } = await axios.get(url);
        console.log(11111, 'data', data);
        commit('receipt', data);
      },
    },

    namespaced: true,
  };
}
