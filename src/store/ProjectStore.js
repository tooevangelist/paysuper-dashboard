import axios from 'axios';
import { includes, mapValues } from 'lodash-es';
import qs from 'qs';

/**
 * Probobaly not needed
 * @todo check & remove
 */
function mapDataFormToApi(data) {
  return mapValues(data, (value) => {
    if (value === '') {
      return null;
    }
    return value;
  });
}

function mapDataApiToForm(data) {
  return mapValues(data, (value, key) => {
    if (includes(['limits_currency', 'callback_currency'], key)) {
      return value.code_int;
    }
    return value;
  });
}

export default function createProjectStore({ config, notifications }) {
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
        if (id === 'new') {
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
            only_fixed_amounts: false,

            is_active: true,
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
        await dispatch('fetchProductsList', id);
      },

      async fetchProject({ commit, rootState }, id) {
        const response = await axios.get(`${config.apiUrl}/admin/api/v1/projects/${id}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        });
        commit('project', mapDataApiToForm(response.data));
      },

      async fetchProductsList({ rootState }, projectId) {
        const params = {
          project_id: projectId,
        };

        let url = `${config.apiUrl}/admin/api/v1/products`;
        url += `?${qs.stringify(params)}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        });
        console.log(11111, 'response.data', response.data);
        // commit('project', mapDataApiToForm(response.data));
      },

      async createProject({ state, commit, rootState }) {
        const response = await axios.post(
          `${config.apiUrl}/admin/api/v1/projects`,
          mapDataFormToApi(state.project),
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );

        commit('project', mapDataApiToForm(response.data));
      },

      async saveProject({ state, dispatch, rootState }) {
        dispatch('setIsLoading', true, { root: true });
        try {
          await axios.put(
            `${config.apiUrl}/admin/api/v1/projects/${state.project.id}`,
            mapDataFormToApi(state.project),
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );
          notifications.showSuccessMessage('Project saved successfully');
        } catch (error) {
          notifications.showErrorMessage('Failed to save project');
        }
        dispatch('setIsLoading', false, { root: true });
      },
    },

    namespaced: true,
  };
}
