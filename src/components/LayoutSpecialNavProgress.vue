<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'LayoutSpecialNavProgress',
  data() {
    return {
      stepsCount: 6,
    };
  },
  computed: {
    ...mapState('User/Merchant', [
      'onboardingCompleteStepsCount',
      'onboardingSteps',
      'hasProjects',
      'merchant',
    ]),

    status() {
      return this.merchant.status;
    },

    currentStepCount() {
      return this.onboardingCompleteStepsCount + 1;
    },
    infoStepName() {
      if (!this.onboardingSteps.company) {
        return 'Account Info';
      }
      if (!this.onboardingSteps.contacts) {
        return 'Contacts';
      }
      if (!this.onboardingSteps.banking) {
        return 'Banking Info';
      }
      if (!this.onboardingSteps.tariff) {
        return 'Payments Methods';
      }

      return '';
    },
    currentStep() {
      switch (this.onboardingCompleteStepsCount) {
        case 4: return { prepend: 'Review & Sign', name: 'License Agreement' };
        case 5: return { prepend: 'Create your 1st', name: 'Project' };
        default: return { prepend: 'Complete', name: this.infoStepName };
      }
    },
    hasClosed() {
      return this.onboardingCompleteStepsCount > 5;
    },
  },
  methods: {
    ...mapMutations('User/Merchant', { setCompleteStepsCount: 'onboardingCompleteStepsCount' }),
  },
};
</script>

<template>
<div
  v-if="!hasClosed"
  class="layout-special-nav-progress"
>
  <RouterLink
    v-if="status < 4 || !hasProjects"
    class="box _progress"
    to="/company"
  >
    <UiProgressRing
      :currentStep="currentStepCount"
      :stepsCount="stepsCount"
    />
    <div class="step-title _progress">
      {{ currentStep.prepend }} “<span class="step-name">{{ currentStep.name }}</span>”
      <span class="step-progress">{{ currentStepCount }}/{{ stepsCount }} steps</span>
    </div>
  </RouterLink>

  <div
    v-else
    class="box"
  >
    <div class="check">
      <IconCheckInCircle />
    </div>
    <div class="step-title">
      Your onboarding process is&nbsp;complete!
    </div>
    <div
      class="close"
      @click="setCompleteStepsCount(onboardingCompleteStepsCount + 1)"
    >
      <IconClose />
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.layout-special-nav-progress {
  display: flex;
  background-color: #daf5f2;
  align-self: stretch;
}
.box {
  display: flex;
  align-content: center;
  align-items: center;

  &._progress {
    padding-left: 7px;
  }
}
.step-title {
  color: #000;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;

  &._progress {
    margin-left: 7px;
  }
}
.step-name {
  color: #3d7bf5;
}
.step-progress {
  display: block;
}
.check {
  min-width: 56px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > svg {
    width: 20px;
    height: 20px;
  }
}
.close {
  align-self: stretch;
  min-width: 56px;
  height: 55px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  & > svg {
    width: 12px;
    height: 12px;
    transition: stroke 0.2s ease-out;
  }

  &:hover > svg {
    stroke: #3d7bf5;
  }
}
</style>
