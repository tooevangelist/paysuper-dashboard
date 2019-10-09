<script>
import { mapActions, mapState } from 'vuex';
import { debounce, get } from 'lodash-es';
import UiImageUpload from '@/components/UiImageUpload.vue';
import ProjectVirtualItemPageStore from '@/store/ProjectVirtualItemPageStore';

const DEFAULTS = {
  name: {
    en: '',
    ru: '',
  },
  description: {
    en: '',
    ru: '',
  },
  long_description: {
    en: '',
    ru: '',
  },
};

export default {
  name: 'ProjectVirtualItemEditPage',

  components: {
    UiImageUpload,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
    uploadImage: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      isSkuUnique: true,
      langs: ['en', 'ru'],
      image: null,
      item: {},
      pricingMethodOptions: {
        real: {
          label: 'Real currency',
          value: 'manual',
        },
        virtual: {
          label: 'Virtual currency',
          value: 'currency',
        },
      },
    };
  },

  computed: {
    ...mapState('ProjectVirtualItemPage', ['virtualItem']),
    ...mapState('Project', ['currencies']),

    isNewItem() {
      return this.$route.params.itemId === 'new';
    },

    mapCurrencies() {
      return this.currencies.map((name) => {
        let currency = name;
        let region = name;
        if (name.indexOf('-') > -1) {
          [currency, region] = name.split('-');
        }
        return {
          amount: 0,
          currency,
          region,
        };
      });
    },

    hasRegionPrice() {
      return this.item.prices.some(price => price.currency !== price.region);
    },

    projectId() {
      return this.$route.params.id;
    },
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('ProjectVirtualItemPage', ProjectVirtualItemPageStore, {
        projectId: route.params.id,
        itemId: route.params.itemId,
      }).catch(this.$showErrorMessage);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  created() {
    if (!this.isNewItem) {
      this.item = this.virtualItem;
    } else {
      Object.assign(this.item, DEFAULTS)
      this.item.prices = this.mapCurrencies;
      this.item.pricingMethod = 'manual';
    }
    this.image = get(this.item, 'images.0', '');
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('ProjectVirtualItemPage', ['editItem', 'createItem']),
    ...mapActions('Project', ['checkIsSkuUnique']),

    async saveItem() {
      this.setIsLoading(true);
      const data = {
        ...this.item,
        images: this.image.length ? [this.image] : null,
        object: 'product',
        type: 'simple_product',
        default_currency: 'USD',
      };
      if (this.isNewItem) {
        await this.createItem(data, this.projectId).catch(this.$showErrorMessage);
      } else {
        data.id = this.virtualItem.id;
        await this.editItem(data, this.projectId).catch(this.$showErrorMessage);
      }
      this.setIsLoading(false);
      this.$showSuccessMessage('Saved successfully');
    },

    getCurrencyName(currency, index) {
      if (index === 0) {
        return 'USD, Default currency';
      }

      if (currency.currency === currency.region) {
        return currency.currency;
      }

      return `${currency.currency}, ${currency.region}`;
    },

    handleSkuFieldInput: debounce(
      async function handleSkuFieldInput(value) {
        this.isSkuUnique = await this.checkIsSkuUnique(value).catch(this.$showErrorMessage);
        this.$v.item.sku.$touch();
      },
      200,
    ),
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        {{ virtualItem === null ? 'Adding item' : 'Edit item' }}
      </template>
      <span slot="description">
        Here you can add a new item to your project, specify localised text descriptions,
        prices and currencies, using the tabs.
      </span>
    </UiPageHeaderFrame>

    <UiPanel>
      <section class="section">
        <UiImageUpload
          class="section"
          title="Update logo"
          description="200x200 px, .png, .jpg"
          :uploadImage="uploadImage"
          v-model="image"
        />
        <UiLangTextField
          :value="item.name"
          :langs="langs"
          label="Item name"
        />
        <UiLangTextField
          :value="item.description"
          :langs="langs"
          :required="true"
          label="Short description"
        />
        <UiLangTextField
          :value="item.long_description"
          :langs="langs"
          :required="true"
          label="Full description"
        />

        <p class="text">
          Use SKU to identify this item. Item SKU is unique within parent project.
        </p>
        <UiTextField
          label="SKU"
          v-model="item.sku"
          @input="handleSkuFieldInput"
          :required="true"></UiTextField>
      </section>
      <section class="section">
        <UiHeader
          :hasMargin="true"
          level="3"
        >
          Pricing
        </UiHeader>
        <p class="text">
          Setup the price for one virtual currency unit in all your <br> currencies.
          If you need to add more currencies to the list you can do this in
          <a :href="`/projects/${project.id}/settings/`">project settings</a>.
        </p>

        <div class="radio-group">
          <UiRadio
            class="radio"
            v-model="item.pricingMethod"
            v-for="(method, index) in pricingMethodOptions"
            :key="index"
            :value="method.value">
            {{ method.label }}
            <IconQuestion fill="#919699" />
          </UiRadio>
        </div>

        <div class="price-group">
          <UiTextField
            v-for="(price, index) in item.prices"
            :key="index"
            v-model="price.amount"
            :isMoney="true"
            :money="{ precision: 2 }"
            label="Price"
            :required="true"
            v-show="price.region === price.currency"
          >
          <span slot="label">
          <IconQuestionInCircle class="field-label-icon" />
            {{ getCurrencyName(price, index) }}
          </span>
          </UiTextField>

          <!-- Show prices for regions if available -->
          <div class="region-prices" v-if="hasRegionPrice">
            <UiHeader level="4" :hasMargin="true">Prices for regions</UiHeader>
            <UiTextField
              v-for="(price, index) in item.prices"
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
      </section>

      <div class="controls">
        <UiSwitchBox v-model="item.enabled">Enabled</UiSwitchBox>
        <UiButton
          class="submit-button"
          @click="saveItem"
          text="SAVE"
        />
      </div>
    </UiPanel>
  </div>
</template>

<style lang="scss" scoped>
.section {
  margin-bottom: 32px;
}

.text {
  width: 416px;
  margin-bottom: 12px;

  & > a {
    color: #3d7bf5;
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

.controls {
  display: flex;
  justify-content: flex-end;

  .submit-button {
    margin-left: 32px;
  }
}

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
</style>
