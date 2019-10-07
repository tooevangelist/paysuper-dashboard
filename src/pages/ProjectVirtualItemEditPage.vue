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
        <ImageUpload
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
        <UiTextField label="SKU" :value="sku" :required="true"></UiTextField>
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

        <UiLangTextField
          :value="singleUnitPrice"
          :langs="currencies"
          :isMoney="true"
          :money="{ precision: 2 }"
          label="Price"
        />
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
import ImageUpload from '@/components/ImageUpload.vue';
import ProjectVirtualItemPageStore from '@/store/ProjectVirtualItemPageStore';

export default {
  name: 'ProjectVirtualItemEditPage',

  components: {
    ImageUpload,
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
      currencies: ['USD', 'EUR'],
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
      pricingMethod: 'real',
      pricingMethodOptions: {
        real: {
          label: 'Real currency',
          value: 'real',
        },
        virtual: {
          label: 'Virtual currency',
          value: 'virtual',
        },
      },
      singleUnitPrice: {
        USD: 0,
        EUR: 0,
      },
      enabled: true,
    };
  },

  computed: {
    ...mapState('ProjectVirtualItemPage', ['virtualItem']),
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('ProjectVirtualItemPage', ProjectVirtualItemPageStore, {
        projectId: route.params.id,
        itemId: route.params.itemId,
      });
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  created() {
    if (this.virtualItem !== null) {
      if (this.virtualItem.images !== null) {
        // eslint-disable-next-line
        this.image = this.virtualItem.images[0];
      }
      this.name = this.virtualItem.name;
      this.description = this.virtualItem.description;
      this.long_description = this.virtualItem.long_description;
      this.sku = this.virtualItem.sku;
      this.enabled = this.virtualItem.enabled;
    }
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('ProjectVirtualItemPage', ['editItem', 'createItem']),

    async saveItem() {
      this.setIsLoading(true);
      const data = {
        image: [this.image],
        name: this.name,
        description: this.description,
        long_description: this.long_description,
        sku: this.sku,
        enabled: this.enabled,
        object: 'product',
        type: 'simple_product',
        default_currency: 'USD',
        prices: [{ amount: 99.50, currency: 'USD', region: 'USD' }],
      };
      if (this.virtualItem === null) {
        await this.createItem(data);
      } else {
        data.id = this.virtualItem.id;
        await this.editItem(data);
      }
      this.setIsLoading(false);
      console.log(this.$route);
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
</style>
