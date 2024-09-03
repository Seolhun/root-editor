import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_I18N_RESOURCES } from './i18n.resources';
import { i18nResource } from './i18n.types';

export function createI18n(language: string, resources?: i18nResource) {
  const i18n = i18next.createInstance();
  i18n.use(initReactI18next).init({
    debug: false,
    defaultNS: 'common',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    lng: language,
    resources: {
      ...resources,
      ...DEFAULT_I18N_RESOURCES,
    },
  });
  return i18n;
}
