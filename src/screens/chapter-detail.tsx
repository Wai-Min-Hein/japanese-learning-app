import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { getChapterById } from '@/server/db';
import { useVocabularyAudio } from '@/hooks/use-vocabulary-audio';

type DepartmentFloorRow = {
  floor: string;
  japanese: string;
  burmese: string;
};

const CHAPTER2_COMMON_NAMES = [
  { no: 1, name: '佐藤', reading: 'さとう' },
  { no: 2, name: '鈴木', reading: 'すずき' },
  { no: 3, name: '高橋', reading: 'たかはし' },
  { no: 4, name: '田中', reading: 'たなか' },
  { no: 5, name: '渡辺', reading: 'わたなべ' },
  { no: 6, name: '伊藤', reading: 'いとう' },
  { no: 7, name: '山本', reading: 'やまもと' },
  { no: 8, name: '中村', reading: 'なかむら' },
  { no: 9, name: '小林', reading: 'こばやし' },
  { no: 10, name: '加藤', reading: 'かとう' },
  { no: 11, name: '吉田', reading: 'よしだ' },
  { no: 12, name: '山田', reading: 'やまだ' },
  { no: 13, name: '佐々木', reading: 'ささき' },
  { no: 14, name: '斎藤', reading: 'さいとう' },
  { no: 15, name: '山口', reading: 'やまぐち' },
  { no: 16, name: '松本', reading: 'まつもと' },
  { no: 17, name: '井上', reading: 'いのうえ' },
  { no: 18, name: '木村', reading: 'きむら' },
  { no: 19, name: '林', reading: 'はやし' },
  { no: 20, name: '清水', reading: 'しみず' },
];

function parseDepartmentFloorGuide(lines: string[]): DepartmentFloorRow[] {
  return lines
    .map((line) => line.replace(/\*\*/g, '').trim())
    .map((line) => {
      const match = line.match(/^(.+?):\s*(.+?)\s*-\s*(.+)$/);
      if (!match) {
        return null;
      }

      return {
        floor: match[1].trim(),
        japanese: match[2].trim(),
        burmese: match[3].trim(),
      };
    })
    .filter((row): row is DepartmentFloorRow => row !== null);
}

export default function ChapterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const chapter = getChapterById(id ?? '');
  const { isPlaying, playVocabulary, playJapaneseText, playAllVocabulary, stop } = useVocabularyAudio();
  const chapter3FloorGuide = chapter?.id === 'chapter-3' && chapter.referenceAndExplanation
    ? parseDepartmentFloorGuide(chapter.referenceAndExplanation)
    : [];

  if (!chapter) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 dark:bg-slate-950 p-5">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">Chapter not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-100 dark:bg-slate-950" contentContainerClassName="gap-4 px-5 pb-5 pt-10">
      <Pressable className="self-start rounded-lg border border-sakura-700 px-4 py-2" onPress={() => router.back()}>
        <Text className="font-semibold text-sakura-700">← Back</Text>
      </Pressable>

      <View className="rounded-2xl bg-white dark:bg-slate-900 p-4">
        <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100">{chapter.title}</Text>
        <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">{chapter.focus}</Text>
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
          {chapter.id === 'chapter-2' ? (
            <View className="gap-4">
              <View className="rounded-xl border border-slate-300 dark:border-slate-700">
                <View className="border-b border-slate-300 bg-slate-100 px-3 py-3 dark:border-slate-700 dark:bg-slate-800">
                  <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    ၃။ ကိုးကားစကားလုံးများနှင့်အချက်အလက်များ
                  </Text>
                  <Text className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">なまえ</Text>
                  <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">名前 အမည်များ</Text>
                  <Text className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    ဂျပန်လူမျိုးများတွင် အသုံးများသော မျိုးရိုးအမည်များ
                  </Text>
                </View>

                <View className="flex-row flex-wrap">
                  {CHAPTER2_COMMON_NAMES.map((item) => (
                    <View
                      key={item.no}
                      className="w-1/2 flex-row border-b border-r border-slate-200 px-3 py-3 dark:border-slate-700"
                    >
                      <Text className="w-8 text-base font-semibold text-slate-700 dark:text-slate-300">{item.no}</Text>
                      <View>
                        <Text className="text-xl font-bold text-slate-900 dark:text-slate-100">{item.name}</Text>
                        <Text className="text-xs text-slate-500 dark:text-slate-400">{item.reading}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                
              </View>

              <View className="rounded-xl border border-dashed border-slate-400 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800">
                <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">နှုတ်ခွန်းဆက် အသုံးများ</Text>
                <Text className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">初めまして。</Text>
                <Text className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  အလုပ်သဘောအရတွေ့ဆုံရသောအခါ လိပ်စာကတ်ကိုဖလှယ်ကြသည်။
                </Text>
                <Text className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
                  どうぞよろしく お願いします。
                </Text>
                <Text className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  အိမ်ပြောင်းသောအခါ အိမ်သစ်မှအိမ်နီးနားချင်းတို့ထံ ပဝါ၊ ဆပ်ပြာ၊ မုန့်အစရှိသည်တို့ကို ကမ်းလှမ်းခြင်းအားဖြင့်
                  သွားရောက်မိတ်ဆက်သင့်သည်။
                </Text>
              </View>
            </View>
          ) : chapter.id === 'chapter-3' && chapter3FloorGuide.length ? (
            <View className="overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">
              <View className="border-b border-slate-300 bg-slate-100 px-3 py-3 dark:border-slate-700 dark:bg-slate-800">
                <Text className="text-base font-semibold text-slate-900 dark:text-slate-100">デパート (ကုန်တိုက်)</Text>
                <Text className="mt-1 text-xs text-slate-600 dark:text-slate-300">အထပ်အလိုက် ဌာနများ</Text>
              </View>
              {chapter3FloorGuide.map((row, index) => (
                <View
                  key={`${row.floor}-${index}`}
                  className="flex-row border-b border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900"
                >
                  <View className="w-24 justify-center pr-2">
                    <Text className="text-sm font-bold text-slate-900 dark:text-slate-100">{row.floor}</Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold text-slate-900 dark:text-slate-100">{row.japanese}</Text>
                    <Text className="text-sm text-slate-700 dark:text-slate-300">{row.burmese}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <>
              {chapter.referenceAndExplanation.map((note, index) => (
                <Text key={`${index}-${note}`} className="text-sm text-slate-700 dark:text-slate-300">
                  • {note}
                </Text>
              ))}
            </>
          )}
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
