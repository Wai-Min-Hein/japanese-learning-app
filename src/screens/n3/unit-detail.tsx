import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useVocabularyAudio } from '@/hooks/use-vocabulary-audio';
import { getN3UnitById } from '@/server/n3-units-db';

export default function N3UnitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const unit = useMemo(() => getN3UnitById(id ?? ''), [id]);
  const { isPlaying, playTextSequence, stop } = useVocabularyAudio();

  if (!unit) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 p-5 dark:bg-slate-950">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Unit not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="gap-4 px-5 pb-5 pt-10">
      <Pressable className="self-start rounded-lg border border-sakura-700 px-4 py-2" onPress={() => router.back()}>
        <Text className="font-semibold text-sakura-700">← Back</Text>
      </Pressable>

      <View className="rounded-2xl bg-white p-4 dark:bg-slate-900">
        <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100">{unit.title}</Text>
        <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">{unit.focus}</Text>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          className="flex-1 rounded-xl bg-sakura-700 px-4 py-3"
          onPress={() => {
            if (isPlaying) {
              stop();
              return;
            }
            const segments = unit.vocabulary.flatMap((item) => {
              const japaneseToPlay = item.hiragana?.trim() ? item.hiragana : item.japanese;
              return [{ text: japaneseToPlay, language: 'ja-JP', rate: 0.9 }];
            });
            void playTextSequence(segments);
          }}
        >
          <Text className="text-center font-semibold text-white">{isPlaying ? 'Stop Playing' : 'Play All Vocabulary'}</Text>
        </Pressable>
        <Pressable className="rounded-xl bg-slate-700 px-4 py-3 dark:bg-slate-600" onPress={stop}>
          <Text className="font-semibold text-white">Stop</Text>
        </Pressable>
      </View>

      <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Vocabulary</Text>
      {unit.vocabulary.map((item) => (
        <View key={item.id} className="gap-2 rounded-2xl bg-white p-4 dark:bg-slate-900">
          <Text className="text-xl font-bold text-slate-900 dark:text-slate-100">{item.japanese}</Text>
          {item.hiragana ? <Text className="text-sm text-slate-700 dark:text-slate-300">Hiragana: {item.hiragana}</Text> : null}
          <Text className="text-sm text-slate-700 dark:text-slate-300">Meaning: {item.meaning}</Text>

          <Pressable
            className="mt-1 rounded-lg border border-sakura-700 px-3 py-2"
            onPress={() =>
              void playTextSequence([
                { text: item.hiragana?.trim() ? item.hiragana : item.japanese, language: 'ja-JP', rate: 0.9 },
              ])
            }
          >
            <Text className="text-center font-semibold text-sakura-700">Play {item.japanese}</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}
