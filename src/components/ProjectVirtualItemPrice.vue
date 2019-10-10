<script>
import { find } from 'lodash-es';

export default {
  name: 'ProjectVirtualItemPrice',

  props: {
    method: {
      type: String,
      required: true,
    },
    prices: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      pricingMethodOptions: {
        real: {
          label: 'Real currency',
          value: 'manual',
          enabled: true,
        },
        virtual: {
          label: 'Virtual currency',
          value: 'currency',
          enabled: false, // TODO: ждем реализацию Virtual currency
        },
      },

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
    hasRegionPrice() {
      return this.prices.some(price => price.currency !== price.region);
    },
  },

  methods: {
    getCurrencyName(currency) {
      if (this.isDefault(currency)) {
        return 'USD, Default currency';
      }

      if (currency.currency === currency.region) {
        return currency.currency;
      }

      return `${currency.currency}, ${currency.region}`;
    },

    isDefault(currency) {
      return currency.currency === 'USD' && currency.region === 'USD';
    },

    handleSuggestClick(item, closeSuggest) {
      if (item.id === 'conversion') {
        this.$emit('fillConvertedPrices', {
          amount: find(this.prices, price => this.isDefault(price)).amount,
          closeSuggest,
        });
      } else {
        closeSuggest();
      }
    },
  },
};
</script>

<template>
<div>
  <div class="radio-group">
    <UiRadio
      class="radio"
      v-model="method"
      v-for="(m, index) in pricingMethodOptions"
      :key="index"
      :disabled="!m.enabled"
      :value="m.value">
      {{ m.label }}
      <IconQuestion fill="#919699" />
    </UiRadio>
  </div>

  <div class="price-group">
    <UiTextField
      v-for="(price, index) in prices"
      :key="index"
      v-model="price.amount"
      :isMoney="true"
      :money="{ precision: 2 }"
      :label="getCurrencyName(price, index)"
      :required="true"
      v-show="price.region === price.currency"
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

    <!-- Show prices for regions if available -->
    <div class="region-prices" v-if="hasRegionPrice">
      <UiHeader level="4" :hasMargin="true">Prices for regions</UiHeader>
      <UiTextField
        v-for="(price, index) in prices"
        :key="index"
        v-model="price.amount"
        :isMoney="true"
        :money="{ precision: 2 }"
        label="Price"
        :required="true"
        v-show="price.region !== price.currency"
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

  .text-field {
    width: 138px;
    margin-right: 12px;

  &:first-child {
     width: 100%;
   }
  }
}

.region-prices {
  width: 100%;

  & > .ui-header {
    margin-left: 12px;
  }
}

.radio-group {
  margin: 22px 0 20px;
}

.radio {
  & + & {
    margin-top: 12px;
  }
}
</style>
