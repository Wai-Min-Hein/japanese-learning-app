import '../../global.css';

import { Stack } from 'expo-router';
import { StyledProvider } from '@gluestack-style/react';
import { config } from '@gluestack-ui/config';

export default function RootLayout() {
  return (
    <StyledProvider config={config}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="chapter/[id]" />
        <Stack.Screen name="events" />
        <Stack.Screen name="settings" />
      </Stack>
    </StyledProvider>
  );
}
