import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { getN3KanjiList } from "@/server/n3-kanji-db";

const SHOW_DETAILS_STORAGE_KEY = "n3-kanji-list-show-details";

function readStoredShowDetails() {
  try {
    const stored = globalThis.localStorage?.getItem(SHOW_DETAILS_STORAGE_KEY);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
}

function writeStoredShowDetails(value: boolean) {
  try {
    globalThis.localStorage?.setItem(SHOW_DETAILS_STORAGE_KEY, String(value));
  } catch {
    // Native runtimes may not expose localStorage.
  }
}

export default function N3KanjiListScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  const kanjiList = useMemo(() => getN3KanjiList(), []);

  useEffect(() => {
    setShowDetails(readStoredShowDetails());
  }, []);

  const toggleShowDetails = () => {
    setShowDetails((current) => {
      const next = !current;
      writeStoredShowDetails(next);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return kanjiList;
    }

    return kanjiList.filter((item) => {
      const meanings = item.meanings.join(" ").toLowerCase();
      const vocab = item.vocab
        .map((entry) => `${entry.word} ${entry.reading} ${entry.meaning}`)
        .join(" ")
        .toLowerCase();

      return (
        item.kanji.includes(normalized) ||
        item.onyomi.toLowerCase().includes(normalized) ||
        item.kunyomi.toLowerCase().includes(normalized) ||
        meanings.includes(normalized) ||
        vocab.includes(normalized)
      );
    });
  }, [kanjiList, query]);

  const handleBackToN3 = () => {
    router.replace({
      pathname: "/",
      params: { step: "n3-categories" },
    } as never);
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-100 dark:bg-slate-950"
      contentContainerClassName="gap-4 p-5"
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        className="mt-6 w-32 flex-row items-center gap-2 rounded-full bg-white px-3 py-2 dark:bg-slate-900"
        onPress={handleBackToN3}
      >
        <Ionicons name="chevron-back" size={18} color="#047857" />
        <Text className="text-sm font-semibold text-emerald-700">
          Back to N3
        </Text>
      </Pressable>

      <View className="rounded-2xl bg-emerald-700 p-5">
        <Text className="text-2xl font-bold text-white">N3 Kanji List</Text>
        <Text className="mt-1 text-sm text-emerald-100">
          Total {kanjiList.length} kanji
        </Text>
      </View>

      <View className="gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Search kanji / reading / meaning / vocab
          </Text>
          <Pressable
            className={`h-10 w-10 items-center justify-center rounded-full ${
              showDetails ? "bg-emerald-700" : "bg-slate-200 dark:bg-slate-800"
            }`}
            onPress={toggleShowDetails}
          >
            <Ionicons
              name={showDetails ? "eye" : "eye-off"}
              size={20}
              color={showDetails ? "#fff" : "#94a3b8"}
            />
          </Pressable>
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. 愛 / アイ / love"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:text-slate-100"
        />
      </View>

      <View style={styles.grid}>
        {filtered.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/n3/kanji/[id]",
                params: { id: item.id },
              } as any)
            }
          >
            <Text style={styles.indexLabel}>No. {item.index}</Text>
            <Text
              style={[styles.kanji, showDetails ? null : styles.kanjiOnly]}
              adjustsFontSizeToFit
            >
              {item.kanji}
            </Text>
            {showDetails ? (
              <>
                <Text style={styles.reading}>
                  {[item.onyomi, item.kunyomi].filter(Boolean).join(" / ")}
                </Text>
                <Text style={styles.meaning}>
                  {item.meanings.slice(0, 3).join(", ")}
                </Text>
              </>
            ) : null}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  card: {
    width: "48%",
    minHeight: 176,
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#134e4a",
    borderRadius: 16,
    backgroundColor: "#0f172a",
    padding: 12,
    paddingTop: 20,
  },
  indexLabel: {
    alignSelf: "flex-start",
    color: "#99f6e4",
    fontSize: 12,
    fontWeight: "700",
  },
  kanji: {
    marginTop: 4,
    color: "#f8fafc",
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 52,
  },
  kanjiOnly: {
    fontSize: 56,
    lineHeight: 68,
  },
  reading: {
    marginTop: 10,
    color: "#5eead4",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  meaning: {
    marginTop: 8,
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
