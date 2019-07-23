<script>
import { mapState } from 'vuex';
import UserProfileStore from '@/store/UserProfileStore';
import UserProfilePerson from '@/components/UserProfilePerson.vue';
import UserProfileHelp from '@/components/UserProfileHelp.vue';
import UserProfileCompany from '@/components/UserProfileCompany.vue';
import StepsProgressBar from '@/components/StepsProgressBar.vue';
import ConfirmYourEmail from '@/components/ConfirmYourEmail.vue';

export default {
  name: 'PageUserProfile',

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
      isComplete: false,
      steps: [
        {
          name: 'About yourself',
          component: 'UserProfilePerson',
          code: 'person',
          isValid: false,
        },
        {
          name: 'How we can help',
          component: 'UserProfileHelp',
          code: 'help',
          isValid: false,
        },
        {
          name: 'About your company and games',
          component: 'UserProfileCompany',
          code: 'company',
          isValid: false,
        },
      ],
      currentStepIndex: 0,
    };
  },

  computed: {
    ...mapState('UserProfile', ['profile']),
    currentStep() {
      return this.steps[this.currentStepIndex];
    },

    isGoNextEnabled() {
      return this.currentStep.isValid;
    },
  },

  methods: {
    handleStepComplete(value) {
      this.currentStep.isValid = value;
    },

    goNext() {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.currentStepIndex += 1;
      }
    },

    goBack() {
      if (this.currentStepIndex !== 0) {
        this.currentStepIndex -= 1;
      }
    },
  },
};
</script>

<template>
<div class="user-profile">
  <div class="wrapper">
    <ConfirmYourEmail v-if="isComplete" />
    <template v-if="!isComplete">
      <StepsProgressBar
        class="progress-bar"
        :stepsCount="3"
        :currentStep="currentStepIndex + 1"
        :currentStepName="currentStep.name"
      />
      <component
        :is="currentStep.component"
        :profile="profile"
        @valid="handleStepComplete"
      />

      <div class="controls">
        <UiButton
          v-if="currentStepIndex > 0"
          class="controls__button"
          :isTransparent="true"
          @click="goBack"
        >
          BACK
        </UiButton>
        <UiButton
          v-if="currentStepIndex === steps.length - 1"
          class="controls__button"
          color="green"
          :disabled="!isGoNextEnabled"
          @click="isComplete = true"
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
