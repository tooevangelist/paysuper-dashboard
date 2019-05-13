import axios from 'axios';
import { times } from 'lodash-es';

export default function createDictionariesStore({ config }) {
  return {
    namespaced: true,

    state: () => ({
      currencies: [],
      countries: [],
    }),

    getters: {
      currenciesInt(state) {
        return state.currencies.map(item => ({ label: item.name.en, value: item.code_int }));
      },
      currenciesCode(state) {
        return state.currencies.map(item => ({ label: item.name.en, value: item.code_a3 }));
      },
      countriesInt(state) {
        return state.countries.map(item => ({ label: item.name.en, value: item.code_int }));
      },
      countriesTwoLetters(state) {
        return state.countries.map(item => ({ label: item.name.en, value: item.code_a2 }));
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
          dispatch('fetchCurrencies'),
          dispatch('fetchCountries'),
        ]);
      },
      fetchCurrencies({ commit }, search = '') {
        let url = `${config.apiUrl}/api/v1/currency`;

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

      getCountries(ctx, { limit = 100, offset = 0 }) {
        const url = `${config.apiUrl}/api/v1/country?limit=${limit}&offset=${offset}`;

        return axios.get(url)
          .then(response => response.data)
          .catch(() => ({
            count: 0,
            items: null,
          }));
      },

      async fetchCountries({ commit, dispatch }) {
        const countries = [];
        const limit = 100;
        const response = await dispatch('getCountries', { limit });
        if (!response.items) {
          return;
        }
        countries.push(...response.items);

        if (response.count > response.items.length) {
          const requestsCount = Math.floor(response.count / limit);

          await Promise.all(
            times(requestsCount).map(async (value, index) => {
              const responseItem = await dispatch(
                'getCountries', { limit, offset: (index + 1) * limit },
              );

              if (responseItem.items) {
                countries.push(...responseItem.items);
              }
            }),
          );
        }

        commit('countries', countries);
      },
    },
  };
}
