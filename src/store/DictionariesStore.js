import axios from 'axios';

export default function createDictionariesStore({ config }) {
  return {
    namespaced: true,

    state: () => ({
      currencies: [],
      countries: [],
    }),

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

            const currencies = [];

            for (let i = 0; i < response.data.length; i += 1) {
              const item = response.data[i];

              currencies.push({ label: item.name.en, value: item.code_int });
            }

            commit('currencies', currencies);
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

            const countries = [];

            for (let i = 0; i < response.data.length; i += 1) {
              const item = response.data[i];

              countries.push({ label: item.name.en, value: item.code_int });
            }

            commit('countries', countries);
          }).catch(() => { });
      },
    },
  };
}
