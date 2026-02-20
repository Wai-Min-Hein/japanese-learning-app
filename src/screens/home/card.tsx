import { Pressable, Text, View } from 'react-native';

import type { Chapter } from '@/server/db';

type ChapterCardProps = {
  chapter: Chapter;
  onPress?: () => void;
};

export function ChapterCard({ chapter, onPress }: ChapterCardProps) {
  return (
    <Pressable className="gap-3 rounded-2xl bg-white p-4 shadow-sm" onPress={onPress}>
      <Text className="text-lg font-semibold text-slate-900">{chapter.title}</Text>
      <Text className="text-sm text-slate-700">{chapter.focus}</Text>

      <View className="rounded-xl bg-slate-50 p-3">
        <Text className="text-xs text-slate-500">Hiragana</Text>
        <Text className="text-sm text-slate-900">{chapter.kana.hiragana.join(' ・ ')}</Text>
        <Text className="mt-2 text-xs text-slate-500">Katakana</Text>
        <Text className="text-sm text-slate-900">{chapter.kana.katakana.join(' ・ ')}</Text>
        <Text className="mt-2 text-xs text-slate-500">Romaji</Text>
        <Text className="text-sm text-slate-700">{chapter.kana.romaji.join(' ・ ')}</Text>
      </View>

      <Text className="text-sm font-medium text-sakura-700">Open chapter vocabulary →</Text>
    </Pressable>
  );
}
