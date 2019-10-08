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
          :value="name"
          :langs="langs"
          label="Item name"
        />
        <UiLangTextField
          :value="description"
          :langs="langs"
          :required="true"
          label="Short description"
        />
        <UiLangTextField
          :value="long_description"
          :langs="langs"
          :required="true"
          label="Full description"
        />

        <p class="text">
          Use SKU to identify this item. Item SKU is unique within parent project.
        </p>
        <UiTextField label="SKU" v-model="sku" :required="true"></UiTextField>
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
            v-model="pricingMethod"
            v-for="(method, index) in pricingMethodOptions"
            :key="index"
            :value="method.value">
            {{ method.label }}
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
            label="Price"
            :required="true"
          >
          <span slot="label">
          <IconQuestionInCircle class="field-label-icon" />
            {{ getCurrencyName(price, index) }}
          </span>
          </UiTextField>
        </div>
      </section>

      <div class="controls">
        <UiSwitchBox v-model="enabled">Enabled</UiSwitchBox>
        <UiButton
          class="submit-button"
          @click="saveItem"
          text="SAVE"
        />
      </div>
    </UiPanel>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UiImageUpload from '@/components/UiImageUpload.vue';
import ProjectVirtualItemPageStore from '@/store/ProjectVirtualItemPageStore';

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
      langs: ['en', 'ru'],
      image: '',
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
      sku: '',
      pricingMethod: 'manual',
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
      prices: [],
      enabled: true,
    };
  },

  computed: {
    ...mapState('ProjectVirtualItemPage', ['virtualItem']),
    ...mapState('Project', ['currencies']),

    isNewItem() {
      return this.$route.params.itemId === 'new';
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
      if (this.virtualItem.images !== null) {
        // eslint-disable-next-line
        this.image = this.virtualItem.images[0];
      }
      this.name = this.virtualItem.name;
      this.description = this.virtualItem.description;
      this.long_description = this.virtualItem.long_description;
      this.sku = this.virtualItem.sku;
      this.enabled = this.virtualItem.enabled;
      this.prices = this.virtualItem.prices;
    } else {
      this.prices = this.mapCurrencies(this.currencies);
    }
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('ProjectVirtualItemPage', ['editItem', 'createItem']),

    async saveItem() {
      this.setIsLoading(true);
      const data = {
        images: [this.image],
        name: this.name,
        description: this.description,
        long_description: this.long_description,
        sku: this.sku,
        enabled: this.enabled,
        object: 'product',
        type: 'simple_product',
        default_currency: 'USD',
        prices: this.prices,
        pricing: this.pricingMethod,
      };
      if (this.isNewItem) {
        await this.createItem(data).catch(this.$showErrorMessage);
      } else {
        data.id = this.virtualItem.id;
        await this.editItem(data).catch(this.$showErrorMessage);
      }
      this.setIsLoading(false);
      this.$showSuccessMessage('Saved successfully');
    },

    mapCurrencies(currencies) {
      return currencies.map((name) => {
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

    getCurrencyName(currency, index) {
      if (index === 0) {
        return 'USD, Default currency';
      }

      if (currency.currency === currency.region) {
        return currency.currency;
      }

      return `${currency.currency}, ${currency.region}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.section {
  margin-bottom: 32px;
}

.text {
  width: 416px;
  margin-bottom: 12px;

a {
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

  &> button {
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
</style>
