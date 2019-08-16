<script>
export default {
  name: 'UiProgressRing',
  props: {
    currentStep: {
      default: 1,
      type: Number,
    },
    stepsCount: {
      default: 6,
      type: Number,
    },
  },
  data() {
    const circumference = 32 * Math.PI;

    return {
      circumference,
      circleAttrs: {
        cx: 21,
        cy: 21,
        fill: 'transparent',
        r: 16,
        'stroke-dasharray': circumference,
        'stroke-width': 3,
      },
    };
  },
  computed: {
    showedStrokeProgress() {
      return this.currentStep - 0.8;
    },
    indentUnpassed() {
      return 360 * this.showedStrokeProgress / this.stepsCount - 80;
    },
    strokePassedDashoffset() {
      return this.circumference - this.showedStrokeProgress / this.stepsCount * this.circumference;
    },
    strokeUnpassedDashoffset() {
      return this.circumference - this.strokePassedDashoffset + 6;
    },
  },
};
</script>

<template>
<div class="ui-progress-ring">
  <svg height="42" width="42">
    <circle
      v-bind="circleAttrs"
      class="ring _unpassed"
      :style="{
        strokeDashoffset: strokeUnpassedDashoffset,
        transform: `rotate(${indentUnpassed}deg)`,
      }"
    />
    <circle
      v-bind="circleAttrs"
      class="ring _passed"
      :style="{ strokeDashoffset: strokePassedDashoffset }"
    />
  </svg>

  <div class="current-step">{{ currentStep }}</div>
</div>
</template>

<style lang="scss" scoped>
.ui-progress-ring {
  position: relative;
  width: 42px;
  height: 42px;
}
.ring {
  transition: transform 0.2s ease-out, stroke-dashoffset 0.2s ease-out;
  transform-origin: 50% 50%;
  transform: rotate(-90deg);

  &._passed {
    stroke: #069697;
  }
  &._unpassed {
    stroke: #fff;
  }
}
.current-step {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
  align-items: center;
  color: #069697;
  font-family: Quicksand;
  font-weight: 500;
  font-size: 16px;
}
</style>
