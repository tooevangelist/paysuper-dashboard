<script>
import { mapActions, mapState } from 'vuex';
import WebhookMethodSimpleCheckout from './WebhookMethodSimpleCheckout.vue';
import WebhookMethodVirtualCurrency from './WebhookMethodVirtualCurrency.vue';
import WebhookMethodVirtualItems from './WebhookMethodVirtualItems.vue';
import WebhookMethodGameKeys from './WebhookMethodGameKeys.vue';
import WebhookTestResult from './WebhookTestResult.vue';

export default {
  name: 'WebhookTestMethods',

  components: {
    WebhookTestResult,
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
      showTestResults: false,
      results: [],
      cases: ['existing_user', 'non_existing_user', 'invalid_signature', 'valid_signature'],
      testData: null,
    };
  },

  computed: {
    ...mapState('WebHookTest', ['projectId']),
  },

  methods: {
    ...mapActions('WebHookTest', ['sendHook']),

    handleTest(data) {
      this.testData = data;
      const tests = this.cases.map(this.runTest);

      Promise.all(tests)
        .then((response) => {
          console.log(response);
        });
    },

    runTest(testCase) {
      this.results = [];
      const req = {
        type: this.testData.type,
        testing_case: testCase,
        user: {
          external_id: this.testData.userId,
        },
        order_id: this.testData.transactionId,
        amount: parseInt(this.testData.amount, 10),
        currency: this.testData.currency,
        project: this.projectId,
      };
      this.sendHook(req)
        .then((response) => {
          this.results.push(response);
        })
        .catch((err) => {
          this.results.push(err.response);
        })
        .finally(() => {
          this.showTestResults = true;
        });
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

    <UiPanel v-if="showTestResults">
      <webhook-test-result :result="result" v-for="(result, index) in results" :key="index" />
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
