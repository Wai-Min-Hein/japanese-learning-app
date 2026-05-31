import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { GSCard } from '@/components/gs-card';
import { getGuestProfile } from '@/server/auth';

export default function SettingsScreen() {
  const router = useRouter();
  const profile = getGuestProfile();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-950" contentContainerClassName="gap-4 p-5">
      <Pressable
        className="mt-6 self-start flex-row items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-900"
        onPress={() => router.push('/')}
      >
        <Ionicons name="chevron-back" size={18} color="#b52049" />
        <Text className="text-sm font-semibold text-sakura-700">Back to Home</Text>
      </Pressable>

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
