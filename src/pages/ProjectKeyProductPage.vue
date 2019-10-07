<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import { find, cloneDeep } from 'lodash-es';
import ProjectKeyProductStore from '@/store/ProjectKeyProductStore';
import { OpenFileDialog } from '@/helpers/uploader';
import PriceSuggestTable from '@/components/PriceSuggestTable.vue';

export default {
  name: 'ProjectKeyProductPage',

  components: {
    PriceSuggestTable,
  },

  async asyncData({ store, registerStoreModule, route }) {
    try {
      await registerStoreModule('ProjectKeyProduct', ProjectKeyProductStore, route.params.keyProductId);
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      keyProductLocal: null,
      isSingleCoverImage: false,
      isDisablePlatformConfirmOpened: false,
      platformIdForDisable: '',
      pricingList: [
        {
          id: 1,
          name: 'Auto-conversion from default currency',
        },
        {
          id: 2,
          name: 'Enter each price manually',
        },
        {
          id: 3,
          name: 'Use default currency only',
        },
        {
          id: 4,
          name: 'Steam recommended prices',
        },
      ],

      priceSuggestList: [
        {
          text: 'Continue manual input for all currencies',
        },
        {
          text: 'Use auto-conversion from default currency',
        },
        {
          text: 'Select Steam recommended prices',
        },
      ],
    };
  },

  computed: {
    ...mapState('Project', ['project']),
    ...mapGetters('Project', ['currenciesDetailed']),
    ...mapState('ProjectKeyProduct', ['keyProductId', 'keyProduct', 'platforms', 'keyCounts']),

    currenciesPrimary() {
      return this.currenciesDetailed
        .filter(item => item.currency === item.region)
        .filter(item => item.currency !== 'USD');
    },
    currenciesSecondary() {
      return this.currenciesDetailed.filter(item => item.currency !== item.region);
    },
  },

  validations() {
    return {
      keyProductLocal: {
        name: {
          en: {
            required,
          },
        },
        sku: {
          required,
        },
      },
    };
  },

  async beforeRouteUpdate(to, from, next) {
    if (to.params.keyProductId !== from.params.keyProductId) {
      this.setIsLoading(true);
      await this.initState(to.params.keyProductId);
      this.updateKeyProductLocal();
      this.setIsLoading(false);
    }
    next();
  },

  created() {
    this.updateKeyProductLocal();
  },

  methods: {
    ...mapActions(['setIsLoading', 'uploadImage']),
    ...mapActions('ProjectKeyProduct', [
      'initState', 'uploadKey', 'updateKeyProduct', 'createKeyProduct',
      'setPlatformPricesRecommendedBySteam',
    ]),

    updateKeyProductLocal() {
      this.keyProductLocal = cloneDeep(this.keyProduct);
    },

    handleUploadKey(platformId) {
      OpenFileDialog('text/*', async (file) => {
        this.setIsLoading(true);
        await this.uploadKey({
          platformId,
          file,
        }).catch(this.$showErrorMessage);
        this.setIsLoading(false);
      });
    },

    isPlatformEnabled(id) {
      if (this.platformIdForDisable === id) {
        // Necessary for correct UiSwith behavior if platform disable
        // is cancalled by the confirm
        return false;
      }
      return Boolean(find(this.keyProductLocal.platforms, { id }));
    },

    togglePlatform(id, isEnabled) {
      if (isEnabled) {
        const platform = find(this.platforms, { id });
        this.keyProductLocal.platforms.push({
          ...platform,
          prices: [],
        });
      } else {
        this.isDisablePlatformConfirmOpened = true;
        this.platformIdForDisable = id;
      }
    },

    disablePlatform() {
      this.isDisablePlatformConfirmOpened = false;
      this.keyProductLocal.platforms = this.keyProductLocal.platforms.filter(
        platform => platform.id !== this.platformIdForDisable,
      );
      this.platformIdForDisable = '';
    },

    cancelPlatformDisable() {
      this.isDisablePlatformConfirmOpened = false;
      this.platformIdForDisable = '';
    },

    async handleKeyProductSave() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$showErrorMessage('The form is not filled right');
        return;
      }
      this.setIsLoading(true);
      try {
        if (this.keyProductId) {
          await this.updateKeyProduct(this.keyProductLocal);
          this.$showSuccessMessage('The key product is successfuly updated');
        } else {
          await this.createKeyProduct({
            keyProduct: this.keyProductLocal,
            projectId: this.project.id,
          });
          this.$showSuccessMessage('The key product is successfuly created');
          this.$navigate(`/projects/${this.project.id}/game-keys/${this.keyProductId}`);
        }
      } catch (error) {
        this.$showErrorMessage(error);
      }
      this.setIsLoading(false);
    },
    handleSuggestClick(lol) {
      console.log(111, 11);
      // this.$refs.usdField.closeSuggest();
    },

    async handleSteamPriceSelect(amount, closeSuggest) {
      this.setIsLoading(true);
      await this.setPlatformPricesRecommendedBySteam({
        amount,
        platformId: 'steam',
      });
      closeSuggest();
      this.setIsLoading(false);
    },
  },
};
</script>

<template>
<div>
  primary
  <pre>{{currenciesPrimary}}</pre>
  secondary
  <pre>{{currenciesSecondary}}</pre>
  <UiPageHeaderFrame>
    <span slot="title">
      {{ keyProductId ? 'Editing' : 'Adding' }} key package
    </span>
    <span
      v-if="!keyProductId"
      slot="description"
    >
      Create a package to sell your game keys for associated DRM platforms.
      You can choose several platforms at once.
    </span>
  </UiPageHeaderFrame>

  <UiPanel>
    <form autocomplete="off">
      <section class="section">
        <UiSwitchBox
          class="localization-switch"
          v-model="isSingleCoverImage"
        >
          Use single cover for all localizations
        </UiSwitchBox>

        <UiLangsImageUpload
          :uploadImage="uploadImage"
          :isLocalizationEnabled="!isSingleCoverImage"
          v-model="keyProductLocal.long_description"
        />

        <UiLangTextField
          label="Game title"
          v-model="keyProductLocal.name"
          v-bind="$getValidatedFieldProps('keyProductLocal.name.en')"
        />
        <UiTextField
          label="SKU"
          v-bind="$getValidatedFieldProps('keyProductLocal.sku')"
          v-model="keyProductLocal.sku"
        />
      </section>

      <section class="section">
        <UiHeader level="3" :hasMargin="true">DRM platforms</UiHeader>
        <UiText>
          Choose a set of DRM platforms you plan to use with this package.
          Each platform associated with it's own pack of keys.
        </UiText>
        <div
          class="platform-item"
          v-for="(platform, index) in platforms"
          :key="index"
        >
          <UiSwitchBox
            :checked="isPlatformEnabled(platform.id)"
            @change="togglePlatform(platform.id, $event)"
          >
            {{ platform.name }}
          </UiSwitchBox>
        </div>
      </section>

      <section class="section">
        <UiHeader level="3" :hasMargin="true">Package price</UiHeader>
        <UiText>
          Setup the price for every platform in all your currencies.
          If you need to add more currencies to the list you can do this in
          <a :href="`/projects/${project.id}/settings/`">project settings</a>.
        </UiText>
        <UiTextField
          label="USD, Default currency"
          :required="true"
          autocomplete="new-password"
        >
          <template v-slot:dropdown="{ closeSuggest }">
            <PriceSuggestTable
              @close="closeSuggest"
              @select="handleSteamPriceSelect($event, closeSuggest)"
            />
            <!-- <UiSuggestItem
              v-for="(item, index) in priceSuggestList"
              :key="index"
              v-text="item.text"
              @click="handleSuggestClick(), closeSuggest()"
            /> -->
          </template>
        </UiTextField>
        <div class="currencies">
          <UiTextField
            v-for="(item, index) in currenciesPrimary"
            :label="item.currency"
            :key="index"
            :required="true"
            autocomplete="off"
          />
        </div>
        <template v-if="currenciesSecondary.length">
          <UiHeader level="4" :hasMargin="true">Prices for regions</UiHeader>
          <div class="currencies">
            <UiTextField
              v-for="(item, index) in currenciesSecondary"
              :key="index"
              :required="true"
              autocomplete="off"
            >
              <span slot="label">
                <IconQuestionInCircle class="field-label-icon" />
                {{ `${item.region}, ${item.currency}` }}
              </span>
            </UiTextField>
          </div>
        </template>

        <!-- <div
          class="radio-row"
          v-for="item in pricingList"
          :key="item.id"
        >
          <UiRadio>{{ item.name }}</UiRadio>
        </div>

        <div
          v-for="platform in keyProductLocal.platforms"
          :key="platform.id"
        >
          <UiHeader level="4" :hasMargin="true">{{ platform.name }}</UiHeader>
          <UiSelect label="Price (USD, Default currency)" :required="true"></UiSelect>
          <UiTextField label="Price (EUR)" />
          <UiTextField label="Price (HKD)" />
        </div> -->
      </section>
      <section class="section">
        <UiHeader level="3" :hasMargin="true">Keys</UiHeader>
        <UiText>
          Upload a pack of game keys for each DRM platform you selected before.
          Use CSV or TXT file format and a line break ("Enter" key) as a separator for key strings.
        </UiText>
      </section>

      <div
        class="key-item"
        v-for="platform in keyProductLocal.platforms"
        :key="platform.id"
        :class="{ '_empty': !keyCounts[platform.id] }"
        @click="handleUploadKey(platform.id)"
      >
        <span>{{ platform.name }} — {{ keyCounts[platform.id] || 'no' }} keys</span>
        <UiUploadControls
          title="keys"
        />
      </div>

      <div class="controls">
        <UiSwitchBox v-model="keyProductLocal.enabled">
          Enable package
        </UiSwitchBox>
        <UiButton
          class="submit-button"
          text="SAVE"
          @click="handleKeyProductSave"
        />
      </div>
    </form>
  </UiPanel>

  <UiDeleteModal
    v-if="isDisablePlatformConfirmOpened"
    title="Disable platform"
    closeButtonText="Cancel"
    submitButtonText="Disable"
    @close="cancelPlatformDisable"
    @submit="disablePlatform"
  >
    Are you sure you want to disable #platform?
  </UiDeleteModal>
</div>
</template>

<style lang="scss" scoped>
.localization-switch {
  margin-bottom: 20px;
}
.section {
  margin-bottom: 24px;
}
.platform-item {
  height: 56px;
  display: flex;
  align-items: center;

  & + & {
    border-top: 1px solid #e3e5e6;
  }
}

.currencies {
  display: flex;
  flex-wrap: wrap;

  & > * {
    width: 18%;
    margin-right: 2%;
  }
}

.radio-row {
  margin-bottom: 12px;
}

.key-item {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #000000;
  cursor: pointer;

  &._empty {
    color: #919699;
  }

  & + & {
    border-top: 1px solid #e3e5e6;
  }
}

.controls {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.submit-button {
  width: 140px;
  margin-left: 32px;
}

.field-label-icon {
  position: absolute;
  margin: 1px 0 0 -16px;
  cursor: pointer;
}
</style>
