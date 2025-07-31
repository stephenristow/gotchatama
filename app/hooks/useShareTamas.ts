
import { Share } from 'react-native';
import { useContext } from 'react';
import { TamaContext } from '../contexts/TamaContext.tsx';

export function useShareTamas() {
  const context = useContext(TamaContext);

  if (!context) {
    throw new Error('useShareTamas must be used within a TamaProvider');
  }

  const { tamas } = context;

  const shareText = async () => {
    const gotchaNames = tamas
      .filter(t => t.acquired)
      .map(t => t.name)
      .join(', ');

    if (!gotchaNames) {
      return alert('You haven’t gotcha’d any Tamas yet!');
    }

    try {
      await Share.share({
        message: `I've gotcha’d these Tamas in GotchaTama!\n\n${gotchaNames}`,
      });
    } catch (err) {
      console.warn('Share error', err);
    }
  };

  return { shareText };
}
