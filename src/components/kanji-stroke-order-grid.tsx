import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
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

type PracticeStroke = {
  id: number;
  characterIndex: number;
  points: { x: number; y: number }[];
};

type CompletedPracticeStroke = {
  id: number;
  characterIndex: number;
  strokeIndex: number;
  progress: Animated.Value;
};

type Point = {
  x: number;
  y: number;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
const ANIMATION_STROKE_LENGTH = 1000;
const STROKE_DURATION_MS = 1350;
const PRACTICE_CANVAS_SIZE = 109;
const PRACTICE_STROKE_ANIMATION_MS = 520;

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

function StrokeContextHeader({
  title,
  detail,
  meta,
}: {
  title: string;
  detail: string;
  meta: string;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3 px-1">
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-semibold text-rose-600 dark:text-rose-300">
          {title}
        </Text>
        <Text className="text-base font-bold text-slate-900 dark:text-slate-100">
          {detail}
        </Text>
      </View>
      <Text className="text-sm font-semibold text-slate-500 dark:text-slate-300">
        {meta}
      </Text>
    </View>
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
  const activeCharacterIndex = characterOffsets.findLastIndex(
    (offset) => offset <= activeGlobalIndex,
  );
  const activeCharacter =
    characterStrokes[Math.max(0, activeCharacterIndex)] ?? characterStrokes[0];
  const activeCharacterOffset =
    characterOffsets[Math.max(0, activeCharacterIndex)] ?? 0;
  const activeStrokeNumber =
    activeCharacter && activeGlobalIndex >= activeCharacterOffset
      ? Math.min(
          activeCharacter.strokes.length,
          activeGlobalIndex - activeCharacterOffset + 1,
        )
      : 1;

  return (
    <View className="gap-2">
      <StrokeContextHeader
        title="Practice writing"
        detail={
          activeCharacter
            ? `${activeCharacter.character} stroke ${activeStrokeNumber} / ${activeCharacter.strokes.length}`
            : "Playing stroke order"
        }
        meta="Playing"
      />
      <View className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900" style={{ aspectRatio: 1 }}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${canvasWidth} 109`}>
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
                      stroke="#ff6d96"
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
    </View>
  );
}

function pointsToPath(points: PracticeStroke["points"]) {
  if (!points.length) {
    return "";
  }

  const [first, ...rest] = points;
  return `M ${first.x.toFixed(2)} ${first.y.toFixed(2)} ${rest
    .map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ")}`;
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function cubicPoint(t: number, p0: Point, p1: Point, p2: Point, p3: Point) {
  const oneMinusT = 1 - t;
  const oneMinusT2 = oneMinusT * oneMinusT;
  const t2 = t * t;

  return {
    x:
      oneMinusT2 * oneMinusT * p0.x +
      3 * oneMinusT2 * t * p1.x +
      3 * oneMinusT * t2 * p2.x +
      t2 * t * p3.x,
    y:
      oneMinusT2 * oneMinusT * p0.y +
      3 * oneMinusT2 * t * p1.y +
      3 * oneMinusT * t2 * p2.y +
      t2 * t * p3.y,
  };
}

function quadraticPoint(t: number, p0: Point, p1: Point, p2: Point) {
  const oneMinusT = 1 - t;

  return {
    x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
    y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y,
  };
}

function tokenizePath(d: string) {
  return d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
}

function sampleSvgPath(d: string): Point[] {
  const tokens = tokenizePath(d);
  const points: Point[] = [];
  let index = 0;
  let command = "";
  let current: Point = { x: 0, y: 0 };
  let start: Point = { x: 0, y: 0 };
  let lastCubicControl: Point | null = null;
  let lastQuadraticControl: Point | null = null;

  const isCommand = (token: string | undefined) => !!token && /^[a-zA-Z]$/.test(token);
  const readNumber = () => Number(tokens[index++]);
  const addPoint = (point: Point) => {
    const last = points[points.length - 1];
    if (!last || distance(last, point) > 0.4) {
      points.push(point);
    }
  };
  const lineTo = (end: Point) => {
    const startPoint = current;
    for (let step = 1; step <= 8; step += 1) {
      const t = step / 8;
      addPoint({
        x: startPoint.x + (end.x - startPoint.x) * t,
        y: startPoint.y + (end.y - startPoint.y) * t,
      });
    }
    current = end;
  };
  const cubicTo = (control1: Point, control2: Point, end: Point) => {
    const startPoint = current;
    for (let step = 1; step <= 16; step += 1) {
      addPoint(cubicPoint(step / 16, startPoint, control1, control2, end));
    }
    current = end;
    lastCubicControl = control2;
    lastQuadraticControl = null;
  };
  const quadraticTo = (control: Point, end: Point) => {
    const startPoint = current;
    for (let step = 1; step <= 12; step += 1) {
      addPoint(quadraticPoint(step / 12, startPoint, control, end));
    }
    current = end;
    lastQuadraticControl = control;
    lastCubicControl = null;
  };

  while (index < tokens.length) {
    if (isCommand(tokens[index])) {
      command = tokens[index++];
    }
    if (!command) {
      break;
    }

    const relative = command === command.toLowerCase();
    const lower = command.toLowerCase();
    const point = (x: number, y: number) =>
      relative ? { x: current.x + x, y: current.y + y } : { x, y };

    if (lower === "m") {
      const next = point(readNumber(), readNumber());
      current = next;
      start = next;
      addPoint(next);
      command = relative ? "l" : "L";
      lastCubicControl = null;
      lastQuadraticControl = null;
      continue;
    }

    if (lower === "z") {
      lineTo(start);
      command = "";
      continue;
    }

    if (lower === "l") {
      while (index < tokens.length && !isCommand(tokens[index])) {
        lineTo(point(readNumber(), readNumber()));
      }
      lastCubicControl = null;
      lastQuadraticControl = null;
      continue;
    }

    if (lower === "h") {
      while (index < tokens.length && !isCommand(tokens[index])) {
        const x = readNumber();
        lineTo({ x: relative ? current.x + x : x, y: current.y });
      }
      lastCubicControl = null;
      lastQuadraticControl = null;
      continue;
    }

    if (lower === "v") {
      while (index < tokens.length && !isCommand(tokens[index])) {
        const y = readNumber();
        lineTo({ x: current.x, y: relative ? current.y + y : y });
      }
      lastCubicControl = null;
      lastQuadraticControl = null;
      continue;
    }

    if (lower === "c") {
      while (index < tokens.length && !isCommand(tokens[index])) {
        cubicTo(
          point(readNumber(), readNumber()),
          point(readNumber(), readNumber()),
          point(readNumber(), readNumber()),
        );
      }
      continue;
    }

    if (lower === "s") {
      while (index < tokens.length && !isCommand(tokens[index])) {
        const control = lastCubicControl as Point | null;
        const reflected = control
          ? {
              x: current.x * 2 - control.x,
              y: current.y * 2 - control.y,
            }
          : current;
        cubicTo(
          reflected,
          point(readNumber(), readNumber()),
          point(readNumber(), readNumber()),
        );
      }
      continue;
    }

    if (lower === "q") {
      while (index < tokens.length && !isCommand(tokens[index])) {
        quadraticTo(point(readNumber(), readNumber()), point(readNumber(), readNumber()));
      }
      continue;
    }

    if (lower === "t") {
      while (index < tokens.length && !isCommand(tokens[index])) {
        const control = lastQuadraticControl as Point | null;
        const reflected = control
          ? {
              x: current.x * 2 - control.x,
              y: current.y * 2 - control.y,
            }
          : current;
        quadraticTo(reflected, point(readNumber(), readNumber()));
      }
      continue;
    }

    break;
  }

  return points;
}

function resamplePoints(points: Point[], count: number) {
  if (points.length <= 1) {
    return points;
  }

  const lengths = [0];
  for (let i = 1; i < points.length; i += 1) {
    lengths[i] = lengths[i - 1] + distance(points[i - 1], points[i]);
  }
  const totalLength = lengths[lengths.length - 1];
  if (!totalLength) {
    return points;
  }

  return Array.from({ length: count }, (_, sampleIndex) => {
    const target = (totalLength * sampleIndex) / Math.max(1, count - 1);
    const segmentIndex = lengths.findIndex((length) => length >= target);
    const endIndex = Math.max(1, segmentIndex < 0 ? lengths.length - 1 : segmentIndex);
    const startIndex = endIndex - 1;
    const segmentLength = lengths[endIndex] - lengths[startIndex] || 1;
    const t = (target - lengths[startIndex]) / segmentLength;
    return {
      x: points[startIndex].x + (points[endIndex].x - points[startIndex].x) * t,
      y: points[startIndex].y + (points[endIndex].y - points[startIndex].y) * t,
    };
  });
}

function averageSampleDistance(a: Point[], b: Point[]) {
  const count = Math.min(a.length, b.length);
  if (!count) {
    return Infinity;
  }

  return (
    a.slice(0, count).reduce((sum, point, index) => sum + distance(point, b[index]), 0) /
    count
  );
}

function validatePracticeStroke(userPoints: Point[], expectedPath: string) {
  const expectedPoints = sampleSvgPath(expectedPath);
  if (userPoints.length < 2 || expectedPoints.length < 2) {
    return false;
  }

  const expectedStart = expectedPoints[0];
  const expectedEnd = expectedPoints[expectedPoints.length - 1];
  const userStart = userPoints[0];
  const userEnd = userPoints[userPoints.length - 1];
  const startDistance = distance(userStart, expectedStart);
  const endDistance = distance(userEnd, expectedEnd);
  const reversedStartDistance = distance(userStart, expectedEnd);
  const reversedEndDistance = distance(userEnd, expectedStart);
  const expectedSamples = resamplePoints(expectedPoints, 12);
  const userSamples = resamplePoints(userPoints, 12);
  const averageDistance = averageSampleDistance(userSamples, expectedSamples);
  const reversedAverageDistance = averageSampleDistance(
    userSamples,
    [...expectedSamples].reverse(),
  );

  return (
    startDistance <= 24 &&
    endDistance <= 28 &&
    averageDistance <= 24 &&
    startDistance + endDistance + averageDistance <
      reversedStartDistance + reversedEndDistance + reversedAverageDistance
  );
}

function PracticeCanvas({
  characterStrokes,
}: {
  characterStrokes: CharacterStrokes[];
}) {
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState<CompletedPracticeStroke[]>([]);
  const [draftStroke, setDraftStroke] = useState<PracticeStroke | null>(null);
  const [rejectedStroke, setRejectedStroke] = useState<PracticeStroke | null>(null);
  const [showCorrectionHint, setShowCorrectionHint] = useState(false);
  const [canvasSize, setCanvasSize] = useState(PRACTICE_CANVAS_SIZE);
  const rejectionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeCharacter =
    characterStrokes[activeCharacterIndex] ?? characterStrokes[0];
  const activeCompletedStrokes = completedStrokes.filter(
    (stroke) => stroke.characterIndex === activeCharacterIndex,
  );
  const currentStrokeIndex = Math.min(
    activeCompletedStrokes.length,
    Math.max(0, (activeCharacter?.strokes.length ?? 1) - 1),
  );
  const isCharacterComplete =
    activeCharacter && activeCompletedStrokes.length >= activeCharacter.strokes.length;

  const getPoint = useCallback(
    (event: GestureResponderEvent) => {
      const { locationX, locationY } = event.nativeEvent;
      const scale = PRACTICE_CANVAS_SIZE / Math.max(1, canvasSize);
      return {
        x: Math.max(0, Math.min(PRACTICE_CANVAS_SIZE, locationX * scale)),
        y: Math.max(0, Math.min(PRACTICE_CANVAS_SIZE, locationY * scale)),
      };
    },
    [canvasSize],
  );

  const startStroke = useCallback(
    (event: GestureResponderEvent) => {
      if (!activeCharacter || isCharacterComplete) {
        return;
      }

      setDraftStroke({
        id: Date.now(),
        characterIndex: activeCharacterIndex,
        points: [getPoint(event)],
      });
      setRejectedStroke(null);
      setShowCorrectionHint(false);
    },
    [activeCharacter, activeCharacterIndex, getPoint, isCharacterComplete],
  );

  const moveStroke = useCallback(
    (event: GestureResponderEvent) => {
      if (!draftStroke) {
        return;
      }

      const point = getPoint(event);
      setDraftStroke((current) => {
        if (!current) {
          return current;
        }

        const lastPoint = current.points[current.points.length - 1];
        if (
          lastPoint &&
          Math.abs(lastPoint.x - point.x) < 0.75 &&
          Math.abs(lastPoint.y - point.y) < 0.75
        ) {
          return current;
        }

        return {
          ...current,
          points: [...current.points, point],
        };
      });
    },
    [draftStroke, getPoint],
  );

  const finishStroke = useCallback(() => {
    setDraftStroke((current) => {
      if (!current || current.points.length < 2) {
        return null;
      }

      const expectedPath = activeCharacter?.strokes[currentStrokeIndex];
      if (!expectedPath || !validatePracticeStroke(current.points, expectedPath)) {
        setRejectedStroke(current);
        setShowCorrectionHint(true);
        if (rejectionTimeout.current) {
          clearTimeout(rejectionTimeout.current);
        }
        rejectionTimeout.current = setTimeout(() => {
          setRejectedStroke(null);
        }, 500);
        return null;
      }

      const progress = new Animated.Value(ANIMATION_STROKE_LENGTH);
      const completedStroke = {
        id: current.id,
        characterIndex: activeCharacterIndex,
        strokeIndex: currentStrokeIndex,
        progress,
      };
      setCompletedStrokes((strokes) => [...strokes, completedStroke]);
      setShowCorrectionHint(false);
      Animated.timing(progress, {
        toValue: 0,
        duration: PRACTICE_STROKE_ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      return null;
    });
  }, [activeCharacter?.strokes, activeCharacterIndex, currentStrokeIndex]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: startStroke,
        onPanResponderMove: moveStroke,
        onPanResponderRelease: finishStroke,
        onPanResponderTerminate: finishStroke,
      }),
    [finishStroke, moveStroke, startStroke],
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasSize(Math.max(1, Math.min(width, height)));
  };

  useEffect(() => {
    if (
      isCharacterComplete &&
      activeCharacterIndex < characterStrokes.length - 1
    ) {
      const timeout = setTimeout(() => {
        setDraftStroke(null);
        setRejectedStroke(null);
        setShowCorrectionHint(false);
        setActiveCharacterIndex((index) => index + 1);
      }, PRACTICE_STROKE_ANIMATION_MS + 120);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [activeCharacterIndex, characterStrokes.length, isCharacterComplete]);

  useEffect(
    () => () => {
      if (rejectionTimeout.current) {
        clearTimeout(rejectionTimeout.current);
      }
    },
    [],
  );

  if (!activeCharacter) {
    return null;
  }

  return (
    <View className="gap-4">
      <View className="gap-2">
        <StrokeContextHeader
          title="Practice writing"
          detail={
            isCharacterComplete
              ? `${activeCharacter.character} complete`
              : `${activeCharacter.character} stroke ${Math.min(
                  activeCompletedStrokes.length + 1,
                  activeCharacter.strokes.length,
                )} / ${activeCharacter.strokes.length}`
          }
          meta={`${activeCharacterIndex + 1} / ${characterStrokes.length}`}
        />
        <View
          className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900"
          onLayout={handleLayout}
          style={{ aspectRatio: 1 }}
          {...panResponder.panHandlers}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${PRACTICE_CANVAS_SIZE} ${PRACTICE_CANVAS_SIZE}`}
          >
            <PracticeGrid />
            {activeCharacter.strokes.map((d, index) => (
              <Path
                key={`trace-${index}`}
                d={d}
                stroke="#475569"
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.35}
              />
            ))}
            {showCorrectionHint && !isCharacterComplete ? (
              <Path
                d={activeCharacter.strokes[currentStrokeIndex]}
                stroke="#ff6d96"
                strokeWidth={7}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.32}
              />
            ) : null}
            {activeCompletedStrokes.map((stroke) => (
              <AnimatedPath
                key={stroke.id}
                d={activeCharacter.strokes[stroke.strokeIndex]}
                stroke="#ff6d96"
                strokeWidth={6.8}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={ANIMATION_STROKE_LENGTH}
                strokeDashoffset={stroke.progress}
              />
            ))}
            {rejectedStroke ? (
              <Path
                d={pointsToPath(rejectedStroke.points)}
                stroke="#fb7185"
                strokeWidth={6.8}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.72}
              />
            ) : null}
            {draftStroke ? (
              <Path
                d={pointsToPath(draftStroke.points)}
                stroke="#f8fafc"
                strokeWidth={6.8}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </Svg>
        </View>
      </View>
    </View>
  );
}

function StrokePracticePlayer({
  characterStrokes,
}: {
  characterStrokes: CharacterStrokes[];
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const isPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGlobalIndex, setActiveGlobalIndex] = useState(0);
  const totalStrokes = useMemo(
    () => characterStrokes.reduce((sum, entry) => sum + entry.strokes.length, 0),
    [characterStrokes],
  );
  const characterOffsets = useMemo(() => {
    let offset = 0;
    return characterStrokes.map((entry) => {
      const start = offset;
      offset += entry.strokes.length;
      return start;
    });
  }, [characterStrokes]);

  const runLoop = useCallback(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: totalStrokes,
      duration: Math.max(1, totalStrokes) * STROKE_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && isPlayingRef.current) {
        runLoop();
      }
    });
  }, [progress, totalStrokes]);

  const stopPlay = useCallback(() => {
    isPlayingRef.current = false;
    progress.stopAnimation(() => {
      progress.setValue(0);
      setActiveGlobalIndex(0);
      setIsPlaying(false);
    });
  }, [progress]);

  const startPlay = useCallback(() => {
    progress.stopAnimation();
    progress.setValue(0);
    setActiveGlobalIndex(0);
    isPlayingRef.current = true;
    setIsPlaying(true);
    runLoop();
  }, [progress, runLoop]);

  useEffect(() => {
    const listener = progress.addListener(({ value }) => {
      setActiveGlobalIndex(
        Math.min(Math.max(0, totalStrokes - 1), Math.max(0, Math.floor(value))),
      );
    });

    return () => {
      progress.removeListener(listener);
      isPlayingRef.current = false;
      progress.stopAnimation();
    };
  }, [progress, totalStrokes]);

  return (
    <View className="gap-4">
      {isPlaying ? (
        <WordStrokePanel
          characterStrokes={characterStrokes}
          progress={progress}
          characterOffsets={characterOffsets}
          activeGlobalIndex={activeGlobalIndex}
        />
      ) : (
        <PracticeCanvas characterStrokes={characterStrokes} />
      )}

      <Pressable
        className="h-12 flex-row items-center justify-center gap-2 rounded-full bg-sakura-700 px-4"
        onPress={isPlaying ? stopPlay : startPlay}
      >
        <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="#fff" />
        <Text className="text-base font-bold text-white">
          {isPlaying ? "Stop" : "Play"}
        </Text>
      </Pressable>
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

  return <StrokePracticePlayer characterStrokes={characterStrokes} />;
}
