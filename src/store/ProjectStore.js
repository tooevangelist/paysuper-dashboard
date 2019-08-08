import axios from 'axios';
import qs from 'qs';

function mapDataFormToApi(data) {
  // eslint-disable-next-line
  const { create_order_allowed_urls, ...rest } = data;
  return {
    ...rest,
    // create_invoice_allowed_urls: create_order_allowed_urls || '',
    notify_emails: data.notify_emails || [],
  };
  // const {
  //   image,
  //   callback_currency,
  //   callback_protocol,
  //   secret_key,
  // } = data;

  // return {
  //   image,
  //   callback_currency: 'EUR',
  //   callback_protocol,
  //   secret_key,
  // };
}

function mapDataApiToForm(data) {
  return data;
}

export default function createProjectStore({ notifications }) {
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
            name: {
              ru: '',
              en: '',
            },
            image: '',
            url_check_account: '',
            url_process_payment: '',
            url_redirect_success: '',
            url_redirect_fail: '',
            secret_key: '',
            create_invoice_allowed_urls: [],

            callback_protocol: 'default',
            min_payment_amount: 0,
            max_payment_amount: 0,

            callback_currency: '',
            limits_currency: '',

            // allow_dynamic_notify_urls: false,
            // allow_dynamic_redirect_urls: true,
            is_products_checkout: true,
            // notify_emails: [],
            // send_notify_email: false,
            // status: 0,
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
        // await dispatch('fetchProductsList', id);
      },

      async fetchProject({ commit, rootState }, id) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/projects/${id}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        });
        commit('project', mapDataApiToForm(response.data.item));
      },

      async fetchProductsList({ rootState }, projectId) {
        const params = {
          project_id: projectId,
        };

        let url = `${rootState.config.apiUrl}/admin/api/v1/products`;
        url += `?${qs.stringify(params)}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        });
        console.log(11111, 'response.data', response.data);
        // commit('project', mapDataApiToForm(response.data));
      },

      async createProject({ state, commit, rootState }) {
        const response = await axios.post(
          `${rootState.config.apiUrl}/admin/api/v1/projects`,
          mapDataFormToApi({
            merchant_id: rootState.User.Merchant.merchant.id,
            ...state.project,
          }),
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );

        commit('project', mapDataApiToForm(response.data.item));
      },

      async saveProject({ state, dispatch, rootState }) {
        dispatch('setIsLoading', true, { root: true });
        try {
          await axios.patch(
            `${rootState.config.apiUrl}/admin/api/v1/projects/${state.project.id}`,
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
