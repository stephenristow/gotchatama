
import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '@/types/settings';

const KEY = '@app_settings';
const DEFAULTS: Settings = {
  theme: 'light',
  viewMode: 'grid',
  itemsPerRow: 2,
};

type SettingsContextType = {
  settings: Settings;
  save: (s: Settings) => void;
  loaded: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(json => {
      if (json) setSettings(JSON.parse(json));
      setLoaded(true);
    });
  }, []);

  const save = (newSettings: Settings) => {
    setSettings(newSettings);
    AsyncStorage.setItem(KEY, JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, save, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
