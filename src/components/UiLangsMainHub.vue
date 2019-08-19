<script>
import AddLocalisationModal from '@/components/AddLocalisationModal.vue';
import DeleteLocalisationModal from '@/components/DeleteLocalisationModal.vue';

export default {
  name: 'UiLangsMainHub',

  components: {
    AddLocalisationModal,
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
      isAddModalOpened: false,
      isDeleteModalOpened: false,
      langToDelete: '',
    };
  },

  methods: {
    requestDeleteLang(lang) {
      this.isDeleteModalOpened = true;
      this.langToDelete = lang;
    },

    deleteLang() {
      const langs = this.langs.filter(item => this.langToDelete !== item);
      this.$emit('change', langs);
      this.isDeleteModalOpened = false;
    },

    handleAddUpdate(value) {
      this.$emit('change', value);
      this.isAddModalOpened = false;
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
      @click="isAddModalOpened = true"
    >
      <IconPlus width="9" height="9" />
      <span>ADD</span>
    </button>
    <button
      class="lang-button"
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

  <AddLocalisationModal
    v-if="isAddModalOpened"
    :selectedLangs="langs"
    @close="isAddModalOpened = false"
    @update="handleAddUpdate"
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

  &:hover {
    color: #ea3d2f;
    background-color: rgba(#ea3d2f, 0.1);

    .close-button {
      stroke: #ea3d2f;
      opacity: 1;
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
