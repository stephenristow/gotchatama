import { StyleSheet, FlatList, Modal, Text as RNText, Pressable, Button, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useTamaStorage } from '../hooks/useTamaStorage';
import TamaItem from '@/components/TamaItem';
import unlockSteps from '../../data/unlockSteps.json';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

const unlockMap: Record<string, string[]> = (unlockSteps as Array<{
  name: string;
  steps: string[];
}>).reduce((map, u) => {
  map[u.name] = u.steps;
  return map;
}, {});

export default function ChecklistScreen() {
  const { tamas, save } = useTamaStorage();
  const [selectedTama, setSelectedTama] = useState<Tama | null>(null);

  const toggle = (id: number) => {
    const updated = tamas.map(t =>
      t.id === id ? { ...t, acquired: !t.acquired } : t
    );
    save(updated);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tamas}
        keyExtractor={t => t.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listBody}
        renderItem={({ item }) => (
          <TamaItem 
            tama={item} 
            onToggle={() => toggle(item.id)}
            onInfoPress={() => setSelectedTama(item)}
          />
        )}
      />

      <Modal
        visible={!!selectedTama}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedTama(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedTama?.name}
            </Text>
            <ScrollView style={styles.stepsList}>
              {(selectedTama && STEPS[selectedTama.id] || []).map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <Text>{`\u2022 ${step}`}</Text>
                </View>
              ))}
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedTama(null)}
              >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listBody: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stepsList: {
    marginBottom: 16,
  },
  stepRow: {
    marginBottom: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
