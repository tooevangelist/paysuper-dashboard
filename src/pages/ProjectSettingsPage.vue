<script>
import { forEach, get, set } from 'lodash-es';
import { mapState, mapMutations, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'ProjectSettingsPage',

  data() {
    return {
      cover: {
        images: { en: '', ru: '' },
        use_one_for_all: true,
      },
      langs: ['en', 'ru'],
      fullDescription: {
        en: '',
        ru: '',
      },
      shortDescription: {
        en: '',
        ru: '',
      },
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

  methods: {
    ...mapActions(['uploadImage']),
    ...mapMutations('Project', { setCurrencies: 'currencies' }),

    updateLangs(langs) {
      this.langs = langs;

      const langFields = [
        'project.name',
        'fullDescription',
        'shortDescription',
      ];

      langFields.forEach((keypath) => {
        const newFieldValue = {};
        forEach(langs, (lang) => {
          newFieldValue[lang] = get(this, `${keypath}.${lang}`) || '';
        });
        set(this, keypath, newFieldValue);
      });
    },

    handleSave() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit('save');
      }
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
      :langs="langs"
      @change="updateLangs"
    />
  </UiPanel>

  <UiPanel>
    <UiSwitchBox
      class="localization-switch"
      v-model="cover.use_one_for_all"
    >
      Use single cover for all localizations
    </UiSwitchBox>

    <UiLangsImageUpload
      class="section"
      :uploadImage="uploadImage"
      :isLocalizationEnabled="!cover.use_one_for_all"
      v-model="cover.images"
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
        :value="project.name"
        :langs="langs"
        label="Project name"
        v-bind="$getValidatedFieldProps('project.name.en')"
      />
      <UiLangTextField
        :value="fullDescription"
        :langs="langs"
        label="Full description"
      />
      <UiLangTextField
        :value="shortDescription"
        :langs="langs"
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
        :currencies="currencies"
        @change="$emit('currenciesChange', setCurrencies)"
      />
    </div>

    <div class="controls">
      <UiButton
        class="submit-button"
        @click="handleSave"
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
