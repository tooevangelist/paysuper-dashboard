import axios from 'axios';
import { mapValues } from 'lodash-es';

function prepareRequestData(data) {
  return mapValues(data, (value) => {
    if (value === '') {
      return null;
    }
    return value;
  });
}

export default function createUserStore({ config }) {
  return {
    state: () => ({
      project: null,
    }),

    mutations: {
      project(state, value) {
        state.project = value;
      },
    },

    actions: {
      async initState({ commit, dispatch }, id) {
        if (!id) {
          commit('project', {
            name: '',
            url_check_account: '',
            url_process_payment: '',
            url_redirect_success: '',
            url_redirect_fail: '',
            secret_key: '',
            create_invoice_allowed_urls: [],

            callback_protocol: 'default',
            min_payment_amount: '',
            max_payment_amount: '',

            callback_currency: '',
            limits_currency: '',
          });
          // commit('project', {
          //   name: 'Universe of Futurama222',
          //   callback_currency: 643,
          //   callback_protocol: 'default',
          //   create_invoice_allowed_urls: [],
          //   limits_currency: 643,
          //   max_payment_amount: 10000,
          //   min_payment_amount: 100,
          //   notify_emails: [],
          //   secret_key: '',
          //   url_check_account: null,
          //   url_process_payment: null,
          //   url_redirect_fail: null,
          //   url_redirect_success: null,
          //   is_active: true,
          //   send_notify_email: false,
          //   only_fixed_amounts: true,
          //   is_allow_dynamic_notify_urls: false,
          //   is_allow_dynamic_redirect_urls: true,
          // });
          return;
        }
        await dispatch('fetchProject', id);
      },

      fetchProject({ commit, rootState }, id) {
        return axios.get(`${config.apiUrl}/api/v1/s/project/${id}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        })
          .then((response) => {
            commit('project', response.data);
          })
          .catch(() => { });
      },

      async createProject({ state, rootState }) {
        try {
          axios.post(`${config.apiUrl}/api/v1/s/project`, prepareRequestData(state.project), {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          });
          // eslint-disable-next-line
        } catch (error) {

        }
      },
    },

    namespaced: true,
  };
}
