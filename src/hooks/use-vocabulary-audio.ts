import { useRef, useState } from 'react';
import * as Speech from 'expo-speech';

import type { VocabularyItem } from '@/server/db';

function normalizeSpeechText(raw: string) {
  const original = raw.trim();
  if (!original) return original;

  // Keep the primary term and drop parenthesized duplicates like:
  // ききます (聞きます), トイレ (おてあらい) (お手洗い)
  let text = original
    .replace(/（[^）]*）/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]/g, ' ')
    .replace(/【[^】]*】/g, ' ')
    .split(/[／/]/)[0]
    .replace(/\b[IVX]+\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Prefer Japanese script and punctuation only for speech.
  const japaneseOnly = Array.from(text)
    .filter((char) => /[\u3040-\u30ff\u3400-\u9fff\u3000-\u303fー々〆ヵヶ\s]/.test(char))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

  if (japaneseOnly) return japaneseOnly;
  if (text) return text;
  return original;
}

function normalizeSpeechTextByLanguage(raw: string, language: string) {
  const text = raw.trim();
  if (!text) return text;

  if (language.toLowerCase().startsWith('ja')) {
    return normalizeSpeechText(text);
  }

  if (language.toLowerCase().startsWith('my')) {
    const burmeseOnly = Array.from(text)
      .filter((char) => /[\u1000-\u109F\uAA60-\uAA7F\u200C\u200D\s၊။,.!?:;'"()]/.test(char))
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
    return burmeseOnly || text;
  }

  return text.replace(/\s+/g, ' ').trim();
}

function speakOnce(text: string, language: string, rate = 0.9) {
  return new Promise<void>((resolve) => {
    Speech.speak(text, {
      language,
      rate,
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });
}

type SpeechSegment = {
  text: string;
  language: string;
  rate?: number;
};

export function useVocabularyAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const activeRunRef = useRef(0);

  const stop = () => {
    activeRunRef.current += 1;
    Speech.stop();
    setIsPlaying(false);
  };

  const playVocabulary = async (item: VocabularyItem) => {
    const runId = activeRunRef.current + 1;
    activeRunRef.current = runId;
    Speech.stop();
    setIsPlaying(true);

    await speakOnce(normalizeSpeechText(item.japanese), 'ja-JP');
    if (runId !== activeRunRef.current) return;

    if (runId === activeRunRef.current) {
      setIsPlaying(false);
    }
  };

  const playJapaneseText = async (text: string) => {
    const runId = activeRunRef.current + 1;
    activeRunRef.current = runId;
    Speech.stop();
    setIsPlaying(true);

    await speakOnce(normalizeSpeechText(text), 'ja-JP');
    if (runId !== activeRunRef.current) return;

    if (runId === activeRunRef.current) {
      setIsPlaying(false);
    }
  };

  const playAllVocabulary = async (items: VocabularyItem[]) => {
    const runId = activeRunRef.current + 1;
    activeRunRef.current = runId;
    Speech.stop();
    setIsPlaying(true);

    for (const item of items) {
      if (runId !== activeRunRef.current) return;
      await speakOnce(normalizeSpeechText(item.japanese), 'ja-JP');
    }

    if (runId === activeRunRef.current) {
      setIsPlaying(false);
    }
  };

  const playTextSequence = async (segments: SpeechSegment[]) => {
    const runId = activeRunRef.current + 1;
    activeRunRef.current = runId;
    Speech.stop();
    setIsPlaying(true);

    for (const segment of segments) {
      if (runId !== activeRunRef.current) return;
      const normalized = normalizeSpeechTextByLanguage(segment.text, segment.language);
      if (!normalized) continue;
      await speakOnce(normalized, segment.language, segment.rate ?? 0.9);
    }

    if (runId === activeRunRef.current) {
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    playVocabulary,
    playJapaneseText,
    playAllVocabulary,
    playTextSequence,
    stop,
  };
}
