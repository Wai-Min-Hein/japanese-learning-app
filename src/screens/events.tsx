import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { SimpleTable } from '@/components/table';
import { useAppState } from '@/hooks/use-app-state';
import { formatDate } from '@/utils/format-date';

export default function EventsScreen() {
  const router = useRouter();
  const { events } = useAppState();

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="gap-4 p-5">
      <Pressable
        className="mt-6 self-start flex-row items-center gap-2 rounded-full bg-white px-3 py-2 dark:bg-slate-900"
        onPress={() => router.push('/')}
      >
        <Ionicons name="chevron-back" size={18} color="#b52049" />
        <Text className="text-sm font-semibold text-sakura-700">Back to Home</Text>
      </Pressable>

      <View>
        <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100">Practice Schedule</Text>
        <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">နေ့စဉ်လေ့ကျင့်ရန်အစီအစဉ်</Text>
      </View>

      <SimpleTable
        rows={events.map((event) => ({
          left: event.title,
          right: formatDate(event.dateISO),
        }))}
      />
    </ScrollView>
  );
}
