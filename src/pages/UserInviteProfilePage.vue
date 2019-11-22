<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { cloneDeep } from 'lodash-es';
import UserProfilePerson from '@/components/UserProfilePerson.vue';
import redirectOnboardedUser from '@/helpers/redirectOnboardedUser';

export default {
  name: 'UserInviteProfilePage',

  components: {
    UserProfilePerson,
  },

  data() {
    return {
      profileLocal: {},
      isFormValid: false,
    };
  },

  computed: {
    ...mapGetters('User', ['userPermissions']),
    ...mapState('User/Profile', ['profile', 'currentStepCode']),
  },

  watch: {
    profile: {
      handler() {
        this.profileLocal = cloneDeep(this.profile);
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions('User', ['initState', 'approveInvitation']),
    ...mapActions('User/Profile', ['updateProfile']),

    async submitForm() {
      try {
        await this.updateProfile({
          personal: this.profileLocal.personal,
        });

        await this.approveInvitation();
        await this.initState();
        redirectOnboardedUser(params => this.$navigate(params), this.userPermissions);
      } catch (error) {
        this.$showErrorMessage(error);
      }
    },
  },
};
</script>

<template>
<div class="user-profile">
  <div class="wrapper">
    <UserProfilePerson
      :profile="profileLocal"
      @valid="isFormValid = $event"
    />

    <div class="controls">
      <UiButton
        class="controls__button"
        color="green"
        :disabled="!isFormValid"
        @click="submitForm"
      >
        DONE
      </UiButton>
    </div>
  </div>
</div>
</template>


<style lang="scss" scoped>
.user-profile {
  padding-bottom: 40px;
}

.wrapper {
  width: 450px;
}

.controls {
  display: flex;
  justify-content: flex-end;
  margin-top: 36px;

  &__button {
    width: 120px;
  }
}
</style>
