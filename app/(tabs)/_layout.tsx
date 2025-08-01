import React from 'react';
import { Text as RNText } from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading'; 

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useShareTamas } from '../hooks/useShareTamas.ts';
import { TamaProvider } from '../contexts/TamaContext.tsx';
import { SettingsProvider } from '../contexts/SettingsContext.tsx';

import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { useSettings } from '../contexts/SettingsContext.tsx';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    ArialRounded: require('../../assets/fonts/arial-rounded-mt-regular.ttf'),
    TamaConnect: require('../../assets/fonts/tamaconnecttype.ttf')
  });
 
  if (!fontsLoaded ) {
    return <AppLoading />;
  }

  return (
    <SettingsProvider>
      <ThemedApp />
    </SettingsProvider>
  );
}

function ThemedApp() {
  const { settings, loaded } = useSettings();
  const colorScheme = settings.theme;
  console.log('[Layout] Resolved color scheme:', colorScheme);

  if (!loaded) { 
    return <AppLoading/>;
  }
  const customTheme = {
    ...((colorScheme === 'dark') ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: Colors[colorScheme].background,
      text: Colors[colorScheme].text,
      border: Colors[colorScheme].border,
      primary: Colors[colorScheme].tint,
      card: Colors[colorScheme].background,
    },
  };
  return (
    <ThemeProvider value={customTheme}>
      <TamaProvider>
        <TabLayoutWithContext colorScheme={colorScheme}/>
      </TamaProvider>
    </ThemeProvider>
  ); 
}

function TabLayoutWithContext({ colorScheme }: { colorScheme: 'light' | 'dark' }) {

  const { shareText } = useShareTamas();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),

        headerStyle: {
          backgroundColor: Colors[colorScheme].background,

          borderBottomWidth: 1,
          borderBottomColor: Colors[colorScheme].border,

          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,

          elevation: 4,
        },

        headerTitleStyle: {
          fontWeight: '600',
        },

        headerTitleAlign: 'center',

        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <Tabs.Screen
        name="Checklist"
        options={{
          title: 'Uni',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={shareText}
              style={{ 
                padding: 8, 
                marginRight: 12, 
                backgroundColor: Colors[colorScheme].card, 
                borderColor: Colors[colorScheme].border, 
                borderWidth: 1,
                borderRadius: 8,
              }}
              hitSlop={8}
            >
              <Feather name="share-2" size={24} color={Colors[colorScheme].text} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
