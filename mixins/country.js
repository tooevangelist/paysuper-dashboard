import axios from 'axios';

export default {
  data() {
    return {
      countries: [],
    };
  },
  methods: {
    onCountrySearch(search) {
      const self = this;

      let url = `${process.env.apiServerUrl}/api/v1/country`;

      if (search.length > 0) {
        url += `?name=${search}`;
      }

      axios.get(url)
        .then((response) => {
          if (response.data.length <= 0) {
            return;
          }

          self.countries = [];

          for (let i = 0; i < response.data.length; i++) {
            const item = response.data[i];

            self.countries.push({ label: item.name.en, value: item.code_int });
          }
        }).catch(() => { });
    },
  },
  mounted() {
    this.onCountrySearch('');
  },
};
