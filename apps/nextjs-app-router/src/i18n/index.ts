import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import resources from './locales';

export const LANGUAGES = ['en', 'ko', 'jp'];

i18next.use(initReactI18next).init({
  debug: false,
  defaultNS: 'common',
  fallbackLng: 'en',
  /**
   * @see https://www.i18next.com/translation-function/interpolation
   */
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
  react: {
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'a'],
    transSupportBasicHtmlNodes: true,
    useSuspense: false,
  },
  resources,
});

export default i18next;
