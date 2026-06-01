import n3KanjiSource from "./n3-kanji.json";

export type N3KanjiVocab = {
  word: string;
  reading: string;
  meaning: string;
  burmeseMeaning?: string;
};

export type N3Kanji = {
  id: string;
  index: number;
  kanji: string;
  onyomi: string;
  kunyomi: string;
  meanings: string[];
  burmeseMeanings?: string[];
  vocab: N3KanjiVocab[];
};

type N3KanjiSourceItem = Omit<N3Kanji, "id">;

const N3_KANJI: N3Kanji[] = (n3KanjiSource as N3KanjiSourceItem[]).map(
  (item) => ({
    id: `n3-k-${item.index}`,
    index: item.index,
    kanji: item.kanji,
    onyomi: item.onyomi,
    kunyomi: item.kunyomi,
    meanings: item.meanings,
    burmeseMeanings: item.burmeseMeanings,
    vocab: item.vocab,
  }),
);

export function getN3KanjiList(): N3Kanji[] {
  return N3_KANJI;
}

export function getN3KanjiById(id: string): N3Kanji | undefined {
  return N3_KANJI.find((item) => item.id === id);
}
