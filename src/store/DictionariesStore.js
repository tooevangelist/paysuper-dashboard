import axios from 'axios';

export default function createDictionariesStore({ config }) {
  return {
    namespaced: true,

    state: () => ({
      currencies: [],
    }),

    mutations: {
      currencies(store, value) {
        store.currencies = value;
      },
    },

    actions: {
      async initState({ dispatch }) {
        await dispatch('fetchCurrencies');
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
    },
  };
}
