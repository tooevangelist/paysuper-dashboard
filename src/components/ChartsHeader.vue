<script>
export default {
  name: 'ChartsHeader',
  props: {
    period: {
      default: 'current_month',
      type: String,
    },
    title: {
      default: 'Dashboard',
      type: String,
    },
  },
  computed: {
    periods() {
      return [
        { label: 'This month', value: 'current_month' },
        { label: 'Previous month', value: 'previous_month' },
        { label: 'This quarter', value: 'current_quarter' },
        { label: 'Previous quarter', value: 'previous_quarter' },
        { label: 'This year', value: 'current_year' },
        { label: 'Previous year', value: 'previous_year' },
      ];
    },
  },
};
</script>

<template>
<div class="charts-header">
  <div class="title">{{ title }}</div>
  <div class="controls">
    <UiSelectAsButton
      color="transparent-gray"
      size="small"
      :options="periods"
      :value="period"
      :isTransparent="true"
      @input="$emit('changePeriod', { type: 'main', period: $event })"
    />
    <UiButton
      class="print"
      color="transparent-gray"
      size="small"
      :isTransparent="true"
      @click="$emit('printDashboard')"
    >
      <IconPrint />
    </UiButton>
  </div>
</div>
</template>

<style lang="scss" scoped>
.charts-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-grow: 1;
  align-items: center;
}
.title {
  font-family: Quicksand;
  font-size: 34px;
  line-height: 42px;
  letter-spacing: 0.25px;
  color: #000;
  padding-right: 16px;
}
.controls {
  display: flex;
  align-items: center;
}
.print {
  margin-left: 8px;
}
</style>
