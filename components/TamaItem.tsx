import React, { useState } from 'react';
import { View, Switch, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import Checkbox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tama } from '../app/hooks/useTamaStorage';
import { normalize } from '../utils/normalize.ts';

import { useColorScheme } from '../components/useColorScheme.ts';
import Colors from '../constants/Colors.ts';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

interface Props {
    tama: Tama;
    onToggle: () => void;
    onInfoPress: () => void;
}

export default function TamaItem({ tama, onToggle, onInfoPress }: Props) {
  const [ cardWidth, setCardWidth ] = useState<number | null>(null);
  
  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    console.log('[TamaItem] Card width:', width);
    setCardWidth(width);
  };

  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] ?? Colors.light;
  console.log('[Debug] themeColors:', themeColors);

  const longestWordLength = Math.max( ...tama.name.split(/[\s\-]/).map(w => w.length));
  const CHAR_WIDTH_ESTIMATE = 8;
  const BASE_FONT_SIZE = 12;
  const softHyphenatedName = tama.name.replace(/-/g, '\u200B');

  let fontSize = BASE_FONT_SIZE;
  if (cardWidth) {
    const maxCharsPerLine = cardWidth / CHAR_WIDTH_ESTIMATE;
    const fontScale = Math.min(1, maxCharsPerLine / longestWordLength);
    fontSize = normalize(BASE_FONT_SIZE * fontScale, cardWidth);
  }

  const opacityStyle = { opacity: tama.acquired ? 1 : 0.4 };

    return (
      <View style={styles.wrapper} onLayout={handleLayout}>
        <View 
          style={[
            styles.card,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <View style={[styles.imageContainer, tama.acquired ? null : styles.disabled]}>
            <Image source={ tama.image } style={styles.image} />
          </View>
          
          <View style={styles.bottomRow}>
            <Checkbox 
              value={tama.acquired}
              onValueChange={onToggle}
              style={styles.checkbox}
            />
          
            <Text style={[styles.name, { color: themeColors.text, fontSize}]} numberOfLines={2}>
              {softHyphenatedName}
            </Text>
            <Pressable onPress={onInfoPress} hitSlop={8}>
              <FontAwesome name="info-circle" size={20} colors="#555"/>
            </Pressable>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      margin: CARD_MARGIN,
    },
    card: {
        flex: 1,
        borderRadius: 32,
        borderWidth: 2, 
        overflow: 'hidden',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    disabled: {
      opacity: 0.4,
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 16,
      paddingHorizontal: 16,
    },
    checkbox: {
      marginRight: 8,
    },
    name: { 
        flex: 1,
        textAlign: 'center',
        fontColor: '#a0a0a0',
        marginRight: 8, 
    },
});
