import axios from 'axios';
import { get } from 'lodash-es';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';

function mapDataFormToApi(data) {
  return data;
  // eslint-disable-next-line
  // const { create_order_allowed_urls, ...rest } = data;
  // return {
  //   ...rest,
  //   // create_invoice_allowed_urls: create_order_allowed_urls || '',
  //   notify_emails: data.notify_emails || [],
  // };
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
  return mergeApiValuesWithDefaults({
    cover: {
      images: {
        en: '',
        ru: '',
      },
      use_one_for_all: true,
    },
    name: {
      en: '',
      ru: '',
    },
    full_description: {
      en: '',
      ru: '',
    },
    short_description: {
      en: '',
      ru: '',
    },
    localizations: ['en', 'ru'],
    currencies: [
      { currency: 'USD', region: 'USD' },
    ],
  }, data);
}

export default function createProjectStore() {
  return {
    state: {
      project: null,
      projectPublicName: '',
    },

    mutations: {
      project(state, value) {
        state.project = mapDataApiToForm(value);
      },
      projectPublicName(state, value) {
        state.projectPublicName = value.en;
      },
      currencies(state, value) {
        localStorage.setItem('projectCurrencies', JSON.stringify(value));
        state.currencies = value;
      },
    },

    actions: {
      async initState({ dispatch }, { id }) {
        await dispatch('fetchProject', id);
      },

      async fetchProject({ state, commit, rootState }, id) {
        const { data } = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/projects/${id}`);
        commit('project', data.item);
        commit('projectPublicName', state.project.name);
      },

      async saveProject({ state, commit, rootState }, project) {
        console.log(11111, 'J', JSON.stringify(project, null, '  '));
        const { data } = await axios.patch(
          `${rootState.config.apiUrl}/admin/api/v1/projects/${state.project.id}`,
          mapDataFormToApi(project),
        );
        commit('project', data);
        commit('projectPublicName', state.project.name);
      },

      async checkIsSkuUnique({ state, rootState }, sku) {
        try {
          await axios.post(
            `${rootState.config.apiUrl}/admin/api/v1/projects/${state.project.id}/sku`,
            {
              sku,
            },
          );
        } catch (error) {
          // (sku+project id already exist)
          if (get(error, 'response.data.code') === 'kp000006') {
            return false;
          }
          throw error;
        }
        return true;
      },
    },

    namespaced: true,
  };
}
