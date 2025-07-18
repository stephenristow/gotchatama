import React from 'react';
import { View, Text, Switch, StyleSheet, Image, Dimensions } from 'react-native';
import { Tama } from '../app/hooks/useTamaStorage';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

interface Props {
    tama: Tama;
    onToggle: () => void;
}

export default function TamaItem({ tama, onToggle }: Props) {
    const uri =
    tama.imageUrl.startsWith('http')
      ? tama.imageUrl
      : `https://tamagotchi-official.com${tama.imageUrl}`;

    return (
        <View style={styles.card}>
            <Image source={{ uri }} style={styles.image} />

            <View style={styles.infoRow}>
                <Text style={styles.name} numberOfLines={1}>
                {tama.name}
                </Text>
                <Switch value={tama.acquired} onValueChange={onToggle} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        margin: CARD_MARGIN,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    name: { 
        flex: 1,
        alignItems: 'center',
        fontSize: 14,
        marginRight: 8, 
    },
});
