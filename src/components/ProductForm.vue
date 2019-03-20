<script>
import { required } from 'vuelidate/lib/validators';
import {
  UiSelect,
  UiTextField,
  UiHeader,
  UiSwitchBox,
} from '@protocol-one/ui-kit';
import { mapState } from 'vuex';

export default {
  name: 'ProductForm',

  components: {
    UiSelect,
    UiTextField,
    UiHeader,
    UiSwitchBox,
  },

  props: {
    product: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapState('Dictionaries', ['currencies']),

    price: {
      get() {
        return this.product.price;
      },

      set(value) {
        this.product.price = Number(value);
      },
    },

    currency: {
      get() {
        return this.product.currency_int;
      },

      set(value) {
        this.product.currency_int = Number(value);
      },
    },
  },

  validations: {
    product: {
      name: {
        required,
      },
      id: {
        required,
      },
    },

    price: {
      required,
    },

    currency: {
      required,
    },
  },

  methods: {
    chekIfFormValid() {
      this.$v.$touch();

      return !this.$v.$invalid;
    },
  },
};
</script>

<template>
  <div class="product-form">
    <UiHeader level="2" :hasMargin="true">
      Details
    </UiHeader>

    <div class="field-row">
      <UiTextField
        v-model="product.name"
        label="Product name"
        :required="true"
        :hasError="$isFieldInvalid('product.name')"
        :errorText="$getFieldErrorMessages('product.name')"
      />
    </div>

    <div class="field-row">
      <UiTextField
        v-model="product.id"
        label="Product ID"
        :required="true"
        :hasError="$isFieldInvalid('product.id')"
        :errorText="$getFieldErrorMessages('product.id')"
      />
    </div>

    <UiHeader level="2" :hasMargin="true">
      Pricing
    </UiHeader>

    <div class="field-row">
      <div class="field-item">
        <UiTextField
          v-model="price"
          label="Price"
          :required="true"
          :hasError="$isFieldInvalid('price')"
          :errorText="$getFieldErrorMessages('price')"
        />
      </div>
      <div class="field-item">
        <UiSelect
          v-model="currency"
          :options="currencies"
          :required="true"
          :hasError="$isFieldInvalid('currency')"
          :errorText="$getFieldErrorMessages('currency')"
          label="Price currency"
        />
      </div>
    </div>

    <div class="field-row">

    </div>

    <UiHeader level="2" :hasMargin="true">
      Active
      <UiSwitchBox class="switch-box" v-model="product.is_active" />
    </UiHeader>

  </div>
</template>

<style lang="scss" scoped>
.product-form {
  width: 600px;
  padding: 25px 35px;
}

.field-row {
  display: flex;
  align-items: center;
}

.field-item {
  flex-grow: 1;
  width: 50%;

  & + & {
    margin-left: 30px;
  }
}

.textarea {
  width: 100%;
}

.switch-box {
  margin-left: 16px;
}
</style>
