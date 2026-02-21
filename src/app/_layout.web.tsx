import '../../global.css';

import { Stack } from 'expo-router';
import { StyledProvider } from '@gluestack-style/react';
import { config } from '@gluestack-ui/config';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RootLayoutWeb() {
  return (
    <StyledProvider config={config}>
      <StatusBar style="auto" />
      <View className="mx-auto w-full max-w-3xl bg-white dark:bg-slate-950">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="chapter/[id]" />
          <Stack.Screen name="events" />
          <Stack.Screen name="settings" />
        </Stack>
      </View>
    </StyledProvider>
  );
}
