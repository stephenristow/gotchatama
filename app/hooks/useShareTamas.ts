
import { Share } from 'react-native';
import { useContext } from 'react';
import { TamaContext } from '@/contexts/TamaContext';

export function useShareTamas() {
  const { state: { tamas } } = useContext(TamaContext);

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
        message: `I just gotcha’d these Tamas in GotchaTama!\n\n${gotchaNames}`,
      });
    } catch (err) {
      console.warn('Share error', err);
    }
  };

  return { shareText };
}
