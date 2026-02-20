import { useRef, useState } from 'react';
import * as Speech from 'expo-speech';

import type { VocabularyItem } from '@/server/db';

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

    await speakOnce(item.japanese, 'ja-JP');
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

    await speakOnce(text, 'ja-JP');
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
      await speakOnce(item.japanese, 'ja-JP');
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
    stop,
  };
}
