import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tamas as rawTamas } from '../../app/data/tamas.ts';
import { Expansion } from '../../app/types/expansion.ts'

export interface Tama {
    id: number;
    name: string;
    image: any;
    acquired: boolean;
    expansion: Expansion;
}
const STORAGE_KEY = '@tama_list';


export function useTamaStorage() {
  const [tamas, setTamas ] = useState<Tama[]>([]);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const saved: Array<{id: number; acquired: boolean }> = 
        json ? JSON.parse(json) : [];

      const merged = rawTamas.map(seed => {
        const match = saved.find(s => s.id === seed.id);
        return {
          ...seed,
          acquired: match?.acquired ?? false,
        };
      });

      setTamas(merged);

      if (!json) {
        const toStore = merged.map(t => ({ id: t.id, acquired: t.acquired }));
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      }
    })();
  }, []);


  const save = async (newList: Tama[]) => {
    setTamas(newList);
    const toStore = newList.map(t => ({ id: t.id, acquired: t.acquired }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  };

  return { tamas, save};
}
