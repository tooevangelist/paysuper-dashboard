<script>
import {
  debounce, get, isEqual, find,
} from 'lodash-es';
import { mapState, mapGetters, mapActions } from 'vuex';
import ProjectKeyProductsListStore from '@/store/ProjectKeyProductsListStore';
import NoResults from '@/components/NoResults.vue';
import PictureGameKeyWithDoor from '@/components/PictureGameKeyWithDoor.vue';

export default {
  components: {
    PictureGameKeyWithDoor,
    NoResults,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('ProjectKeyProductsList', ProjectKeyProductsListStore, {
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
      openedTooltipId: '',
      isDeleteKeyProductConfirmOpened: false,
      deleteKeyProductCallback: () => {},
    };
  },

  async beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.updateFiltersFromQuery();
      this.setIsLoading(true);
      await this.fetchKeyProducts().catch(this.$showErrorMessage);
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
    ...mapState('Project', ['project', 'defaultCurrency']),
    ...mapState('ProjectKeyProductsList', ['gameKeys', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('ProjectKeyProductsList', ['getFilterValues']),
    ...mapGetters('User/Profile', ['userPermissions']),

    viewOnly() {
      return !this.userPermissions.editProjects;
    },

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
    ...mapActions('ProjectKeyProductsList', [
      'submitFilters', 'fetchKeyProducts', 'initQuery',
      'deleteKeyProduct', 'toggleKeyProductEnabled',
    ]),

    get,

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'offset', 'limit', 'dateFrom', 'dateTo']);
    },

    filterMerchants() {
      this.filters.offset = 0;
      this.searchKeyProducts();
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
        await this.searchKeyProducts();
        this.isInfiniteScrollLocked = false;
      });
    },

    async searchKeyProducts() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchKeyProducts().catch(this.$showErrorMessage);
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

    handleDeleteKeyProduct(keyProduct) {
      this.isDeleteKeyProductConfirmOpened = true;
      this.deleteKeyProductCallback = async () => {
        this.isDeleteKeyProductConfirmOpened = false;
        this.setIsLoading(true);
        await this.deleteKeyProduct(keyProduct.id).catch(this.$showErrorMessage);
        await this.searchKeyProducts();
        this.setIsLoading(false);
      };
    },

    async handleToggleKeyProductEnabled(keyProduct) {
      this.setIsLoading(true);
      await this.toggleKeyProductEnabled(keyProduct).catch(this.$showErrorMessage);
      await this.searchKeyProducts();
      this.setIsLoading(false);
    },

    getPlatformPrice(platform) {
      const price = find(platform.prices, this.defaultCurrency);
      if (!price) {
        return '';
      }
      return this.$formatPrice(price.amount, price.currency);
    },
  },
};
</script>

<template>
<div>
  <UiPageHeaderFrame>
    <span slot="title">Game keys</span>
    <span slot="description">
      This sales method is intended to sell game keys for specific DRM platforms,
      sending your customers e-mail with a key. Key distribution allows you to sell not only games,
      but any key activated products.
    </span>
    <PictureGameKeyWithDoor slot="picture" />
  </UiPageHeaderFrame>

  <UiPanel class="items-panel">
    <div class="filters">
      <UiFilterSearchInput
        :isAlwaysExpanded="true"
        v-model="filters.quickFilter"
        @input="handleQuickSearchInput"
      />
      <div class="filters-right">
        <UiButton
          :isTransparent="true"
          color="transparent-blue"
          class="quilin-packages-button"
          :disabled="true"
          >
          <IconUpload slot="iconBefore" class="upload-icon" fill="#919699" />
          QUILIN PACKAGES
        </UiButton>
        <RouterLink :to="`/projects/${project.id}/game-keys/new/`" v-if="!viewOnly">
          <UiButton>ADD KEYS</UiButton>
        </RouterLink>
      </div>
    </div>

    <UiTable
      v-if="gameKeys.products.length"
      layout="fixed"
    >
      <UiTableRow :isHead="true">
        <UiTableCell width="40px" align="center">
          <span class="leading-cell-content">№</span>
        </UiTableCell>
        <UiTableCell width="50px" align="left">&nbsp;</UiTableCell>
        <UiTableCell width="115px" align="left">Package</UiTableCell>
        <UiTableCell width="115px" align="left">SKU</UiTableCell>
        <UiTableCell width="115px" align="left">DRM platform</UiTableCell>
        <UiTableCell width="10%" align="left">Available keys</UiTableCell>
        <UiTableCell width="10%" align="left">Price</UiTableCell>
        <UiTableCell align="left" width="3%">&nbsp;</UiTableCell>
        <UiTableCell width="12%" align="left">Status</UiTableCell>
        <UiTableCell width="5%" align="left" v-if="!viewOnly">&nbsp;</UiTableCell>
      </UiTableRow>
      <UiTableRow
        class="content-row"
        v-for="(keyProduct, index) in gameKeys.products"
        :key="keyProduct.id"
        :link="`/projects/${project.id}/game-keys/${keyProduct.id}`"
      >
        <UiTableCell align="center"  valign="middle">
          <span class="leading-cell-content">{{ index + 1 }}</span>
        </UiTableCell>
        <UiTableCell align="left" valign="middle">
          <span
            v-if="keyProduct.cover && keyProduct.cover.images.en"
            class="img"
            :style="{ backgroundImage: `url(${keyProduct.cover.images.en})` }"
          ></span>
          <IconNoImage
            v-else
            class="img"
            width="18"
            height="18"
            fill="#919699"
          />
        </UiTableCell>
        <UiTableCell align="left"  valign="middle" :title="keyProduct.name.en">
          <span class="cell-text">{{ keyProduct.name.en }}</span>
        </UiTableCell>
        <UiTableCell align="left"  valign="middle" :title="keyProduct.sku">
          <span class="cell-text">{{ keyProduct.sku }}</span>
        </UiTableCell>
        <UiTableCell align="left"  valign="middle">
          <UiTableCellUnit
            v-for="platform in keyProduct.platforms"
            :key="platform.id"
             :title="platform.name"
          >
            <span class="cell-text">{{ platform.name }}</span>
          </UiTableCellUnit>
          <UiNoText v-if="!keyProduct.platforms" />
        </UiTableCell>
        <UiTableCell align="left"  valign="middle">
          <UiTableCellUnit
            v-for="platform in keyProduct.platforms"
            :key="platform.id"
          >
            <UiNoText v-if="!platform.count" />
            <span v-else>{{ platform.count }}</span>
          </UiTableCellUnit>
          <UiNoText v-if="!keyProduct.platforms" />
        </UiTableCell>
        <UiTableCell align="left"  valign="middle">
          <UiTableCellUnit
            v-for="platform in keyProduct.platforms"
            :key="platform.id"
          >
            <UiNoText v-if="!getPlatformPrice(platform)" />
            <span v-else>
              {{ getPlatformPrice(platform) }}
            </span>
          </UiTableCellUnit>
          <UiNoText v-if="!keyProduct.platforms" />
        </UiTableCell>
        <UiTableCell align="left"  valign="middle">&nbsp;</UiTableCell>
        <UiTableCell align="left"  valign="middle">
          <UiLabelTag
            :color="keyProduct.enabled ? 'green': 'transparent'"
          >
            {{ keyProduct.enabled ? 'Enabled': 'Disabled' }}
          </UiLabelTag>
        </UiTableCell>
        <UiTableCell
          v-if="!viewOnly"
          class="cell"
          align="left"
           valign="middle"
          @mouseenter.native="openedTooltipId = keyProduct.id"
          @mouseleave.native="() => openedTooltipId = ''"
          :noPadding="true"
        >
          <div class="dots-menu">
            <UiDotsMenuTrigger
              class="dots-menu-trigger"
              :isOpened="openedTooltipId === keyProduct.id"
            />
            <UiTip
              innerPosition="right"
              position="bottom"
              width="180px"
              :margin="0"
              :visible="openedTooltipId === keyProduct.id"
              :closeDelay="0"
              :stayOpenedOnHover="false"
            >
              <UiTooltipMenuItem
                iconComponent="IconPen"
              >
                Edit
              </UiTooltipMenuItem>
              <UiTooltipMenuItem
                :iconComponent="keyProduct.enabled ? 'IconDeactivate' : 'IconPlayTriangle'"
                @click.stop.prevent="handleToggleKeyProductEnabled(keyProduct)"
              >
                {{ keyProduct.enabled ? 'Disable': 'Enable' }}
              </UiTooltipMenuItem>
              <UiTooltipMenuItem
                iconComponent="IconDelete"
                type="delete"
                @click.stop.prevent="handleDeleteKeyProduct(keyProduct)"
              >
                Delete
              </UiTooltipMenuItem>
            </UiTip>
          </div>
        </UiTableCell>
      </UiTableRow>
    </UiTable>
    <NoResults
      v-else
      :type="isFiltersNotEmpty ? 'no-results' : 'add-new'"
    >
      <span v-if="!isFiltersNotEmpty">You don’t have any items yet</span>
    </NoResults>
  </UiPanel>

  <UiDeleteModal
    v-if="isDeleteKeyProductConfirmOpened"
    title="Delete game key"
    closeButtonText="Cancel"
    submitButtonText="Delete"
    @close="isDeleteKeyProductConfirmOpened = false"
    @submit="deleteKeyProductCallback"
  >
    Are you sure you want to delete the game key?
  </UiDeleteModal>
</div>
</template>

<style lang="scss" scoped>
$hover-text-color: #3d7bf5;
$hover-background-color: rgba($hover-text-color, 0.1);
$hover-deactivate-text-color: #ea3d2f;
$hover-deactivate-background-color: rgba($hover-deactivate-text-color, 0.08);

.items-panel {
  width: 800px;
}

.cell {
  position: relative;
}

.cell-text {
  max-width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 6px;
}

.img {
  width: 18px;
  height: 18px;
  border-radius: 2px;
  display: inline-block;
  background-size: cover;
  background-position: center;
  vertical-align: middle;
}

.dots-menu {
  position: relative;
}

.leading-cell-content {
  padding-left: 10px;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.quilin-packages-button {
  margin-right: 10px;
}
.upload-icon {
  vertical-align: middle;
}

.dots-menu-trigger {
  margin-top: 4px;
}
</style>
