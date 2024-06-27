import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import * as React from 'react';

import type { EditorSettings } from '../../Editor.settings';

import { DEFAULT_SETTINGS, INITIAL_SETTINGS } from '../../Editor.settings';

export interface SettingsContextValues {
  setOption: (name: keyof EditorSettings, value: boolean) => void;
  settings: EditorSettings;
}

export const SettingsContext = createContext(null as unknown as SettingsContextValues);

export interface SettingsProviderProps {
  children: ReactNode;
  initialSettings?: Partial<EditorSettings>;
}

export const SettingsProvider = ({ children, initialSettings }: SettingsProviderProps): JSX.Element => {
  const [editorSettings, setEditorSettings] = useState({
    ...INITIAL_SETTINGS,
    ...initialSettings,
  });

  const setOption = useCallback((setting: keyof EditorSettings, value: boolean) => {
    setEditorSettings((options) => ({
      ...options,
      [setting]: value,
    }));
    setURLParam(setting, value);
  }, []);

  const contextValue = useMemo<SettingsContextValues>(() => {
    return {
      setOption,
      settings: editorSettings,
    };
  }, [setOption, editorSettings]);

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValues => {
  return useContext(SettingsContext);
};

function setURLParam(param: keyof EditorSettings, value: boolean | null) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  if (value !== DEFAULT_SETTINGS[param]) {
    params.set(param, String(value));
  } else {
    params.delete(param);
  }
  url.search = params.toString();
  window.history.pushState(null, '', url.toString());
}
