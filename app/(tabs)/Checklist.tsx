import { StyleSheet, FlatList } from 'react-native';
import { useTamaStorage } from '../hooks/useTamaStorage';
import TamaItem from '@/components/TamaItem';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function ChecklistScreen() {
  const { tamas, save } = useTamaStorage();

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
          <TamaItem tama={item} onToggle={() => toggle(item.id)} />
        )}
      />
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
});
