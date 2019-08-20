<script>
import LocalisationsModal from '@/components/LocalisationsModal.vue';
import DeleteLocalisationModal from '@/components/DeleteLocalisationModal.vue';

export default {
  name: 'UiLangsMainHub',

  components: {
    LocalisationsModal,
    DeleteLocalisationModal,
  },

  props: {
    langs: {
      type: Array,
      default: () => ['en', 'ru'],
    },
  },

  data() {
    return {
      isToReopenAddModal: false,
      isLocalisationsModalOpened: false,
      localisationsModalLangs: [],
      isDeleteModalOpened: false,
      langToDelete: '',
    };
  },

  methods: {
    openLocalisationsModal() {
      this.localisationsModalLangs = this.langs.slice();
      this.isLocalisationsModalOpened = true;
    },

    requestDeleteLang(lang) {
      if (lang === 'en') {
        return;
      }
      this.isDeleteModalOpened = true;
      this.langToDelete = lang;
    },

    requestDeleteLangFromModal(lang) {
      this.langToDelete = lang;
      this.isLocalisationsModalOpened = false;
      this.isToReopenAddModal = true;
      this.isDeleteModalOpened = true;
    },

    deleteLang() {
      const newLangs = this.langs.filter(item => this.langToDelete !== item);
      this.isDeleteModalOpened = false;

      if (this.isToReopenAddModal) {
        this.isLocalisationsModalOpened = true;
        this.isToReopenAddModal = false;
        this.localisationsModalLangs = newLangs;
      } else {
        this.$emit('change', newLangs);
      }
    },

    handleModalSave(newLangs) {
      this.$emit('change', newLangs);
      this.isLocalisationsModalOpened = false;
    },
  },
};
</script>

<template>
<div class="ui-langs-main-hub">
  <div class="title">Localisation</div>
  <div>
    <button
      class="add-button"
      @click="openLocalisationsModal"
    >
      <IconPlus width="9" height="9" />
      <span>ADD</span>
    </button>
    <button
      class="lang-button"
      :class="{ '_undeletable': lang === 'en' }"
      v-for="lang in langs"
      :key="lang"
      @click="requestDeleteLang(lang)"
    >
      {{ lang }}
      <IconClose
        class="close-button"
      />
    </button>
  </div>

  <DeleteLocalisationModal
    v-if="isDeleteModalOpened"
    @close="isDeleteModalOpened = false"
    @delete="deleteLang"
  />

  <LocalisationsModal
    v-if="isLocalisationsModalOpened"
    v-model="localisationsModalLangs"
    @close="isLocalisationsModalOpened = false"
    @delete="requestDeleteLangFromModal"
    @save="handleModalSave"
  />
</div>
</template>

<style scoped lang="scss">
.ui-langs-main-hub {
  padding-top: 6px;
}

.title {
  font-size: 12px;
  line-height: 16px;
  color: #5e6366;
  padding-left: 12px;
  margin-bottom: 8px;
}

.add-button,
.lang-button {
  position: relative;
  border-radius: 14px;
  font-size: 12px;
  cursor: pointer;
  outline: none;
  height: 28px;
  line-height: 28px;
  text-transform: uppercase;
  display: inline-flex;
  transition: background-color 0.2s ease-out;
  border: 0;

  & + & {
    margin-left: 2px;
  }
}

.add-button {
  padding: 0 14px 0 12px;
  background-color: #3d7bf5;
  color: #fff;
  align-items: baseline;

  &:hover {
    background-color: rgba(#3d7bf5, 0.85);
  }

  & > svg {
    margin-right: 3px;
  }
}

.lang-button {
  padding: 0 20px;
  background-color: #f7f9fa;

  &:not(._undeletable):hover {
    color: #ea3d2f;
    background-color: rgba(#ea3d2f, 0.1);

    .close-button {
      stroke: #ea3d2f;
    }
  }

  &._undeletable {
    cursor: default;

    .close-button {
      display: none;
    }
  }
}

.close-button {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 7px;
  height: 7px;
  stroke: #919699;
}
</style>
