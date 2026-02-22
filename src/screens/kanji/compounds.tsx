import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { getN5KanjiCompounds } from '@/server/kanji-db';

export default function KanjiCompoundsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const compounds = useMemo(() => getN5KanjiCompounds(), []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return compounds;
    }

    return compounds.filter((item) => {
      return (
        item.compound.includes(normalized) ||
        item.reading.toLowerCase().includes(normalized) ||
        item.meaning.toLowerCase().includes(normalized)
      );
    });
  }, [compounds, query]);

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="gap-4 p-5">
      <View className="rounded-2xl bg-sakura-700 p-5">
        <Text className="text-2xl font-bold text-white">Kanji Compounds</Text>
        <Text className="mt-1 text-sm text-rose-100">
          Sample usages({compounds.length} items)
        </Text>
      </View>

      <View className="gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900">
        <Text className="text-sm font-semibold text-slate-900 dark:text-slate-100">Search compound / reading / meaning</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. 日本 / にほん / ဂျပန်"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:text-slate-100"
        />
        <Pressable className="rounded-xl border border-sakura-700 px-4 py-3" onPress={() => router.back()}>
          <Text className="text-center font-semibold text-sakura-700">Back</Text>
        </Pressable>
      </View>

      <View className="gap-3">
        {filtered.map((item) => (
          <View key={item.id} className="rounded-2xl bg-white p-4 dark:bg-slate-900">
            <Text className="text-xl font-bold text-slate-900 dark:text-slate-100">{item.compound}</Text>
            <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.reading}</Text>
            <Text className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item.meaning}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
