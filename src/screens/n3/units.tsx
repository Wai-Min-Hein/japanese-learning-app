import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { useVocabularyAudio } from "@/hooks/use-vocabulary-audio";
import { getN3Units } from "@/server/n3-units-db";

export default function N3UnitsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const units = useMemo(
    () => [...getN3Units()].sort((a, b) => a.unitNumber - b.unitNumber),
    [],
  );
  const { isPlaying, playTextSequence, stop } = useVocabularyAudio();
  const allN3SegmentsFromGenerated = useMemo(
    () =>
      units
        .sort((a, b) => a.unitNumber - b.unitNumber)
        .flatMap((unit) =>
          unit.vocabulary.map((item) => ({
            text:
              (item.hiragana?.trim()
                ? item.hiragana
                : item.japanese) ?? "",
            language: "ja-JP" as const,
            rate: 0.9,
          })),
        ),
    [units],
  );
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
    <ScrollView
      className="flex-1 bg-slate-100 dark:bg-slate-950"
      contentContainerClassName="gap-4 px-5 pb-5 pt-6"
    >
      <Pressable
        className="mt-6 self-start flex-row items-center gap-2 rounded-full bg-white px-3 py-2 dark:bg-slate-900"
        onPress={() =>
          router.push({ pathname: "/", params: { step: "n3-categories" } })
        }
      >
        <Ionicons name="chevron-back" size={18} color="#b52049" />
        <Text className="text-sm font-semibold text-sakura-700">Back to N3</Text>
      </Pressable>

      <View className="rounded-2xl bg-sakura-700 p-5">
        <Text className="text-2xl font-bold text-white">N3 All Units</Text>
        <Text className="mt-1 text-sm text-rose-100">
          Total {units.length} units
        </Text>
      </View>

      <View className="gap-2 rounded-2xl border border-sakura-700 bg-white p-4 dark:bg-slate-900">
        <Text className="text-base font-semibold text-sakura-700">
          N3 Vocab Search
        </Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by kanji / hiragana / burmese"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:text-slate-100"
        />
        {filteredVocab.map((item) => (
          <View
            key={item.id}
            className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800"
          >
            <Text className="text-sm font-semibold text-sakura-700">
              {item.source}
            </Text>
            <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {item.japanese}
            </Text>
            <Text className="text-base text-slate-600 dark:text-slate-300">
              {item.hiragana}
            </Text>
            <Text className="text-base text-slate-700 dark:text-slate-200">
              {item.meaning}
            </Text>
          </View>
        ))}
      </View>

      <View className="gap-3">
        {units.map((unit) => (
          <Pressable
            key={unit.id}
            className="rounded-2xl border border-sakura-700 bg-white p-4 dark:bg-slate-900"
            onPress={() =>
              router.push({
                pathname: "/n3/unit/[id]",
                params: { id: unit.id },
              } as any)
            }
          >
            <Text className="text-lg font-semibold text-sakura-700">
              {unit.title}
            </Text>
            <Text className="mt-1 text-base text-slate-700 dark:text-slate-300">
              {unit.focus}
            </Text>
            <Text className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Vocabulary: {unit.vocabulary.length}
            </Text>
          </Pressable>
        ))}
      </View>
      <View className="flex-row gap-3">
        <Pressable
          className="flex-1 rounded-2xl bg-sakura-700 px-4 py-4"
          onPress={() => {
            if (isPlaying) {
              stop();
              return;
            }
            void playTextSequence(allN3SegmentsFromGenerated);
          }}
        >
          <Text className="text-center text-base font-semibold text-white">
            {isPlaying
              ? "Stop Global Vocabulary Audio"
              : "Play All Vocabulary (All Units)"}
          </Text>
        </Pressable>
        <Pressable
          className="rounded-2xl bg-slate-700 px-4 py-4 dark:bg-slate-600"
          onPress={stop}
        >
          <Text className="font-semibold text-white">Stop</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
