import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Filters } from '../types/filters.ts';

const KEY = '@tama_filters';
const DEFAULTS: Filters = {
  showAcquired: true,
  showUnacquired: true,
  onlyBaseGame: false,
  onlyExpansions: false,
  expansions: ['Very Berry Land', 'LoveMelo Concert', 'Tamamori Fashion Show', 
    'Sanrio Characters', 'Angel Festival', 'Monster Carnival', 'Fairy Tale Library', 
    'PokoPea Land', 'DoriTama School', 'KAWAISOUN! Land'],
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

