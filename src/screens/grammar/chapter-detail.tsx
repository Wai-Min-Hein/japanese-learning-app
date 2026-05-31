import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useVocabularyAudio } from "@/hooks/use-vocabulary-audio";
import { getGrammarChapterById } from "@/server/grammar-db";

export default function GrammarChapterDetailScreen() {
  const router = useRouter();
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const { playJapaneseText } = useVocabularyAudio();

  const chapter = useMemo(() => {
    const parsed = Number(chapterId ?? "");
    if (!Number.isFinite(parsed)) {
      return undefined;
    }
    return getGrammarChapterById(parsed);
  }, [chapterId]);

  if (!chapter) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 p-5 dark:bg-slate-950">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Grammar chapter not found
        </Text>
        <Pressable className="mt-3" onPress={() => router.push("/grammar")}>
          <Text className="font-semibold text-sakura-700">
            Grammar Chapters
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-100 dark:bg-slate-950"
      contentContainerClassName="gap-4 px-5 pb-5 pt-6"
    >
      <Pressable
        className="mt-6 self-start flex-row items-center gap-2 rounded-full bg-white px-3 py-2 dark:bg-slate-900"
        onPress={() => router.push("/grammar")}
      >
        <Ionicons name="chevron-back" size={18} color="#b52049" />
        <Text className="text-sm font-semibold text-sakura-700">Back to Grammar</Text>
      </Pressable>

      <View className="rounded-2xl bg-sakura-700 p-5">
        <Text className="text-2xl font-bold text-white">{chapter.title}</Text>
        <Text className="mt-1 text-sm text-rose-100">
          Grammar points: {chapter.points.length}
        </Text>
      </View>

      {chapter.points.length ? (
        chapter.points.map((point) => (
          <View
            key={point.id}
            className="gap-2 rounded-2xl bg-white p-4 dark:bg-slate-900"
          >
            <View className="rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/30">
              <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Grammar Pattern
              </Text>
              <Text className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
                {point.title}
              </Text>
            </View>
            <View className="rounded-lg bg-sky-50 px-3 py-2 dark:bg-sky-900/30">
              <Text className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
                Meaning / Note
              </Text>
              <Text className="text-sm leading-6 text-sky-900 dark:text-sky-100">
                {point.detailNote}
              </Text>
            </View>

            {point.usages.map((usage, index) => (
              <View
                key={`${point.id}-${index}`}
                className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-3 dark:bg-amber-900/20"
              >
                <Text className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  Usage
                </Text>
                <Text className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {usage.japanese}
                </Text>
                {usage.romaji ? (
                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                    {usage.romaji}
                  </Text>
                ) : null}
                <Text className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  {usage.burmese}
                </Text>
                <Pressable
                  className="mt-2 self-start rounded-md border border-sakura-700 px-3 py-1"
                  onPress={() => void playJapaneseText(usage.japanese)}
                >
                  <Text className="text-xs font-semibold text-sakura-700">
                    Play
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        ))
      ) : (
        <View className="rounded-2xl bg-white p-4 dark:bg-slate-900">
          <Text className="text-sm text-slate-700 dark:text-slate-300">
            No grammar points available for this chapter yet.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
