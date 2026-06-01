import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { KanjiStrokeOrderGrid } from "@/components/kanji-stroke-order-grid";
import { getN3KanjiById } from "@/server/n3-kanji-db";

export default function N3KanjiDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const kanji = useMemo(() => getN3KanjiById(id ?? ""), [id]);
  const handleBackToKanji = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/n3/kanji" as never);
  };

  if (!kanji) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 p-5 dark:bg-slate-950">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Kanji not found
        </Text>
        <Pressable className="mt-3" onPress={() => router.replace("/n3/kanji" as never)}>
          <Text className="font-semibold text-sakura-700">N3 Kanji List</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-100 dark:bg-slate-950"
      contentContainerClassName="gap-4 p-5"
    >
      <Pressable
        className="mt-6 w-40 flex-row items-center gap-2 rounded-full bg-white px-3 py-2 dark:bg-slate-900"
        onPress={handleBackToKanji}
      >
        <Ionicons name="chevron-back" size={18} color="#b52049" />
        <Text className="text-sm font-semibold text-sakura-700">
          Back to N3 Kanji
        </Text>
      </Pressable>

      <View className="rounded-2xl bg-slate-950 p-5">
        <Text className="text-sm text-rose-300">
          N3 Kanji No. {kanji.index}
        </Text>
        <Text className="mt-1 text-7xl text-white">{kanji.kanji}</Text>
        <View className="mt-3 gap-2">
          <ReadingLine label="Onyomi" value={kanji.onyomi} />
          <ReadingLine label="Kunyomi" value={kanji.kunyomi} />
        </View>
        <Text className="mt-3 text-sm text-slate-300">
          {kanji.meanings.join(", ")}
        </Text>
      </View>

      <View className="gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Stroke Order
        </Text>
        <KanjiStrokeOrderGrid kanji={kanji.kanji} />
      </View>

      <View className="gap-2 rounded-2xl bg-white p-4 dark:bg-slate-900">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Vocab using {kanji.kanji}
        </Text>
        {kanji.vocab.length ? (
          kanji.vocab.map((entry, index) => (
            <View
              key={`${entry.word}-${entry.reading}-${index}`}
              className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"
            >
              <Text className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {entry.word}
              </Text>
              <Text className="text-sm text-slate-600 dark:text-slate-300">
                {entry.reading}
              </Text>
              <Text className="text-sm text-slate-700 dark:text-slate-200">
                {entry.meaning}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-sm text-slate-600 dark:text-slate-300">
            No vocab found in your source file.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

function ReadingLine({ label, value }: { label: string; value: string }) {
  if (!value) {
    return null;
  }

  return (
    <View>
      <Text className="text-xs font-semibold uppercase text-rose-300">
        {label}
      </Text>
      <Text className="text-base font-semibold text-slate-100">{value}</Text>
    </View>
  );
}
