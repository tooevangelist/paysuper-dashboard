<template>
    <div style="width: 100%;">
        <order-search-panel @onSearch="onSearch"></order-search-panel>

        <div class="col-12">
            <order-item-list :count="count" :items="items" @onPageChange="onPageChange"></order-item-list>
        </div>
    </div>
</template>

<script>
    import OrderSearchPanel from '../../components/OrderSearchPanel';
    import OrderItemList from '../../components/OrderItemList';
    import axios from 'axios';

    export default {
        middleware: 'IsNotAuthenticated',
        components: {OrderSearchPanel, OrderItemList},
        data: function () {
            return {
                count: 0,
                items: [],
                filters: {
                    limit: 10,
                    offset: 0,
                    sort: ['_id']
                }
            }
        },
        methods: {
            onChangeCountry: function (val) {

            },
            onPageChange: function (limit, offset, sortBy) {
                this.filters.limit = limit;
                this.filters.offset = offset;
                this.filters.sort = sortBy;

                this.onSearch(this.filters);
            },
            onSearch: function (filters) {
                const self = this;
                this.filters = {...this.filters, ...filters};

                let url = `${process.env.apiServerUrl}/api/v1/s/order`;

                if (Object.keys(this.filters).length > 0) {
                    url += '?' + $.param(this.filters);
                }

                axios.get(url, {headers: {Authorization: `Bearer ${this['$store'].state.user.accessToken}`}})
                    .then(function (response) {
                        if (!response.hasOwnProperty('data') || !response.data.hasOwnProperty('count')
                            || !response.data.hasOwnProperty('items')) {
                            return;
                        }

                        self.items = response.data.items;
                        self.count = response.data.count;
                    }).catch(function () {

                    });
            }
        },
        watch: {
            limit: function (value) {
                this.filters.limit = value;
            }
        }
    }
</script>