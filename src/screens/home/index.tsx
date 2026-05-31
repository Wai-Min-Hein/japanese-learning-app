import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

import { useAppState } from "@/hooks/use-app-state";
import { useVocabularyAudio } from "@/hooks/use-vocabulary-audio";
import { ChapterCard } from "@/screens/home/card";
import { getN3Units } from "@/server/n3-units-db";

type HomeStep = "levels" | "n5-categories" | "n5-chapters" | "n3-categories";
type IconName = keyof typeof Ionicons.glyphMap;

export default function HomeScreen() {
  const { chapters } = useAppState();
  const { isPlaying, playAllVocabulary, stop } = useVocabularyAudio();
  const router = useRouter();
  const { step } = useLocalSearchParams<{ step?: string }>();
  const [allLevelsQuery, setAllLevelsQuery] = useState("");
  const [n5Query, setN5Query] = useState("");
  const [homeStep, setHomeStep] = useState<HomeStep>("levels");

  const n5Chapters = useMemo(() => chapters, [chapters]);
  const n3Units = useMemo(() => getN3Units(), []);

  useEffect(() => {
    if (
      step === "levels" ||
      step === "n5-categories" ||
      step === "n5-chapters" ||
      step === "n3-categories"
    ) {
      setHomeStep(step);
    }
  }, [step]);
  const n5VocabItems = useMemo(
    () =>
      n5Chapters.flatMap((chapter) =>
        chapter.vocabulary.map((item) => ({
          ...item,
          source: chapter.title,
        })),
      ),
    [n5Chapters],
  );
  const allVocab = useMemo(
    () =>
      n5Chapters
        .filter((chapter) => chapter.id !== "chapter-0")
        .flatMap((chapter) => chapter.vocabulary),
    [n5Chapters],
  );
  const allLevelsVocab = useMemo(
    () => [
      ...n5Chapters.flatMap((chapter) =>
        chapter.vocabulary.map((item) => ({
          ...item,
          level: "N5",
          source: chapter.title,
        })),
      ),
      ...n3Units.flatMap((unit) =>
        unit.vocabulary.map((item) => ({
          ...item,
          level: "N3",
          source: unit.title,
        })),
      ),
    ],
    [n5Chapters, n3Units],
  );
  const filteredAllLevels = useMemo(() => {
    const q = allLevelsQuery.trim().toLowerCase();
    if (!q) return [];
    return allLevelsVocab
      .filter(
        (item) =>
          item.japanese.toLowerCase().includes(q) ||
          item.hiragana.toLowerCase().includes(q) ||
          item.meaning.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [allLevelsQuery, allLevelsVocab]);
  const filteredN5Vocab = useMemo(() => {
    const q = n5Query.trim().toLowerCase();
    if (!q) return [];
    return n5VocabItems
      .filter(
        (item) =>
          item.japanese.toLowerCase().includes(q) ||
          item.hiragana.toLowerCase().includes(q) ||
          item.meaning.toLowerCase().includes(q),
      )
      .slice(0, 80);
  }, [n5Query, n5VocabItems]);

  const handleQuickVocabulary = () => {
    if (homeStep === "levels") {
      setHomeStep("n5-chapters");
      return;
    }
    if (isPlaying) {
      stop();
      return;
    }
    void playAllVocabulary(allVocab);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {homeStep === "levels" ? (
          <>
            <HeroHeader />
            <SearchPanel
              value={allLevelsQuery}
              onChangeText={setAllLevelsQuery}
              results={filteredAllLevels}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Study Levels</Text>
              <Text style={styles.sectionSubtitle}>
                Choose your level and start learning
              </Text>
            </View>

            <View style={styles.levelStack}>
              <LevelCard
                level="N5"
                title="Beginner"
                description="Start your Japanese journey here."
                accent="pink"
                onPress={() => setHomeStep("n5-categories")}
              />
              <LevelCard
                level="N4"
                title="Elementary"
                description="Keep building your vocabulary and skills."
                accent="blue"
                locked
              />
              <LevelCard
                level="N3"
                title="Intermediate"
                description="Take your Japanese to the next level."
                accent="green"
                onPress={() => setHomeStep("n3-categories")}
              />
            </View>

          </>
        ) : null}

        {homeStep === "n5-categories" ? (
          <View style={styles.innerPage}>
            <BackButton label="Back to Home" onPress={() => setHomeStep("levels")} />
            <Text style={styles.pageTitle}>N5 Beginner</Text>
            <Text style={styles.pageSubtitle}>
              Pick a study path for vocabulary, kanji, or grammar.
            </Text>
            <MenuCard
              title="All Chapters"
              subtitle="Vocabulary and textbook lessons"
              icon="library"
              onPress={() => setHomeStep("n5-chapters")}
            />
            <MenuCard
              title="Kanji"
              subtitle="Characters, readings, and stroke order"
              icon="translate"
              onPress={() => router.push("/kanji")}
            />
            <MenuCard
              title="Grammar"
              subtitle="Patterns and examples"
              icon="text-box-outline"
              onPress={() => router.push("/grammar")}
            />
          </View>
        ) : null}

        {homeStep === "n5-chapters" ? (
          <View style={styles.innerPage}>
            <BackButton label="Back to N5" onPress={() => setHomeStep("n5-categories")} />
            <Text style={styles.pageTitle}>N5 Chapters</Text>
            <View style={styles.compactSearch}>
              <Ionicons name="search" size={18} color="#dbe6ff" />
              <TextInput
                value={n5Query}
                onChangeText={setN5Query}
                placeholder="Search N5 vocabulary"
                placeholderTextColor="#90a0bd"
                style={styles.searchInput}
              />
            </View>
            {filteredN5Vocab.map((item) => (
              <VocabResult key={item.id} item={item} />
            ))}
            {n5Chapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                onPress={() => router.push(`/chapter/${chapter.id}`)}
              />
            ))}
            <Pressable style={styles.audioButton} onPress={handleQuickVocabulary}>
              <Ionicons
                name={isPlaying ? "stop" : "volume-high"}
                size={18}
                color="#fff"
              />
              <Text style={styles.audioButtonText}>
                {isPlaying ? "Stop Vocabulary Audio" : "Play All Vocabulary"}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {homeStep === "n3-categories" ? (
          <View style={styles.innerPage}>
            <BackButton label="Back to Home" onPress={() => setHomeStep("levels")} />
            <Text style={styles.pageTitle}>N3 Intermediate</Text>
            <Text style={styles.pageSubtitle}>
              Continue with N3 units and advanced vocabulary.
            </Text>
            <MenuCard
              title="All Units"
              subtitle="N3 vocabulary grouped by unit"
              icon="layers"
              onPress={() => router.push("/n3" as never)}
            />
          </View>
        ) : null}
      </ScrollView>

      <BottomNav
        onHome={() => setHomeStep("levels")}
        onLearn={() => setHomeStep("levels")}
        onSaved={() => undefined}
        onProgress={() => undefined}
        onProfile={() => undefined}
      />
    </SafeAreaView>
  );
}

function HeroHeader() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroCopy}>
        <Text style={styles.greeting}>こんにちは! 👋</Text>
        <Text style={styles.heroTitle}>Japanese</Text>
        <Text style={styles.heroSubtitle}>For Burmese Learners</Text>
      </View>
      <View style={styles.heroArt}>
        <JapanScene />
      </View>
    </View>
  );
}

function SearchPanel({
  value,
  onChangeText,
  results,
}: {
  value: string;
  onChangeText: (text: string) => void;
  results: {
    id: string;
    japanese: string;
    hiragana: string;
    meaning: string;
    level: string;
    source: string;
  }[];
}) {
  return (
    <View style={styles.searchBlock}>
      <View style={styles.searchShell}>
        <View style={styles.searchIconBubble}>
          <Ionicons name="search" size={22} color="#eaf0ff" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search by kanji, hiragana or burmese..."
          placeholderTextColor="#93a1b8"
          style={styles.searchInput}
        />
        {/* <Pressable style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable> */}
      </View>
      {results.length ? (
        <View style={styles.resultsPanel}>
          {results.map((item) => (
            <VocabResult key={`${item.level}-${item.id}`} item={item} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function VocabResult({
  item,
}: {
  item: {
    japanese: string;
    hiragana: string;
    meaning: string;
    level?: string;
    source: string;
  };
}) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultMeta}>
        {item.level ? `${item.level} · ` : ""}
        {item.source}
      </Text>
      <Text style={styles.resultJapanese}>{item.japanese}</Text>
      <Text style={styles.resultText}>{item.hiragana}</Text>
      <Text style={styles.resultText}>{item.meaning}</Text>
    </View>
  );
}

function LevelCard({
  level,
  title,
  description,
  accent,
  locked,
  onPress,
}: {
  level: string;
  title: string;
  description: string;
  accent: "pink" | "blue" | "green";
  locked?: boolean;
  onPress?: () => void;
}) {
  const palette = levelPalettes[accent];
  return (
    <Pressable
      disabled={locked && !onPress}
      onPress={onPress}
      style={[
        styles.levelCard,
        { backgroundColor: palette.background, borderColor: palette.border },
      ]}
    >
      <View style={styles.levelCopy}>
        <Text style={styles.levelLabel}>{level}</Text>
        <Text style={styles.levelTitle}>{title}</Text>
        <Text style={styles.levelDescription}>{description}</Text>
      </View>
      <LevelArtwork accent={accent} />
      <View
        style={[
          styles.levelAction,
          { backgroundColor: locked ? palette.lockBubble : "#ffffff" },
        ]}
      >
        <Ionicons
          name={locked ? "lock-closed" : "arrow-forward"}
          size={24}
          color={locked ? "#dbe8ff" : "#d73564"}
        />
      </View>
    </Pressable>
  );
}

function MenuCard({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuCard} onPress={onPress}>
      <View style={styles.menuIcon}>
        <MaterialCommunityIcons name={icon} size={24} color="#ff6d96" />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9fafcf" />
    </Pressable>
  );
}

function BackButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.backButton} onPress={onPress}>
      <Ionicons name="chevron-back" size={18} color="#ff6d96" />
      <Text style={styles.backButtonText}>{label}</Text>
    </Pressable>
  );
}

function BottomNav({
  onHome,
  onSaved,
  onLearn,
  onProgress,
  onProfile,
}: {
  onHome: () => void;
  onSaved: () => void;
  onLearn: () => void;
  onProgress: () => void;
  onProfile: () => void;
}) {
  return (
    <View style={styles.bottomNav}>
      <NavItem label="Home" icon="home" active onPress={onHome} />
      <NavItem label="Saved" icon="bookmark" onPress={onSaved} />
      <Pressable style={styles.learnButton} onPress={onLearn}>
        <Ionicons name="book-outline" size={25} color="#fff" />
      </Pressable>
      <NavItem label="Progress" icon="bar-chart" onPress={onProgress} />
      <NavItem label="Profile" icon="person-circle" onPress={onProfile} />
    </View>
  );
}

function NavItem({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: IconName;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color={active ? "#ff5f8d" : "#a9b7d0"} />
      <Text style={[styles.navLabel, active ? styles.navLabelActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function JapanScene() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 260 180">
      <Defs>
        <LinearGradient id="mountain" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#785b8f" />
          <Stop offset="1" stopColor="#1b2849" />
        </LinearGradient>
        <LinearGradient id="sakura" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ff8aaa" />
          <Stop offset="1" stopColor="#d74a72" />
        </LinearGradient>
      </Defs>
      <Path d="M30 160 C85 120 105 92 138 150 Z" fill="url(#mountain)" />
      <Path d="M108 132 L122 96 L139 137 Z" fill="#f7b5bd" />
      <Path d="M122 96 L132 138 L149 139 Z" fill="#51436f" opacity="0.75" />
      <Path d="M148 155 C182 105 199 92 240 154 Z" fill="url(#mountain)" />
      <Path d="M185 129 L203 92 L222 134 Z" fill="#f2a2b0" />
      <Path d="M202 92 L213 135 L230 139 Z" fill="#4a3a68" opacity="0.72" />
      <Circle cx="226" cy="22" r="19" fill="#ffd1cb" />

      <G transform="translate(142 46)">
        <Path
          d="M0 0 C56 16 118 8 155 -7 L151 5 C105 25 48 22 4 11 Z"
          fill="#2b244d"
        />
        <Path
          d="M14 16 C62 25 115 19 143 4 L138 18 C94 34 50 34 20 27 Z"
          fill="#ff4d75"
        />
        <Rect x="45" y="36" width="15" height="82" rx="2" fill="#eb496d" />
        <Rect x="116" y="29" width="15" height="88" rx="2" fill="#eb496d" />
        <Rect x="33" y="46" width="115" height="14" rx="2" fill="#ff6686" />
        <Rect x="41" y="70" width="103" height="10" rx="2" fill="#e23e65" />
        <Rect x="41" y="60" width="12" height="13" fill="#d33a60" />
        <Rect x="119" y="55" width="12" height="18" fill="#d33a60" />
      </G>

      <G transform="translate(42 86)">
        <Path
          d="M25 73 C36 40 45 26 43 4 M42 24 C18 23 10 44 3 66 M45 29 C66 29 71 45 82 66"
          stroke="#4b233a"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {[
          [16, 20],
          [32, 8],
          [50, 12],
          [66, 28],
          [10, 42],
          [30, 34],
          [52, 42],
          [74, 52],
        ].map(([cx, cy]) => (
          <Flower key={`${cx}-${cy}`} cx={cx} cy={cy} />
        ))}
      </G>
    </Svg>
  );
}

function Flower({ cx, cy }: { cx: number; cy: number }) {
  return (
    <G>
      <Circle cx={cx} cy={cy - 6} r="6" fill="#ff7895" />
      <Circle cx={cx + 6} cy={cy} r="6" fill="#ff7895" />
      <Circle cx={cx} cy={cy + 6} r="6" fill="#ff7895" />
      <Circle cx={cx - 6} cy={cy} r="6" fill="#ff7895" />
      <Circle cx={cx} cy={cy} r="4" fill="#ffd0d6" />
    </G>
  );
}

function LevelArtwork({ accent }: { accent: "pink" | "blue" | "green" }) {
  if (accent === "pink") {
    return (
      <Svg style={styles.cardArt} viewBox="0 0 220 130">
        <Defs>
          <LinearGradient id="cardMountain" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffb2bc" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#7a244c" stopOpacity="0.3" />
          </LinearGradient>
        </Defs>
        <Path d="M40 128 C82 70 102 42 130 128 Z" fill="url(#cardMountain)" />
        <Path d="M91 74 L108 42 L126 80 Z" fill="#ffd5db" opacity="0.85" />
        <Path
          d="M132 128 C145 90 154 74 153 45 M152 70 C130 72 125 88 120 112 M155 75 C175 75 181 92 190 112"
          stroke="#7a244c"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <Flower cx={139} cy={78} />
        <Flower cx={161} cy={80} />
        <Flower cx={176} cy={97} />
        <Path
          d="M192 52 C208 50 214 39 219 30 C218 48 206 58 192 52 Z"
          fill="#ffdce3"
          opacity="0.9"
        />
      </Svg>
    );
  }

  return (
    <Svg style={styles.cardArt} viewBox="0 0 220 130">
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <Path
            key={`${row}-${col}`}
            d={`M${36 + col * 54} ${115 - row * 18} C${
              50 + col * 54
            } ${88 - row * 18} ${76 + col * 54} ${88 - row * 18} ${
              92 + col * 54
            } ${115 - row * 18}`}
            stroke={accent === "blue" ? "#6d94ee" : "#4cc4ac"}
            strokeWidth="6"
            fill="none"
            opacity="0.18"
          />
        )),
      )}
    </Svg>
  );
}

const levelPalettes = {
  pink: {
    background: "#e94174",
    border: "#ff6d96",
    lockBubble: "#f66a94",
  },
  blue: {
    background: "#0b3a8e",
    border: "#2569cf",
    lockBubble: "#315ca9",
  },
  green: {
    background: "#0c5b52",
    border: "#1fa182",
    lockBubble: "#267468",
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#031934",
  },
  screen: {
    flex: 1,
    backgroundColor: "#031934",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 108,
    gap: 14,
  },
  hero: {
    minHeight: 168,
    flexDirection: "row",
    alignItems: "center",
  },
  heroCopy: {
    flex: 1,
    zIndex: 2,
  },
  greeting: {
    color: "#ff8ea8",
    fontSize: 20,
    fontWeight: "800",
  },
  heroTitle: {
    marginTop: 8,
    color: "#fff",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0,
  },
  heroSubtitle: {
    marginTop: 4,
    color: "#ff7798",
    fontSize: 18,
    fontWeight: "800",
  },
  heroArt: {
    position: "absolute",
    right: -16,
    top: 8,
    width: "50%",
    height: 142,
  },
  searchBlock: {
    gap: 10,
  },
  searchShell: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "rgba(170, 194, 235, 0.22)",
    borderRadius: 18,
    backgroundColor: "rgba(32, 55, 91, 0.78)",
    paddingHorizontal: 12,
  },
  searchIconBubble: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(59, 86, 138, 0.55)",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: "#f4f7ff",
    fontSize: 14,
    fontWeight: "600",
  },
  searchButton: {
    minWidth: 82,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#f25079",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  resultsPanel: {
    gap: 8,
  },
  resultRow: {
    borderWidth: 1,
    borderColor: "rgba(148, 176, 220, 0.18)",
    borderRadius: 12,
    backgroundColor: "rgba(18, 38, 70, 0.92)",
    padding: 10,
  },
  resultMeta: {
    color: "#74ddb9",
    fontSize: 12,
    fontWeight: "800",
  },
  resultJapanese: {
    marginTop: 4,
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  resultText: {
    marginTop: 2,
    color: "#c6d3ea",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeader: {
    marginTop: 6,
    gap: 4,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "900",
  },
  sectionSubtitle: {
    color: "#aab6ca",
    fontSize: 14,
    fontWeight: "600",
  },
  levelStack: {
    gap: 12,
  },
  levelCard: {
    minHeight: 112,
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  levelCopy: {
    width: "48%",
    zIndex: 2,
  },
  levelLabel: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
  },
  levelTitle: {
    marginTop: 2,
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
  levelDescription: {
    marginTop: 4,
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  levelAction: {
    position: "absolute",
    right: 22,
    top: 36,
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
  },
  cardArt: {
    position: "absolute",
    right: 34,
    bottom: 0,
    width: "56%",
    height: "100%",
  },
  innerPage: {
    gap: 14,
    paddingTop: 8,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 109, 150, 0.28)",
    borderRadius: 999,
    backgroundColor: "rgba(25, 48, 82, 0.92)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#ff6d96",
    fontSize: 14,
    fontWeight: "800",
  },
  pageTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "900",
  },
  pageSubtitle: {
    color: "#abb9d0",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  compactSearch: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "rgba(170, 194, 235, 0.22)",
    borderRadius: 15,
    backgroundColor: "rgba(32, 55, 91, 0.78)",
    paddingHorizontal: 12,
  },
  menuCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(170, 194, 235, 0.22)",
    borderRadius: 16,
    backgroundColor: "rgba(25, 48, 82, 0.92)",
    padding: 13,
  },
  menuIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255, 95, 141, 0.14)",
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  menuSubtitle: {
    marginTop: 3,
    color: "#abb9d0",
    fontSize: 12,
    fontWeight: "600",
  },
  audioButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 15,
    backgroundColor: "#f25079",
  },
  audioButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },
  bottomNav: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 10,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 18,
    backgroundColor: "rgba(25, 48, 82, 0.96)",
    paddingHorizontal: 8,
  },
  navItem: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navLabel: {
    color: "#a9b7d0",
    fontSize: 11,
    fontWeight: "800",
  },
  navLabelActive: {
    color: "#ff5f8d",
  },
  learnButton: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ff789d",
    borderRadius: 26,
    backgroundColor: "#db3d6a",
    transform: [{ translateY: -21 }],
  },
});
