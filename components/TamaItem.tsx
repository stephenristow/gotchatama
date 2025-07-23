import React from 'react';
import { View, Switch, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import Checkbox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tama } from '../app/hooks/useTamaStorage';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 4;
const CARD_WIDTH = (width - CARD_MARGIN * 2) / 2;

interface Props {
    tama: Tama;
    onToggle: () => void;
    onInfoPress: () => void;
}

export default function TamaItem({ tama, onToggle, onInfoPress }: Props) {
    const uri =
    tama.imageUrl.startsWith('http')
      ? tama.imageUrl
      : `https://tamagotchi-official.com${tama.imageUrl}`;
    
    const opacityStyle = { opacity: tama.acquired ? 1 : 0.4 };

    return (
      <View style={styles.wrapper}>
        <View style={[styles.card, tama.acquired ? null : styles.disabled]}>
          <Image source={{ uri }} style={styles.image} />
          
          <View style={styles.bottomRow}>
            <Checkbox 
              value={tama.acquired}
              onValueChange={onToggle}
              style={styles.checkbox}
            />
          
            <Text style={styles.name} numberOfLines={1}>
              {tama.name}
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
        width: CARD_WIDTH,
        margin: CARD_MARGIN,
    },
    wrapper: {
      flex: 1,
      aspectRatio: 0.85,
      margin: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 32,
        borderColor: '#a0a0a0',
        borderWidth: 4, 
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
    image: {
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      paddingBottom: 8,
      paddingHorizontal: 16,
    },
    checkbox: {
      marginRight: 8,
    },
    name: { 
        flex: 1,
        alignItems: 'center',
        fontSize: 16,
        marginRight: 8, 
    },
});
