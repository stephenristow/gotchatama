import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 430;
const MIN_FONT_SIZE = 10;

export function normalize(size: number, referenceWidth: number = Dimensions.get('window').width) {
  const baseWidth = 430;
  const scale = referenceWidth / baseWidth;
  const newSize = size * scale;
  const fontSize = Math.max(newSize, MIN_FONT_SIZE)

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(fontSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(fontSize)) - 2;
  }
}
