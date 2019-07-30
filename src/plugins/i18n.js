/**
 * Подключение модуля интернационализации
 */

import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const [, locale] = key.split('/');
    messages[locale] = {
      ...(messages[locale] || {}),
      ...locales(key),
    };
  });
  return messages;
}

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
});
