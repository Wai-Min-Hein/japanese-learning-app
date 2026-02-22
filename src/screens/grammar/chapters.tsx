import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { getGrammarChapters } from '@/server/grammar-db';

export default function GrammarChaptersScreen() {
  const router = useRouter();
  const chapters = useMemo(() => getGrammarChapters(), []);

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="gap-4 px-5 pb-5 pt-10">
      <Pressable className="self-start rounded-lg border border-sakura-700 px-4 py-2" onPress={() => router.back()}>
        <Text className="font-semibold text-sakura-700">← Back</Text>
      </Pressable>

      <View className="rounded-2xl bg-sakura-700 p-5">
        <Text className="text-2xl font-bold text-white">N5 Grammar Chapters</Text>
        <Text className="mt-1 text-sm text-rose-100">25 grammar chapters</Text>
      </View>

      <View className="gap-3">
        {chapters.map((chapter) => (
          <Pressable
            key={`grammar-ch-${chapter.chapterId}`}
            className="rounded-2xl bg-white p-4 dark:bg-slate-900"
            onPress={() => router.push(`/grammar/chapter/${chapter.chapterId}`)}
          >
            <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {chapter.title}
            </Text>
            <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Grammar points: {chapter.points.length}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
