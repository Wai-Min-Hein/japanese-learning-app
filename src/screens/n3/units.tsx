import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { getN3Units } from '@/server/n3-units-db';

export default function N3UnitsScreen() {
  const router = useRouter();
  const units = useMemo(() => getN3Units(), []);

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="gap-4 px-5 pb-5 pt-10">
      <Pressable className="self-start rounded-lg border border-sakura-700 px-4 py-2" onPress={() => router.back()}>
        <Text className="font-semibold text-sakura-700">← Back</Text>
      </Pressable>

      <View className="rounded-2xl bg-sakura-700 p-5">
        <Text className="text-2xl font-bold text-white">N3 All Units</Text>
        <Text className="mt-1 text-sm text-rose-100">Total {units.length} units</Text>
      </View>

      <View className="gap-3">
        {units.map((unit) => (
          <Pressable
            key={unit.id}
            className="rounded-2xl bg-white p-4 dark:bg-slate-900"
            onPress={() =>
              router.push({
                pathname: '/n3/unit/[id]',
                params: { id: unit.id },
              } as any)
            }
          >
            <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">{unit.title}</Text>
            <Text className="mt-1 text-sm text-slate-700 dark:text-slate-300">{unit.focus}</Text>
            <Text className="mt-2 text-xs text-slate-500 dark:text-slate-400">Vocabulary: {unit.vocabulary.length}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
