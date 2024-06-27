import { ReactNode } from 'react';

export type I18nMessages = Record<string, React.ReactNode>;
export type I18nResources = Record<string, I18nMessages>;
export type I18nTFunction = (key: string) => ReactNode;
