import React from 'react';
import { View, Switch, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import Checkbox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tama } from '../app/hooks/useTamaStorage';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

interface Props {
    tama: Tama;
    onToggle: () => void;
    onInfoPress: () => void;
}

export default function TamaItem({ tama, onToggle, onInfoPress }: Props) {
  

  const opacityStyle = { opacity: tama.acquired ? 1 : 0.4 };

    return (
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <View style={[styles.imageContainer, tama.acquired ? null : styles.disabled]}>
            <Image source={ tama.image } style={styles.image} />
          </View>
          
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
        flexBasis: CARD_WIDTH,
        flexGrow: 0,
        margin: CARD_MARGIN,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 32,
        borderColor: '#a0a0a0',
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
        fontSize: 16,
        fontColor: '#a0a0a0',
        marginRight: 8, 
    },
});
