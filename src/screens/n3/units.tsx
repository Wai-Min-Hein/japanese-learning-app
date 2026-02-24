import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { getN3Units } from '@/server/n3-units-db';

export default function N3UnitsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const units = useMemo(() => getN3Units(), []);
  const allN3Vocab = useMemo(
    () =>
      units.flatMap((unit) =>
        unit.vocabulary.map((item) => ({
          ...item,
          source: unit.title,
        })),
      ),
    [units],
  );
  const filteredVocab = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allN3Vocab
      .filter(
        (item) =>
          item.japanese.toLowerCase().includes(q) ||
          item.hiragana.toLowerCase().includes(q) ||
          item.meaning.toLowerCase().includes(q),
      )
      .slice(0, 120);
  }, [query, allN3Vocab]);

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="gap-4 px-5 pb-5 pt-10">
      <Pressable className="self-start rounded-lg border border-sakura-700 px-4 py-2" onPress={() => router.back()}>
        <Text className="font-semibold text-sakura-700">← Back</Text>
      </Pressable>

      <View className="rounded-2xl bg-sakura-700 p-5">
        <Text className="text-2xl font-bold text-white">N3 All Units</Text>
        <Text className="mt-1 text-sm text-rose-100">Total {units.length} units</Text>
      </View>

      <View className="gap-2 rounded-2xl border border-blue-700 bg-white p-4 dark:bg-slate-900">
        <Text className="text-sm font-semibold text-blue-700">N3 Vocab Search</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by kanji / hiragana / burmese"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:text-slate-100"
        />
        {filteredVocab.map((item) => (
          <View key={item.id} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <Text className="text-xs font-semibold text-emerald-700">{item.source}</Text>
            <Text className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.japanese}</Text>
            <Text className="text-xs text-slate-600 dark:text-slate-300">{item.hiragana}</Text>
            <Text className="text-xs text-slate-700 dark:text-slate-200">{item.meaning}</Text>
          </View>
        ))}
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
