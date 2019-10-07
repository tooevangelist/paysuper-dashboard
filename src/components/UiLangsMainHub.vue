<script>
import { upperFirst } from 'lodash-es';
import EntityManagementModal from '@/components/EntityManagementModal.vue';

export default {
  name: 'UiLangsMainHub',

  components: {
    EntityManagementModal,
  },

  model: {
    prop: 'langs',
    event: 'change',
  },

  props: {
    langs: {
      type: Array,
      default: () => ['en', 'ru'],
    },
  },

  data() {
    return {
      defaultOptionCode: 'en',
      isToReopenAddModal: false,
      isEntityManagementModalOpened: false,
      localizationsModalLangs: [],
      isDeleteModalOpened: false,
      langToDelete: '',
      localizationOptions: [
        { label: 'Английский', code: 'en' },
        { label: 'Испанский', code: 'es' },
        { label: 'Арабский', code: 'ar' },
        { label: 'Русский', code: 'ru' },
        { label: 'Традиционный китайский', code: 'zh-Hant' },
        { label: 'Упрощенный китайский', code: 'zh-Hans' },
        { label: 'Бразильский португальский', code: 'pt-BR' },
        { label: 'Португальский', code: 'pt-PT' },
        { label: 'Французский', code: 'fr' },
        { label: 'Немецкий', code: 'de' },
        { label: 'Итальянский', code: 'it' },
        { label: 'Польский', code: 'pl' },
        { label: 'Турецкий', code: 'tr' },
        { label: 'Греческий', code: 'el' },
        { label: 'Корейский', code: 'ko' },
        { label: 'Вьетнамский', code: 'vi' },
        { label: 'Японский', code: 'ja' },
        { label: 'Иврит', code: 'he' },
        { label: 'Тайский', code: 'th' },
        { label: 'Чешский', code: 'cs' },
        { label: 'Болгарский', code: 'bg' },
        { label: 'Финский', code: 'fi' },
        { label: 'Шведский', code: 'sv' },
        { label: 'Датский', code: 'da' },
      ],
    };
  },

  computed: {
    localizationOptionsPrepared() {
      return this.localizationOptions.map((item) => {
        let iconComponent = 'IconLangNoIcon';
        const [name] = item.code.split('-');
        const componentName = `IconLang${upperFirst(name)}`;

        if (this.$options.components[componentName]) {
          iconComponent = componentName;
        }
        return {
          label: `${item.label} (${item.code.toUpperCase()})`,
          code: item.code,
          iconComponent,
        };
      });
    },
  },

  methods: {
    openEntityManagementModal() {
      this.localizationsModalLangs = this.langs.slice();
      this.isEntityManagementModalOpened = true;
    },

    requestDeleteLang(lang) {
      if (lang === this.defaultOptionCode) {
        return;
      }
      this.isDeleteModalOpened = true;
      this.langToDelete = lang;
    },

    requestDeleteLangFromModal(lang) {
      this.langToDelete = lang;
      this.isEntityManagementModalOpened = false;
      this.isToReopenAddModal = true;
      this.isDeleteModalOpened = true;
    },

    deleteLang() {
      this.isDeleteModalOpened = false;

      if (this.isToReopenAddModal) {
        this.isEntityManagementModalOpened = true;
        this.isToReopenAddModal = false;
        const newLangs = this.localizationsModalLangs.filter(item => this.langToDelete !== item);
        this.localizationsModalLangs = newLangs;
      } else {
        const newLangs = this.langs.filter(item => this.langToDelete !== item);
        this.$emit('change', newLangs);
      }
    },

    handleModalSave(newLangs) {
      this.$emit('change', newLangs);
      this.isEntityManagementModalOpened = false;
    },
  },
};
</script>

<template>
<div>
  <UiEntityMainHub
    label="Localization"
    :value="langs"
    :defaultOption="defaultOptionCode"
    @add="openEntityManagementModal"
    @delete="requestDeleteLang"
  />

  <UiDeleteModal
    v-if="isDeleteModalOpened"
    title="Delete localization"
    closeButtonText="Cancel"
    @close="isDeleteModalOpened = false"
    @submit="deleteLang"
  >
    Are you sure you want to delete? All texts and descriptions for this language will be lost.
  </UiDeleteModal>

  <EntityManagementModal
    v-if="isEntityManagementModalOpened"
    v-model="localizationsModalLangs"
    title="Localizations"
    :value="langs"
    :options="localizationOptionsPrepared"
    :defaultOptionCode="defaultOptionCode"
    @close="isEntityManagementModalOpened = false"
    @delete="requestDeleteLangFromModal"
    @save="handleModalSave"
  />
</div>
</template>
