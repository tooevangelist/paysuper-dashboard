<script>
import {
  forEach, get, set, cloneDeep, isEqual,
} from 'lodash-es';
import { mapState, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import SaveDataWarningModal from '@/components/SaveDataWarningModal.vue';

export default {
  name: 'ProjectSettingsPage',

  components: {
    SaveDataWarningModal,
  },

  data() {
    return {
      projectLocal: null,
      isUnsavedDataModalOpened: false,
    };
  },

  computed: {
    ...mapState('Project', ['project', 'currencies']),
  },

  validations() {
    const rules = {
      project: {
        name: {
          en: {
            required,
          },
        },
      },
    };

    return rules;
  },

  async beforeRouteUpdate(to, from, next) {
    if (to.params.id !== from.params.id) {
      this.setIsLoading(true);
      await this.initState({ id: to.params.id });
      this.updateProjectLocal();
      this.setIsLoading(false);
    }
    next();
  },

  async beforeRouteLeave(to, from, next) {
    if (isEqual(this.project, this.projectLocal)) {
      next();
      return;
    }
    try {
      await this.confirmDataSaved();
      next(false);
      this.handleSaveProject();
    } catch (error) {
      next();
    }
  },

  created() {
    this.updateProjectLocal();
  },

  methods: {
    ...mapActions(['setIsLoading', 'uploadImage']),
    ...mapActions('Project', [
      'initState',
      'saveProject',
    ]),

    updateLangs(langs) {
      this.projectLocal.localizations = langs;

      const langFields = [
        'projectLocal.name',
        'projectLocal.full_description',
        'projectLocal.short_description',
      ];

      langFields.forEach((keypath) => {
        const newFieldValue = {};
        forEach(langs, (lang) => {
          newFieldValue[lang] = get(this, `${keypath}.${lang}`) || '';
        });
        set(this, keypath, newFieldValue);
      });
    },

    updateProjectLocal() {
      this.projectLocal = cloneDeep(this.project);
    },

    async handleSaveProject() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit('save');
      }

      this.setIsLoading(true);
      try {
        await this.saveProject(this.projectLocal);
        this.updateProjectLocal();
        this.$showSuccessMessage('Project saved successfully');
      } catch (error) {
        this.$showErrorMessage(error);
      }
      this.setIsLoading(false);
    },

    confirmDataSaved() {
      return new Promise((resolve, reject) => {
        this.isUnsavedDataModalOpened = true;
        this.$refs.saveDataWarningModal.$once('submit', (result) => {
          if (result) {
            resolve();
          } else {
            reject();
          }
          this.isUnsavedDataModalOpened = false;
        });
      });
    },

    setCurrencies(value) {
      console.log(11111, 'setCurrencies', value);
    },
  },
};
</script>

<template>
<div>
  <UiPageHeaderFrame>
    <span slot="title">Settings</span>
    <span slot="description">
      Setup main scope of project parameters here.
    </span>
  </UiPageHeaderFrame>

  <UiPanel>
    <UiHeader
      :hasMargin="true"
      level="3"
    >
      Localizations
    </UiHeader>
    <UiText indentBottom="small">
      Choose complete set of supported languages for all products and descriptions.
    </UiText>
    <UiLangsMainHub
      :langs="projectLocal.localizations"
      @change="updateLangs"
    />
  </UiPanel>

  <UiPanel>
    <UiSwitchBox
      class="localization-switch"
      v-model="projectLocal.cover.use_one_for_all"
    >
      Use single cover for all localizations
    </UiSwitchBox>

    <UiLangsImageUpload
      class="section"
      :uploadImage="uploadImage"
      :isLocalizationEnabled="!projectLocal.cover.use_one_for_all"
      v-model="projectLocal.cover.images"
    />

    <div class="section">
      <UiHeader
        :hasMargin="true"
        level="3"
      >
        Project description
      </UiHeader>
      <UiText>
        Fill-in the unique name and localised project descriptions here.
        It will be mentioned in payment form and different customer correspondence.
      </UiText>
      <UiLangTextField
        :value="projectLocal.name"
        :langs="projectLocal.localizations"
        label="Project name"
        v-bind="$getValidatedFieldProps('project.name.en')"
      />
      <UiLangTextField
        :value="projectLocal.full_description"
        :langs="projectLocal.localizations"
        label="Full description"
      />
      <UiLangTextField
        :value="projectLocal.short_description"
        :langs="projectLocal.localizations"
        label="Short description"
      />
    </div>

    <div class="section">
      <UiHeader
        :hasMargin="true"
        level="3"
      >
        Currencies
      </UiHeader>
      <UiText indentBottom="small">
        Choose a fixed set of currencies which will be actual for all products in this project.
        <span class="bold">USD is default currency</span>.
      </UiText>

      <UiCurrenciesMainHub
        v-model="projectLocal.currencies"
      />
    </div>

    <div class="controls">
      <UiButton
        class="submit-button"
        @click="handleSaveProject"
        text="SAVE"
      />
    </div>
  </UiPanel>

  <SaveDataWarningModal
    v-show="isUnsavedDataModalOpened"
    ref="saveDataWarningModal"
  />
</div>
</template>


<style lang="scss" scoped>
.section {
  margin-bottom: 32px;
}

.localization-switch {
  margin-bottom: 20px;
}

.switch-box {
  margin-left: 16px;
}

.bold {
  font-weight: 500;
}

.generate-button {
  margin-left: 30px;
}
.controls {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  width: 140px;
}
</style>
