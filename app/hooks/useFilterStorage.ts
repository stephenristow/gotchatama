import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Filters } from '../types/filters.ts';

const KEY = '@tama_filters';
const DEFAULTS: Filters = {
  showAcquired: true,
  showUnacquired: true,
  expansions: [],
};

export function useFilterStorage() {
  const [filters, setFilters] = useState<Filters>(DEFAULTS);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(KEY);
      if (json) setFilters(JSON.parse(json));
    })();
  }, []);

  const save = async (newFilters: Filters) => {
    setFilters(newFilters);
    await AsyncStorage.setItem(KEY, JSON.stringify(newFilters));
  };

  return { filters, save };
}

