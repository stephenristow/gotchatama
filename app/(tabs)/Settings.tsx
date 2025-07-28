import { StyleSheet, View, Button, TextInput, Platform, } from 'react-native';
import { Text } from '@/components/Themed';
import { Picker } from '@react-native-picker/picker';
import { useSettingsStorage } from '../hooks/useSettingsStorage.ts';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Theme, ViewMode } from '../types/settings.ts';
import CustomSwitch from '@/components/CustomSwitch';

export default function SettingsScreen() {
  const { settings, save } = useSettingsStorage();

  const update = (partial: Parial<typeof settings>) =>
    save({ ...settings, ...partial });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <CustomSwitch
          value={settings.theme === 'dark'}
          onValueChange={v => update({ theme: v ? 'dark' : 'light' })}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>View Mode</Text>
        <Picker
          selectedValue={settings.viewMode}
          style={styles.picker}
          onValueChange={(v: ViewMode) => update({ viewMode: v })}
        >
          <Picker.Item label="Grid" value="grid" />
          <Picker.Item label="List" value="list" />
        </Picker>
      </View>
      {settings.viewMode === 'grid' && (
        <View style={styles.row}>
          <Text style={styles.label}>Columns</Text>
          <Picker
            selectedValue={settings.itemsPerRow}
            style={styles.picker}
            onValueChange={(v: number) => update({ itemsPerRow: v })}
          >
            {[1, 2, 3].map(n => (
              <Picker.Item key={n} label={String(n)} value={n} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
