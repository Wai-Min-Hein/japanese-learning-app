import learningEventsSource from '../data/learning-events.json';
import chaptersSource from '../data/n5/units.json';

export type VocabularyItem = {
  id: string;
  japanese: string;
  hiragana: string;
  katakana?: string;
  romaji: string;
  burmesePronunciation: string;
  meaning: string;
};

export type Chapter = {
  id: string;
  title: string;
  focus: string;
  textbookPageRange?: string;
  vocabulary: VocabularyItem[];
  translations?: {
    id: string;
    japanese: string;
    romaji?: string;
    burmese: string;
    beginnerTip?: string;
  }[];
  referenceAndExplanation?: string[];
  grammarExplanation?: string[];
  grammarTeachingNotes?: string[];
  grammarUsage?: {
    id: string;
    pattern: string;
    meaning: string;
    examples: {
      japanese: string;
      romaji: string;
      burmese: string;
    }[];
  }[];
  greetingPhrases?: {
    id: string;
    japanese: string;
    romaji: string;
    burmese: string;
  }[];
  countryPeopleLanguage?: {
    id: string;
    country: string;
    people: string;
    language: string;
  }[];
  scriptTable?: {
    id: string;
    hiragana: string;
    katakana: string;
    romaji: string;
  }[];
  practice?: string[];
  sourceText?: string;
};

export type LearningEvent = {
  id: string;
  title: string;
  dateISO: string;
  type: 'lesson' | 'review';
};

const CHAPTERS: Chapter[] = chaptersSource as Chapter[];
const EVENTS: LearningEvent[] = learningEventsSource as LearningEvent[];

export function getChapters(): Chapter[] {
  return CHAPTERS;
}

export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.id === id);
}

export function getLearningEvents(): LearningEvent[] {
  return EVENTS;
}
