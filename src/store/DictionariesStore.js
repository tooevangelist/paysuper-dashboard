import axios from 'axios';
import { sortBy } from 'lodash-es';
import i18n from '@/plugins/i18n';

export default function createDictionariesStore() {
  return {
    namespaced: true,

    state: () => ({
      currencies: [
        {
          name: { en: 'USD' },
          code_a3: 'USD',
        },
        {
          name: { en: 'EUR' },
          code_a3: 'EUR',
        },
        {
          name: { en: 'RUB' },
          code_a3: 'RUB',
        },
        {
          name: { en: 'GBP' },
          code_a3: 'GBP',
        },
      ],
      countries: [],
    }),

    getters: {
      countries(state) {
        const countries = state.countries
          .map(item => ({
            label: i18n.t(`countries.${item.iso_code_a2}`),
            value: item.iso_code_a2,
          }));
        return sortBy(countries, 'label');
      },
      currenciesInt(state) {
        return state.currencies.map(item => ({ label: item.name.en, value: item.code_int }));
      },
      currenciesCode(state) {
        return state.currencies.map(item => ({ label: item.name.en, value: item.code_a3 }));
      },
      currenciesThreeLetters(state) {
        return state.currencies.map(item => ({ label: item.name.en, value: item.code_a3 }));
      },
    },

    mutations: {
      currencies(store, value) {
        store.currencies = value;
      },
      countries(store, value) {
        store.countries = value;
      },
    },

    actions: {
      initState({ dispatch }) {
        return Promise.all([
          // dispatch('fetchCurrencies'),
          dispatch('fetchCountries'),
        ]);
      },
      fetchCurrencies({ commit, rootState }, search = '') {
        let url = `${rootState.config.apiUrl}/api/v1/currency`;

        if (search.length > 0) {
          url += `?name=${search}`;
        }

        axios.get(url)
          .then((response) => {
            if (response.data.length <= 0) {
              return;
            }

            commit('currencies', response.data);
          }).catch(() => { });
      },

      getCountries({ rootState }) {
        const url = `${rootState.config.apiUrl}/api/v1/country`;

        return axios.get(url)
          .then(response => response.data)
          .catch(() => ({
            items: null,
          }));
      },

      async fetchCountries({ commit, dispatch }) {
        const response = await dispatch('getCountries');
        commit('countries', response.countries);
      },
    },
  };
}
