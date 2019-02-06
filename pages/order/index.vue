<template>
  <div style="width: 100%;">
    <order-search-panel @onSearch="onSearch"></order-search-panel>

    <div class="col-12">
      <order-item-list :count="count" :items="items" @onPageChange="onPageChange"></order-item-list>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import OrderSearchPanel from '../../components/OrderSearchPanel.vue';
import OrderItemList from '../../components/OrderItemList.vue';

export default {
  middleware: 'IsNotAuthenticated',
  components: { OrderSearchPanel, OrderItemList },
  data() {
    return {
      count: 0,
      items: [],
      filters: {
        limit: 10,
        offset: 0,
        sort: ['_id'],
      },
    };
  },
  methods: {
    onChangeCountry(val) {

    },
    onPageChange(limit, offset, sortBy) {
      this.filters.limit = limit;
      this.filters.offset = offset;
      this.filters.sort = sortBy;

      this.onSearch(this.filters);
    },
    onSearch(filters) {
      const self = this;
      this.filters = { ...this.filters, ...filters };

      let url = `${process.env.apiServerUrl}/api/v1/s/order`;

      if (Object.keys(this.filters).length > 0) {
        url += `?${$.param(this.filters)}`;
      }

      axios.get(url, { headers: { Authorization: `Bearer ${this.$store.state.user.accessToken}` } })
        .then((response) => {
          if (!response.hasOwnProperty('data') || !response.data.hasOwnProperty('count')
                            || !response.data.hasOwnProperty('items')) {
            return;
          }

          self.items = response.data.items;
          self.count = response.data.count;
        }).catch(() => {

        });
    },
  },
  watch: {
    limit(value) {
      this.filters.limit = value;
    },
  },
};
</script>
