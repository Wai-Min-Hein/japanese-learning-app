import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { KanjiStrokeOrderGrid } from "@/components/kanji-stroke-order-grid";
import { getN5KanjiById } from "@/server/kanji-db";

export default function KanjiDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const kanji = useMemo(() => getN5KanjiById(id ?? ""), [id]);

  if (!kanji) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 p-5 dark:bg-slate-950">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Kanji not found
        </Text>
        <Pressable className="mt-3" onPress={() => router.push("/kanji")}>
          <Text className="font-semibold text-sakura-700">Kanji List</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-100 dark:bg-slate-950"
      contentContainerClassName="gap-4 p-5"
    >
      <View className="flex-row flex-wrap items-center gap-1 pt-6">
        <Pressable onPress={() => router.push("/")}>
          <Text className="text-base font-semibold text-sakura-700">Home</Text>
        </Pressable>
        <Text className="text-base text-slate-500">›</Text>
        <Pressable onPress={() => router.push("/kanji")}>
          <Text className="text-base font-semibold text-sakura-700">Kanji</Text>
        </Pressable>
        <Text className="text-base text-slate-500">›</Text>
        <Text className="text-base font-semibold text-slate-700 dark:text-slate-300">
          {kanji.kanji}
        </Text>
      </View>

      <View className="rounded-2xl bg-slate-950 p-5">
        <Text className="text-sm text-emerald-300">
          N5 Kanji No. {kanji.index}
        </Text>
        <Text className="mt-1 text-7xl text-white">{kanji.kanji}</Text>
        <Text className="mt-2 text-base font-semibold text-slate-100">
          {kanji.readings}
        </Text>
        <Text className="mt-1 text-sm text-slate-300">{kanji.meaning}</Text>
      </View>

      <View className="gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Stroke Order
        </Text>
        <KanjiStrokeOrderGrid kanji={kanji.kanji} />
      </View>

      <View className="gap-2 rounded-2xl bg-white p-4 dark:bg-slate-900">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Compounds using {kanji.kanji}
        </Text>
        {kanji.compounds.length ? (
          kanji.compounds.map((entry) => (
            <View
              key={entry.id}
              className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"
            >
              <Text className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {entry.compound}
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
            No compounds found in your source file.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
