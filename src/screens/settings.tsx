import { ScrollView, Text, View } from 'react-native';

import { GSCard } from '@/components/gs-card';
import { getGuestProfile } from '@/server/auth';

export default function SettingsScreen() {
  const profile = getGuestProfile();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-950" contentContainerClassName="gap-4 p-5">
      <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</Text>

      <GSCard>
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
            <Text className="text-base font-bold text-white">{profile.name.slice(0, 1)}</Text>
          </View>
          <View>
            <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">Guest Mode</Text>
            <Text className="text-sm text-slate-600 dark:text-slate-300">No auth required</Text>
          </View>
        </View>
      </GSCard>

      <GSCard>
        <Text className="text-sm text-slate-600 dark:text-slate-300">Native language</Text>
        <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">{profile.nativeLanguage}</Text>
      </GSCard>

      <GSCard>
        <Text className="text-sm text-slate-600 dark:text-slate-300">Current level</Text>
        <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">{profile.japaneseLevel}</Text>
      </GSCard>
    </ScrollView>
  );
}
