<script>
import { find, mapValues, isEqual } from 'lodash-es';
import { required } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
  name: 'ProjectEntityPricesForm',

  props: {
    prices: {
      type: Array,
      required: true,
    },
    currencies: {
      type: Array,
      required: true,
    },
    getRecommendedPrices: {
      type: Function,
      required: true,
    },
    defaultCurrency: {
      type: Object,
      required: true,
    },
  },

  model: {
    prop: 'prices',
    event: 'updatePrice',
  },

  data() {
    return {
      priceData: null,

      isSteamSuggestOpened: false,

      priceSuggestList: [
        {
          id: 'manual',
          text: 'Continue manual input for all currencies',
        },
        {
          id: 'conversion',
          text: 'Use auto-conversion from default currency',
        },
      ],
    };
  },

  computed: {
    regionsPriceData() {
      return this.priceData.filter(item => item.currency !== item.region);
    },
  },

  validations() {
    return {
      priceData: mapValues(this.priceData, () => ({
        amount: {
          required,
        },
      })),
    };
  },

  created() {
    this.priceData = this.currencies.map(({ currency, region }) => {
      const match = find(this.prices, { currency, region });
      if (match) {
        return match;
      }
      return {
        amount: null,
        currency,
        region,
      };
    });
  },

  watch: {
    priceData(value) {
      this.$emit('updatePrice', value);
    },
  },

  methods: {
    ...mapActions(['setIsLoading']),

    getCurrencyName({ currency, region }) {
      if (this.isDefault({ currency, region })) {
        return `${currency}, Default currency`;
      }
      if (currency === region) {
        return currency;
      }
      return `${region}, ${currency}`;
    },

    isDefault({ currency, region }) {
      return isEqual(this.defaultCurrency, { currency, region });
    },

    async fillPrice(amount) {
      this.setIsLoading(true);
      const { currency } = this.defaultCurrency;
      const type = 'conversion';
      const prices = await this.getRecommendedPrices({ type, amount, currency })
        .catch(this.$showErrorMessage);
      prices.forEach((price) => {
        const item = find(this.priceData, { region: price.region, currency: price.currency });
        if (item) {
          item.amount = price.amount;
        }
      });
      this.setIsLoading(false);
    },

    async handleSuggestClick(item, closeSuggest) {
      if (item.id === 'conversion' && find(this.priceData, price => this.isDefault(price)).amount > 0) {
        await this.fillPrice(find(this.priceData, price => this.isDefault(price)).amount);
      }
      closeSuggest();
    },

    checkIsValid() {
      this.$v.$touch();
      return !this.$v.$invalid;
    },
  },
};
</script>

<template>
<div>
  <div class="price-group">
    <UiTextField
      v-for="(price, index) in priceData"
      :key="index"
      :class="['price-input', { '_default': isDefault(price) }]"
      :isNumeric="true"
      :decimalLength="2"
      :label="getCurrencyName(price, index)"
      v-model="price.amount"
      v-show="price.region === price.currency"
      v-bind="$getValidatedFieldProps(`priceData[${index}].amount`)"
      @suggestClosed="isSteamSuggestOpened = false"
    >
      <template v-slot:suggest="{ closeSuggest }" v-if="isDefault(price)">
        <div>
          <UiSuggestItem
            v-show="!isSteamSuggestOpened"
            v-for="(item, index) in priceSuggestList"
            :key="index"
            v-text="item.text"
            @click="handleSuggestClick(item, closeSuggest)"
          />
        </div>
      </template>
    </UiTextField>
  </div>

  <!-- Show prices for regions if available -->
  <div class="region-prices" v-if="regionsPriceData.length">
    <UiHeader level="4" :hasMargin="true">Prices for regions</UiHeader>
    <div class="price-group">
      <UiTextField
        class="price-input"
        v-for="(price, index) in regionsPriceData"
        :key="index"
        v-model="price.amount"
        :isNumeric="true"
        :decimalLength="2"
        label="Price"
        :required="true"
        v-bind="$getValidatedFieldProps(`priceData[${index}].amount`)"
      >
        <span slot="label">
          <IconQuestionInCircle class="field-label-icon" />
          {{ getCurrencyName(price, index) }}
        </span>
      </UiTextField>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.price-group {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.price-input {
  width: 18%;
  margin-right: 2%;

  &:first-child {
    width: 100%;
  }
}
.field-label-icon {
  position: absolute;
  margin: 1px 0 0 -16px;
  cursor: pointer;
}
</style>
