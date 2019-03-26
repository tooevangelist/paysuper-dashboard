import axios from 'axios';

function mapDataApiToForm(data) {
  return data;
}

export default function createPaymentMethodStore({ config }) {
  return {
    state: () => ({
      paymentMethod: null,
    }),

    mutations: {
      paymentMethod(store, data) {
        store.paymentMethod = data;
      },
    },

    actions: {
      initState({ dispatch }, id) {
        return dispatch('fetchPaymentMethod', id);
      },

      fetchPaymentMethod({ commit, dispatch, rootState }, { merchantID, methodID }) {
        return axios.get(`${config.apiUrl}/admin/api/v1/merchants/${merchantID}/methods/${methodID}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        }).then((response) => {
          commit('paymentMethod', mapDataApiToForm(response.data));
        }).catch((error) => {
          dispatch('setPageError', error.response.status, { root: true });
        });
      },

      // async updatePaymentMethod({
      //   state, commit, dispatch, rootState,
      // }) {
      //   dispatch('setIsLoading', true, { root: true });
      //   try {
      //     const response = await axios.put(
      //       `${config.apiUrl}/admin/api/v1/merchants`,
      //       state.merchant,
      //       {
      //         headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
      //       },
      //     );
      //     commit('merchant', mapDataApiToForm(response.data));
      //     notifications.showSuccessMessage('PaymentMethod updated successfully');
      //   } catch (error) {
      //     notifications.showErrorMessage('Failed to update merchant');
      //   }
      //   dispatch('setIsLoading', false, { root: true });
      // },
    },

    namespaced: true,
  };
}
