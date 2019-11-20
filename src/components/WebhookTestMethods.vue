<script>
import WebhookMethodSimpleCheckout from './WebhookMethodSimpleCheckout.vue';
import WebhookMethodVirtualCurrency from './WebhookMethodVirtualCurrency.vue';
import WebhookMethodVirtualItems from './WebhookMethodVirtualItems.vue';
import WebhookMethodGameKeys from './WebhookMethodGameKeys.vue';

export default {
  name: 'WebhookTestMethods',

  components: {
    WebhookMethodSimpleCheckout,
    WebhookMethodVirtualCurrency,
    WebhookMethodVirtualItems,
    WebhookMethodGameKeys,
  },

  data() {
    return {
      tabs: [
        { label: 'Simple checkout', value: 0 },
        { label: 'Virtual currency', value: 1 },
        { label: 'Virtual items', value: 2 },
        { label: 'Game keys', value: 3 },
      ],
      currentTab: 0,
      tabsComponents: [
        WebhookMethodSimpleCheckout,
        WebhookMethodVirtualCurrency,
        WebhookMethodVirtualItems,
        WebhookMethodGameKeys,
      ],
    };
  },

  methods: {
    handleTest(data) {
      console.log(data);
    },
  },
};
</script>

<template>
  <div class="wh-test">
    <UiPanel>
      <UiTabs :items="tabs" v-model="currentTab"></UiTabs>
      <div class="wh-test__content">
        <component :is="tabsComponents[currentTab]" @input="handleTest"></component>
      </div>
    </UiPanel>
  </div>
</template>

<style lang="scss" scoped>
.wh-test {
  margin-top: 8px;

  &__content {
    margin-top: 32px;
  }
}
</style>
