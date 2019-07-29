<script>
import { mapState, mapActions } from 'vuex';
import { findKey, size } from 'lodash-es';
import UserProfileStore from '@/store/UserProfileStore';
import UserProfilePerson from '@/components/UserProfilePerson.vue';
import UserProfileHelp from '@/components/UserProfileHelp.vue';
import UserProfileCompany from '@/components/UserProfileCompany.vue';
import StepsProgressBar from '@/components/StepsProgressBar.vue';
import ConfirmYourEmail from '@/components/ConfirmYourEmail.vue';
import Notifications from '@/mixins/Notifications';

export default {
  name: 'PageUserProfile',

  mixins: [Notifications],

  components: {
    UserProfilePerson,
    UserProfileHelp,
    UserProfileCompany,
    StepsProgressBar,
    ConfirmYourEmail,
  },

  async asyncData({ store, registerStoreModule }) {
    try {
      await registerStoreModule('UserProfile', UserProfileStore);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      steps: {
        personal: {
          name: 'About yourself',
          component: 'UserProfilePerson',
          position: 1,
          isValid: false,
          dataSectionName: 'personal',
        },
        help: {
          name: 'How we can help',
          component: 'UserProfileHelp',
          position: 2,
          isValid: false,
          dataSectionName: 'help',
        },
        company: {
          name: 'About your company and games',
          component: 'UserProfileCompany',
          position: 3,
          isValid: false,
          dataSectionName: 'company',
        },
      },
    };
  },

  computed: {
    ...mapState('UserProfile', ['profile', 'currentStepCode']),

    isConfirmEmailStep() {
      return this.currentStepCode === 'confirmEmail';
    },

    currentStep() {
      return this.steps[this.currentStepCode];
    },

    isFinalStep() {
      if (!this.currentStep) {
        return false;
      }
      return this.currentStep.position === size(this.steps);
    },

    isGoNextEnabled() {
      if (!this.currentStep) {
        return false;
      }
      return this.currentStep.isValid;
    },
  },

  methods: {
    ...mapActions('UserProfile', ['updateProfile', 'setCurrentStepCode']),

    handleStepComplete(value) {
      this.currentStep.isValid = value;
    },

    async goNext() {
      const nextStepCode = findKey(this.steps, { position: this.currentStep.position + 1 })
        || 'confirmEmail';
      const { dataSectionName } = this.currentStep;
      try {
        await this.updateProfile({
          [dataSectionName]: this.profile[dataSectionName],
          ...(nextStepCode ? { last_step: nextStepCode } : {}),
        });

        this.setCurrentStepCode(nextStepCode);
      } catch (error) {
        this.$_Notifications_showErrorMessage(error.message);
      }
    },

    goBack() {
      const prevStepCode = findKey(this.steps, { position: this.currentStep.position - 1 });
      if (prevStepCode) {
        this.setCurrentStepCode(prevStepCode);
      }
    },
  },
};
</script>

<template>
<div class="user-profile">
  <div class="wrapper">
    <ConfirmYourEmail v-if="isConfirmEmailStep" />
    <template v-if="!isConfirmEmailStep">
      <StepsProgressBar
        class="progress-bar"
        :stepsCount="3"
        :currentStep="currentStep.position"
        :currentStepName="currentStep.name"
      />
      <component
        :is="currentStep.component"
        :profile="profile"
        @valid="handleStepComplete"
      />

      <div class="controls">
        <UiButton
          v-if="currentStep.position > 1"
          class="controls__button"
          :isTransparent="true"
          @click="goBack"
        >
          BACK
        </UiButton>
        <UiButton
          v-if="isFinalStep"
          class="controls__button"
          color="green"
          :disabled="!isGoNextEnabled"
          @click="goNext"
        >
          DONE
        </UiButton>
        <UiButton
          v-else
          class="controls__button"
          :disabled="!isGoNextEnabled"
          @click="goNext"
        >
          NEXT
        </UiButton>
      </div>
    </template>
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

.progress-bar {
  margin-bottom: 48px;
}

.controls {
  display: flex;
  justify-content: flex-end;
  margin-top: 36px;

  &__button {
    width: 120px;

    & + & {
      margin-left: 12px;
    }
  }
}
</style>
