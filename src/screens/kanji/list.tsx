import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { getN5KanjiList } from '@/server/kanji-db';

export default function KanjiListScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const kanjiList = useMemo(() => getN5KanjiList(), []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return kanjiList;
    }

    return kanjiList.filter((item) => {
      return (
        item.kanji.includes(normalized) ||
        item.readings.toLowerCase().includes(normalized) ||
        item.meaning.toLowerCase().includes(normalized)
      );
    });
  }, [kanjiList, query]);

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="gap-4 p-5">
      <View className="rounded-2xl bg-sakura-700 p-5">
        <Text className="text-2xl font-bold text-white">N5 Kanji List</Text>
        <Text className="mt-1 text-sm text-rose-100">
          Total {kanjiList.length} kanji
        </Text>
      </View>

      <View className="gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900">
        <Text className="text-sm font-semibold text-slate-900 dark:text-slate-100">Search kanji / reading / meaning</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. 山 / みず / နေ့"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:text-slate-100"
        />
        <View className="flex-row gap-3">
          <Pressable className="flex-1 rounded-xl border border-sakura-700 px-4 py-3" onPress={() => router.back()}>
            <Text className="text-center font-semibold text-sakura-700">Back</Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-xl bg-sakura-700 px-4 py-3"
            onPress={() => router.push('/kanji/compounds')}
          >
            <Text className="text-center font-semibold text-white">Kanji Compounds</Text>
          </Pressable>
        </View>
      </View>

      <View className="gap-3">
        {filtered.map((item) => (
          <Pressable
            key={item.id}
            className="rounded-2xl bg-white p-4 dark:bg-slate-900"
            onPress={() => router.push(`/kanji/${item.id}`)}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-14 w-14 items-center justify-center rounded-xl border border-emerald-700 bg-slate-950">
                <Text className="text-3xl text-white">{item.kanji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-slate-500 dark:text-slate-400">No. {item.index}</Text>
                <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.readings}</Text>
                <Text className="text-sm text-slate-700 dark:text-slate-300">{item.meaning}</Text>
              </View>
              <Text className="text-xl text-sakura-700">›</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
