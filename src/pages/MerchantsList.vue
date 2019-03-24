<script>
import { mapState } from 'vuex';
import {
  UiButton,
  UiPageHeader,
  UiTable,
  UiTableCell,
  UiTableRow,
} from '@protocol-one/ui-kit';
import MerchanstListStore from '@/store/MerchanstListStore';
import NoResults from '@/components/NoResults.vue';

export default {
  components: {
    UiPageHeader,
    UiButton,
    UiTable,
    UiTableCell,
    UiTableRow,
    NoResults,
  },

  asyncData({ registerStoreModule, route }) {
    return registerStoreModule('MerchanstList', MerchanstListStore, {
      query: route.query,
    });
  },

  data() {
    return {

    };
  },
  computed: {
    ...mapState('MerchanstList', ['merchants']),
  },


  methods: {
  },
};
</script>

<template>
  <div>
    <UiPageHeader>
      <span slot="title">Merchants</span>
      <router-link
        slot="right"
        to="/merchants/new"
      >
       <UiButton>Create merchant</UiButton>
      </router-link>
    </UiPageHeader>

    <ui-table>
      <ui-table-row :isHead="true">
        <ui-table-cell>Name</ui-table-cell>
        <ui-table-cell>Owner user</ui-table-cell>
        <ui-table-cell>Agreement</ui-table-cell>
        <ui-table-cell>Last payout date</ui-table-cell>
        <ui-table-cell>Last payout</ui-table-cell>
      </ui-table-row>
      <ui-table-row
        v-for="merchant in merchants"
        :key="merchant.id"
        :link="{
          url: `/merchants/${merchant.id}`,
          router: true
        }"
      >
        <ui-table-cell>{{merchant.name}}</ui-table-cell>
        <ui-table-cell></ui-table-cell>
        <ui-table-cell></ui-table-cell>
        <ui-table-cell></ui-table-cell>
        <ui-table-cell></ui-table-cell>

      </ui-table-row>
    </ui-table>

    <UiPaginator
      v-if="merchants.length"
      :offset="filters.offset"
      :limit="filters.limit"
      :count="count"
      @pageChanged="handlePageChange"
    />
    <NoResults v-if="!merchants.length" />
    <pre>{{merchants}}</pre>
  </div>
</template>
