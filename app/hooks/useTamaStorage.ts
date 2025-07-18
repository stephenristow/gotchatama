import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import rawTamas from '../../data/tamas.json';

export interface Tama {
    id: number;
    name: string;
    imageUrl: string;
    acquired: boolean;
}
const STORAGE_KEY = '@tama_list';


export function useTamaStorage() {
    const [tamas, setTamas ] = useState<Tama[]>([]);

    useEffect(() => {
        (async () => {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (json) {
                setTamas(JSON.parse(json));
            } else {
                const initial = rawTamas.map(t => ({
                    ...t,
                    acquired: false
                }));
                setTamas(initial);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
            }
        })();
    }, []);

    const save = async (newList: Tama[]) => {
        setTamas(newList);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    };

    return { tamas, save};
}