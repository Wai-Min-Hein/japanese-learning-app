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

import { getN5KanjiList } from "@/server/kanji-db";

const SHOW_DETAILS_STORAGE_KEY = "kanji-list-show-details";

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

export default function KanjiListScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  const kanjiList = useMemo(() => getN5KanjiList(), []);

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
      return (
        item.kanji.includes(normalized) ||
        item.readings.toLowerCase().includes(normalized) ||
        item.meaning.toLowerCase().includes(normalized)
      );
    });
  }, [kanjiList, query]);

  return (
    <ScrollView
      className="flex-1 bg-slate-100 dark:bg-slate-950"
      contentContainerClassName="gap-4 p-5"
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        className="mt-6 w-32 flex-row items-center gap-2 rounded-full bg-white px-3 py-2 dark:bg-slate-900"
        onPress={() =>
          router.push({ pathname: "/", params: { step: "n5-categories" } })
        }
      >
        <Ionicons name="chevron-back" size={18} color="#b52049" />
        <Text className="text-sm font-semibold text-sakura-700">Back to N5</Text>
      </Pressable>

      <View className="rounded-2xl bg-sakura-700 p-5">
        <Text className="text-2xl font-bold text-white">N5 Kanji List</Text>
        <Text className="mt-1 text-sm text-rose-100">
          Total {kanjiList.length} kanji
        </Text>
      </View>

      <View className="gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="flex-1 text-base font-semibold text-slate-900 dark:text-slate-100">
            Search kanji / reading / meaning
          </Text>
          <Pressable
            className={`h-10 w-10 items-center justify-center rounded-full ${
              showDetails ? "bg-sakura-700" : "bg-slate-200 dark:bg-slate-800"
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
          placeholder="e.g. 山 / みず / နေ့"
          placeholderTextColor="#94a3b8"
          className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:text-slate-100"
        />
      </View>

      <View style={styles.grid}>
        {filtered.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => router.push(`/kanji/${item.id}`)}
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
                <Text style={styles.reading}>{item.readings}</Text>
                <Text style={styles.meaning}>{item.meaning}</Text>
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
    minHeight: 184,
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 16,
    backgroundColor: "#0f172a",
    padding: 12,
    paddingTop: 20,
  },
  indexLabel: {
    alignSelf: "flex-start",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
  },
  kanji: {
    marginTop: 4,
    color: "#f8fafc",
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 58,
  },
  kanjiOnly: {
    fontSize: 64,
    lineHeight: 76,
  },
  reading: {
    marginTop: 10,
    color: "#ff6d96",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  meaning: {
    marginTop: 8,
    color: "#cbd5e1",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
