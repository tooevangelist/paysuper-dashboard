<script>
import { required } from 'vuelidate/lib/validators';
import { findKey } from 'lodash-es';
import { getCurrencyValueFromItem } from '@/helpers/currencyDataConversion';
import ProjectEntityPricesForm from '@/components/ProjectEntityPricesForm.vue';

export default {
  name: 'ProjectPlatformsPricesForm',

  components: {
    ProjectEntityPricesForm,
  },

  props: {
    platforms: {
      required: true,
      type: Array,
    },
    currencies: {
      required: true,
      type: Array,
    },
    getRecommendedPrices: {
      type: Function,
      required: true,
    },
    defaultCurrency: {
      required: true,
      type: Object,
    },
    recommendedPricesTable: {
      required: true,
      type: Array,
    },
  },

  model: {
    prop: 'platforms',
    event: 'updatePlatforms',
  },

  data() {
    return {
      currentPlatformPricingIndex: 0,
    };
  },

  computed: {
    defaultCurrencyValue() {
      return getCurrencyValueFromItem(this.defaultCurrency);
    },
    currentPlatformPricing: {
      get() {
        return this.platforms[this.currentPlatformPricingIndex].prices;
      },
      set(value) {
        const platforms = this.platforms.map(item => ({ ...item }));
        platforms[this.currentPlatformPricingIndex].prices = value;
        this.$emit('updatePlatforms', platforms);
      },
    },

    platformsForTabs() {
      return this.platforms.map((item, index) => {
        const { $invalid, $dirty } = this.$v.platforms.$each[index];
        return {
          label: item.name,
          value: item.id,
          hasError: $dirty && $invalid,
        };
      });
    },
  },

  watch: {
    platforms(value) {
      const lastIndex = value.length - 1;
      if (this.currentPlatformPricingIndex > lastIndex) {
        this.currentPlatformPricingIndex = lastIndex;
      }
    },
  },

  validations() {
    return {
      platforms: {
        $each: {
          prices: {
            $each: {
              amount: {
                required,
              },
            },
          },
        },
      },
    };
  },

  methods: {
    checkIsValid() {
      this.$v.$touch();
      this.$refs.pricesBlock.checkIsValid();

      const index = findKey(this.$v.platforms.$each.$iter, { $invalid: true });
      if (index) {
        this.currentPlatformPricingIndex = Number(index);
      }
      return !this.$v.$invalid;
    },

    getPriceId(item) {
      return getCurrencyValueFromItem(item);
    },
  },
};
</script>

<template>
<div>
  <UiTabs
    class="tabs"
    :items="platformsForTabs"
    v-model="currentPlatformPricingIndex"
  />

  <ProjectEntityPricesForm
    ref="pricesBlock"
    :currencies="currentPlatformPricing"
    :getRecommendedPrices="getRecommendedPrices"
    :defaultCurrency="defaultCurrency"
    :hasSteamRecommendations="true"
    :recommendedPricesTable="recommendedPricesTable"
    v-model="currentPlatformPricing"
  />
</div>
</template>

<style lang="scss" scoped>
.tabs {
  margin-bottom: 28px;
}
</style>
