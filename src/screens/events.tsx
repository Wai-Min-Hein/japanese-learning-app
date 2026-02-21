import { ScrollView, Text, View } from 'react-native';

import { SimpleTable } from '@/components/table';
import { useAppState } from '@/hooks/use-app-state';
import { formatDate } from '@/utils/format-date';

export default function EventsScreen() {
  const { events } = useAppState();

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="gap-4 p-5">
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
