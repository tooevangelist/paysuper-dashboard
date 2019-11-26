<script>
import { get } from 'lodash-es';
import { mapActions, mapState, mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'WebhookMethodGameKeys',

  components: {
    NoResults,
  },

  data() {
    return {
      form: {
        userId: null,
        transactionId: null,
      },
      items: [null],
    };
  },

  computed: {
    ...mapState('WebHookTest', ['keys', 'projectId']),
    ...mapGetters('WebHookTest', ['keysList']),
  },

  validations: {
    form: {
      userId: {
        required,
      },
      transactionId: {
        required,
      },
    },
  },

  created() {
    this.setIsLoading(true);
    this.fetchKeys()
      .then(() => {
        this.setIsLoading(false);
      });
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('WebHookTest', ['fetchKeys']),

    get,

    addItem() {
      this.items.push(null);
    },

    runTest() {
      this.$emit('input', { ...this.form, type: 'key', products: this.items });
    },
  },

};
</script>

<template>
  <div>
    <div v-if="get(keys, 'count', 0) > 0">
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

      <div class="items">
        <UiHeader level="4">Keys</UiHeader>

        <div class="items__row" v-for="(item, index) in items" :key="index">
          <UiSelect
            v-model="items[index]"
            :options="keysList"></UiSelect>
        </div>

        <div class="items__add" @click="addItem" v-if="items.length < keysList.length">
          <IconPlus></IconPlus> Add key
        </div>
      </div>

      <div class="controls">
        <UiButton
          class="test-button"
          :disabled="$v.form.$invalid"
          @click="runTest"
          text="TEST"
        />
      </div>
    </div>

    <NoResults type="add-new" v-else>
      Please
      <router-link :to="`/projects/${projectId}/game-keys/`">
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

.items {
  .items__add {
    border: 1px dashed #E3E5E6;
    border-radius: 4px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #3D7BF5;

    svg {
      fill: #3D7BF5;
      margin-right: 10px;
      position: relative;
      top: -1px;
    }

    &:hover {
      border-color: #3D7BF5;
    }
  }
}
</style>
