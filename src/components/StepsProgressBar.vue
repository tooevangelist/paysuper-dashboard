<script>
export default {
  name: 'StepsProgressBar',

  props: {
    stepsCount: {
      required: true,
      type: Number,
    },

    currentStep: {
      required: true,
      type: Number,
    },

    currentStepName: {
      required: true,
      type: String,
    },
  },

  computed: {
    progressBarWidth() {
      return `${100 / this.stepsCount * this.currentStep}%`;
    },
  },
};
</script>

<template>
<div class="steps-progress-bar">
  <div class="head">
    <span>{{currentStep}}/{{stepsCount}} STEPS</span>
  </div>
  <div class="step-name">
    <span>{{currentStepName}}</span>
  </div>
  <div class="bar">
    <span :style="{width: progressBarWidth}"></span>
  </div>
</div>
</template>

<style lang="scss" scoped>
.steps-progress-bar {
}

.head,
.step-name {
  padding: 0 6px;
}
.head {
  font-weight: 500;
  font-size: 10px;
  line-height: 16px;
  color: #3d7bf5;
  letter-spacing: 1.5px;
  margin-bottom: 2px;
}

.step-name {
  font-size: 12px;
  line-height: 16px;
}

.bar {
  margin-top: 6px;
  height: 4px;
  background: #e6efff;

  span {
    display: block;
    height: 100%;
    background: #3d7bf5;
  }
}
</style>
