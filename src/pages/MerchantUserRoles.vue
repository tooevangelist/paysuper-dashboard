<script>
import {
  debounce, isEqual, get, find,
} from 'lodash-es';
import {
  mapState, mapGetters, mapActions,
} from 'vuex';
import PictureTwoPeoples from '@/components/PictureTwoPeoples.vue';
import userRoles from '@/store/UserRolesStore';
import roleScheme from '@/schemes/userRolesStatusScheme';
import InviteUserModal from '@/components/InviteUserModal.vue';
import InviteUserSuccessModal from '@/components/InviteUserSeccessModal.vue';

export default {
  name: 'MerchantUserRoles',

  components: {
    InviteUserSuccessModal,
    InviteUserModal,
    PictureTwoPeoples,
  },

  data() {
    return {
      filters: {},
      isSearchRouting: false,
      isInfiniteScrollLocked: false,
      inviteModal: false,
      inviteSuccessModal: false,
      showDeleteConfirm: false,
      showChangeRoleConfirm: false,
      selectedUser: null,
      newRole: null,
      roleScheme,
    };
  },

  async asyncData({ store, registerStoreModule, route }) {
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
    ...mapGetters('User', ['userPermissions']),

    handleQuickSearchInput() {
      return debounce(() => {
        this.filterItems();
      }, 500);
    },

    filteredUsers() {
      return this.users.filter(user =>
        // eslint-disable-next-line
        ~user.email.toLowerCase().indexOf(this.filters.quickFilter.toLowerCase()));
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

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('userRoles', [
      'initQuery',
      'submitFilters',
      'fetchUsers',
      'invite',
      'delete',
      'changeRole',
    ]),

    updateFiltersFromQuery() {
      this.filters = this.getFilterValues(['quickFilter']);
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

    navigate() {
      if (isEqual(this.$route.query, this.query)) {
        return;
      }
      this.$router.push({
        path: this.$route.path,
        query: this.query,
      });
    },

    async handleAddUser(user) {
      this.setIsLoading(true);
      await this.invite(user)
        .then((data) => {
          if (data.status === 400) {
            throw data.message;
          } else {
            this.inviteSuccessModal = true;
          }
        })
        .catch(this.$showErrorMessage);
      this.setIsLoading(false);
      this.inviteModal = false;
    },

    getLabelColor(role) {
      return get(find(this.roleScheme, { value: role }), 'color');
    },

    getRoleName(role) {
      return get(find(this.roleScheme, { value: role }), 'status');
    },

    deleteSeletedUser() {
      this.delete(this.selectedUser).catch(this.$showErrorMessage);
      this.showDeleteConfirm = false;
      this.selectedUser = null;
    },

    handleChangeRole(role, user) {
      this.selectedUser = user;
      this.newRole = role.value;
      this.showChangeRoleConfirm = true;
    },

    async confirmChangeRole() {
      this.setIsLoading(true);
      await this.changeRole({
        id: this.selectedUser.id,
        email: this.selectedUser.email,
        role: this.newRole,
      }).catch(this.$showErrorMessage);
      this.setIsLoading(false);
      this.selectedUser = null;
      this.newRole = null;
      this.showChangeRoleConfirm = false;
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

        <div class="control-bar__right" v-if="userPermissions.inviteProjectUsers">
          <UiButton text="INVITE USER" @click="inviteModal = true"></UiButton>
        </div>
      </div>

      <UiTable class="users">
        <UiTableRow :isHead="true">
          <UiTableCell align="left" width="4%"></UiTableCell>
          <UiTableCell align="left" width="73%">User</UiTableCell>
          <UiTableCell align="left">Role</UiTableCell>
          <UiTableCell align="left" width="5%" v-if="userPermissions.inviteProjectUsers"/>
        </UiTableRow>
        <UiTableRow
          v-for="user in filteredUsers"
          :key="user.id"
          :link="`/settings/user-roles/${user.id}`"
        >
          <UiTableCell align="left">
            <IconUser class="img" width="18" height="18" fill="#919699" />
          </UiTableCell>
          <UiTableCell align="left">
            {{ user.email }}
          </UiTableCell>
          <UiTableCell align="left">
            <template v-if="user.role !== 'merchant_owner'">
              <template v-if="userPermissions.inviteProjectUsers">
                <UiLabelSwitch
                  :value="user.role"
                  :scheme="roleScheme"
                  @input="handleChangeRole($event, user)"/>
              </template>
              <template v-else>
                <UiLabelTag :color="getLabelColor(user.role)" class="owner-label">
                  {{ getRoleName(user.role) }}
                </UiLabelTag>
              </template>
            </template>
            <UiLabelTag v-else color="red" class="owner-label">Owner</UiLabelTag>
          </UiTableCell>
          <UiTableCell v-if="userPermissions.inviteProjectUsers">
            <div
              class="delete-user"
              v-if="user.role !== 'merchant_owner'"
              @click.stop.prevent="showDeleteConfirm = true, selectedUser = user">
              <IconDelete />
            </div>
          </UiTableCell>
        </UiTableRow>
      </UiTable>
    </UiPanel>

    <UiConfirm
      v-if="showChangeRoleConfirm && selectedUser"
      title="Change role"
      buttonText="CONFIRM"
      buttonColor="blue"
      @close="showChangeRoleConfirm=false"
      @confirm="confirmChangeRole">
      <div class="change-role">
        <div class="change-role__labels">
          <UiLabelTag :color="getLabelColor(this.selectedUser.role)">
            {{ getRoleName(this.selectedUser.role) }}
          </UiLabelTag>

          <IconThinRightArrow class="change-role__dir"/>

          <UiLabelTag :color="getLabelColor(this.newRole)">
            {{ getRoleName(this.newRole) }}
          </UiLabelTag>
        </div>
        Are you sure you want to assign a new role for this user <br> {{selectedUser.email}}?
      </div>
    </UiConfirm>

    <UiConfirm
      v-if="showDeleteConfirm && selectedUser"
      title="Delete item"
      buttonText="DELETE"
      buttonColor="red"
      @close="showDeleteConfirm=false"
      @confirm="deleteSeletedUser">
      Are you sure you want to assign a new role for this user {{selectedUser.email}}?
    </UiConfirm>

    <InviteUserModal
      v-if="inviteModal"
      @close="inviteModal = false"
      @input="handleAddUser" />

    <InviteUserSuccessModal
      v-show="inviteSuccessModal"
      @close="inviteSuccessModal = false" />
  </div>
</template>

<style lang="scss" scoped>
.control-bar {
  display: flex;
  justify-content: space-between;
}

.users {
  margin-top: 32px;
}

.delete-user {
  cursor: pointer;
  position: relative;
  top: 2px;

  svg {
    fill: #c6cacc;
  }

  &:hover svg {
    fill: #ea3d2f;
  }
}

.owner-label {
  width: 130px;
}

.change-role {
  font-size: 14px;
  letter-spacing: 0.25px;
  color: #5e6366;

  &__labels {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }

  &__dir {
    fill: #000;
  }
}
</style>
