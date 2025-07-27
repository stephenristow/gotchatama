import { StyleSheet, FlatList, Modal, Text as RNText, Pressable, Button, Switch, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useTamaStorage } from '../hooks/useTamaStorage';
import TamaItem from '@/components/TamaItem';
import unlockSteps from '../../data/unlockSteps.json';
import { useFilterStorage } from '../hooks/useFilterStorage.ts';

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
  const { filters, save: saveFilters } = useFilterStorage();
  const [ showFilterModal, setShowFilterModal ] = useState(false);
  const BASE_GAME_MAX_ID = 22;

  const toggle = (id: number) => {
    const updated = tamas.map(t =>
      t.id === id ? { ...t, acquired: !t.acquired } : t
    );
    save(updated);
  };

  const unlockMap = React.useMemo(
    () => 
      unlockSteps.reduce<Record<string,string[]>>((map, u) => {
        map[u.name] = u.steps;
        return map;
      }, {}),
    []
  );


  const visibleTamas = tamas.filter(t => {
    if (!filters.showAcquired && t.acquired) return false;
    if (!filters.showUnacquired && !t.acquired) return false;
    
    const isBase = t.id <= BASE_GAME_MAX_ID;
    if (filters.onlyBaseGame && !isBase) return false;
    if (filters.onlyExpansions && isBase) return false;

    // if (filters.expansions.length > 0) {
    //   const expansionName = getExpansionNameForTama(t.id);
    //   if (!filters.expansions.includes(expansionName)) return false;
    // }

    return true;
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tama Checklist</Text>
        <Button title="Filters" onPress={() => setShowFilterModal(true)} />
      </View>
      <FlatList
        data={visibleTamas}
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

      <Modal visible={showFilterModal}>
        <View style={styles.modalContent}>
          <Text>Show Acquired</Text>
          <Switch value={filters.showAcquired}
          onValueChange={v => saveFilters({ ...filters, showAcquired: v})}
          />
          <Text>Show Unacquired</Text>
          <Switch value={filters.showUnacquired}
          onValueChange={v => saveFilters({ ...filters, showUnacquired: v})}
          />
          <Text>Base Game Only</Text>
          <Switch value={filters.onlyBaseGame}
          onValueChange={v => saveFilters({ ...filters, onlyBaseGame: v})}
          />
          <Text>Expansions Only</Text>
          <Switch value={filters.onlyExpansions}
          onValueChange={v => saveFilters({ ...filters, onlyExpansions: v})}
          />
          
          <Button title="Done" onPress={() => setShowFilterModal(false)} />
        </View>
      </Modal>

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
              {selectedTama ? (unlockMap[selectedTama.name] || []).map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <Text>{`\u2022 ${step}`}</Text>
                </View>
              )) : null}
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
