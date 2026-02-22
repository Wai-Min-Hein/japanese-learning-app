import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';

type KanjiStrokeOrderGridProps = {
  kanji: string;
};

type ParsedKanjiSvg = {
  allStrokes: string[];
};

function getKanjiVgSvgUrl(kanji: string): string {
  const codePoint = kanji.codePointAt(0);
  if (!codePoint) {
    return '';
  }

  const hex = codePoint.toString(16).padStart(5, '0');
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

function StrokeCard({
  allStrokes,
  currentStroke,
  index,
}: {
  allStrokes: string[];
  currentStroke: string;
  index: number;
}) {
  return (
    <View className="w-[48%] rounded-xl border border-emerald-800 bg-slate-950 p-2">
      <Text className="mb-1 text-center text-lg font-semibold text-slate-100">{index + 1}</Text>
      <View className="items-center rounded-lg border border-slate-800 bg-slate-950 py-2">
        <Svg width={120} height={120} viewBox="0 0 109 109">
          <Line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#243142" strokeWidth={0.8} />
          <Line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#243142" strokeWidth={0.8} />
          {allStrokes.map((d, i) => (
            <Path
              key={`base-${index}-${i}`}
              d={d}
              stroke="#1f2937"
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          <Path
            d={currentStroke}
            stroke="#f8fafc"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <View className="mt-2 rounded-md bg-emerald-950 px-2 py-1">
        <Text className="text-center text-xs text-emerald-200">Stroke {index + 1}</Text>
      </View>
    </View>
  );
}

export function KanjiStrokeOrderGrid({ kanji }: KanjiStrokeOrderGridProps) {
  const [strokes, setStrokes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError('');
      try {
        const url = getKanjiVgSvgUrl(kanji);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Unable to load stroke data (${response.status})`);
        }
        const svgText = await response.text();
        const parsed = parseKanjiVgPaths(svgText);
        if (!parsed.allStrokes.length) {
          throw new Error('No stroke path found');
        }
        if (!cancelled) {
          setStrokes(parsed.allStrokes);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load stroke order');
          setStrokes([]);
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

  const cards = useMemo(
    () => strokes.map((stroke, index) => <StrokeCard key={`stroke-card-${index}`} allStrokes={strokes} currentStroke={stroke} index={index} />),
    [strokes],
  );

  if (isLoading) {
    return (
      <View className="items-center gap-2 rounded-xl border border-slate-300 p-4 dark:border-slate-700">
        <ActivityIndicator color="#047857" />
        <Text className="text-sm text-slate-600 dark:text-slate-300">Loading stroke order...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View className="rounded-xl border border-rose-300 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/30">
        <Text className="text-sm font-semibold text-rose-700 dark:text-rose-300">Stroke order unavailable</Text>
        <Text className="mt-1 text-xs text-rose-700 dark:text-rose-300">{loadError}</Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <Text className="text-sm text-slate-600 dark:text-slate-300">
        Step-by-step stroke order (static cards)
      </Text>
      <View className="flex-row flex-wrap justify-between gap-y-3">{cards}</View>
    </View>
  );
}
