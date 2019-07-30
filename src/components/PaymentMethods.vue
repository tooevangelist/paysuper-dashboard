<script>
export default {
  name: 'PaymentMethods',
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<template>
<div class="payment-methods">
  <div class="section">
    <div class="info">
    </div>

  </div>

  <UiButton
    class="submit"
  >
    SUBMIT APPLICATION
  </UiButton>
</div>
</template>

<style lang="scss" scoped>
.payment-methods {
  display: flex;
  flex-direction: column;
}
.section {
  margin-bottom: 12px;
}
.info {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #5e6366;
  margin-bottom: 20px;
  max-width: 548px;
}
.submit {
  min-width: 180px;
  align-self: flex-end;
  letter-spacing: 0.75px;
}
</style>
