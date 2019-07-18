<script>
import UserProfilePerson from '@/components/UserProfilePerson.vue';
import UserProfileHelp from '@/components/UserProfileHelp.vue';
import UserProfileCompany from '@/components/UserProfileCompany.vue';
import StepsProgressBar from '@/components/StepsProgressBar.vue';

export default {
  name: 'PageUserProfile',

  components: {
    UserProfilePerson,
    UserProfileHelp,
    UserProfileCompany,
    StepsProgressBar,
  },

  data() {
    return {
      steps: [
        {
          name: 'About yourself',
          component: 'UserProfilePerson',
        },
        {
          name: 'How we can help',
          component: 'UserProfileHelp',
        },
        {
          name: 'About your company and games',
          component: 'UserProfileCompany',
        },
      ],
      currentStepIndex: 0,
    };
  },

  computed: {
    currentStep() {
      return this.steps[this.currentStepIndex];
    },
  },

  methods: {
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
    <StepsProgressBar
      class="progress-bar"
      :stepsCount="3"
      :currentStep="currentStepIndex + 1"
      :currentStepName="currentStep.name"
     />
    <component :is="currentStep.component" />

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
        class="controls__button"
        @click="goNext"
      >
        NEXT
      </UiButton>
    </div>
  </div>
</div>
</template>


<style lang="scss" scoped>
.user-profile {
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
