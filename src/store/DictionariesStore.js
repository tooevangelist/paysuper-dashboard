import axios from 'axios';

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

      fetchCountries({ commit }, search = '') {
        let url = `${config.apiUrl}/api/v1/country`;

        if (search.length > 0) {
          url += `?name=${search}`;
        }

        axios.get(url)
          .then((response) => {
            if (response.data.length <= 0) {
              return;
            }
            commit('countries', response.data);
          }).catch(() => { });
      },
    },
  };
}
