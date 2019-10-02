<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        Virtual items
      </template>
      <span slot="description">
        This sales option will allow you to sell your Virtual Items, like <b>swords, guns,
          helmets</b> and virtual currency packs.
      </span>
      <PictureWoomanLooking slot="picture"/>
    </UiPageHeaderFrame>

    <UiPanel>
      <div class="control-bar">
        <UiFilterSearchInput
          :isAlwaysExpanded="true"
          v-model="filters.quickFilter"
          @input="handleQuickSearchInput" />
        <UiButton text="ADD ITEM" @click.prevent="createItem"></UiButton>
      </div>

      <div class="items-list">
        <UiTable v-if="virtualItems.items.length">
          <UiTableRow :isHead="true">
            <UiTableCell width="5%" align="left">
              <span class="leading-cell-content">№</span>
            </UiTableCell>
            <UiTableCell width="5%" align="left">&nbsp;</UiTableCell>
            <UiTableCell align="left">Virtual item</UiTableCell>
            <UiTableCell align="left">SKU</UiTableCell>
            <UiTableCell align="left">Price</UiTableCell>
            <UiTableCell align="left">Status</UiTableCell>
            <UiTableCell width="5%" align="left"></UiTableCell>
          </UiTableRow>
          <UiTableRow
            class="content-row"
            v-for="(item, index) in virtualItems.items"
            :key="item.id"
            :link="`/virtualItems/${item.id}`">
            <UiTableCell align="left" valign="top">
              <span class="leading-cell-content">{{ index + 1 }}</span>
            </UiTableCell>
            <UiTableCell align="left" valign="top">
              <IconNoImage class="img" width="18" height="18" fill="#919699" />
            </UiTableCell>
            <UiTableCell align="left" valign="top" :title="item.name.en">
              <span class="cell-text">{{ item.name.en }}</span>
            </UiTableCell>
            <UiTableCell align="left" valign="top" :title="item.sku">
              <span class="cell-text">{{ item.sku }}</span>
            </UiTableCell>
            <UiTableCell align="left" valign="top" :title="item.price">
              <span class="cell-text">{{ item.price }}</span>
            </UiTableCell>
            <UiTableCell align="left" valign="top">
              Status
            </UiTableCell>
            <UiTableCell
              class="cell"
              align="left"
              valign="top"
              @mouseenter.native="openedTooltipId = item.id"
              @mouseleave.native="() => openedTooltipId = ''"
              :noPadding="true"
            >
              <UiDotsMenuTrigger
                class="dots-menu-trigger"
                :isOpened="openedTooltipId === item.id"
              />

              <UiTip
                innerPosition="right"
                position="bottom"
                width="180px"
                :margin="0"
                :visible="openedTooltipId === item.id"
                :closeDelay="0"
                :stayOpenedOnHover="false"
              >
                <UiTooltipMenuItem
                  iconComponent="IconPen"
                >
                  Edit
                </UiTooltipMenuItem>
                <UiTooltipMenuItem
                  iconComponent="IconDeactivate"
                >
                  {{ keyProduct.enabled ? 'Disable': 'Enable' }}
                </UiTooltipMenuItem>
                <UiTooltipMenuItem
                  iconComponent="IconDelete"
                  type="delete"
                >
                  Delete
                </UiTooltipMenuItem>
              </UiTip>
            </UiTableCell>
          </UiTableRow>
        </UiTable>

        <NoResults type="add-new" v-else>You don’t have any item yet</NoResults>
      </div>
    </UiPanel>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';
import { mapState, mapGetters, mapActions } from 'vuex';
import PictureWoomanLooking from '@/components/PictureWomanLooking.vue';
import NoResults from '@/components/NoResults.vue';
import ProjectVirtualItemsStore from '@/store/ProjectVirtualItemsStore';

export default {
  name: 'ProjectVirtualItemsPage',

  components: {
    NoResults,
    PictureWoomanLooking,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      filters: {},
      isSearchRouting: false,
      isInfiniteScrollLocked: false,
      openedTooltipId: '',
    };
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('ProjectVirtualItems', ProjectVirtualItemsStore, {
        query: route.query,
        projectId: route.params.id,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  computed: {
    ...mapState('ProjectVirtualItems', ['virtualItems', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('ProjectVirtualItems', ['getFilterValues']),

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
    ...mapActions('ProjectVirtualItems', ['initQuery', 'createItem']),
  },
};
</script>

<style lang="scss" scoped>
.control-bar {
  display: flex;
  justify-content: space-between;
}
</style>
