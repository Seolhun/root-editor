import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import * as React from 'react';

import type { SettingName } from '../appSettings';

import { DEFAULT_SETTINGS, INITIAL_SETTINGS } from '../appSettings';

type SettingsContextValues = {
  setOption: (name: SettingName, value: boolean) => void;
  settings: Record<SettingName, boolean>;
};

export const SettingsContext: React.Context<SettingsContextValues> = createContext({
  setOption: (name: SettingName, value: boolean) => {
    return;
  },
  settings: INITIAL_SETTINGS,
});

export const SettingsProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  const setOption = useCallback((setting: SettingName, value: boolean) => {
    setSettings((options) => ({
      ...options,
      [setting]: value,
    }));
    setURLParam(setting, value);
  }, []);

  const contextValue = useMemo(() => {
    return { setOption, settings };
  }, [setOption, settings]);

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValues => {
  return useContext(SettingsContext);
};

function setURLParam(param: SettingName, value: boolean | null) {
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
