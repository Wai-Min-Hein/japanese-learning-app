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
      <View className="flex-1 items-center justify-center bg-slate-100 p-5">
        <Text className="text-lg font-semibold text-slate-900">Chapter not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-100" contentContainerClassName="gap-4 p-5">
      <View className="rounded-2xl bg-white p-4">
        <Text className="text-2xl font-bold text-slate-900">{chapter.title}</Text>
        <Text className="mt-1 text-sm text-slate-600">{chapter.focus}</Text>
        {chapter.textbookPageRange ? (
          <Text className="mt-2 text-xs text-slate-500">Textbook pages: {chapter.textbookPageRange}</Text>
        ) : null}
      </View>

      {chapter.scriptTable?.length ? (
        <View className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Hiragana / Katakana / Romaji</Text>
          <View className="rounded-lg border border-slate-200">
            <View className="flex-row border-b border-slate-200 bg-slate-50 px-2 py-2">
              <Text className="flex-1 text-xs font-semibold text-slate-700">Hiragana</Text>
              <Text className="flex-1 text-xs font-semibold text-slate-700">Katakana</Text>
              <Text className="flex-1 text-xs font-semibold text-slate-700">Romaji</Text>
            </View>
            {chapter.scriptTable.map((row) => (
              <View key={row.id} className="border-b border-slate-100 px-2 py-2">
                <View className="flex-row">
                  <Text className="flex-1 text-sm text-slate-900">{row.hiragana}</Text>
                  <Text className="flex-1 text-sm text-slate-900">{row.katakana}</Text>
                  <Text className="flex-1 text-sm text-slate-700">{row.romaji}</Text>
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

        <Pressable className="rounded-xl bg-slate-700 px-4 py-3" onPress={stop}>
          <Text className="font-semibold text-white">Stop</Text>
        </Pressable>
      </View>

      <Text className="text-lg font-semibold text-slate-900">Vocabulary</Text>
      {chapter.vocabulary.map((item) => (
        <View key={item.id} className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-xl font-bold text-slate-900">{item.japanese}</Text>
          <Text className="text-sm text-slate-700">Hiragana: {item.hiragana}</Text>
          {item.katakana ? (
            <Text className="text-sm text-slate-700">Katakana: {item.katakana}</Text>
          ) : null}
          <Text className="text-sm text-slate-700">Romaji: {item.romaji}</Text>
          <Text className="text-sm font-semibold text-slate-900">Meaning: {item.meaning}</Text>

          <Pressable
            className="mt-1 rounded-lg border border-sakura-700 px-3 py-2"
            onPress={() => void playVocabulary(item)}
          >
            <Text className="text-center font-semibold text-sakura-700">Play {item.japanese}</Text>
          </Pressable>
        </View>
      ))}

      {chapter.translations?.length ? (
        <View className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Translations</Text>
          {chapter.translations.map((line) => (
            <View key={line.id} className="rounded-lg bg-slate-50 p-3">
              <Text className="text-sm font-semibold text-slate-900">{line.japanese}</Text>
              <Text className="text-xs text-slate-500">{line.romaji}</Text>
              <Text className="mt-1 text-sm text-slate-700">{line.burmese}</Text>
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
        <View className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Ref & Explanation</Text>
          {chapter.referenceAndExplanation.map((note, index) => (
            <Text key={`${index}-${note}`} className="text-sm text-slate-700">
              • {note}
            </Text>
          ))}
        </View>
      ) : null}

      {chapter.grammarExplanation?.length ? (
        <View className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Grammar Explanation</Text>
          {chapter.grammarExplanation.map((note, index) => (
            <Text key={`${index}-${note}`} className="text-sm text-slate-700">
              {index + 1}. {note}
            </Text>
          ))}
        </View>
      ) : null}

      {chapter.grammarUsage?.length ? (
        <View className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Grammar Example Usage</Text>
          {chapter.grammarUsage.map((usage) => (
            <View key={usage.id} className="rounded-lg bg-slate-50 p-3">
              <Text className="text-sm font-semibold text-slate-900">{usage.pattern}</Text>
              <Text className="text-xs text-slate-500">{usage.meaning}</Text>
              {usage.examples.map((example, index) => (
                <View key={`${usage.id}-${index}`} className="mt-2 rounded-md border border-slate-200 p-2">
                  <Text className="text-sm text-slate-900">{example.japanese}</Text>
                  <Text className="text-xs text-slate-500">{example.romaji}</Text>
                  <Text className="text-sm text-slate-700">{example.burmese}</Text>
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
        <View className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Essential Teaching Notes</Text>
          {chapter.grammarTeachingNotes.map((note, index) => (
            <Text key={`${index}-${note}`} className="text-sm text-slate-700">
              • {note}
            </Text>
          ))}
        </View>
      ) : null}

      {chapter.greetingPhrases?.length ? (
        <View className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Greeting & Intro Phrases</Text>
          {chapter.greetingPhrases.map((item) => (
            <View key={item.id} className="rounded-lg bg-slate-50 p-3">
              <Text className="text-sm font-semibold text-slate-900">{item.japanese}</Text>
              <Text className="text-xs text-slate-500">{item.romaji}</Text>
              <Text className="mt-1 text-sm text-slate-700">{item.burmese}</Text>
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
        <View className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Country / People / Language</Text>
          {chapter.countryPeopleLanguage.map((row) => (
            <View key={row.id} className="rounded-lg border border-slate-200 p-3">
              <Text className="text-sm text-slate-900">Country: {row.country}</Text>
              <Text className="text-sm text-slate-700">People: {row.people}</Text>
              <Text className="text-sm text-slate-700">Language: {row.language}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {chapter.practice?.length ? (
        <View className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Practice</Text>
          {chapter.practice.map((item, index) => (
            <Text key={`${index}-${item}`} className="text-sm text-slate-700">
              {index + 1}. {item}
            </Text>
          ))}
        </View>
      ) : null}

      {chapter.sourceText ? (
        <View className="gap-2 rounded-2xl bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Chapter Source Text</Text>
          <Text className="text-sm leading-6 text-slate-700">{chapter.sourceText}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
