import { createContext, useContext, useState, ReactNode } from 'react';
import { useTamaStorage } from '../hooks/useTamaStorage.ts';
import { Tama } from '../types/tama.ts';

type TamaContextType = {
  tamas: Tama[];
  toggleTama: (id: number) => void;
  getShareableText: () => string;
}

export const TamaContext = createContext<TamaContextType | undefined>(undefined);

export const TamaProvider = ({ children }: { children: ReactNode }) => {
  const { tamas, save } = useTamaStorage();

  const toggleTama = (id: number) => {
    const updated = tamas.map(t => 
        t.id === id ? { ...t, acquired: !t.acquired } : t
    );
  };

  const getShareableText = () => {
    return tamas
      .filter(t => t.acquired)
      .map(t => t.name)
      .join(', ');
  };

  return (
    <TamaContext.Provider value={{ tamas, toggleTama, getShareableText }}>
      {children}
    </TamaContext.Provider>
  );
};

export const useShareTamas = () => {
  const context = useContext(TamaContext);
  if (!context) {
    throw new Error('useShareTamas must be used within a TamaProvider');
  }
  return context;
};
