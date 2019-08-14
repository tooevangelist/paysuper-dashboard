<script>
export default {
  name: 'LayoutTopControlsDatepicker',

  data() {
    return {
      innerPeriod: [1534784400000, 1537462800000],
    };
  },
};
</script>

<template>
<div class="layout-top-controls-datepicker">
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
</template>

<style lang="scss" scoped>
.layout-top-controls-datepicker {
  position: relative;
  display: flex;
  justify-content: flex-end;
}
.datepicker {
  max-width: 232px;
  margin-right: 16px;
  margin-left: 12px;
}
</style>
