<script>
export default {
  name: 'LayoutSpecialNavProgress',
  props: {
    currentStep: {
      default: 1,
      type: Number,
    },
    currentStepName: {
      default: 'Account Info',
      type: String,
    },
    stepsCount: {
      default: 6,
      type: Number,
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
    :currentStep="currentStep"
    :stepsCount="stepsCount"
  />
  <div class="step-title">
    Complete “<span class="step-name">{{ currentStepName }}</span>”
    <span class="step-progress">{{ currentStep }}/{{ stepsCount }} steps</span>
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
