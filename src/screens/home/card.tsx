import { Pressable, Text, View } from 'react-native';

import type { Chapter } from '@/server/db';

type ChapterCardProps = {
  chapter: Chapter;
  onPress?: () => void;
};

export function ChapterCard({ chapter, onPress }: ChapterCardProps) {
  return (
    <Pressable className="gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900" onPress={onPress}>
      <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">{chapter.title}</Text>
      <Text className="text-sm text-slate-700 dark:text-slate-300">{chapter.focus}</Text>

      <View className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
        <Text className="text-xs text-slate-500 dark:text-slate-400">Lessons</Text>
        <Text className="text-sm text-slate-900 dark:text-slate-100">{chapter.vocabulary.length} vocabulary items</Text>
        <Text className="mt-2 text-xs text-slate-500 dark:text-slate-400">Focus</Text>
        <Text className="text-sm text-slate-700 dark:text-slate-300">{chapter.textbookPageRange ?? 'Core concepts'}</Text>
      </View>

      <Text className="text-sm font-medium text-sakura-700">Open chapter vocabulary →</Text>
    </Pressable>
  );
}
