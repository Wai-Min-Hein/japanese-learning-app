import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  Text,
  View,
} from "react-native";
import Svg, { G, Line, Path } from "react-native-svg";

type KanjiStrokeOrderGridProps = {
  kanji: string;
};

type ParsedKanjiSvg = {
  allStrokes: string[];
};

type CharacterStrokes = {
  character: string;
  strokes: string[];
};

type StrokeRecord = {
  character: string;
  characterIndex: number;
  strokeIndex: number;
  globalIndex: number;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
const ANIMATION_STROKE_LENGTH = 1000;
const STROKE_DURATION_MS = 950;

function getKanjiVgSvgUrl(kanji: string): string {
  const codePoint = kanji.codePointAt(0);
  if (!codePoint) {
    return "";
  }

  const hex = codePoint.toString(16).padStart(5, "0");
  return `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;
}

function parseKanjiVgPaths(svgText: string): ParsedKanjiSvg {
  const allStrokes: string[] = [];
  const regex = /<path[^>]*id="[^"]*-s\d+"[^>]*d="([^"]+)"[^>]*>/g;

  let match = regex.exec(svgText);
  while (match) {
    if (match[1]) {
      allStrokes.push(match[1]);
    }
    match = regex.exec(svgText);
  }

  return { allStrokes };
}

function getCharacters(text: string): string[] {
  return Array.from(text).filter((character) => character.trim().length > 0);
}

async function loadCharacterStrokes(character: string): Promise<CharacterStrokes> {
  const url = getKanjiVgSvgUrl(character);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to load stroke data for ${character} (${response.status})`);
  }

  const svgText = await response.text();
  const parsed = parseKanjiVgPaths(svgText);
  if (!parsed.allStrokes.length) {
    throw new Error(`No stroke path found for ${character}`);
  }

  return {
    character,
    strokes: parsed.allStrokes,
  };
}

function PracticeGrid() {
  return (
    <>
      <Line
        x1="54.5"
        y1="0"
        x2="54.5"
        y2="109"
        stroke="#26364d"
        strokeWidth={0.75}
      />
      <Line
        x1="0"
        y1="54.5"
        x2="109"
        y2="54.5"
        stroke="#26364d"
        strokeWidth={0.75}
      />
      <Line
        x1="0"
        y1="0"
        x2="109"
        y2="109"
        stroke="#1c2a3f"
        strokeWidth={0.5}
      />
      <Line
        x1="109"
        y1="0"
        x2="0"
        y2="109"
        stroke="#1c2a3f"
        strokeWidth={0.5}
      />
    </>
  );
}

function WordStrokePanel({
  characterStrokes,
  progress,
  characterOffsets,
  activeGlobalIndex,
}: {
  characterStrokes: CharacterStrokes[];
  progress: Animated.Value;
  characterOffsets: number[];
  activeGlobalIndex: number;
}) {
  const characterWidth = 109;
  const canvasWidth = Math.max(characterWidth, characterStrokes.length * characterWidth);

  return (
    <View className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
      <Svg width="100%" height={characterStrokes.length > 1 ? 190 : 250} viewBox={`0 0 ${canvasWidth} 109`}>
        {characterStrokes.map((entry, characterIndex) => (
          <G
            key={`grid-${entry.character}-${characterIndex}`}
            x={characterIndex * characterWidth}
          >
            <PracticeGrid />
          </G>
        ))}

        {characterStrokes.map((entry, characterIndex) => (
          <G
            key={`base-${entry.character}-${characterIndex}`}
            x={characterIndex * characterWidth}
          >
            {entry.strokes.map((d, strokeIndex) => (
              <Path
                key={`base-${characterIndex}-${strokeIndex}`}
                d={d}
                stroke="#263142"
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </G>
        ))}

        {characterStrokes.map((entry, characterIndex) => {
          const offset = characterOffsets[characterIndex] ?? 0;

          return (
            <G
              key={`animated-${entry.character}-${characterIndex}`}
              x={characterIndex * characterWidth}
            >
              {entry.strokes.map((d, strokeIndex) => {
                const globalIndex = offset + strokeIndex;
                const strokeDashoffset = progress.interpolate({
                  inputRange: [globalIndex, globalIndex + 0.88],
                  outputRange: [ANIMATION_STROKE_LENGTH, 0],
                  extrapolate: "clamp",
                });

                return (
                  <AnimatedPath
                    key={`animated-${characterIndex}-${strokeIndex}`}
                    d={d}
                    stroke={globalIndex <= activeGlobalIndex ? "#ff6d96" : "#f8fafc"}
                    strokeWidth={6.8}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={ANIMATION_STROKE_LENGTH}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              })}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

function StrokeAnimator({
  characterStrokes,
}: {
  characterStrokes: CharacterStrokes[];
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGlobalIndex, setActiveGlobalIndex] = useState(0);
  const strokeRecords = useMemo<StrokeRecord[]>(() => {
    let globalIndex = 0;

    return characterStrokes.flatMap((entry, characterIndex) =>
      entry.strokes.map((_, strokeIndex) => ({
        character: entry.character,
        characterIndex,
        strokeIndex,
        globalIndex: globalIndex++,
      })),
    );
  }, [characterStrokes]);

  const totalStrokes = strokeRecords.length;
  const activeStroke = strokeRecords[activeGlobalIndex];
  const characterOffsets = useMemo(() => {
    let offset = 0;
    return characterStrokes.map((entry) => {
      const start = offset;
      offset += entry.strokes.length;
      return start;
    });
  }, [characterStrokes]);

  const stop = useCallback(() => {
    progress.stopAnimation(() => {
      setIsPlaying(false);
    });
  }, [progress]);

  const play = useCallback(
    (fromStart = false) => {
      progress.stopAnimation((value) => {
        const startValue = fromStart || value >= totalStrokes ? 0 : value;
        progress.setValue(startValue);
        setIsPlaying(true);
        Animated.timing(progress, {
          toValue: totalStrokes,
          duration: Math.max(1, totalStrokes - startValue) * STROKE_DURATION_MS,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished) {
            setIsPlaying(false);
            setActiveGlobalIndex(Math.max(0, totalStrokes - 1));
          }
        });
      });
    },
    [progress, totalStrokes],
  );

  useEffect(() => {
    progress.setValue(0);
    setActiveGlobalIndex(0);
    play(true);

    const listener = progress.addListener(({ value }) => {
      setActiveGlobalIndex(
        Math.min(Math.max(0, totalStrokes - 1), Math.max(0, Math.floor(value))),
      );
    });

    return () => {
      progress.removeListener(listener);
      progress.stopAnimation();
    };
  }, [play, progress, totalStrokes]);

  return (
    <View className="gap-4">
      <WordStrokePanel
        characterStrokes={characterStrokes}
        progress={progress}
        characterOffsets={characterOffsets}
        activeGlobalIndex={activeGlobalIndex}
      />

      <View className="flex-row items-center justify-between rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
        <View>
          <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Animated stroke order
          </Text>
          <Text className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {activeStroke
              ? `${activeStroke.character} stroke ${activeStroke.strokeIndex + 1} / ${
                  characterStrokes[activeStroke.characterIndex]?.strokes.length ?? 0
                }`
              : "Complete"}
          </Text>
          <Text className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total{" "}
            {Math.min(activeStroke ? activeGlobalIndex + 1 : activeGlobalIndex, totalStrokes)} /{" "}
            {totalStrokes}
          </Text>
        </View>

        <View className="flex-row gap-2">
          
          <Pressable
            className="h-10 flex-row items-center justify-center gap-2 rounded-full bg-sakura-700 px-4"
            onPress={isPlaying ? stop : () => play(false)}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={19}
              color="#fff"
            />
            <Text className="text-sm font-bold text-white">
              {isPlaying ? "Stop" : "Play"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function KanjiStrokeOrderGrid({ kanji }: KanjiStrokeOrderGridProps) {
  const [characterStrokes, setCharacterStrokes] = useState<CharacterStrokes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError("");
      try {
        const characters = getCharacters(kanji);
        if (!characters.length) {
          throw new Error("No character found");
        }

        const settled = await Promise.allSettled(
          characters.map(loadCharacterStrokes),
        );
        const loaded = settled.flatMap((result) =>
          result.status === "fulfilled" ? [result.value] : [],
        );
        if (!loaded.length) {
          throw new Error("No stroke path found");
        }

        if (!cancelled) {
          setCharacterStrokes(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Failed to load stroke order",
          );
          setCharacterStrokes([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [kanji]);

  if (isLoading) {
    return (
      <View className="items-center gap-2 rounded-xl border border-slate-300 p-4 dark:border-slate-700">
        <ActivityIndicator color="#047857" />
        <Text className="text-sm text-slate-600 dark:text-slate-300">
          Loading stroke order...
        </Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View className="rounded-xl border border-rose-300 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/30">
        <Text className="text-sm font-semibold text-rose-700 dark:text-rose-300">
          Stroke order unavailable
        </Text>
        <Text className="mt-1 text-xs text-rose-700 dark:text-rose-300">
          {loadError}
        </Text>
      </View>
    );
  }

  return <StrokeAnimator characterStrokes={characterStrokes} />;
}
