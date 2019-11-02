<script>
import { mapActions, mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import {
  debounce, get, cloneDeep, find,
} from 'lodash-es';
import ProjectVirtualItemPageStore from '@/store/ProjectVirtualItemPageStore';
import ProjectEntityPricesForm from '@/components/ProjectEntityPricesForm.vue';
import updateLangFields from '@/helpers/updateLangFields';

export default {
  name: 'ProjectVirtualItemEditPage',

  components: {
    ProjectEntityPricesForm,
  },

  async asyncData({
    store, registerStoreModule, route, resources,
  }) {
    try {
      await registerStoreModule('ProjectVirtualItemPage', ProjectVirtualItemPageStore, {
        projectId: route.params.id,
        itemId: route.params.itemId,
      }).catch(resources.notifications.showErrorMessage);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      langFields: ['name', 'description', 'long_description'],
      isSkuUnique: true,
      item: null,
      pricingMethodOptions: [
        {
          label: 'Real currency',
          value: 'real',
        },
        {
          label: 'Virtual currency',
          value: 'virtual',
        },
      ],
    };
  },

  computed: {
    ...mapState('Project', ['project', 'defaultCurrency']),
    ...mapState('ProjectVirtualItemPage', ['virtualItem']),

    isNewItem() {
      return this.$route.params.itemId === 'new';
    },

    projectId() {
      return this.$route.params.id;
    },

    image: {
      get() {
        return get(this.item, 'images[0]', '');
      },
      set(value) {
        this.item.images = [value];
      },
    },

    virtualCurrencySellCountType() {
      return get(this.project, 'virtual_currency.sell_count_type', '');
    },

    virtualCurrencyFieldLabel() {
      const name = get(this.project, 'virtual_currency.name.en', '');
      const sellCountTypeNameMap = {
        fractional: 'Fractional value',
        integral: 'Integral value',
      };
      return `${name}, ${sellCountTypeNameMap[this.virtualCurrencySellCountType]}`;
    },
    virtualCurrencyPrice: {
      get() {
        const item = find(this.item.prices, { is_virtual_currency: true });
        return item ? item.amount : null;
      },
      set(amount) {
        this.item.prices = [
          {
            amount,
            is_virtual_currency: true,
          },
        ];
      },
    },
  },

  validations() {
    const item = {
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

    if (this.item.billing_type === 'virtual') {
      return {
        ...item,
        virtualCurrencyPrice: {
          required,
        },
      };
    }
    return item;
  },

  created() {
    this.updateVirtualItemLocal();
  },

  methods: {
    ...mapActions(['uploadImage', 'setIsLoading']),
    ...mapActions('ProjectVirtualItemPage', ['editItem', 'createItem']),
    ...mapActions('Project', ['checkIsSkuUnique', 'getRecommendedPrices']),

    updateVirtualItemLocal() {
      this.item = {
        ...cloneDeep(this.virtualItem),
        default_currency: this.defaultCurrency.currency,
      };
      updateLangFields(this.item, this.langFields, this.project.localizations);
    },

    async saveItem() {
      this.$v.$touch();
      let isPricesValid = true;
      if (this.$refs.pricesBlock) {
        isPricesValid = this.$refs.pricesBlock.checkIsValid();
      }
      if (this.$v.$invalid || !isPricesValid) {
        this.$showErrorMessage('The form is not filled right');
        return;
      }
      this.setIsLoading(true);
      const data = {
        ...this.item,
        object: 'product',
        type: 'simple_product',
      };
      try {
        if (this.isNewItem) {
          await this.createItem({ data, projectId: this.projectId });
        } else {
          data.id = this.virtualItem.id;
          await this.editItem({ data, projectId: this.projectId });
        }
        this.$showSuccessMessage('Saved successfully');
        this.$navigate(`/projects/${this.project.id}/virtual-items/`);
      } catch (e) {
        this.$showErrorMessage(e);
      }
      this.setIsLoading(false);
    },

    handleSkuFieldInput: debounce(
      async function handleSkuFieldInput(value) {
        this.isSkuUnique = await this.checkIsSkuUnique(value).catch(this.$showErrorMessage);
        this.$v.item.sku.$touch();
      },
      200,
    ),

    checkIsBillingTypeDisabled(type) {
      const isVirtualCurrencyAvailable = Boolean(
        get(this.project, 'virtual_currency.name.en')
        && get(this.project, 'virtual_currency.prices[0]'),
      );
      return type === 'virtual' ? !isVirtualCurrencyAvailable : false;
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        {{ isNewItem ? 'Adding item' : 'Edit item' }}
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
          title="cover"
          description=".png, .jpg, .jpeg, max size 30Mb, min 200x300px; max 1000x1500px"
          :uploadImage="uploadImage"
          v-model="image"
        />
        <UiLangTextField
          :langs="project.localizations"
          v-model="item.name"
          label="Item name"
          v-bind="$getValidatedFieldProps('item.name.en')"
        />
        <UiLangTextField
          :langs="project.localizations"
          v-model="item.description"
          label="Short description"
          v-bind="$getValidatedFieldProps('item.description.en')"
        />
        <UiLangTextField
          :langs="project.localizations"
          v-model="item.long_description"
          label="Full description"
          v-bind="$getValidatedFieldProps('item.long_description.en')"
        />

        <p class="text">
          Use SKU to identify this item. Item SKU is unique within parent project.
        </p>
        <UiTextField
          :disabled="!isNewItem"
          label="SKU"
          v-model="item.sku"
          @input="handleSkuFieldInput"
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

        <div class="radio-group">
          <UiRadio
            class="radio"
            v-for="option in pricingMethodOptions"
            v-model="item.billing_type"
            :key="option.value"
            :disabled="checkIsBillingTypeDisabled(option.value)"
            :value="option.value"
          >
            {{ option.label }}
            <IconQuestion fill="#919699" />
          </UiRadio>
        </div>

        <ProjectEntityPricesForm
          v-if="item.billing_type === 'real'"
          ref="pricesBlock"
          :currencies="project.currencies"
          :getRecommendedPrices="getRecommendedPrices"
          :defaultCurrency="defaultCurrency"
          v-model="item.prices"
        />
        <UiTextField
          v-else
          :label="virtualCurrencyFieldLabel"
          :isNumeric="true"
          :decimalLength="virtualCurrencySellCountType === 'fractional' ? 2 : 0"
          v-model="virtualCurrencyPrice"
          v-bind="$getValidatedFieldProps('virtualCurrencyPrice')"
        />
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
}

.submit-button {
  width: 140px;
  margin-left: 32px;
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

.radio-group {
  margin: 22px 0 20px;
}

.radio {
  & + & {
    margin-top: 12px;
  }
}
</style>
