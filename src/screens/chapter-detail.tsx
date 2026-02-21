import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { getChapterById } from '@/server/db';
import { useVocabularyAudio } from '@/hooks/use-vocabulary-audio';

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chapter = getChapterById(id ?? '');
  const { isPlaying, playVocabulary, playJapaneseText, playAllVocabulary, stop } = useVocabularyAudio();

  if (!chapter) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 dark:bg-slate-950 p-5">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Chapter not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="gap-4 p-5">
      <View className="rounded-2xl bg-white dark:bg-slate-900 p-4">
        <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100">{chapter.title}</Text>
        <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">{chapter.focus}</Text>
        {chapter.textbookPageRange ? (
          <Text className="mt-2 text-xs text-slate-500 dark:text-slate-400">Textbook pages: {chapter.textbookPageRange}</Text>
        ) : null}
      </View>

      {chapter.scriptTable?.length ? (
        <View className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Hiragana / Katakana / Romaji</Text>
          <View className="rounded-lg border border-slate-200 dark:border-slate-700">
            <View className="flex-row border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-2">
              <Text className="flex-1 text-xs font-semibold text-slate-700 dark:text-slate-300">Hiragana</Text>
              <Text className="flex-1 text-xs font-semibold text-slate-700 dark:text-slate-300">Katakana</Text>
              <Text className="flex-1 text-xs font-semibold text-slate-700 dark:text-slate-300">Romaji</Text>
            </View>
            {chapter.scriptTable.map((row) => (
              <View key={row.id} className="border-b border-slate-100 dark:border-slate-800 px-2 py-2">
                <View className="flex-row">
                  <Text className="flex-1 text-sm text-slate-900 dark:text-slate-100">{row.hiragana}</Text>
                  <Text className="flex-1 text-sm text-slate-900 dark:text-slate-100">{row.katakana}</Text>
                  <Text className="flex-1 text-sm text-slate-700 dark:text-slate-300">{row.romaji}</Text>
                </View>
                <Pressable
                  className="mt-2 rounded-md border border-sakura-700 px-2 py-1"
                  onPress={() => void playJapaneseText(row.hiragana)}
                >
                  <Text className="text-center text-xs font-semibold text-sakura-700">Play row</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View className="flex-row gap-3">
        <Pressable
          className="flex-1 rounded-xl bg-sakura-700 px-4 py-3"
          onPress={() => {
            if (isPlaying) {
              stop();
              return;
            }
            void playAllVocabulary(chapter.vocabulary);
          }}
        >
          <Text className="text-center font-semibold text-white">
            {isPlaying ? 'Stop Playing' : 'Play All Vocabulary'}
          </Text>
        </Pressable>

        <Pressable className="rounded-xl bg-slate-700 dark:bg-slate-600 px-4 py-3" onPress={stop}>
          <Text className="font-semibold text-white">Stop</Text>
        </Pressable>
      </View>

      <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Vocabulary</Text>
      {chapter.vocabulary.map((item) => (
        <View key={item.id} className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-xl font-bold text-slate-900 dark:text-slate-100">{item.japanese}</Text>
          <Text className="text-sm text-slate-700 dark:text-slate-300">Hiragana: {item.hiragana}</Text>
          {item.katakana ? (
            <Text className="text-sm text-slate-700 dark:text-slate-300">Katakana: {item.katakana}</Text>
          ) : null}
          <Text className="text-sm text-slate-700 dark:text-slate-300">Romaji: {item.romaji}</Text>
          <Text className="text-sm font-semibold text-slate-900 dark:text-slate-100">Meaning: {item.meaning}</Text>

          <Pressable
            className="mt-1 rounded-lg border border-sakura-700 px-3 py-2"
            onPress={() => void playVocabulary(item)}
          >
            <Text className="text-center font-semibold text-sakura-700">Play {item.japanese}</Text>
          </Pressable>
        </View>
      ))}

      {chapter.translations?.length ? (
        <View className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Translations</Text>
          {chapter.translations.map((line) => (
            <View key={line.id} className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <Text className="text-sm font-semibold text-slate-900 dark:text-slate-100">{line.japanese}</Text>
              {line.romaji ? <Text className="text-xs text-slate-500 dark:text-slate-400">{line.romaji}</Text> : null}
              <Text className="mt-1 text-sm text-slate-700 dark:text-slate-300">{line.burmese}</Text>
              {line.beginnerTip ? (
                <Text className="mt-1 text-xs text-emerald-700">Beginner note: {line.beginnerTip}</Text>
              ) : null}
              <Pressable
                className="mt-2 rounded-lg border border-sakura-700 px-3 py-2"
                onPress={() => void playJapaneseText(line.japanese)}
              >
                <Text className="text-center font-semibold text-sakura-700">Play translation audio</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      {chapter.referenceAndExplanation?.length ? (
        <View className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ref & Explanation</Text>
          {chapter.referenceAndExplanation.map((note, index) => (
            <Text key={`${index}-${note}`} className="text-sm text-slate-700 dark:text-slate-300">
              • {note}
            </Text>
          ))}
        </View>
      ) : null}

      {chapter.grammarExplanation?.length ? (
        <View className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Grammar Explanation</Text>
          {chapter.grammarExplanation.map((note, index) => (
            <Text key={`${index}-${note}`} className="text-sm text-slate-700 dark:text-slate-300">
              {index + 1}. {note}
            </Text>
          ))}
        </View>
      ) : null}

      {chapter.grammarUsage?.length ? (
        <View className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Grammar Example Usage</Text>
          {chapter.grammarUsage.map((usage) => (
            <View key={usage.id} className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <Text className="text-sm font-semibold text-slate-900 dark:text-slate-100">{usage.pattern}</Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">{usage.meaning}</Text>
              {usage.examples.map((example, index) => (
                <View key={`${usage.id}-${index}`} className="mt-2 rounded-md border border-slate-200 dark:border-slate-700 p-2">
                  <Text className="text-sm text-slate-900 dark:text-slate-100">{example.japanese}</Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400">{example.romaji}</Text>
                  <Text className="text-sm text-slate-700 dark:text-slate-300">{example.burmese}</Text>
                  <Pressable
                    className="mt-2 rounded-md border border-sakura-700 px-2 py-1"
                    onPress={() => void playJapaneseText(example.japanese)}
                  >
                    <Text className="text-center text-xs font-semibold text-sakura-700">Play example</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null}

      {chapter.grammarTeachingNotes?.length ? (
        <View className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Essential Teaching Notes</Text>
          {chapter.grammarTeachingNotes.map((note, index) => (
            <Text key={`${index}-${note}`} className="text-sm text-slate-700 dark:text-slate-300">
              • {note}
            </Text>
          ))}
        </View>
      ) : null}

      {chapter.greetingPhrases?.length ? (
        <View className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Greeting & Intro Phrases</Text>
          {chapter.greetingPhrases.map((item) => (
            <View key={item.id} className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <Text className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.japanese}</Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">{item.romaji}</Text>
              <Text className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.burmese}</Text>
              <Pressable
                className="mt-2 rounded-lg border border-sakura-700 px-3 py-2"
                onPress={() => void playJapaneseText(item.japanese)}
              >
                <Text className="text-center font-semibold text-sakura-700">Play phrase</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      {chapter.countryPeopleLanguage?.length ? (
        <View className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Country / People / Language</Text>
          {chapter.countryPeopleLanguage.map((row) => (
            <View key={row.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <Text className="text-sm text-slate-900 dark:text-slate-100">Country: {row.country}</Text>
              <Text className="text-sm text-slate-700 dark:text-slate-300">People: {row.people}</Text>
              <Text className="text-sm text-slate-700 dark:text-slate-300">Language: {row.language}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {chapter.practice?.length ? (
        <View className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Practice</Text>
          {chapter.practice.map((item, index) => (
            <Text key={`${index}-${item}`} className="text-sm text-slate-700 dark:text-slate-300">
              {index + 1}. {item}
            </Text>
          ))}
        </View>
      ) : null}

      {chapter.sourceText ? (
        <View className="gap-2 rounded-2xl bg-white dark:bg-slate-900 p-4">
          <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Chapter Source Text</Text>
          <Text className="text-sm leading-6 text-slate-700 dark:text-slate-300">{chapter.sourceText}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
