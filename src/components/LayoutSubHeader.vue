<script>
export default {
  name: 'LayoutSubHeader',
  props: {
    currentStep: {
      default: 1,
      type: Number,
    },
    currentStepName: {
      default: 'Account Info',
      type: String,
    },
    period: {
      required: true,
      type: Array,
    },
    stepsCount: {
      default: 6,
      type: Number,
    },
  },
  data() {
    return {
      innerPeriod: this.period,
    };
  },
};
</script>

<template>
<div class="layout-sub-header">
  <RouterLink
    class="left"
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

  <div class="right">
    <v-datepicker
      v-model="innerPeriod"
      class="datepicker"
      format="MMM DD YYYY"
      lang="en"
      rangeSeparator="·"
      valueType="timestamp"
      :editable="false"
      :range="true"
      @input="$emit('periodChange', innerPeriod)"
    />
  </div>
</div>
</template>

<style lang="scss" scoped>
.layout-sub-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #f1f3f4;
  flex-wrap: wrap;
  align-content: stretch;
  z-index: 15;
}
.left,
.right {
  position: relative;
  display: flex;
  align-content: center;
  align-items: center;
}
.left {
  min-width: 260px;
  max-width: 320px;
  flex-basis: 20%;
  background-color: #daf5f2;
  align-self: stretch;
  padding: 8px 0 8px 7px;
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
.right {
  padding: 12px 0;
}
.datepicker {
  max-width: 232px;
  margin-right: 16px;
  margin-left: 12px;
}
</style>
