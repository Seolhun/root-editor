export type i18nLanguage = string;

export type i18nResourceValue =
  | {
      [key: string]: any;
    }
  | string;

export interface i18nResourceLanguage {
  [namespace: string]: i18nResourceValue;
}

export interface i18nResource {
  [language: i18nLanguage]: i18nResourceLanguage;
}
