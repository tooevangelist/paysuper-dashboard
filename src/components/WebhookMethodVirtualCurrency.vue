<script>
import { required } from 'vuelidate/lib/validators';
import { mapState } from 'vuex';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'WebhookMethodVirtualCurrency',

  components: {
    NoResults,
  },

  data() {
    return {
      form: {
        userId: null,
        transactionId: null,
        amount: null,
        is_buy_for_virtual_currency: true,
      },
    };
  },

  computed: {
    ...mapState('Project', ['project']),

    active() {
      return !!this.project.virtual_currency;
    },
  },

  validations: {
    form: {
      userId: {
        required,
      },
      transactionId: {
        required,
      },
      amount: {
        required,
      },
    },
  },
};
</script>

<template>
  <div>
    <div v-if="active">
      <UiTextField
        label="User ID"
        :required="true"
        v-model="form.userId"
        v-bind="$getValidatedFieldProps('form.userId')"/>
      <UiTextField
        label="Transaction ID"
        :required="true"
        v-model="form.transactionId"
        v-bind="$getValidatedFieldProps('form.transactionId')"/>
      <UiTextField
        label="Virtual currency amount"
        :required="true"
        v-model="form.amount"
        v-bind="$getValidatedFieldProps('form.amount')"/>
      <div class="controls">
        <UiButton
          class="test-button"
          :disabled="$v.form.$invalid"
          @click="$emit('input', { ...form,  type: 'virtual_currency'})"
          text="TEST"
        />
      </div>
    </div>

    <NoResults type="add-new" v-else>
      Please
      <router-link :to="`/projects/${projectId}/virtual-currency/`">
        complete setting up this sale option
      </router-link>
      <br>
      before testing its webhooks.
    </NoResults>
  </div>
</template>

<style lang="scss" scoped>
.controls {
  margin-top: 36px;
  display: flex;
  justify-content: flex-end;
}

.test-button {
  width: 140px;
}
</style>
