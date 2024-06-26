import { merge } from 'lodash-es';
import * as React from 'react';

import { DEFAULT_I18N_RESOURCES } from './I18n.resources';
import { I18nResources, I18nTFunction } from './I18n.types';

export interface I18nContextValues {
  /**
   * Current language of the application.
   */
  currentLanguage: string;
  /**
   * Function to set the current language of the application.
   */
  setCurrentLanguage: React.Dispatch<React.SetStateAction<string>>;
  /**
   * Function to translate the key to the current language.
   */
  t: I18nTFunction;
}

export const I18nContext = React.createContext(null as unknown as I18nContextValues);

export interface i18nProviderProps {
  children: React.ReactNode;
  /**
   * Locale of the application.
   */
  language?: string;
  /**
   * Resources for the i18n messages
   */
  resources?: Partial<I18nResources>;
}

export const I18nProvider = ({ children, language = 'en', resources = DEFAULT_I18N_RESOURCES }: i18nProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = React.useState<string>(language);

  const i18nResources = React.useMemo(() => {
    return merge(DEFAULT_I18N_RESOURCES, resources);
  }, [resources]);

  const t = React.useCallback<I18nTFunction>(
    (key: string) => i18nResources?.[language]?.[key] || key,
    [i18nResources, language],
  );

  const contextValue = React.useMemo(() => {
    return {
      currentLanguage,
      setCurrentLanguage,
      t,
    };
  }, [currentLanguage, t]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValues => {
  return React.useContext(I18nContext);
};
