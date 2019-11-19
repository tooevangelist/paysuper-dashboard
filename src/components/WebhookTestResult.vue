<script>
export default {
  name: 'WebhookTestResult',

  data() {
    return {
      tabs: [
        { label: 'Request', value: 'request' },
        { label: 'Response', value: 'response' },
      ],
      currentTab: 0,
    };
  },
};
</script>

<template>
  <div class="result">
    <header class="result__header">
      <UiHeader level="3">
        Test
      </UiHeader>
      <div class="result__status result__status--passed">
        <IconPassed class="passed"></IconPassed>
        <IconFail class="fail"></IconFail>
        <span>Status text</span>
      </div>

      <p>Some text</p>
    </header>

    <div class="result__content">
      <UiTabs :items="tabs" v-model="currentTab"></UiTabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result {
  border: 1px solid #F1F3F4;

  &__header {
    background: #F7F9FA;
    padding: 27px 25px;
    color: #5E6366;
  }

  &__content {
    padding: 12px 25px 25px;
  }

  &__status {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    margin: 2px 0 9px;

    svg {
      margin-right: 8px;
      position: relative;
      top: -1px;
    }

    &--passed {
      color: #2FA84F;

      .fail {
        display: none;
      }
    }

    &--fail {
      color: #EA3D2F;

      .passed {
        display: none;
      }
    }
  }
}
</style>
