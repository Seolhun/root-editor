import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_I18N_RESOURCES } from './i18n.resources';
import { i18nResource } from './i18n.types';

export function createI18n(language: string, resources?: i18nResource) {
  i18n.use(initReactI18next).init({
    fallbackLng: language,
    interpolation: {
      escapeValue: false,
    },
    lng: language,
    ns: 'translation',
    resources: {
      ...resources,
      ...DEFAULT_I18N_RESOURCES,
    },
  });
  return i18n;
}
