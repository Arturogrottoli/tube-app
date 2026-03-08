import { Stack } from 'expo-router';
import { View, StatusBar } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <StatusBar barStyle="light-content" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e1e1e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#121212',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'PocketTube' }} />
        <Stack.Screen name="library" options={{ title: 'Mi Librería' }} />
        <Stack.Screen name="player" options={{ title: 'Reproductor' }} />
      </Stack>
    </View>
  );
}
