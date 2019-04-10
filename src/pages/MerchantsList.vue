<script>
import { debounce } from 'lodash-es';
import { mapState, mapGetters, mapActions } from 'vuex';
import {
  UiPageHeader,
  UiTable,
  UiTableCell,
  UiTableRow,
  UiTextField,
  UiPaginator,
} from '@protocol-one/ui-kit';
import Notifications from '@/mixins/Notifications';
import MerchanstListStore from '@/store/MerchanstListStore';
import NoResults from '@/components/NoResults.vue';
import StatusIcon from '@/components/StatusIcon.vue';
import MerchantExtendingMenu from '@/components/MerchantExtendingMenu.vue';

export default {
  mixins: [Notifications],

  components: {
    UiPageHeader,
    UiTable,
    UiTableCell,
    UiTableRow,
    UiTextField,
    UiPaginator,
    NoResults,
    StatusIcon,
    MerchantExtendingMenu,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('MerchanstList', MerchanstListStore, {
        query: route.query,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      filters: {},
      isSearchRouting: false,
    };
  },

  async beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.updateFiltersFromQuery();
      this.setIsLoading(true);
      await this.fetchMerchants();
      this.setIsLoading(false);
    }
    this.isSearchRouting = false;
    next();
  },

  created() {
    this.updateFiltersFromQuery();
  },

  computed: {
    ...mapState('MerchanstList', ['merchants', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('MerchanstList', ['getFilterValues']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.searchMerchants();
      }, 500);
    },
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('MerchanstList', [
      'submitFilters', 'fetchMerchants', 'initQuery', 'sendNotification',
    ]),

    async searchMerchants() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchMerchants();
      this.setIsLoading(false);
    },

    handlePageChange({ offset }) {
      this.filters.offset = offset;
      this.searchMerchants();
    },

    navigate() {
      this.$router.push({
        path: this.$route.path,
        query: this.query,
      });
    },

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'limit', 'offset']);
    },

    async handleSendNotification(merchant, notification) {
      this.setIsLoading(true);
      try {
        await this.sendNotification({
          notification,
          merchantId: merchant.id,
        });
        this.$_Notifications_showSuccessMessage('Notification sent successfully');
      } catch (error) {
        console.warn(error);
        this.$_Notifications_showErrorMessage('Failed to send notification');
      }
      this.setIsLoading(false);
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeader>
      <span slot="title">Merchants</span>
      <UiTextField
        slot="right"
        label="Quick search"
        v-model="filters.quickFilter"
        @input="handleQuickSearchInput"
      />
    </UiPageHeader>

    <ui-table>
      <ui-table-row :isHead="true">
        <ui-table-cell>Name</ui-table-cell>
        <ui-table-cell>Owner user</ui-table-cell>
        <ui-table-cell>Agreement</ui-table-cell>
        <ui-table-cell>Last payout date</ui-table-cell>
        <ui-table-cell>Last payout</ui-table-cell>
        <ui-table-cell></ui-table-cell>
      </ui-table-row>
      <ui-table-row
        v-for="merchant in merchants.items"
        :key="merchant.id"
        :link="{
          url: `/merchants/${merchant.id}`,
          router: true
        }"
      >
        <ui-table-cell>{{merchant.name || '—'}}</ui-table-cell>
        <ui-table-cell>
          {{merchant.user ? merchant.user.email : '—'}}
        </ui-table-cell>
        <ui-table-cell>
          <StatusIcon v-if="merchant.status === 4" status="complete" />
        </ui-table-cell>
        <ui-table-cell>
          {{merchant.last_payout ? merchant.last_payout.date : '—'}}
        </ui-table-cell>
        <ui-table-cell>
          {{merchant.last_payout ? merchant.last_payout.amount : '—'}}
        </ui-table-cell>
        <ui-table-cell>
          <MerchantExtendingMenu
            :merchant="merchant"
            @sendNotification="handleSendNotification(merchant, $event)"
          />
        </ui-table-cell>
      </ui-table-row>
    </ui-table>

    <UiPaginator
      v-if="merchants.items.length"
      :offset="filters.offset"
      :limit="filters.limit"
      :count="merchants.count"
      @pageChanged="handlePageChange"
    />
    <NoResults v-if="!merchants.items.length" />
  </div>
</template>
