import { StyleSheet, FlatList, Modal, Text as RNText, Pressable, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useTamaStorage } from '../hooks/useTamaStorage';
import TamaItem from '@/components/TamaItem';
import unlockSteps from '../../data/unlockSteps.json';
import { useFilterStorage } from '../hooks/useFilterStorage.ts';
import CustomButton from '@/components/CustomButton';
import CustomSwitch from '@/components/CustomSwitch';

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
  const [ searchQuery, setSearchQuery ] = useState('');

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


  const visibleTamas = tamas.filter(t => 
    t.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ).filter(t => {
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
    });

  const toggleAcquire = (id: number) =>
    save(tamas.map(t => t.id === id ? { ...t, acquired: !t.acquired } : t));

  const chips = [
    {
      key: 'acquired',
      label: 'Gotcha @',
      active: filters.showAcquired,
      onPress: () => saveFilters({ ...filters, showAcquired: !filters.showAcquired })
    },
    {
      key: 'unacquired',
      label: 'Notcha \\',
      active: filters.showUnacquired,
      onPress: () => saveFilters({ ...filters, showUnacquired: !filters.showUnacquired })
    },
    {
      key: 'base',
      label: 'Base Game',
      active: filters.onlyBaseGame,
      onPress: () => saveFilters({ ...filters, onlyBaseGame: !filters.onlyBaseGame, onlyExpansions: false })
    },
    {
      key: 'expansions',
      label: 'Expansions',
      active: filters.onlyExpansions,
      onPress: () => saveFilters({ ...filters, onlyExpansions: !filters.onlyExpansions, onlyBaseGame: false })
    }
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Search Tamagotchi…"
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="while-editing"
      />
      <FlatList
        data={visibleTamas}
        keyExtractor={t => t.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listBody}
        ListHeaderComponent={() => (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipContainer}
          >
            {chips.map(chip => (
              <Pressable
                key={chip.key}
                onPress={chip.onPress}
                style={[
                  styles.chip,
                  chip.active ? styles.chipActive : styles.chipInactive
                ]}
              >
                <Text style={chip.active ? styles.chipTextActive : styles.chipTextInactive}>
                  {chip.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <TamaItem 
            tama={item} 
            onToggle={() => toggle(item.id)}
            onInfoPress={() => setSelectedTama(item)}
          />
        )}

        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No Tamagotchi found.
            </Text>
            <Text style={styles.emptySubtext}>
              Try clearing your search or toggling your filter.
            </Text>
          </View>
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
    backgroundColor: '#f7f7f7',
  },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  chipScroll: {
    width: '100%',
    maxHeight: 80,
  },
  chipContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  chipInactive: {
    backgroundColor: 'transparent',
    borderColor: '#aaa',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  chipTextInactive: {
    color: '#444',
  },
  listBody: {
    paddingHorizontal: 8,
    paddingVertical: 16,
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
  emptyContainer: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
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
