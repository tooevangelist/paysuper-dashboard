<script>
import { mapActions, mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import { debounce, get, find } from 'lodash-es';
import UiImageUpload from '@/components/UiImageUpload.vue';
import ProjectVirtualItemPageStore from '@/store/ProjectVirtualItemPageStore';
import ProjectVirtualItemPrice from '@/components/ProjectVirtualItemPrice.vue';

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
    ProjectVirtualItemPrice,
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

    projectId() {
      return this.$route.params.id;
    },
  },

  validations() {
    return {
      item: {
        name: {
          en: {
            required,
          },
        },
        description: {
          en: {
            required,
          },
        },
        long_description: {
          en: {
            required,
          },
        },
        sku: {
          required,
          uniqueSku() {
            return this.isSkuUnique;
          },
        },
      },
    };
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
      Object.assign(this.item, DEFAULTS);
      this.item.prices = this.mapCurrencies;
      this.item.pricingMethod = 'manual';
    }
    this.image = get(this.item, 'images.0', '');
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('ProjectVirtualItemPage', ['editItem', 'createItem', 'getPrices']),
    ...mapActions('Project', ['checkIsSkuUnique']),

    async saveItem() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$showErrorMessage('The form is not filled right');
        return;
      }
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

    handleSkuFieldInput: debounce(
      async function handleSkuFieldInput(value) {
        this.isSkuUnique = await this.checkIsSkuUnique(value).catch(this.$showErrorMessage);
        this.$v.item.sku.$touch();
      },
      200,
    ),

    async handleFillPrice({ amount, closeSuggest }) {
      this.setIsLoading(true);
      const prices = await this.getPrices(amount).catch(this.$showErrorMessage);
      prices.forEach((price) => {
        const item = find(this.item.prices, { region: price.region, currency: price.currency });
        if (item) {
          item.amount = price.amount;
        }
      });

      closeSuggest();
      this.setIsLoading(false);
    },
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
          v-bind="$getValidatedFieldProps('item.name.en')"
        />
        <UiLangTextField
          :value="item.description"
          :langs="langs"
          :required="true"
          label="Short description"
          v-bind="$getValidatedFieldProps('item.description.en')"
        />
        <UiLangTextField
          :value="item.long_description"
          :langs="langs"
          :required="true"
          label="Full description"
          v-bind="$getValidatedFieldProps('item.long_description.en')"
        />

        <p class="text">
          Use SKU to identify this item. Item SKU is unique within parent project.
        </p>
        <UiTextField
          label="SKU"
          v-model="item.sku"
          @input="handleSkuFieldInput"
          :required="true"
          v-bind="$getValidatedFieldProps('item.sku')"/>
      </section>
      <section class="section">
        <UiHeader
          :hasMargin="true"
          level="3"
        >
          Item price
        </UiHeader>
        <p class="text">
          Setup the price for one virtual currency unit in all your <br> currencies.
          If you need to add more currencies to the list you can do this in
          <a :href="`/projects/${project.id}/settings/`">project settings</a>.
        </p>

        <ProjectVirtualItemPrice
          :method="item.pricingMethod"
          :prices="item.prices"
          @fillConvertedPrices="handleFillPrice"/>
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
