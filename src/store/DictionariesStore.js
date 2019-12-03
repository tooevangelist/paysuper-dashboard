import axios from 'axios';
import { sortBy, flatten } from 'lodash-es';
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
      regionsCurrencies: [],
      countries: [],
      cities: [],
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

      currenciesWithRegions(state) {
        return flatten(state.regionsCurrencies.map(item => item.regions.map(region => ({
          currency: item.currency,
          region: region.region,
        }))));
      },
      cities(state) {
        const cities = state.cities.map((item) => {
          const [value] = item.split(',');
          return { label: value, value };
        });
        return cities;
      },
    },

    mutations: {
      currencies(store, value) {
        store.currencies = value;
      },
      countries(store, value) {
        store.countries = value || [];
      },
      regionsCurrencies(store, value) {
        store.regionsCurrencies = value;
      },
      cities(store, value) {
        store.cities = value || [];
      },
    },

    actions: {
      initState({ dispatch }) {
        return Promise.all([
          dispatch('fetchRegionsCurrencies'),
          dispatch('fetchCountries'),
        ]);
      },

      async fetchRegionsCurrencies({ commit }) {
        const url = '{apiUrl}/api/v1/price_group/currencies';

        const result = await axios.get(url)
          .then(response => response.data)
          .catch(() => ({
            regions: [],
          }));

        commit('regionsCurrencies', result.regions);
      },

      getCountries() {
        const url = '{apiUrl}/api/v1/country';

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

      async fetchCities({ commit }, { query, country }) {
        const url = `https://cors-anywhere.herokuapp.com/secure.geobytes.com/AutoCompleteCity?filter=${country}&q=${query}`;
        const cities = await axios.get(url)
          .then(response => response.data)
          .catch(() => []);

        commit('cities', cities);
      },
    },
  };
}
