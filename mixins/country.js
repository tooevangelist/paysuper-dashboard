import axios from 'axios';

export default {
    data: function () {
        return {
            countries: []
        }
    },
    methods: {
        onCountrySearch: function (search) {
            const self = this;

            let url = `${process.env.apiServerUrl}/country`;

            if (search.length > 0) {
                url += `?name=${search}`;
            }

            axios.get(url)
                .then(function (response) {
                    if (response.data.length <= 0) {
                        return;
                    }

                    self.countries = [];

                    for (let i = 0; i < response.data.length; i++) {
                        let item = response.data[i];

                        self.countries.push({label: item['name']['en'], value: item['code_int']});
                    }
                }).catch(function () {});
        }
    },
    mounted: function () {
        this.onCountrySearch('');
    }
}