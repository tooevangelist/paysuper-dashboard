<template>
  <div>
    <UiPageHeaderFrame>
      <template slot="title">
        Adding item
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
          v-bind="$getValidatedFieldProps('name.en')"
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
        <UiLangTextField
          :value="successfulMessage"
          :langs="langs"
          :required="true"
          label="Custom message on successful payment"
        />

        <p class="text">
          Use SKU to identify this item. Item SKU is unique within parent project.
        </p>
        <UiTextField label="SKU" :required="true"></UiTextField>
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
          <UiRadio class="radio" :disabled="true">
            Currency conversion
            <IconQuestion fill="#919699" />
          </UiRadio>
          <UiRadio class="radio">
            Manual input
            <IconQuestion fill="#919699" />
          </UiRadio>
          <UiRadio class="radio">
            Default currency only
            <IconQuestion fill="#919699" />
          </UiRadio>
        </div>

        <UiLangTextField
          :value="singleUnitPrice"
          :langs="currencies"
          :isMoney="true"
          :money="{ precision: 2 }"
          label="Price"
          v-bind="$getValidatedFieldProps('singleUnitPrice.USD')"
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
// import { mapActions } from 'vuex';
import ImageUpload from '@/components/ImageUpload.vue';

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
      successfulMessage: {
        en: '',
        ru: '',
      },
      singleUnitPrice: {
        USD: 0,
        EUR: 0,
      },
      enabled: true,
    };
  },

  methods: {
    saveItem() {
      //
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
