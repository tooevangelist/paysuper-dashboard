<script>
import { mapState } from 'vuex';

export default {
  name: 'LayoutSpecialNavProgress',
  data() {
    return {
      stepsCount: 6,
    };
  },
  computed: {
    ...mapState('Company', ['completeStepsCount', 'steps']),

    currentStepCount() {
      return this.completeStepsCount + 1;
    },
    infoStepName() {
      if (!this.steps.company) {
        return 'Account Info';
      }
      if (!this.steps.contacts) {
        return 'Contacts';
      }
      if (!this.steps.banking) {
        return 'Banking Info';
      }
      if (!this.steps.tariff) {
        return 'Payments Methods';
      }

      return '';
    },
    currentStep() {
      switch (this.completeStepsCount) {
        case 4: return { prepend: 'Review & Sign', name: 'License Agreement' };
        case 5: return { prepend: 'Create your 1st', name: 'Project' };
        default: return { prepend: 'Complete', name: this.infoStepName };
      }
    },
  },
};
</script>

<template>
<RouterLink
  class="layout-special-nav-progress"
  to="/company"
>
  <UiProgressRing
    :currentStep="currentStepCount"
    :stepsCount="stepsCount"
  />
  <div class="step-title">
    {{ currentStep.prepend }} “<span class="step-name">{{ currentStep.name }}</span>”
    <span class="step-progress">{{ currentStepCount }}/{{ stepsCount }} steps</span>
  </div>
</RouterLink>
</template>

<style lang="scss" scoped>
.layout-special-nav-progress {
  display: flex;
  align-content: center;
  align-items: center;
  background-color: #daf5f2;
  align-self: stretch;
  padding-left: 7px;
}

.step-title {
  color: #000;
  font-size: 12px;
  line-height: 16px;
  margin-left: 7px;
  letter-spacing: 0.4px;
}
.step-name {
  color: #3d7bf5;
}
.step-progress {
  display: block;
}
</style>
