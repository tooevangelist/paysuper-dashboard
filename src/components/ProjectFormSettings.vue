<script>
import { required, minLength } from 'vuelidate/lib/validators';
import ImageUpload from '@/components/ImageUpload.vue';
import KeyGenerateField from '@/components/KeyGenerateField.vue';

export default {
  name: 'ProjectFormSettings',

  components: {
    ImageUpload,
    KeyGenerateField,
  },

  props: {
    project: {
      required: true,
      type: Object,
    },
    uploadImage: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
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

  validations() {
    const rules = {
      project: {
        name: {
          en: {
            required,
          },
        },
        secret_key: {
          required,
          minLength: minLength(12),
        },
      },
    };

    return rules;
  },

  methods: {
    validateForm() {
      this.$v.$touch();

      this.$watch('$v.$invalid', (value) => {
        this.$emit('validationResult', !value);
      });
      this.$emit('validationResult', !this.$v.$invalid);
    },

    getValidatedFieldProps(path) {
      return {
        required: true,
        hasError: this.$isFieldInvalid(path),
        errorText: this.$getFieldErrorMessages(path),
      };
    },
  },
};
</script>

<template>
<div class="project-form-settings">
  <ImageUpload
    class="field-row"
    :uploadImage="uploadImage"
    v-model="project.image"
  />

  <div class="field-row">
    <UiHeader
      :hasMargin="true"
      level="3"
    >
      Localisations
    </UiHeader>
    <p class="text">
      Choose complete set of supported languages for all products and descriptions.
    </p>
    <UiLangsMainHub
      :langs="langs"
      @change="langs = $event"
    />
  </div>

  <div class="field-row">
    <UiHeader
      :hasMargin="true"
      level="3"
    >
      Project description
    </UiHeader>
    <p class="text">
      Fill-in the unique name and localised project descriptions here.
      It will be mentioned in payment form and different customer correspondence.
    </p>
    <UiLangTextField
      :value="project.name"
      :langs="langs"
      label="Project name"
      v-bind="getValidatedFieldProps('project.name.en')"
    />
    <UiLangTextField
      :value="fullDescription"
      :langs="langs"
      label="Full description"
      :required="true"
    />
    <UiLangTextField
      :value="shortDescription"
      :langs="langs"
      label="Short description"
      :required="true"
    />
  </div>

  <div class="field-row">
    <UiHeader
      :hasMargin="true"
      level="3"
    >
      Secret key
    </UiHeader>
    <p class="text">
      Generate a secret key to set up correct integration with
      Pay Super platform.
    </p>

    <KeyGenerateField
      v-model="project.secret_key"
      label="Secret key"
      v-bind="getValidatedFieldProps('project.secret_key')"
    />
  </div>

</div>
</template>

<style lang="scss" scoped>
.project-form-settings {
}

.field-row {
  margin-bottom: 32px;
}

.text {
  width: 416px;
  margin-bottom: 12px;
}

.switch-box {
  margin-left: 16px;
}

.textarea {
  width: 100%;
}

.generate-button {
  margin-left: 30px;
}
</style>
