<script>
import { upperFirst, includes } from 'lodash-es';

export default {
  name: 'DeleteLocalisationModal',

  props: {
    selectedLangs: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      availableLangs: {
        'zh-Hant': { label: 'Традиционный китайский' },
        'zh-Hans': { label: 'Упрощенный китайский' },
        en: { label: 'Английский' },
        es: { label: 'Испанский' },
        ar: { label: 'Арабский' },
        ru: { label: 'Русский' },
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

      selectedLangsInner: this.selectedLangs,
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
      if (includes(this.selectedLangsInner, langCode)) {
        this.selectedLangsInner = this.selectedLangsInner.filter(item => item !== langCode);
      } else {
        this.selectedLangsInner.push(langCode);
      }
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
    Add localisation
  </UiHeader>
  <UiScrollbarBox class="content">
    <div
      v-for="(lang, langCode) in availableLangs"
      class="item"
      :key="langCode"
      :class="{
        '_selected': includes(selectedLangsInner, langCode),
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

      <IconCheck class="check-mark" />
    </div>
  </UiScrollbarBox>
  <div class="controls">
    <UiButton
      class="submit-button"
      @click="$emit('update', selectedLangsInner)"
    >
      UPDATE
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

  &._selected,
  &._selected-now {
    color: #919699;

    .check-mark {
      opacity: 1;
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

.check-mark {
  stroke: #c6cacc;
  width: 14px;
  height: 11px;
  position: absolute;
  right: 9px;
  top: 18px;
  opacity: 0;
}

.controls {
  display: flex;
}
.submit-button {
  flex-grow: 1;
}
</style>
