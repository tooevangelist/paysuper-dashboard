<script>
import { required } from 'vuelidate/lib/validators';
import {
  UiSelect, UiTextField, UiHeader, UiSwitchBox,
} from '@protocol-one/ui-kit';
import { mapGetters } from 'vuex';

export default {
  name: 'ProjectFormSimpleCheckout',

  components: {
    UiSelect,
    UiTextField,
    UiHeader,
    UiSwitchBox,
  },

  props: {
    project: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapGetters('Dictionaries', ['currenciesCode']),
  },

  validations: {
    project: {
      callback_currency: {
        required,
      },
    },
  },

  methods: {
    validateForm() {
      this.$v.$touch();

      this.$watch('$v.$invalid', (value) => {
        this.$emit('validationResult', !value);
      });
      this.$emit('validationResult', !this.$v.$invalid);
    },
  },
};
</script>

<template>
  <div class="project-form-simple-checkout">
    <UiHeader level="2" :hasMargin="true">
      Simple checkout
      <UiSwitchBox class="switch-box" v-model="project.is_products_checkout" />
    </UiHeader>

    <div class="field-row">
      <UiSelect
        v-model="project.callback_currency"
        :options="currenciesCode"
        :required="true"
        :hasError="$isFieldInvalid('project.callback_currency')"
        :errorText="$getFieldErrorMessages('project.callback_currency')"
        label="Default request currency"
      />
    </div>

    <div class="field-row">
      <UiSelect
        v-model="project.limits_currency"
        :options="currenciesCode"
        label="Limits currency"
      />
    </div>

    <div class="field-row">
      <div class="field-item">
        <UiTextField v-model="project.min_payment_amount" label="Minimal amount allowed" />
      </div>
      <div class="field-item">
        <UiTextField v-model="project.max_payment_amount" label="Maximal amount allowed" />
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.project-form-simple-checkout {
  width: 528px;
}

.field-row {
  display: flex;
  align-items: center;
}

.field-item {
  flex-grow: 1;

  & + & {
    margin-left: 30px;
  }
}

.switch-box {
  margin-left: 16px;
}

.generate-button {
  margin-left: 30px;
}
</style>
