<script>
import { debounce, get, isEqual } from 'lodash-es';
import { mapState, mapGetters, mapActions } from 'vuex';
import Notifications from '@/mixins/Notifications';
import ProjectGameKeysStore from '@/store/ProjectGameKeysStore';
import SimplePageHeader from '@/components/SimplePageHeader.vue';
import NoResults from '@/components/NoResults.vue';
import PictureGameKeyWithDoor from '@/components/PictureGameKeyWithDoor.vue';

export default {
  mixins: [Notifications],

  components: {
    SimplePageHeader,
    PictureGameKeyWithDoor,
    NoResults,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('ProjectGameKeys', ProjectGameKeysStore, {
        query: route.query,
        projectId: route.params.id,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      filters: {},
      isSearchRouting: false,
      isInfiniteScrollLocked: false,
    };
  },

  async beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.updateFiltersFromQuery();
      this.setIsLoading(true);
      await this.fetchGameKeys().catch(this.$_Notifications_showErrorMessage);
      this.setIsLoading(false);
    }
    this.isSearchRouting = false;
    next();
  },

  created() {
    this.updateFiltersFromQuery();
  },

  mounted() {
    this.initInfiniteScroll();
  },

  computed: {
    ...mapState('ProjectGameKeys', ['gameKeys', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('ProjectGameKeys', ['getFilterValues']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.filterMerchants();
      }, 500);
    },

    isFiltersNotEmpty() {
      return Boolean(this.filters.quickFilter);
    },
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('ProjectGameKeys', [
      'submitFilters', 'fetchGameKeys', 'initQuery', 'createGameKey',
    ]),

    get,

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'offset', 'limit', 'dateFrom', 'dateTo']);
    },

    filterMerchants() {
      this.filters.offset = 0;
      this.searchMerchants();
    },

    initInfiniteScroll() {
      this.$appEventsOn('contentScrollReachEnd', async () => {
        if (
          this.isInfiniteScrollLocked
          || this.filters.offset + this.filters.limit >= this.gameKeys.count
        ) {
          return;
        }
        this.isInfiniteScrollLocked = true;

        this.filters.offset += this.filters.limit;
        await this.searchMerchants();
        this.isInfiniteScrollLocked = false;
      });
    },

    async searchMerchants() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchGameKeys().catch(this.$_Notifications_showErrorMessage);
      this.setIsLoading(false);
    },

    navigate() {
      if (isEqual(this.$route.query, this.query)) {
        return;
      }
      this.$router.push({
        path: this.$route.path,
        query: this.query,
      });
    },

    getCountry(merchant) {
      const country = get(merchant, 'company.country');
      if (!country) {
        return '—';
      }
      return this.$t(`countries.${country}`);
    },

    getLastPayoutValue(merchant) {
      const amount = get(merchant, 'last_payout.amount');
      if (!amount) {
        return '—';
      }

      const currency = get(merchant, 'banking.currency', '');
      return this.$formatPrice(amount, currency);
    },
  },
};
</script>

<template>
<div>
  <SimplePageHeader>
    <span slot="title">Game keys</span>
    <span slot="description">
      This sales method is intended to sell game keys for specific DRM platforms,
      sending your customers e-mail with a key. Key distribution allows you to sell not only games,
      but any key activated products.
    </span>
    <PictureGameKeyWithDoor slot="picture" />
  </SimplePageHeader>

  <UiButton @click="createGameKey">createGameKey</UiButton>

  <UiPanel>

    <div class="filters">
      <UiFilterSearchInput
        :isAlwaysExpanded="true"
        v-model="filters.quickFilter"
        @input="handleQuickSearchInput"
      />
    </div>

    <UiTable
      v-if="gameKeys.products.length"
      layout="fixed"
    >
      <UiTableRow :isHead="true">
        <UiTableCell width="5%" align="left">
          <span class="leading-cell-content">№</span>
        </UiTableCell>
        <UiTableCell width="5%" align="left">&nbsp;</UiTableCell>
        <UiTableCell align="left">Package</UiTableCell>
        <UiTableCell align="left">SKU</UiTableCell>
        <UiTableCell align="left">DRM platform</UiTableCell>
        <UiTableCell align="left">Available keys</UiTableCell>
        <UiTableCell align="left">Price</UiTableCell>
        <UiTableCell align="left">Status</UiTableCell>
        <UiTableCell align="left">&nbsp;</UiTableCell>
      </UiTableRow>
      <UiTableRow
        class="content-row"
        v-for="(keyProduct, index) in gameKeys.products"
        :key="keyProduct.id"
        :link="`/gameKeys/${keyProduct.id}`"
      >
        <UiTableCell align="left">
          <span class="leading-cell-content">{{ index + 1 }}</span>
        </UiTableCell>
        <UiTableCell align="left">
          <IconNoImage class="img" width="18" height="18" fill="#919699" />
        </UiTableCell>
        <UiTableCell align="left">
          {{ keyProduct.name.en }}
        </UiTableCell>
        <UiTableCell align="left">
          {{ keyProduct.sku }}
        </UiTableCell>
        <UiTableCell align="left">
          DRM platform
        </UiTableCell>
        <UiTableCell align="left">
          Available keys
        </UiTableCell>
        <UiTableCell align="left">
          Price
        </UiTableCell>
        <UiTableCell align="left">
          <UiLabelTag
            :color="keyProduct.enabled ? 'green': 'transparent'"
          >
            {{ keyProduct.enabled ? 'Enabled': 'Disabled' }}
          </UiLabelTag>
        </UiTableCell>
        <UiTableCell align="left">...</UiTableCell>
      </UiTableRow>
    </UiTable>
    <NoResults
      v-else
      :type="isFiltersNotEmpty ? 'no-results' : 'add-new'"
    >
      <span v-if="!isFiltersNotEmpty">You don’t have any items yet</span>
    </NoResults>
  </UiPanel>
</div>
</template>

<style lang="scss" scoped>
.cell-text {
  &:not(._price) {
    max-width: 100%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &._price {
    color: #069697;
    font-weight: 500;
  }

  &._empty {
    color: #c6cacc;
  }

  .content-row:hover & {
    color: #3d7bf5;
  }
}

.img {
  display: inline-flex;
  vertical-align: middle;
}

.leading-cell-content {
  padding-left: 10px;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}
</style>
