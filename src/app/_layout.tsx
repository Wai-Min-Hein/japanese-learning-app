import '../../global.css';

import { Stack } from 'expo-router';
import { StyledProvider } from '@gluestack-style/react';
import { config } from '@gluestack-ui/config';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <StyledProvider config={config}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="chapter/[id]" />
        <Stack.Screen name="kanji/index" />
        <Stack.Screen name="kanji/[id]" />
        <Stack.Screen name="kanji/compounds" />
        <Stack.Screen name="events" />
        <Stack.Screen name="settings" />
      </Stack>
    </StyledProvider>
  );
}
