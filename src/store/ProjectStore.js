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

export default function createProjectStore() {
  return {
    state: () => ({
      project: null,
      projectPublicName: '',
    }),

    mutations: {
      project(state, value) {
        state.project = value;
      },
      projectPublicName(state, value) {
        state.projectPublicName = value.en;
      },
    },

    actions: {
      async initState({ state, commit, dispatch }, { id, name, image }) {
        if (id === 'new') {
          commit('project', {
            name: {
              ru: '',
              en: name || '',
            },
            image: image || '',
            url_check_account: 'https://ya.ru',
            url_process_payment: 'https://ya.ru',
            url_redirect_success: 'https://ya.ru',
            url_redirect_fail: 'https://ya.ru',
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
          commit('projectPublicName', state.project.name);
          return;
        }
        await dispatch('fetchProject', id);
        // await dispatch('fetchProductsList', id);
      },

      async fetchProject({ state, commit, rootState }, id) {
        const response = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/projects/${id}`, {
          headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
        });
        commit('project', mapDataApiToForm(response.data.item));
        commit('projectPublicName', state.project.name);
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

      async createProject({
        state, commit, dispatch, rootState,
      }, project) {
        const response = await axios.post(
          `${rootState.config.apiUrl}/admin/api/v1/projects`,
          mapDataFormToApi({
            merchant_id: rootState.User.Merchant.merchant.id,
            ...project,
          }),
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );

        commit('project', mapDataApiToForm(response.data.item));
        commit('projectPublicName', state.project.name);
        /**
         * TODO: after https://protocolone.tpondemand.com/restui/board.aspx?#page=task/191909
         * remove this and use has_projects attribute from merchant object
         */
        dispatch('User/Merchant/completeStep', 'projects', { root: true });
      },

      async saveProject({ state, commit, rootState }, project) {
        await axios.patch(
          `${rootState.config.apiUrl}/admin/api/v1/projects/${state.project.id}`,
          mapDataFormToApi(project),
          {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          },
        );
        commit('projectPublicName', state.project.name);
      },
    },

    namespaced: true,
  };
}
