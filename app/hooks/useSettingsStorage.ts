
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../types/settings';

const KEY = '@app_settings';
const DEFAULTS: Settings = {
  theme: 'light',
  viewMode: 'grid',
  itemsPerRow: 2,
};

export function useSettingsStorage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(KEY);
      if (json) setSettings(JSON.parse(json));
    })();
  }, []);

  const save = async (newSettings: Settings) => {
    setSettings(newSettings);
    await AsyncStorage.setItem(KEY, JSON.stringify(newSettings));
  };

  return { settings, save };
}
