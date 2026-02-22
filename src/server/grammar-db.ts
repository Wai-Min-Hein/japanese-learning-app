import { GENERATED_N5_GRAMMAR } from './generated-grammar';

export type GrammarUsage = {
  japanese: string;
  romaji?: string;
  burmese: string;
};

export type GrammarPoint = {
  id: string;
  title: string;
  detailNote: string;
  usages: GrammarUsage[];
};

export type GrammarChapter = {
  chapterId: number;
  title: string;
  points: GrammarPoint[];
};

type SourceExample = {
  japanese: string;
  romaji?: string;
  burmese?: string;
};

type SourcePoint = {
  id: string;
  pattern: string;
  meaning: string;
  examples: readonly SourceExample[];
};

type SourceChapter = {
  chapterId: number;
  chapterTitle: string;
  context: readonly string[];
  points: readonly SourcePoint[];
};

function normalizeGrammarKey(text: string): string {
  const trimmed = text.trim();
  const burmeseIndex = trimmed.search(/[\u1000-\u109F]/);
  const left = burmeseIndex >= 0 ? trimmed.slice(0, burmeseIndex) : trimmed;

  return left
    .toLowerCase()
    .replace(/^\d+\.\s*/, '')
    .replace(/[()（）。、,.・/\\:*〜~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isSameGrammarPoint(a: string, b: string): boolean {
  const ak = normalizeGrammarKey(a);
  const bk = normalizeGrammarKey(b);
  if (!ak || !bk) {
    return false;
  }
  if (ak === bk) {
    return true;
  }
  if (ak.length >= 4 && bk.length >= 4 && (ak.includes(bk) || bk.includes(ak))) {
    return true;
  }
  return false;
}

function mergePointInto(target: GrammarPoint, source: GrammarPoint): void {
  if (
    source.detailNote &&
    source.detailNote !== source.title &&
    (target.detailNote === target.title || target.detailNote.length < source.detailNote.length)
  ) {
    target.detailNote = source.detailNote;
  }

  source.usages.forEach((usage) => {
    const exists = target.usages.some((item) => item.japanese === usage.japanese);
    if (!exists) {
      target.usages.push(usage);
    }
  });
}

function dedupeGrammarPoints(points: GrammarPoint[]): GrammarPoint[] {
  const result: GrammarPoint[] = [];
  points.forEach((point) => {
    const existing = result.find((saved) => isSameGrammarPoint(saved.title, point.title));
    if (!existing) {
      result.push(point);
      return;
    }
    mergePointInto(existing, point);
  });
  return result;
}

function firstBurmeseText(texts: readonly string[]): string | null {
  return texts.find((line) => /[\u1000-\u109F]/.test(line)) ?? null;
}

function fallbackBurmese(title: string, detail: string, japanese: string): string {
  const fromText = firstBurmeseText([title, detail]);
  if (fromText) {
    return `${fromText} (ဥပမာ: ${japanese})`;
  }
  return `ဒီ grammar pattern ကို "${japanese}" ဝါကျထဲမှာ သုံးထားပါတယ်။`;
}

export function getGrammarChapters(): GrammarChapter[] {
  const chapterMap = new Map<number, GrammarChapter>();
  const sourceChapters = GENERATED_N5_GRAMMAR as readonly SourceChapter[];

  for (let i = 1; i <= 25; i += 1) {
    chapterMap.set(i, {
      chapterId: i,
      title: `Chapter ${i}`,
      points: [],
    });
  }

  sourceChapters.forEach((chapter) => {
    if (chapter.chapterId < 1 || chapter.chapterId > 25) {
      return;
    }
    const slot = chapterMap.get(chapter.chapterId);
    if (!slot) {
      return;
    }

    slot.title = chapter.chapterTitle;
    const chapterContext = firstBurmeseText(chapter.context);

    chapter.points.forEach((usage) => {
      const matched = slot.points.find(
        (point) =>
          isSameGrammarPoint(point.title, usage.pattern),
      );

      const mappedUsages = usage.examples.map((example) => ({
        japanese: example.japanese,
        romaji: example.romaji,
        burmese:
          example.burmese ||
          chapterContext ||
          fallbackBurmese(usage.pattern, usage.meaning, example.japanese),
      }));

      if (matched) {
        if (!matched.detailNote || matched.detailNote === matched.title) {
          matched.detailNote = usage.meaning || matched.detailNote;
        }
        mappedUsages.forEach((entry) => {
          const exists = matched.usages.some((u) => u.japanese === entry.japanese);
          if (!exists) {
            matched.usages.push(entry);
          }
        });
        return;
      }

      slot.points.push({
        id: `gen-${usage.id}`,
        title: usage.pattern,
        detailNote: usage.meaning || chapterContext || usage.pattern,
        usages: mappedUsages,
      });
    });

    slot.points = dedupeGrammarPoints(slot.points);
  });

  return Array.from(chapterMap.values()).sort((a, b) => a.chapterId - b.chapterId);
}

export function getGrammarChapterById(chapterId: number): GrammarChapter | undefined {
  return getGrammarChapters().find((chapter) => chapter.chapterId === chapterId);
}
