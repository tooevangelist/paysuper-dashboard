import axios from 'axios';

export default {
  data() {
    return {
      currencies: [],
    };
  },
  methods: {
    onCurrencySearch(search) {
      const self = this;

      let url = `${process.env.apiServerUrl}/api/v1/currency`;

      if (search.length > 0) {
        url += `?name=${search}`;
      }

      axios.get(url)
        .then((response) => {
          if (response.data.length <= 0) {
            return;
          }

          self.currencies = [];

          for (let i = 0; i < response.data.length; i++) {
            const item = response.data[i];

            self.currencies.push({ label: item.name.en, value: item.code_int });
          }
        }).catch(() => { });
    },
  },
  mounted() {
    this.onCurrencySearch('');
  },
};
