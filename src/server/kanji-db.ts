import n5KanjiSource from '../data/n5/kanji.json';

export type N5KanjiCompound = {
  id: string;
  compound: string;
  reading: string;
  meaning: string;
};

export type N5Kanji = {
  id: string;
  index: number;
  kanji: string;
  readings: string;
  meaning: string;
  compounds: N5KanjiCompound[];
};

const N5_KANJI: N5Kanji[] = (n5KanjiSource as N5Kanji[]).map((item) => ({
  id: item.id,
  index: item.index,
  kanji: item.kanji,
  readings: item.readings,
  meaning: item.meaning,
  compounds: item.compounds.map((entry) => ({
    id: entry.id,
    compound: entry.compound,
    reading: entry.reading,
    meaning: entry.meaning,
  })),
}));

export function getN5KanjiList(): N5Kanji[] {
  return N5_KANJI;
}

export function getN5KanjiById(id: string): N5Kanji | undefined {
  return N5_KANJI.find((item) => item.id === id);
}
