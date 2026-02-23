import type { VocabularyItem } from './db';
import { GENERATED_N3_UNITS } from './generated-n3-units';

export type N3Unit = {
  id: string;
  unitNumber: number;
  title: string;
  focus: string;
  vocabulary: VocabularyItem[];
};

const N3_UNITS: N3Unit[] = GENERATED_N3_UNITS.map((unit) => ({
  id: unit.id,
  unitNumber: unit.unitNumber,
  title: unit.title,
  focus: unit.focus,
  vocabulary: unit.vocabulary.map((item) => ({
    id: item.id,
    japanese: item.japanese,
    hiragana: 'hiragana' in item ? item.hiragana : '',
    romaji: item.romaji,
    burmesePronunciation: item.burmesePronunciation,
    meaning: item.meaning,
  })),
}));

export function getN3Units(): N3Unit[] {
  return N3_UNITS;
}

export function getN3UnitById(id: string): N3Unit | undefined {
  return N3_UNITS.find((unit) => unit.id === id);
}
