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

      <View className="rounded-2xl bg-white p-4">
        <Text className="text-base font-semibold text-slate-900">Kana</Text>
        <Text className="mt-2 text-xs text-slate-500">Hiragana</Text>
        <Text className="text-sm text-slate-900">{chapter.kana.hiragana.join(' ・ ')}</Text>
        <Text className="mt-2 text-xs text-slate-500">Katakana</Text>
        <Text className="text-sm text-slate-900">{chapter.kana.katakana.join(' ・ ')}</Text>
        <Text className="mt-2 text-xs text-slate-500">Romaji</Text>
        <Text className="text-sm text-slate-700">{chapter.kana.romaji.join(' ・ ')}</Text>
      </View>

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
