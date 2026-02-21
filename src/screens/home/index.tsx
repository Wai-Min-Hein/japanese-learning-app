import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import BarChart from "@/components/bar-chart";
import { useAppState } from "@/hooks/use-app-state";
import { useVocabularyAudio } from "@/hooks/use-vocabulary-audio";
import { ChapterCard } from "@/screens/home/card";

export default function HomeScreen() {
  const { chapters, streakDays } = useAppState();
  const { isPlaying, playAllVocabulary, stop } = useVocabularyAudio();
  const router = useRouter();
  const [homeStep, setHomeStep] = useState<
    "levels" | "n5-categories" | "n5-chapters"
  >("levels");

  const n5Chapters = useMemo(() => chapters, [chapters]);
  const allVocab = useMemo(
    () => n5Chapters.flatMap((chapter) => chapter.vocabulary),
    [n5Chapters],
  );

  return (
    <ScrollView
      className="flex-1 bg-rose-50 dark:bg-slate-950"
      contentContainerClassName="gap-5 p-5"
    >
      <View className="rounded-2xl bg-sakura-700 p-5">
        <Text className="text-2xl font-bold text-white">
          ဂျပန်စာ Chapter Navigator
        </Text>
        <Text className="mt-1 text-sm text-rose-100">
          Burmese absolute beginners အတွက်
        </Text>
        <Text className="mt-3 text-sm font-semibold text-white">
          Streak: {streakDays} days
        </Text>
      </View>

      <BarChart values={[15, 30, 20, 40, 25, 10, 35]} />

      {homeStep === "levels" ? (
        <View className="gap-3">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Levels
          </Text>
          <Pressable
            className="rounded-2xl bg-sakura-700 px-4 py-4"
            onPress={() => setHomeStep("n5-categories")}
          >
            <Text className="text-base font-semibold text-white">N5</Text>
          </Pressable>
          <View className="rounded-2xl border border-slate-300 px-4 py-4 dark:border-slate-700">
            <Text className="text-base font-semibold text-slate-500 dark:text-slate-400">
              N4 (Unavilable)
            </Text>
          </View>
        </View>
      ) : null}

      {homeStep === "n5-categories" ? (
        <View className="gap-3">
          <Pressable onPress={() => setHomeStep("levels")}>
            <Text className="text-sm font-semibold text-sakura-700">
              ← Back
            </Text>
          </Pressable>
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            N5
          </Text>
          <Pressable
            className="rounded-2xl bg-sakura-700 px-4 py-4"
            onPress={() => setHomeStep("n5-chapters")}
          >
            <Text className="text-base font-semibold text-white">
              All Chapters
            </Text>
          </Pressable>
          <View className="rounded-2xl border border-slate-300 px-4 py-4 dark:border-slate-700">
            <Text className="text-base font-semibold text-slate-500 dark:text-slate-400">
              Kanji (Unavilable)
            </Text>
          </View>
        </View>
      ) : null}

      {homeStep === "n5-chapters" ? (
        <View className="gap-3">
          <Pressable onPress={() => setHomeStep("n5-categories")}>
            <Text className="text-sm font-semibold text-sakura-700">
              ← Back
            </Text>
          </Pressable>
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            N5 Chapters
          </Text>
          {n5Chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              onPress={() => router.push(`/chapter/${chapter.id}`)}
            />
          ))}

          <Pressable
            className="rounded-2xl bg-sakura-700 px-4 py-4"
            onPress={() => {
              if (isPlaying) {
                stop();
                return;
              }
              void playAllVocabulary(allVocab);
            }}
          >
            <Text className="text-center text-base font-semibold text-white">
              {isPlaying
                ? "Stop Global Vocabulary Audio"
                : "Play All Vocabulary (All Chapters)"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}
