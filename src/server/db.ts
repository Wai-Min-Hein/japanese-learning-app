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
  kana: {
    hiragana: string[];
    katakana: string[];
    romaji: string[];
  };
  vocabulary: VocabularyItem[];
  translations?: {
    id: string;
    japanese: string;
    romaji: string;
    burmese: string;
  }[];
  referenceAndExplanation?: string[];
  grammarExplanation?: string[];
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
  practice?: string[];
  sourceText?: string;
};

export type LearningEvent = {
  id: string;
  title: string;
  dateISO: string;
  type: 'lesson' | 'review';
};

const CHAPTERS: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Chapter 1 - Self Introduction',
    focus: 'မိတ်ဆက်ခြင်း၊ နိုင်ငံနှင့် အလုပ်အကိုင်',
    textbookPageRange: '10-15',
    kana: {
      hiragana: ['わ', 'た', 'し', 'で', 'す', 'は'],
      katakana: ['ワ', 'タ', 'シ', 'デ', 'ス', 'ハ'],
      romaji: ['wa', 'ta', 'shi', 'de', 'su', 'ha'],
    },
    vocabulary: [
      { id: 'c1-v1', japanese: 'わたし', hiragana: 'わたし', romaji: 'watashi', burmesePronunciation: '', meaning: 'ကျွန်ုပ်၊ ကျွန်တော်/ကျွန်မ' },
      { id: 'c1-v2', japanese: 'あなた', hiragana: 'あなた', romaji: 'anata', burmesePronunciation: '', meaning: 'သင်၊ ခင်ဗျား၊ ရှင်' },
      { id: 'c1-v3', japanese: 'あのひと', hiragana: 'あのひと', romaji: 'anohito', burmesePronunciation: '', meaning: 'ဟိုလူ' },
      { id: 'c1-v4', japanese: 'あのかた', hiragana: 'あのかた', romaji: 'anokata', burmesePronunciation: '', meaning: 'ဟိုပုဂ္ဂိုလ် (ယဉ်ကျေး)' },
      { id: 'c1-v5', japanese: '～さん', hiragana: 'さん', romaji: 'san', burmesePronunciation: '', meaning: 'ဦး~၊ ဒေါ်~ (နာမည်နောက် ယဉ်ကျေးနောက်ဆက်)' },
      { id: 'c1-v6', japanese: '～ちゃん', hiragana: 'ちゃん', romaji: 'chan', burmesePronunciation: '', meaning: 'ကလေးနာမည်နောက် နောက်ဆက်' },
      { id: 'c1-v7', japanese: '～じん', hiragana: 'じん', romaji: 'jin', burmesePronunciation: '', meaning: '~လူမျိုး' },
      { id: 'c1-v8', japanese: 'せんせい', hiragana: 'せんせい', romaji: 'sensei', burmesePronunciation: '', meaning: 'ဆရာ/ဆရာမ (ကိုယ်အလုပ်ကို မသုံး)' },
      { id: 'c1-v9', japanese: 'きょうし', hiragana: 'きょうし', romaji: 'kyoshi', burmesePronunciation: '', meaning: 'ကျောင်းဆရာ၊ နည်းပြဆရာ' },
      { id: 'c1-v10', japanese: 'がくせい', hiragana: 'がくせい', romaji: 'gakusei', burmesePronunciation: '', meaning: 'ကျောင်းသား/ကျောင်းသူ' },
      { id: 'c1-v11', japanese: 'かいしゃいん', hiragana: 'かいしゃいん', romaji: 'kaishain', burmesePronunciation: '', meaning: 'ကုမ္ပဏီဝန်ထမ်း' },
      { id: 'c1-v12', japanese: 'ぎんこういん', hiragana: 'ぎんこういん', romaji: 'ginkoin', burmesePronunciation: '', meaning: 'ဘဏ်ဝန်ထမ်း' },
      { id: 'c1-v13', japanese: 'いしゃ', hiragana: 'いしゃ', romaji: 'isha', burmesePronunciation: '', meaning: 'ဆရာဝန်' },
      { id: 'c1-v14', japanese: 'けんきゅうしゃ', hiragana: 'けんきゅうしゃ', romaji: 'kenkyusha', burmesePronunciation: '', meaning: 'သုတေသနပညာရှင်' },
      { id: 'c1-v15', japanese: 'だいがく', hiragana: 'だいがく', romaji: 'daigaku', burmesePronunciation: '', meaning: 'တက္ကသိုလ်' },
      { id: 'c1-v16', japanese: 'びょういん', hiragana: 'びょういん', romaji: 'byoin', burmesePronunciation: '', meaning: 'ဆေးရုံ၊ ဆေးခန်း' },
      { id: 'c1-v17', japanese: 'だれ', hiragana: 'だれ', romaji: 'dare', burmesePronunciation: '', meaning: 'ဘယ်သူ' },
      { id: 'c1-v18', japanese: 'どなた', hiragana: 'どなた', romaji: 'donata', burmesePronunciation: '', meaning: 'ဘယ်သူ (ယဉ်ကျေး)' },
      { id: 'c1-v19', japanese: '～さい', hiragana: 'さい', romaji: 'sai', burmesePronunciation: '', meaning: 'အသက် -နှစ်' },
      { id: 'c1-v20', japanese: 'なんさい', hiragana: 'なんさい', romaji: 'nansai', burmesePronunciation: '', meaning: 'အသက် ဘယ်နှနှစ်' },
      { id: 'c1-v21', japanese: 'おいくつ', hiragana: 'おいくつ', romaji: 'oikutsu', burmesePronunciation: '', meaning: 'အသက် ဘယ်နှနှစ် (ယဉ်ကျေး)' },
      { id: 'c1-v22', japanese: 'はじめまして', hiragana: 'はじめまして', romaji: 'hajimemashite', burmesePronunciation: '', meaning: 'တွေ့ရတာ ဝမ်းသာပါတယ်' },
      { id: 'c1-v23', japanese: '～からきました', hiragana: 'からきました', romaji: 'kara kimashita', burmesePronunciation: '', meaning: '~က/မှ လာပါတယ်' },
      { id: 'c1-v24', japanese: 'どうぞよろしくおねがいします', hiragana: 'どうぞよろしくおねがいします', romaji: 'dozo yoroshiku onegaishimasu', burmesePronunciation: '', meaning: 'ရင်းရင်းနှီးနှီး ဆက်ဆံပါ' },
      { id: 'c1-v25', japanese: 'しつれいですが', hiragana: 'しつれいですが', romaji: 'shitsurei desu ga', burmesePronunciation: '', meaning: 'တစ်ဆိတ်လောက် (မေးခွန်းမမေးမီ)' },
      { id: 'c1-v26', japanese: 'アメリカ', hiragana: 'あめりか', katakana: 'アメリカ', romaji: 'amerika', burmesePronunciation: '', meaning: 'အမေရိက' },
      { id: 'c1-v27', japanese: 'イギリス', hiragana: 'いぎりす', katakana: 'イギリス', romaji: 'igirisu', burmesePronunciation: '', meaning: 'အင်္ဂလန်' },
      { id: 'c1-v28', japanese: 'インド', hiragana: 'いんど', katakana: 'インド', romaji: 'indo', burmesePronunciation: '', meaning: 'အိန္ဒိယ' },
      { id: 'c1-v29', japanese: 'タイ', hiragana: 'たい', katakana: 'タイ', romaji: 'tai', burmesePronunciation: '', meaning: 'ထိုင်း' },
      { id: 'c1-v30', japanese: 'ちゅうごく', hiragana: 'ちゅうごく', romaji: 'chugoku', burmesePronunciation: '', meaning: 'တရုတ်' },
      { id: 'c1-v31', japanese: 'にほん', hiragana: 'にほん', romaji: 'nihon', burmesePronunciation: '', meaning: 'ဂျပန်' },
    ],
    translations: [
      {
        id: 'c1-t-pattern-1',
        japanese: 'わたしは マイクミラー です。',
        romaji: 'Watashi wa Maiku Mira desu.',
        burmese: 'ကျွန်တော်က မိုက်မီလာ ပါ။',
      },
      {
        id: 'c1-t-pattern-2',
        japanese: 'サントスさん は がくせい じゃありません。',
        romaji: 'Santos-san wa gakusei ja arimasen.',
        burmese: 'မစ္စတာဆန်းတိုးစုက ကျောင်းသား မဟုတ်ပါဘူး။',
      },
      {
        id: 'c1-t-pattern-3',
        japanese: 'ミラーさん は かいしゃいん ですか。',
        romaji: 'Mira-san wa kaishain desu ka?',
        burmese: 'မစ္စတာမီလာက ကုမ္ပဏီဝန်ထမ်းလား။',
      },
      {
        id: 'c1-t-pattern-4',
        japanese: 'サントスさん も かいしゃいん です。',
        romaji: 'Santos-san mo kaishain desu.',
        burmese: 'မစ္စတာဆန်းတိုးစုလည်း ကုမ္ပဏီဝန်ထမ်းပါ။',
      },
      {
        id: 'c1-t-example-1',
        japanese: 'あのひと は だれですか。...ワットさん です。',
        romaji: 'Ano hito wa dare desu ka? ... Watto-san desu.',
        burmese: 'ဟိုပုဂ္ဂိုလ်က ဘယ်သူပါလဲ။ ... မစ္စတာဝပ် ပါ။',
      },
      {
        id: 'c1-t-example-2',
        japanese: 'テレサちゃん は なんさい ですか。...きゅうさい です。',
        romaji: 'Teresa-chan wa nansai desu ka? ... kyusai desu.',
        burmese: 'တဲလဲဆလေးက ဘယ်နှနှစ်လဲ။ ... ၉နှစ်ပါ။',
      },
    ],
    referenceAndExplanation: [
      'နိုင်ငံ၊ လူမျိုး၊ ဘာသာစကားကို ဇယားဖြင့် ကိုးကားသင်နိုင်သည်။',
      'ဥပမာ: アメリカ / アメリカ人 / 英語 အစရှိသဖြင့်။',
      '「さん」ကို တခြားသူနာမည်နောက်တွင် သုံးပြီး ကိုယ့်နာမည်နောက် မသုံးရ။',
    ],
    grammarExplanation: [
      'N1 は N2 です : ယဉ်ကျေးသော သဘောထားဖြင့် "သည်/ပါ" ကိုပြသည်။',
      'N1 は N2 じゃ(では)ありません : အငြင်းဝါကျ "မဟုတ်ပါဘူး"။',
      'N1 は N2 ですか : ဝါကျအဆုံး か ဖြင့် အမေးဝါကျ တည်ဆောက်သည်။',
      'N も : "လည်း" ဟု အဓိပ္ပာယ်ရပြီး ရှေ့အကြောင်းအရာနှင့် တူညီသည့်အခါ သုံးသည်။',
      'N1 の N2 : の သည် ပိုင်ဆိုင်မှု/ဆက်စပ်မှု ပြသသည်။ ဥပမာ IMC の 社員。',
      'は (wa) သည် topic marker ဖြစ်ပြီး ဝါကျအဓိကအကြောင်းအရာကို ညွှန်းသည်။',
      'です သည် polite sentence ending ဖြစ်ပြီး beginner lesson 1 တွင် အခြေခံဖြစ်သည်။',
      'じゃありません / ではありません သည် noun sentence negative form ဖြစ်သည်။',
      'ですか အမေးဝါကျတွင် အဖြေကို はい / いいえ ဖြင့် စတင်ဖြေဆိုနိုင်သည်။',
    ],
    greetingPhrases: [
      {
        id: 'c1-g1',
        japanese: 'はじめまして。',
        romaji: 'Hajimemashite.',
        burmese: 'တွေ့ရတာဝမ်းသာပါတယ် (ပထမဆုံးမိတ်ဆက်ချိန်)',
      },
      {
        id: 'c1-g2',
        japanese: '〜からきました。',
        romaji: '...kara kimashita.',
        burmese: '~က/မှ လာပါတယ်',
      },
      {
        id: 'c1-g3',
        japanese: 'どうぞ よろしく おねがいします。',
        romaji: 'Dozo yoroshiku onegaishimasu.',
        burmese: 'ရင်းရင်းနှီးနှီး ဆက်ဆံပေးပါ',
      },
      {
        id: 'c1-g4',
        japanese: 'しつれいですが。',
        romaji: 'Shitsurei desu ga.',
        burmese: 'တစ်ဆိတ်လောက် (မေးခွန်းမမေးမီ)',
      },
      {
        id: 'c1-g5',
        japanese: 'おなまえ は？',
        romaji: 'Onamae wa?',
        burmese: 'နာမည်ဘယ်လိုခေါ်ပါသလဲ',
      },
      {
        id: 'c1-g6',
        japanese: 'こちらは 〜さん です。',
        romaji: 'Kochira wa ...san desu.',
        burmese: 'ဒီဘက်က ~ပါ',
      },
    ],
    countryPeopleLanguage: [
      { id: 'c1-c1', country: 'アメリカ', people: 'アメリカ人', language: '英語' },
      { id: 'c1-c2', country: 'イギリス', people: 'イギリス人', language: '英語' },
      { id: 'c1-c3', country: 'インド', people: 'インド人', language: 'ヒンディー語' },
      { id: 'c1-c4', country: 'インドネシア', people: 'インドネシア人', language: 'インドネシア語' },
      { id: 'c1-c5', country: '韓国', people: '韓国人', language: '韓国語' },
      { id: 'c1-c6', country: 'タイ', people: 'タイ人', language: 'タイ語' },
      { id: 'c1-c7', country: '中国', people: '中国人', language: '中国語' },
      { id: 'c1-c8', country: 'ドイツ', people: 'ドイツ人', language: 'ドイツ語' },
      { id: 'c1-c9', country: '日本', people: '日本人', language: '日本語' },
      { id: 'c1-c10', country: 'ブラジル', people: 'ブラジル人', language: 'ポルトガル語' },
    ],
    practice: [
      'ကျွန်တော်က မိုက်မီလာ ပါ။ (わたしは マイク・ミラーです。)',
      'မစ္စတာဆန်းတိုးစုက ကျောင်းသား မဟုတ်ပါဘူး။ (サントスさんは がくせいじゃありません。)',
      'မစ္စတာမီလာက ကုမ္ပဏီဝန်ထမ်းလား။ (ミラーさんは かいしゃいんですか。)',
      'မစ္စတာဆန်းတိုးစုလည်း ကုမ္ပဏီဝန်ထမ်းပါ။ (サントスさんも かいしゃいんです。)',
      'ဟိုပုဂ္ဂိုလ်က ဘယ်သူပါလဲ။ (あのひとは だれですか。)',
      'တယ်ရီဆာလေးက ဘယ်နှနှစ်လဲ။ (テレサちゃんは なんさいですか。)',
      'はい / いいえ အဖြေစတိုင်ကို pattern 3 နဲ့တွဲပြီးလေ့ကျင့်ပါ။',
    ],
    sourceText: `သင်ခန်းစာ - ၁ (Chapter 1)
### **ဝေါဟာရများ (Vocabulary)**

သင်ခန်းစာ - ၁ အတွက် အခြေခံစကားလုံးများမှာ-

* **わたし** : ကျွန်ုပ်၊ ကျွန်တော်/ကျွန်မ 
* **あなた** : သင်၊ ခင်ဗျား၊ ရှင် 
* **あのひと (あのかた)** : ဟိုလူ (ဟိုပုဂ္ဂိုလ် - ယဉ်ကျေးသောအသုံး) 
* **～さん** : ဦး~၊ ဒေါ်~ (အမည်များနောက်တွင် ထည့်သုံးသော ယဉ်ကျေးသည့် နောက်ဆက်တွဲ) 
* **～ちゃん** : ကလေးအမည်များနောက်တွင် ထည့်သုံးသော နောက်ဆက်တွဲ 
* **～じん** : ~လူမျိုး (ဥပမာ- အမေရိကန်လူမျိုး) 
* **せんせい** : ဆရာ/ဆရာမ (မိမိအလုပ်ကို ပြောရာတွင် မသုံးပါ) 
* **きょうし** : ကျောင်းဆရာ၊ နည်းပြဆရာ 
* **がくせい** : ကျောင်းသား/ကျောင်းသူ 
* **かいしゃいん** : ကုမ္ပဏီဝန်ထမ်း 
* **ぎんこういん** : ဘဏ်ဝန်ထမ်း 
* **いしゃ** : ဆရာဝန် 
* **けんきゅうしゃ** : သုတေသနပညာရှင် 
* **だいがく** : တက္ကသိုလ် 
* **びょういん** : ဆေးရုံ၊ ဆေးခန်း 
* **だれ (どなた)** : ဘယ်သူ (ဘယ်သူ - ယဉ်ကျေးသောအသုံး) 
* **～さい** : -နှစ် (အသက်) 
* **なんさい (おいくつ)** : အသက်ဘယ်နှနှစ်လဲ 

### **မိတ်ဆက်စကားများနှင့် နိုင်ငံအမည်များ**

* **初めまして (はじめまして)** : တွေ့ရတာ ဝမ်းသာပါတယ် (ပထမဆုံး မိတ်ဆက်ရာတွင် သုံးသည်) 
* **～から来ました** : ~က/မှ လာပါတယ် 
* **[どうぞ] よろしく [お願いします]** : ရင်းရင်းနှီးနှီး ဆက်ဆံပါလို့ တောင်းဆိုပါတယ် 
* **失礼ですが (しつれいですが)** : တစ်ဆိတ်လောက် (ကိုယ်ရေးကိုယ်တာ မေးခွန်းများ မစမီ သုံးသည်) 
* **အဓိကနိုင်ငံများ** : アメリカ (အမေရိက)၊ イギリス (အင်္ဂလန်)၊ インド (အိန္ဒိယ)၊ タイ (ထိုင်း)၊ 中国 (တရုတ်)၊ 日本 (ဂျပန်) 

### **ဘာသာပြန် (Translation)**

**ဝါကျပုံစံများ (Sentence Patterns)**
1. ကျွန်တော်က မိုက်မီလာ ပါ။ 
2. မစ္စတာဆန်းတိုးစုက ကျောင်းသား မဟုတ်ပါဘူး။ 
3. မစ္စတာမီလာက ကုမ္ပဏီဝန်ထမ်းလား။ 
4. မစ္စတာဆန်းတိုးစုလည်း ကုမ္ပဏီဝန်ထမ်းပါ။ 

**နမူနာဝါကျများ (Example Sentences)**
* ဟိုပုဂ္ဂိုလ်က ဘယ်သူပါလဲ။ ...မစ္စတာဝပ် ပါ။ 
* တဲလဲဆလေးက ဘယ်နှနှစ်လဲ။ ...၉နှစ်ပါ။ 

### **ကိုးကားစကားလုံးများ (Reference)**
နိုင်ငံ၊ လူမျိုးနှင့် ဘာသာစကားများကို ဇယားဖြင့် ဖော်ပြထားသည်။

### **သဒ္ဒါရှင်းလင်းချက် (Grammar Notes - ၁/၂)**
1. **N1 は N2 です**
2. **N1 は N2 じゃ(では)ありません**
3. **N1 は N2 ですか**
4. **N も**
5. **N1 の N2**
6. **～さん အသုံးပြုမှု**`,
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2 - This/That',
    focus: 'ပစ္စည်းများကို ညွှန်ပြခြင်းနှင့် မေးခြင်း',
    kana: {
      hiragana: ['こ', 'そ', 'あ', 'れ', 'ど', 'の'],
      katakana: ['コ', 'ソ', 'ア', 'レ', 'ド', 'ノ'],
      romaji: ['ko', 'so', 'a', 're', 'do', 'no'],
    },
    vocabulary: [
      { id: 'c2-v1', japanese: 'これ', hiragana: 'これ', romaji: 'kore', burmesePronunciation: 'ကိုရေး', meaning: 'ဒီဟာ' },
      { id: 'c2-v2', japanese: 'それ', hiragana: 'それ', romaji: 'sore', burmesePronunciation: 'ဆိုရေး', meaning: 'အဲဒီဟာ' },
      { id: 'c2-v3', japanese: 'あれ', hiragana: 'あれ', romaji: 'are', burmesePronunciation: 'အာရေး', meaning: 'ဟိုဟာ' },
      { id: 'c2-v4', japanese: 'ほん', hiragana: 'ほん', romaji: 'hon', burmesePronunciation: 'ဟွန်း', meaning: 'စာအုပ်' },
      { id: 'c2-v5', japanese: 'じしょ', hiragana: 'じしょ', romaji: 'jisho', burmesePronunciation: 'ဂျိရှိော', meaning: 'အဘိဓာန်' },
      { id: 'c2-v6', japanese: 'カメラ', hiragana: 'かめら', katakana: 'カメラ', romaji: 'kamera', burmesePronunciation: 'ကာမဲရာ', meaning: 'ကင်မရာ' },
    ],
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3 - Places',
    focus: 'နေရာမေးခြင်း၊ ဘယ်မှာလဲ',
    kana: {
      hiragana: ['こ', 'ち', 'ら', 'ど', 'こ', 'え'],
      katakana: ['コ', 'チ', 'ラ', 'ド', 'コ', 'エ'],
      romaji: ['ko', 'chi', 'ra', 'do', 'ko', 'e'],
    },
    vocabulary: [
      { id: 'c3-v1', japanese: 'ここ', hiragana: 'ここ', romaji: 'koko', burmesePronunciation: 'ကိုကို', meaning: 'ဒီနေရာ' },
      { id: 'c3-v2', japanese: 'そこ', hiragana: 'そこ', romaji: 'soko', burmesePronunciation: 'ဆိုကို', meaning: 'အဲဒီနေရာ' },
      { id: 'c3-v3', japanese: 'あそこ', hiragana: 'あそこ', romaji: 'asoko', burmesePronunciation: 'အဆိုကို', meaning: 'ဟိုနေရာ' },
      { id: 'c3-v4', japanese: 'トイレ', hiragana: 'といれ', katakana: 'トイレ', romaji: 'toire', burmesePronunciation: 'တိုအိရေး', meaning: 'အိမ်သာ' },
      { id: 'c3-v5', japanese: 'きょうしつ', hiragana: 'きょうしつ', romaji: 'kyoshitsu', burmesePronunciation: 'ကျိုးးရှိတ်စု', meaning: 'စာသင်ခန်း' },
      { id: 'c3-v6', japanese: 'うけつけ', hiragana: 'うけつけ', romaji: 'uketsuke', burmesePronunciation: 'ဦခဲစ်စုခဲ', meaning: 'ဧည့်ခံကောင်တာ' },
    ],
  },
  {
    id: 'chapter-4',
    title: 'Chapter 4 - Time & Schedule',
    focus: 'အချိန်၊ နေ့စဉ် လုပ်ရိုးလုပ်စဉ်',
    kana: {
      hiragana: ['い', 'ま', 'じ', 'ふん', 'はん', 'ご'],
      katakana: ['イ', 'マ', 'ジ', 'フン', 'ハン', 'ゴ'],
      romaji: ['i', 'ma', 'ji', 'fun', 'han', 'go'],
    },
    vocabulary: [
      { id: 'c4-v1', japanese: 'いま', hiragana: 'いま', romaji: 'ima', burmesePronunciation: 'အိမာ', meaning: 'အခု' },
      { id: 'c4-v2', japanese: 'じ', hiragana: 'じ', romaji: 'ji', burmesePronunciation: 'ဂျိ', meaning: 'နာရီ' },
      { id: 'c4-v3', japanese: 'ふん', hiragana: 'ふん', romaji: 'fun', burmesePronunciation: 'ဖွန်း', meaning: 'မိနစ်' },
      { id: 'c4-v4', japanese: 'はん', hiragana: 'はん', romaji: 'han', burmesePronunciation: 'ဟန်း', meaning: 'တစ်ဝက်' },
      { id: 'c4-v5', japanese: 'まいにち', hiragana: 'まいにち', romaji: 'mainichi', burmesePronunciation: 'မိုင်နိချိ', meaning: 'နေ့တိုင်း' },
      { id: 'c4-v6', japanese: 'にちようび', hiragana: 'にちようび', romaji: 'nichiyobi', burmesePronunciation: 'နိချိယိုဘိ', meaning: 'တနင်္ဂနွေနေ့' },
    ],
  },
  {
    id: 'chapter-5',
    title: 'Chapter 5 - Go/Come/Return',
    focus: 'သွားသည်၊ လာသည်၊ ပြန်သည်',
    kana: {
      hiragana: ['い', 'き', 'ま', 'す', 'き', 'ま', 'す'],
      katakana: ['イ', 'キ', 'マ', 'ス', 'キ', 'マ', 'ス'],
      romaji: ['i', 'ki', 'ma', 'su', 'ki', 'ma', 'su'],
    },
    vocabulary: [
      { id: 'c5-v1', japanese: 'いきます', hiragana: 'いきます', romaji: 'ikimasu', burmesePronunciation: 'အိခိမတ်စ', meaning: 'သွားသည်' },
      { id: 'c5-v2', japanese: 'きます', hiragana: 'きます', romaji: 'kimasu', burmesePronunciation: 'ခိမတ်စ', meaning: 'လာသည်' },
      { id: 'c5-v3', japanese: 'かえります', hiragana: 'かえります', romaji: 'kaerimasu', burmesePronunciation: 'ခအဲရိမတ်စ', meaning: 'ပြန်သည်' },
      { id: 'c5-v4', japanese: 'えき', hiragana: 'えき', romaji: 'eki', burmesePronunciation: 'အဲခိ', meaning: 'ဘူတာရုံ' },
      { id: 'c5-v5', japanese: 'ひこうき', hiragana: 'ひこうき', romaji: 'hikoki', burmesePronunciation: 'ဟိကိုးခိ', meaning: 'လေယာဉ်' },
      { id: 'c5-v6', japanese: 'でんしゃ', hiragana: 'でんしゃ', romaji: 'densha', burmesePronunciation: 'ဒဲန်ရှ', meaning: 'ရထား' },
    ],
  },
  {
    id: 'chapter-6',
    title: 'Chapter 6 - Eating & Drinking',
    focus: 'စားသောက်ခြင်း',
    kana: {
      hiragana: ['た', 'べ', 'ま', 'す', 'の', 'み'],
      katakana: ['タ', 'ベ', 'マ', 'ス', 'ノ', 'ミ'],
      romaji: ['ta', 'be', 'ma', 'su', 'no', 'mi'],
    },
    vocabulary: [
      { id: 'c6-v1', japanese: 'たべます', hiragana: 'たべます', romaji: 'tabemasu', burmesePronunciation: 'တာဘဲမတ်စ', meaning: 'စားသည်' },
      { id: 'c6-v2', japanese: 'のみます', hiragana: 'のみます', romaji: 'nomimasu', burmesePronunciation: 'နိုမိမတ်စ', meaning: 'သောက်သည်' },
      { id: 'c6-v3', japanese: 'みます', hiragana: 'みます', romaji: 'mimasu', burmesePronunciation: 'မိမတ်စ', meaning: 'ကြည့်သည်' },
      { id: 'c6-v4', japanese: 'ごはん', hiragana: 'ごはん', romaji: 'gohan', burmesePronunciation: 'ဂိုဟန်', meaning: 'ထမင်း/အစားအစာ' },
      { id: 'c6-v5', japanese: 'みず', hiragana: 'みず', romaji: 'mizu', burmesePronunciation: 'မိဇု', meaning: 'ရေ' },
      { id: 'c6-v6', japanese: 'パン', hiragana: 'ぱん', katakana: 'パン', romaji: 'pan', burmesePronunciation: 'ပန်', meaning: 'ပေါင်မုန့်' },
    ],
  },
  {
    id: 'chapter-7',
    title: 'Chapter 7 - Give & Receive',
    focus: 'ပေးခြင်း၊ လက်ခံခြင်း',
    kana: {
      hiragana: ['あ', 'げ', 'ま', 'す', 'も', 'ら'],
      katakana: ['ア', 'ゲ', 'マ', 'ス', 'モ', 'ラ'],
      romaji: ['a', 'ge', 'ma', 'su', 'mo', 'ra'],
    },
    vocabulary: [
      { id: 'c7-v1', japanese: 'あげます', hiragana: 'あげます', romaji: 'agemasu', burmesePronunciation: 'အဂဲမတ်စ', meaning: 'ပေးသည်' },
      { id: 'c7-v2', japanese: 'もらいます', hiragana: 'もらいます', romaji: 'moraimasu', burmesePronunciation: 'မိုလိုင်မတ်စ', meaning: 'ရယူသည်' },
      { id: 'c7-v3', japanese: 'かします', hiragana: 'かします', romaji: 'kashimasu', burmesePronunciation: 'ခရှိမတ်စ', meaning: 'ငှားပေးသည်' },
      { id: 'c7-v4', japanese: 'かります', hiragana: 'かります', romaji: 'karimasu', burmesePronunciation: 'ခရိမတ်စ', meaning: 'ငှားယူသည်' },
      { id: 'c7-v5', japanese: 'てがみ', hiragana: 'てがみ', romaji: 'tegami', burmesePronunciation: 'တဲဂမိ', meaning: 'စာ' },
      { id: 'c7-v6', japanese: 'プレゼント', hiragana: 'ぷれぜんと', katakana: 'プレゼント', romaji: 'purezento', burmesePronunciation: 'ပုရဲဇဲန်တို', meaning: 'လက်ဆောင်' },
    ],
  },
  {
    id: 'chapter-8',
    title: 'Chapter 8 - Adjectives',
    focus: 'အရည်အသွေးဖော်ပြခြင်း',
    kana: {
      hiragana: ['お', 'お', 'き', 'い', 'ち', 'い', 'さ'],
      katakana: ['オ', 'オ', 'キ', 'イ', 'チ', 'イ', 'サ'],
      romaji: ['o', 'o', 'ki', 'i', 'chi', 'i', 'sa'],
    },
    vocabulary: [
      { id: 'c8-v1', japanese: 'おおきい', hiragana: 'おおきい', romaji: 'okii', burmesePronunciation: 'အိုးခီး', meaning: 'ကြီးသည်' },
      { id: 'c8-v2', japanese: 'ちいさい', hiragana: 'ちいさい', romaji: 'chiisai', burmesePronunciation: 'ချီးစိုင်', meaning: 'သေးသည်' },
      { id: 'c8-v3', japanese: 'あたらしい', hiragana: 'あたらしい', romaji: 'atarashii', burmesePronunciation: 'အတရာရှိး', meaning: 'အသစ်' },
      { id: 'c8-v4', japanese: 'ふるい', hiragana: 'ふるい', romaji: 'furui', burmesePronunciation: 'ဖုရုအိ', meaning: 'ဟောင်းသည်' },
      { id: 'c8-v5', japanese: 'いい', hiragana: 'いい', romaji: 'ii', burmesePronunciation: 'အီး', meaning: 'ကောင်းသည်' },
      { id: 'c8-v6', japanese: 'ハンサム', hiragana: 'はんさむ', katakana: 'ハンサム', romaji: 'hansamu', burmesePronunciation: 'ဟန်ဆမု', meaning: 'ချောမောသည်' },
    ],
  },
  {
    id: 'chapter-9',
    title: 'Chapter 9 - Likes & Skills',
    focus: 'ကြိုက်နှစ်သက်မှု၊ ကျွမ်းကျင်မှု',
    kana: {
      hiragana: ['す', 'き', 'き', 'ら', 'い', 'じ', 'ょ'],
      katakana: ['ス', 'キ', 'キ', 'ラ', 'イ', 'ジョ'],
      romaji: ['su', 'ki', 'ki', 'ra', 'i', 'jo'],
    },
    vocabulary: [
      { id: 'c9-v1', japanese: 'すき', hiragana: 'すき', romaji: 'suki', burmesePronunciation: 'စုခိ', meaning: 'ကြိုက်သည်' },
      { id: 'c9-v2', japanese: 'きらい', hiragana: 'きらい', romaji: 'kirai', burmesePronunciation: 'ခိလိုင်', meaning: 'မကြိုက်' },
      { id: 'c9-v3', japanese: 'じょうず', hiragana: 'じょうず', romaji: 'jozu', burmesePronunciation: 'ဂျိုးဇု', meaning: 'ကျွမ်းကျင်သည်' },
      { id: 'c9-v4', japanese: 'へた', hiragana: 'へた', romaji: 'heta', burmesePronunciation: 'ဟဲတာ', meaning: 'မကျွမ်းကျင်' },
      { id: 'c9-v5', japanese: 'りょうり', hiragana: 'りょうり', romaji: 'ryori', burmesePronunciation: 'ရျိုးရိ', meaning: 'ဟင်းချက်မှု' },
      { id: 'c9-v6', japanese: 'スポーツ', hiragana: 'すぽーつ', katakana: 'スポーツ', romaji: 'supotsu', burmesePronunciation: 'စုပါ့စ်စု', meaning: 'အားကစား' },
    ],
  },
  {
    id: 'chapter-10',
    title: 'Chapter 10 - Location of Things',
    focus: 'ရှိနေရာဖော်ပြခြင်း',
    kana: {
      hiragana: ['う', 'え', 'し', 'た', 'な', 'か'],
      katakana: ['ウ', 'エ', 'シ', 'タ', 'ナ', 'カ'],
      romaji: ['u', 'e', 'shi', 'ta', 'na', 'ka'],
    },
    vocabulary: [
      { id: 'c10-v1', japanese: 'うえ', hiragana: 'うえ', romaji: 'ue', burmesePronunciation: 'ဦအဲ', meaning: 'အပေါ်' },
      { id: 'c10-v2', japanese: 'した', hiragana: 'した', romaji: 'shita', burmesePronunciation: 'ရှိတာ', meaning: 'အောက်' },
      { id: 'c10-v3', japanese: 'まえ', hiragana: 'まえ', romaji: 'mae', burmesePronunciation: 'မအဲ', meaning: 'ရှေ့' },
      { id: 'c10-v4', japanese: 'うしろ', hiragana: 'うしろ', romaji: 'ushiro', burmesePronunciation: 'ဦရှိရို', meaning: 'နောက်' },
      { id: 'c10-v5', japanese: 'なか', hiragana: 'なか', romaji: 'naka', burmesePronunciation: 'နခ', meaning: 'အတွင်း' },
      { id: 'c10-v6', japanese: 'そと', hiragana: 'そと', romaji: 'soto', burmesePronunciation: 'ဆိုတို', meaning: 'အပြင်' },
    ],
  },
  {
    id: 'chapter-11',
    title: 'Chapter 11 - Quantity & Counting',
    focus: 'ရေတွက်ပုံနှင့် အရေအတွက်',
    kana: {
      hiragana: ['ひ', 'と', 'つ', 'ふ', 'た', 'つ'],
      katakana: ['ヒ', 'ト', 'ツ', 'フ', 'タ', 'ツ'],
      romaji: ['hi', 'to', 'tsu', 'fu', 'ta', 'tsu'],
    },
    vocabulary: [
      { id: 'c11-v1', japanese: 'ひとつ', hiragana: 'ひとつ', romaji: 'hitotsu', burmesePronunciation: 'ဟိတိုဆု', meaning: 'တစ်ခု' },
      { id: 'c11-v2', japanese: 'ふたつ', hiragana: 'ふたつ', romaji: 'futatsu', burmesePronunciation: 'ဖုတာဆု', meaning: 'နှစ်ခု' },
      { id: 'c11-v3', japanese: 'みっつ', hiragana: 'みっつ', romaji: 'mittsu', burmesePronunciation: 'မိစ်စု', meaning: 'သုံးခု' },
      { id: 'c11-v4', japanese: 'いくつ', hiragana: 'いくつ', romaji: 'ikutsu', burmesePronunciation: 'အိခုစု', meaning: 'ဘယ်နှစ်ခု' },
      { id: 'c11-v5', japanese: 'りんご', hiragana: 'りんご', romaji: 'ringo', burmesePronunciation: 'ရင်ဂို', meaning: 'ပန်းသီး' },
      { id: 'c11-v6', japanese: 'みかん', hiragana: 'みかん', romaji: 'mikan', burmesePronunciation: 'မိခန်', meaning: 'လိမ္မော်သီး' },
    ],
  },
  {
    id: 'chapter-12',
    title: 'Chapter 12 - Past Tense',
    focus: 'ပြီးခဲ့သော လုပ်ရပ်များ',
    kana: {
      hiragana: ['き', 'の', 'う', 'きょ', 'う', 'あ', 'し'],
      katakana: ['キ', 'ノ', 'ウ', 'キョ', 'ウ', 'ア', 'シ'],
      romaji: ['ki', 'no', 'u', 'kyo', 'u', 'a', 'shi'],
    },
    vocabulary: [
      { id: 'c12-v1', japanese: 'きのう', hiragana: 'きのう', romaji: 'kino', burmesePronunciation: 'ခိနို', meaning: 'မနေ့က' },
      { id: 'c12-v2', japanese: 'きょう', hiragana: 'きょう', romaji: 'kyo', burmesePronunciation: 'ကျိုး', meaning: 'ဒီနေ့' },
      { id: 'c12-v3', japanese: 'あした', hiragana: 'あした', romaji: 'ashita', burmesePronunciation: 'အရှိတာ', meaning: 'မနက်ဖြန်' },
      { id: 'c12-v4', japanese: 'べんきょうしました', hiragana: 'べんきょうしました', romaji: 'benkyoshimashita', burmesePronunciation: 'ဘဲန်ကျိုးရှိမရှိတာ', meaning: 'လေ့လာခဲ့သည်' },
      { id: 'c12-v5', japanese: 'はたらきました', hiragana: 'はたらきました', romaji: 'hatarakimashita', burmesePronunciation: 'ဟာတာရခိမရှိတာ', meaning: 'အလုပ်လုပ်ခဲ့သည်' },
      { id: 'c12-v6', japanese: 'やすみました', hiragana: 'やすみました', romaji: 'yasumimashita', burmesePronunciation: 'ယာစုမိမရှိတာ', meaning: 'နားခဲ့သည်' },
    ],
  },
  {
    id: 'chapter-13',
    title: 'Chapter 13 - Want to',
    focus: 'လုပ်ချင်သည်',
    kana: {
      hiragana: ['た', 'い', 'で', 'す', 'な', 'に'],
      katakana: ['タ', 'イ', 'デ', 'ス', 'ナ', 'ニ'],
      romaji: ['ta', 'i', 'de', 'su', 'na', 'ni'],
    },
    vocabulary: [
      { id: 'c13-v1', japanese: 'いきたいです', hiragana: 'いきたいです', romaji: 'ikitai desu', burmesePronunciation: 'အိခိတိုင်းဒဲစု', meaning: 'သွားချင်တယ်' },
      { id: 'c13-v2', japanese: 'たべたいです', hiragana: 'たべたいです', romaji: 'tabetai desu', burmesePronunciation: 'တာဘဲတိုင်းဒဲစု', meaning: 'စားချင်တယ်' },
      { id: 'c13-v3', japanese: 'のみたいです', hiragana: 'のみたいです', romaji: 'nomitai desu', burmesePronunciation: 'နိုမိတိုင်းဒဲစု', meaning: 'သောက်ချင်တယ်' },
      { id: 'c13-v4', japanese: 'なに', hiragana: 'なに', romaji: 'nani', burmesePronunciation: 'နနိ', meaning: 'ဘာ' },
      { id: 'c13-v5', japanese: 'どこ', hiragana: 'どこ', romaji: 'doko', burmesePronunciation: 'ဒိုကို', meaning: 'ဘယ်နေရာ' },
      { id: 'c13-v6', japanese: 'なにを', hiragana: 'なにを', romaji: 'nani o', burmesePronunciation: 'နနိအို', meaning: 'ဘာကို' },
    ],
  },
  {
    id: 'chapter-14',
    title: 'Chapter 14 - Te-form (Requests/Sequence)',
    focus: 'တေ-ပုံစံ၊ အမိန့်ပျော့နှင့် လုပ်ဆောင်မှုအစဉ်',
    kana: {
      hiragana: ['て', 'く', 'だ', 'さ', 'い', 'ま'],
      katakana: ['テ', 'ク', 'ダ', 'サ', 'イ', 'マ'],
      romaji: ['te', 'ku', 'da', 'sa', 'i', 'ma'],
    },
    vocabulary: [
      { id: 'c14-v1', japanese: 'みてください', hiragana: 'みてください', romaji: 'mite kudasai', burmesePronunciation: 'မိတဲ ခုဒါဆိုင်း', meaning: 'ကြည့်ပါ' },
      { id: 'c14-v2', japanese: 'よんでください', hiragana: 'よんでください', romaji: 'yonde kudasai', burmesePronunciation: 'ယွန်ဒဲ ခုဒါဆိုင်း', meaning: 'ဖတ်ပါ' },
      { id: 'c14-v3', japanese: 'かいてください', hiragana: 'かいてください', romaji: 'kaite kudasai', burmesePronunciation: 'ကိုင်တဲ ခုဒါဆိုင်း', meaning: 'ရေးပါ' },
      { id: 'c14-v4', japanese: 'まってください', hiragana: 'まってください', romaji: 'matte kudasai', burmesePronunciation: 'မတ်တဲ ခုဒါဆိုင်း', meaning: 'စောင့်ပါ' },
      { id: 'c14-v5', japanese: 'てつだってください', hiragana: 'てつだってください', romaji: 'tetsudatte kudasai', burmesePronunciation: 'တဲစုဒတ်တဲ ခုဒါဆိုင်း', meaning: 'ကူညီပါ' },
      { id: 'c14-v6', japanese: 'スイッチ', hiragana: 'すいっち', katakana: 'スイッチ', romaji: 'suicchi', burmesePronunciation: 'စုအိချိ', meaning: 'ခလုတ်' },
    ],
  },
  {
    id: 'chapter-15',
    title: 'Chapter 15 - Progressive Form',
    focus: 'လုပ်နေသည် (〜ています)',
    kana: {
      hiragana: ['て', 'い', 'ま', 'す', 'い', 'ま'],
      katakana: ['テ', 'イ', 'マ', 'ス', 'イ', 'マ'],
      romaji: ['te', 'i', 'ma', 'su', 'i', 'ma'],
    },
    vocabulary: [
      { id: 'c15-v1', japanese: 'たべています', hiragana: 'たべています', romaji: 'tabeteimasu', burmesePronunciation: 'တာဘဲတဲအိမတ်စ', meaning: 'စားနေသည်' },
      { id: 'c15-v2', japanese: 'べんきょうしています', hiragana: 'べんきょうしています', romaji: 'benkyoshiteimasu', burmesePronunciation: 'ဘဲန်ကျိုးရှိတဲအိမတ်စ', meaning: 'လေ့လာနေသည်' },
      { id: 'c15-v3', japanese: 'はたらいています', hiragana: 'はたらいています', romaji: 'hataraitemasu', burmesePronunciation: 'ဟာတာလိုင်တဲမတ်စ', meaning: 'အလုပ်လုပ်နေသည်' },
      { id: 'c15-v4', japanese: 'すんでいます', hiragana: 'すんでいます', romaji: 'sundeimasu', burmesePronunciation: 'စုန်ဒဲအိမတ်စ', meaning: 'နေထိုင်နေသည်' },
      { id: 'c15-v5', japanese: 'しっています', hiragana: 'しっています', romaji: 'shitteimasu', burmesePronunciation: 'ရှိတ်တဲအိမတ်စ', meaning: 'သိသည်' },
      { id: 'c15-v6', japanese: 'しりません', hiragana: 'しりません', romaji: 'shirimasen', burmesePronunciation: 'ရှိရိမဆဲန်', meaning: 'မသိပါ' },
    ],
  },
  {
    id: 'chapter-16',
    title: 'Chapter 16 - Connect Sentences',
    focus: 'ဝါကျဆက်ခြင်း (〜て、〜て)',
    kana: {
      hiragana: ['て', 'そ', 'れ', 'か', 'ら', 'に'],
      katakana: ['テ', 'ソ', 'レ', 'カ', 'ラ', 'ニ'],
      romaji: ['te', 'so', 're', 'ka', 'ra', 'ni'],
    },
    vocabulary: [
      { id: 'c16-v1', japanese: 'おきて、あさごはんをたべます', hiragana: 'おきて、あさごはんをたべます', romaji: 'okite, asagohan o tabemasu', burmesePronunciation: 'အိုခိတဲ ...', meaning: 'နိုးပြီး မနက်စာစားသည်' },
      { id: 'c16-v2', japanese: 'それから', hiragana: 'それから', romaji: 'sorekara', burmesePronunciation: 'ဆိုရေးကရာ', meaning: 'ပြီးတော့' },
      { id: 'c16-v3', japanese: 'しゅみ', hiragana: 'しゅみ', romaji: 'shumi', burmesePronunciation: 'ရှုမိ', meaning: 'ဝါသနာ' },
      { id: 'c16-v4', japanese: 'あつめます', hiragana: 'あつめます', romaji: 'atsumemasu', burmesePronunciation: 'အစုမဲမတ်စ', meaning: 'စုဆောင်းသည်' },
      { id: 'c16-v5', japanese: 'あそびます', hiragana: 'あそびます', romaji: 'asobimasu', burmesePronunciation: 'အဆိုဘိမတ်စ', meaning: 'ကစားသည်' },
      { id: 'c16-v6', japanese: 'ジョギング', hiragana: 'じょぎんぐ', katakana: 'ジョギング', romaji: 'jogingu', burmesePronunciation: 'ဂျိုဂင်ဂု', meaning: 'ပြေးလေ့ကျင့်ခြင်း' },
    ],
  },
  {
    id: 'chapter-17',
    title: 'Chapter 17 - Permission / Prohibition',
    focus: 'လုပ်လို့ရ/မရ',
    kana: {
      hiragana: ['て', 'も', 'い', 'い', 'で', 'す'],
      katakana: ['テ', 'モ', 'イ', 'イ', 'デ', 'ス'],
      romaji: ['te', 'mo', 'i', 'i', 'de', 'su'],
    },
    vocabulary: [
      { id: 'c17-v1', japanese: 'はいってもいいです', hiragana: 'はいってもいいです', romaji: 'haittemo ii desu', burmesePronunciation: 'ဟိုက်တဲမို အီးဒဲစု', meaning: 'ဝင်လို့ရတယ်' },
      { id: 'c17-v2', japanese: 'たばこをすってはいけません', hiragana: 'たばこをすってはいけません', romaji: 'tabako o sutte wa ikemasen', burmesePronunciation: 'တဘာကို ...', meaning: 'ဆေးလိပ်မသောက်ရ' },
      { id: 'c17-v3', japanese: 'ここで', hiragana: 'ここで', romaji: 'koko de', burmesePronunciation: 'ကိုကိုဒဲ', meaning: 'ဒီနေရာမှာ' },
      { id: 'c17-v4', japanese: 'しゃしん', hiragana: 'しゃしん', romaji: 'shashin', burmesePronunciation: 'ရှရှင်', meaning: 'ဓာတ်ပုံ' },
      { id: 'c17-v5', japanese: 'とります', hiragana: 'とります', romaji: 'torimasu', burmesePronunciation: 'တိုရိမတ်စ', meaning: 'ရိုက်သည်/ယူသည်' },
      { id: 'c17-v6', japanese: 'ケータイ', hiragana: 'けーたい', katakana: 'ケータイ', romaji: 'ketai', burmesePronunciation: 'ခေးတိုင်း', meaning: 'ဖုန်း' },
    ],
  },
  {
    id: 'chapter-18',
    title: 'Chapter 18 - Ability',
    focus: 'လုပ်နိုင်စွမ်း',
    kana: {
      hiragana: ['で', 'き', 'ま', 'す', 'う', 'た'],
      katakana: ['デ', 'キ', 'マ', 'ス', 'ウ', 'タ'],
      romaji: ['de', 'ki', 'ma', 'su', 'u', 'ta'],
    },
    vocabulary: [
      { id: 'c18-v1', japanese: 'できます', hiragana: 'できます', romaji: 'dekimasu', burmesePronunciation: 'ဒဲခိမတ်စ', meaning: 'လုပ်နိုင်သည်' },
      { id: 'c18-v2', japanese: 'にほんごができます', hiragana: 'にほんごができます', romaji: 'nihongo ga dekimasu', burmesePronunciation: 'နိဟွန်ဂိုဂ ဒဲခိမတ်စ', meaning: 'ဂျပန်စာပြောနိုင်သည်' },
      { id: 'c18-v3', japanese: 'うたいます', hiragana: 'うたいます', romaji: 'utaimasu', burmesePronunciation: 'ဦတိုင်းမတ်စ', meaning: 'သီချင်းဆိုသည်' },
      { id: 'c18-v4', japanese: 'ひきます', hiragana: 'ひきます', romaji: 'hikimasu', burmesePronunciation: 'ဟိခိမတ်စ', meaning: 'တီးသည်' },
      { id: 'c18-v5', japanese: 'みせ', hiragana: 'みせ', romaji: 'mise', burmesePronunciation: 'မိဆဲ', meaning: 'ဆိုင်' },
      { id: 'c18-v6', japanese: 'ピアノ', hiragana: 'ぴあの', katakana: 'ピアノ', romaji: 'piano', burmesePronunciation: 'ပိအနို', meaning: 'စန္ဒရား' },
    ],
  },
  {
    id: 'chapter-19',
    title: 'Chapter 19 - Plain Form',
    focus: 'ရိုးရိုးပုံစံ (dictionary/plain)',
    kana: {
      hiragana: ['い', 'く', 'た', 'べ', 'る', 'み'],
      katakana: ['イ', 'ク', 'タ', 'ベ', 'ル', 'ミ'],
      romaji: ['i', 'ku', 'ta', 'be', 'ru', 'mi'],
    },
    vocabulary: [
      { id: 'c19-v1', japanese: 'いく', hiragana: 'いく', romaji: 'iku', burmesePronunciation: 'အိခု', meaning: 'သွားသည် (plain)' },
      { id: 'c19-v2', japanese: 'たべる', hiragana: 'たべる', romaji: 'taberu', burmesePronunciation: 'တာဘဲရု', meaning: 'စားသည် (plain)' },
      { id: 'c19-v3', japanese: 'みる', hiragana: 'みる', romaji: 'miru', burmesePronunciation: 'မိရု', meaning: 'ကြည့်သည် (plain)' },
      { id: 'c19-v4', japanese: 'よむ', hiragana: 'よむ', romaji: 'yomu', burmesePronunciation: 'ယိုမု', meaning: 'ဖတ်သည် (plain)' },
      { id: 'c19-v5', japanese: 'のむ', hiragana: 'のむ', romaji: 'nomu', burmesePronunciation: 'နိုမု', meaning: 'သောက်သည် (plain)' },
      { id: 'c19-v6', japanese: 'あります', hiragana: 'あります', romaji: 'arimasu', burmesePronunciation: 'အရိမတ်စ', meaning: 'ရှိသည် (inanimate)' },
    ],
  },
  {
    id: 'chapter-20',
    title: 'Chapter 20 - Casual Style',
    focus: 'မိတ်ဆွေစကားပုံစံ',
    kana: {
      hiragana: ['な', 'い', 'い', 'く', 'よ', 'ね'],
      katakana: ['ナ', 'イ', 'イ', 'ク', 'ヨ', 'ネ'],
      romaji: ['na', 'i', 'i', 'ku', 'yo', 'ne'],
    },
    vocabulary: [
      { id: 'c20-v1', japanese: 'いかない', hiragana: 'いかない', romaji: 'ikanai', burmesePronunciation: 'အိခနိုင်း', meaning: 'မသွားဘူး (casual)' },
      { id: 'c20-v2', japanese: 'たべない', hiragana: 'たべない', romaji: 'tabenai', burmesePronunciation: 'တာဘဲနိုင်း', meaning: 'မစားဘူး (casual)' },
      { id: 'c20-v3', japanese: 'そうだね', hiragana: 'そうだね', romaji: 'so da ne', burmesePronunciation: 'ဆို ဒ နဲ', meaning: 'ဟုတ်တာပဲနော်' },
      { id: 'c20-v4', japanese: 'どう？', hiragana: 'どう', romaji: 'do', burmesePronunciation: 'ဒို', meaning: 'ဘယ်လိုလဲ' },
      { id: 'c20-v5', japanese: 'いいよ', hiragana: 'いいよ', romaji: 'ii yo', burmesePronunciation: 'အီး ယို', meaning: 'ရပါတယ်' },
      { id: 'c20-v6', japanese: 'だめ', hiragana: 'だめ', romaji: 'dame', burmesePronunciation: 'ဒါမဲ', meaning: 'မရဘူး' },
    ],
  },
  {
    id: 'chapter-21',
    title: 'Chapter 21 - Thoughts & Opinions',
    focus: 'ထင်မြင်ချက်ပြောခြင်း',
    kana: {
      hiragana: ['と', 'お', 'も', 'い', 'ま', 'す'],
      katakana: ['ト', 'オ', 'モ', 'イ', 'マ', 'ス'],
      romaji: ['to', 'o', 'mo', 'i', 'ma', 'su'],
    },
    vocabulary: [
      { id: 'c21-v1', japanese: 'おもいます', hiragana: 'おもいます', romaji: 'omoimasu', burmesePronunciation: 'အိုမိုင်းမတ်စ', meaning: 'ထင်သည်' },
      { id: 'c21-v2', japanese: 'いいます', hiragana: 'いいます', romaji: 'iimasu', burmesePronunciation: 'အီးမတ်စ', meaning: 'ပြောသည်' },
      { id: 'c21-v3', japanese: 'たぶん', hiragana: 'たぶん', romaji: 'tabun', burmesePronunciation: 'တာဘွန်း', meaning: 'ဖြစ်နိုင်တာ' },
      { id: 'c21-v4', japanese: 'ほんとう', hiragana: 'ほんとう', romaji: 'honto', burmesePronunciation: 'ဟွန်တို', meaning: 'တကယ်' },
      { id: 'c21-v5', japanese: 'ニュース', hiragana: 'にゅーす', katakana: 'ニュース', romaji: 'nyusu', burmesePronunciation: 'ညူးစု', meaning: 'သတင်း' },
      { id: 'c21-v6', japanese: 'てんき', hiragana: 'てんき', romaji: 'tenki', burmesePronunciation: 'တဲန်ခိ', meaning: 'ရာသီဥတု' },
    ],
  },
  {
    id: 'chapter-22',
    title: 'Chapter 22 - Relative Clauses',
    focus: 'နာမ်ကို ပြန်ဖော်ပြသော ဝါကျ',
    kana: {
      hiragana: ['こ', 'の', 'ひ', 'と', 'は', 'だ'],
      katakana: ['コ', 'ノ', 'ヒ', 'ト', 'ハ', 'ダ'],
      romaji: ['ko', 'no', 'hi', 'to', 'wa', 'da'],
    },
    vocabulary: [
      { id: 'c22-v1', japanese: 'わたしがかったほん', hiragana: 'わたしがかったほん', romaji: 'watashi ga katta hon', burmesePronunciation: 'ဝတရှိဂ ...', meaning: 'ကျွန်တော်ဝယ်ခဲ့သော စာအုပ်' },
      { id: 'c22-v2', japanese: 'にほんでとったしゃしん', hiragana: 'にほんでとったしゃしん', romaji: 'nihon de totta shashin', burmesePronunciation: 'နိဟွန်ဒဲ ...', meaning: 'ဂျပန်မှာ ရိုက်ခဲ့သော ဓာတ်ပုံ' },
      { id: 'c22-v3', japanese: 'しっているひと', hiragana: 'しっているひと', romaji: 'shitteiru hito', burmesePronunciation: 'ရှိတ်တဲအိရု ဟိတို', meaning: 'သိတဲ့လူ' },
      { id: 'c22-v4', japanese: 'すんでいるまち', hiragana: 'すんでいるまち', romaji: 'sundeiru machi', burmesePronunciation: 'စုန်ဒဲအိရု မချိ', meaning: 'နေထိုင်နေတဲ့ မြို့' },
      { id: 'c22-v5', japanese: 'きれいなひと', hiragana: 'きれいなひと', romaji: 'kirei na hito', burmesePronunciation: 'ခိရဲ န ဟိတို', meaning: 'လှသောသူ' },
      { id: 'c22-v6', japanese: 'ゆうめい', hiragana: 'ゆうめい', romaji: 'yumei', burmesePronunciation: 'ယူမေး', meaning: 'နာမည်ကြီး' },
    ],
  },
  {
    id: 'chapter-23',
    title: 'Chapter 23 - Conditionals (When/If)',
    focus: 'အခြေအနေပြဝါကျ',
    kana: {
      hiragana: ['と', 'き', 'あ', 'め', 'ふ', 'る'],
      katakana: ['ト', 'キ', 'ア', 'メ', 'フ', 'ル'],
      romaji: ['to', 'ki', 'a', 'me', 'fu', 'ru'],
    },
    vocabulary: [
      { id: 'c23-v1', japanese: 'とき', hiragana: 'とき', romaji: 'toki', burmesePronunciation: 'တိုခိ', meaning: 'အချိန်' },
      { id: 'c23-v2', japanese: 'あめがふる', hiragana: 'あめがふる', romaji: 'ame ga furu', burmesePronunciation: 'အမဲဂ ဖုရု', meaning: 'မိုးရွာသည်' },
      { id: 'c23-v3', japanese: 'いきます', hiragana: 'いきます', romaji: 'ikimasu', burmesePronunciation: 'အိခိမတ်စ', meaning: 'သွားသည်' },
      { id: 'c23-v4', japanese: 'のみます', hiragana: 'のみます', romaji: 'nomimasu', burmesePronunciation: 'နိုမိမတ်စ', meaning: 'သောက်သည်' },
      { id: 'c23-v5', japanese: 'くすり', hiragana: 'くすり', romaji: 'kusuri', burmesePronunciation: 'ခုစုရိ', meaning: 'ဆေး' },
      { id: 'c23-v6', japanese: 'ボタン', hiragana: 'ぼたん', katakana: 'ボタン', romaji: 'botan', burmesePronunciation: 'ဘိုတန်', meaning: 'ခလုတ်' },
    ],
  },
  {
    id: 'chapter-24',
    title: 'Chapter 24 - Giving/Receiving Actions',
    focus: 'လုပ်ပေးခြင်း၊ လုပ်ယူခြင်း',
    kana: {
      hiragana: ['く', 'れ', 'る', 'あ', 'げ', 'る'],
      katakana: ['ク', 'レ', 'ル', 'ア', 'ゲ', 'ル'],
      romaji: ['ku', 're', 'ru', 'a', 'ge', 'ru'],
    },
    vocabulary: [
      { id: 'c24-v1', japanese: 'くれます', hiragana: 'くれます', romaji: 'kuremasu', burmesePronunciation: 'ခုရဲမတ်စ', meaning: 'ပေးပါသည် (to me/us)' },
      { id: 'c24-v2', japanese: 'あげます', hiragana: 'あげます', romaji: 'agemasu', burmesePronunciation: 'အဂဲမတ်စ', meaning: 'ပေးပါသည်' },
      { id: 'c24-v3', japanese: 'もらいます', hiragana: 'もらいます', romaji: 'moraimasu', burmesePronunciation: 'မိုလိုင်မတ်စ', meaning: 'လက်ခံရယူသည်' },
      { id: 'c24-v4', japanese: 'てつだいます', hiragana: 'てつだいます', romaji: 'tetsudaimasu', burmesePronunciation: 'တဲစုဒိုင်းမတ်စ', meaning: 'ကူညီသည်' },
      { id: 'c24-v5', japanese: 'せつめいします', hiragana: 'せつめいします', romaji: 'setsumei shimasu', burmesePronunciation: 'ဆဲစုမေးရှိမတ်စ', meaning: 'ရှင်းပြသည်' },
      { id: 'c24-v6', japanese: 'コピー', hiragana: 'こぴー', katakana: 'コピー', romaji: 'kopi', burmesePronunciation: 'ကိုပီ', meaning: 'မိတ္တူ' },
    ],
  },
  {
    id: 'chapter-25',
    title: 'Chapter 25 - Potential/Assumptions',
    focus: 'ဖြစ်နိုင်ခြင်း၊ အယူအဆ',
    kana: {
      hiragana: ['か', 'も', 'し', 'れ', 'ま', 'せ'],
      katakana: ['カ', 'モ', 'シ', 'レ', 'マ', 'セ'],
      romaji: ['ka', 'mo', 'shi', 're', 'ma', 'se'],
    },
    vocabulary: [
      { id: 'c25-v1', japanese: 'かもしれません', hiragana: 'かもしれません', romaji: 'kamoshiremasen', burmesePronunciation: 'ခမိုရှိရဲမဆဲန်', meaning: 'ဖြစ်နိုင်ပါသည်' },
      { id: 'c25-v2', japanese: 'たぶん', hiragana: 'たぶん', romaji: 'tabun', burmesePronunciation: 'တာဘွန်း', meaning: 'ဖြစ်ကောင်းဖြစ်နိုင်' },
      { id: 'c25-v3', japanese: 'ほんとうです', hiragana: 'ほんとうです', romaji: 'honto desu', burmesePronunciation: 'ဟွန်တို ဒဲစု', meaning: 'တကယ်ပါ' },
      { id: 'c25-v4', japanese: 'うそ', hiragana: 'うそ', romaji: 'uso', burmesePronunciation: 'ဦဆို', meaning: 'မမှန်တာ' },
      { id: 'c25-v5', japanese: 'しんじます', hiragana: 'しんじます', romaji: 'shinjimasu', burmesePronunciation: 'ရှင်ဂျိမတ်စ', meaning: 'ယုံကြည်သည်' },
      { id: 'c25-v6', japanese: 'チェック', hiragana: 'ちぇっく', katakana: 'チェック', romaji: 'chekku', burmesePronunciation: 'ချဲခ္ခု', meaning: 'စစ်ဆေးမှု' },
    ],
  },
];

const EVENTS: LearningEvent[] = [
  {
    id: 'e1',
    title: 'Chapter 1 Listening Practice',
    dateISO: '2026-02-21T19:00:00+06:30',
    type: 'lesson',
  },
  {
    id: 'e2',
    title: 'Chapter 10 Vocabulary Review',
    dateISO: '2026-02-22T20:30:00+06:30',
    type: 'review',
  },
  {
    id: 'e3',
    title: 'Chapter 25 Mock Conversation',
    dateISO: '2026-02-24T19:30:00+06:30',
    type: 'lesson',
  },
];

export function getChapters(): Chapter[] {
  return CHAPTERS;
}

export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.id === id);
}

export function getLearningEvents(): LearningEvent[] {
  return EVENTS;
}
