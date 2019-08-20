<script>
import { upperFirst, includes } from 'lodash-es';

export default {
  name: 'LocalisationsModal',

  model: {
    event: 'update',
    prop: 'langs',
  },

  props: {
    langs: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      availableLangs: {
        en: { label: 'Английский' },
        es: { label: 'Испанский' },
        ar: { label: 'Арабский' },
        ru: { label: 'Русский' },
        'zh-Hant': { label: 'Традиционный китайский' },
        'zh-Hans': { label: 'Упрощенный китайский' },
        'pt-BR': { label: 'Бразильский португальский' },
        'pt-PT': { label: 'Португальский' },
        fr: { label: 'Французский' },
        de: { label: 'Немецкий' },
        it: { label: 'Итальянский' },
        pl: { label: 'Польский' },
        tr: { label: 'Турецкий' },
        el: { label: 'Греческий' },
        ko: { label: 'Корейский' },
        vi: { label: 'Вьетнамский' },
        ja: { label: 'Японский' },
        he: { label: 'Иврит' },
        th: { label: 'Тайский' },
        cs: { label: 'Чешский' },
        bg: { label: 'Болгарский' },
        fi: { label: 'Финский' },
        sv: { label: 'Шведский' },
        da: { label: 'Датский' },
      },
    };
  },

  methods: {
    iconLang(locale) {
      const [lang] = locale.split('-');
      const componentName = `IconLang${upperFirst(lang)}`;

      if (this.$options.components[componentName]) {
        return componentName;
      }
      return 'IconLangNoIcon';
    },

    includes,

    toggleLangSelected(langCode) {
      if (langCode === 'en' || includes(this.langs, langCode)) {
        return;
      }
      let newLangs;
      if (includes(this.langs, langCode)) {
        newLangs = this.langs.filter(item => item !== langCode);
      } else {
        newLangs = this.langs.slice();
        newLangs.push(langCode);
      }

      this.$emit('update', newLangs);
    },
  },
};
</script>

<template>
<UiModal
  width="458px"
  :hasCloseButton="true"
  @close="$emit('close')"
>
  <UiHeader
    slot="header"
    level="3"
    align="center"
  >
    Localisations
  </UiHeader>
  <UiScrollbarBox class="content">
    <div
      v-for="(lang, langCode) in availableLangs"
      class="item"
      :key="langCode"
      :class="{
        '_selected': includes(langs, langCode),
        '_undeletable': langCode === 'en',
      }"
      @click="toggleLangSelected(langCode)"
    >
      <div class="icon">
        <component :is="iconLang(langCode)" />
      </div>

      <div class="label">
        {{ lang.label }}
        ({{ langCode.toUpperCase() }})
      </div>

      <span
        class="delete-icon"
        @click="$emit('delete', langCode)"
      >
        <IconCloseInCircle />
      </span>
    </div>
  </UiScrollbarBox>
  <div class="controls">
    <UiButton
      class="submit-button"
      @click="$emit('save', langs)"
    >
      SAVE
    </UiButton>
  </div>
</UiModal>
</template>

<style lang="scss" scoped>
.content {
  max-height: 295px;
  margin-right: -20px;
  margin-bottom: 10px;
}

.item {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 48px;
  font-size: 16px;
  line-height: 24px;
  border-bottom: 1px solid #e3e5e6;
  margin-right: 20px;
  padding-right: 20px;
  position: relative;

  &:not(._selected):hover {
    background-color: rgba(#3d7bf5, 0.1);
    color: #3d7bf5;
  }

  &._selected {
    color: #919699;
    cursor: default;

    .delete-icon {
      opacity: 1;
    }

    .icon {
      opacity: 0.3;
    }
  }

  &._undeletable {
    cursor: default;

    .delete-icon {
      display: none;
    }
  }
}
.icon {
  border-radius: 3px;
  overflow: hidden;
  height: 18px;
  flex-shrink: 0;
  margin: -1px 10px 0 0;
}
.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-icon {
  position: absolute;
  opacity: 0;
  right: 0;
  top: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover > svg {
    fill: #ea3d2f;
  }
}

.controls {
  display: flex;
}
.submit-button {
  flex-grow: 1;
}
</style>
