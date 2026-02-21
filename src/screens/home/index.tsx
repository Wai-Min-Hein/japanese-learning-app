import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import BarChart from '@/components/bar-chart';
import { useAppState } from '@/hooks/use-app-state';
import { ChapterCard } from '@/screens/home/card';

export default function HomeScreen() {
  const { chapters, streakDays } = useAppState();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-rose-50 dark:bg-slate-950" contentContainerClassName="gap-5 p-5">
      <View className="rounded-2xl bg-sakura-700 p-5">
        <Text className="text-2xl font-bold text-white">ဂျပန်စာ Chapter Navigator</Text>
        <Text className="mt-1 text-sm text-rose-100">Burmese absolute beginners အတွက်</Text>
        <Text className="mt-3 text-sm font-semibold text-white">Streak: {streakDays} days</Text>
      </View>

      <BarChart values={[15, 30, 20, 40, 25, 10, 35]} />

      <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Chapters</Text>
      {chapters.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
          onPress={() => router.push(`/chapter/${chapter.id}`)}
        />
      ))}
    </ScrollView>
  );
}
