<script>
/* eslint-disable */
import { debounce, isEqual } from 'lodash-es';
import {
  mapState, mapGetters, mapActions,
} from 'vuex';
import PictureTwoPeoples from '@/components/PictureTwoPeoples.vue';
import userRoles from '@/store/UserRolesStore';
import InviteUserModal from '../components/InviteUserModal';

export default {
  name: 'MerchantUserRoles',

  components: {
    InviteUserModal,
    PictureTwoPeoples,
  },

  data() {
    return {
      filters: {},
      isSearchRouting: false,
      isInfiniteScrollLocked: false,
      inviteModal: false,
    };
  },

  /* async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('userRoles', userRoles, {
        query: route.query,
        projectId: route.params.id,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  computed: {
    ...mapState('userRoles', ['users', 'filterValues', 'query', 'apiQuery']),
    ...mapGetters('userRoles', ['getFilterValues']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.filterItems();
      }, 500);
    },
  },

  async beforeRouteUpdate(to, from, next) {
    if (!this.isSearchRouting) {
      this.initQuery(to.query);
      this.updateFiltersFromQuery();
      this.setIsLoading(true);
      await this.fetchUsers().catch(this.$showErrorMessage);
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
  }, */

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('userRoles', [
      'initQuery',
      'submitFilters',
      'fetchUsers',
    ]),

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter', 'offset', 'limit']);
    },

    filterItems() {
      this.filters.offset = 0;
      this.searchItems();
    },

    async searchItems() {
      this.isSearchRouting = true;
      this.setIsLoading(true);
      this.submitFilters(this.filters);
      this.navigate();
      await this.fetchUsers().catch(this.$showErrorMessage);
      this.setIsLoading(false);
    },

    initInfiniteScroll() {
      this.$appEventsOn('contentScrollReachEnd', async () => {
        if (
          this.isInfiniteScrollLocked
          || this.filters.offset + this.filters.limit >= this.users.count
        ) {
          return;
        }
        this.isInfiniteScrollLocked = true;

        this.filters.offset += this.filters.limit;
        await this.searchItems();
        this.isInfiniteScrollLocked = false;
      });
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
  },
};
</script>
<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        User roles
      </template>
      <span slot="description">
        Invite users from your company to share your Pay Super account management.
        You can assign them on different roles for different kind of duties.
      </span>
      <PictureTwoPeoples slot="picture" />
    </UiPageHeaderFrame>

    <UiPanel>
      <div class="control-bar">
        <div class="control-bar__left">
          <UiFilterSearchInput
            :isAlwaysExpanded="true"
            v-model="filters.quickFilter"
            @input="handleQuickSearchInput" />
        </div>

        <div class="control-bar__right">
          <UiButton text="INVITE USER"></UiButton>
        </div>
      </div>
    </UiPanel>

    <InviteUserModal v-show="inviteModal" :hasCloseButton="true"></InviteUserModal>
  </div>
</template>

<style lang="scss" scoped>
.control-bar {
  display: flex;
  justify-content: space-between;
}
</style>
