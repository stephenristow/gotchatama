import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useSettings } from '../app/contexts/SettingsContext.tsx';

export function useColorScheme(): 'light' | 'dark' {
  const systemScheme = useSystemColorScheme();
  const { settings, loaded } = useSettings();

  const fallback = systemScheme === 'dark' ? 'dark' : 'light';

  if (!loaded || !settings?.theme) return fallback; 

  const scheme = settings.theme.toLowerCase();
  return scheme === 'dark' ? 'dark' : 'light';
}

