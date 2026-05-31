export interface PlacementQuestion {
  id: number
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  type: 'multiple_choice' | 'fill_blank' | 'reading' | 'word_order'
  question: string
  text?: string
  options?: string[]
  words?: string[]
  correct: number | string
  explanation: string
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // ═══════ A1 (1–6) ═══════
  {
    id: 1, level: 'A1', type: 'multiple_choice',
    question: 'I ___ a student.',
    options: ['am', 'is', 'are', 'be'],
    correct: 0,
    explanation: 'С местоимением "I" используется "am"',
  },
  {
    id: 2, level: 'A1', type: 'multiple_choice',
    question: 'She ___ from Kazakhstan.',
    options: ['am', 'is', 'are', 'be'],
    correct: 1,
    explanation: 'С местоимением "She" используется "is"',
  },
  {
    id: 3, level: 'A1', type: 'multiple_choice',
    question: 'How ___ books do you have?',
    options: ['much', 'many', 'any', 'some'],
    correct: 1,
    explanation: '"Many" используется с исчисляемыми существительными',
  },
  {
    id: 4, level: 'A1', type: 'fill_blank',
    question: 'There ___ a book on the table.',
    options: ['is', 'are', 'am', 'be'],
    correct: 0,
    explanation: '"A book" — единственное число, используем "is"',
  },
  {
    id: 5, level: 'A1', type: 'multiple_choice',
    question: 'My brother ___ football every day.',
    options: ['play', 'plays', 'playing', 'played'],
    correct: 1,
    explanation: 'Present Simple, 3 лицо ед. число — добавляем "s"',
  },
  {
    id: 6, level: 'A1', type: 'word_order',
    question: 'Расставь слова в правильном порядке',
    words: ['name', 'My', 'Aizhan', 'is'],
    correct: 'My name is Aizhan',
    explanation: 'Порядок: подлежащее + сказуемое + дополнение',
  },

  // ═══════ A2 (7–12) ═══════
  {
    id: 7, level: 'A2', type: 'multiple_choice',
    question: 'Yesterday I ___ to the cinema.',
    options: ['go', 'went', 'gone', 'going'],
    correct: 1,
    explanation: 'Past Simple от "go" — "went"',
  },
  {
    id: 8, level: 'A2', type: 'multiple_choice',
    question: 'If it rains tomorrow, we ___ at home.',
    options: ['stay', 'will stay', 'stayed', 'are staying'],
    correct: 1,
    explanation: 'First Conditional: If + Present Simple, will + verb',
  },
  {
    id: 9, level: 'A2', type: 'fill_blank',
    question: 'This is the ___ book I have ever read.',
    options: ['best', 'better', 'good', 'goodest'],
    correct: 0,
    explanation: 'Превосходная степень "good" — "the best"',
  },
  {
    id: 10, level: 'A2', type: 'multiple_choice',
    question: "She doesn't like coffee, ___ she?",
    options: ['do', 'does', 'is', "doesn't"],
    correct: 1,
    explanation: 'Question tag для отрицательного предложения — утвердительный',
  },
  {
    id: 11, level: 'A2', type: 'word_order',
    question: 'Расставь слова в правильном порядке',
    words: ['often', 'I', 'visit', 'grandparents', 'my'],
    correct: 'I often visit my grandparents',
    explanation: 'Наречие частоты "often" ставится перед смысловым глаголом',
  },
  {
    id: 12, level: 'A2', type: 'multiple_choice',
    question: 'I have lived in Almaty ___ 5 years.',
    options: ['since', 'for', 'from', 'during'],
    correct: 1,
    explanation: '"For" используется с периодом времени',
  },

  // ═══════ B1 (13–18) ═══════
  {
    id: 13, level: 'B1', type: 'multiple_choice',
    question: 'She has ___ been to Paris.',
    options: ['ever', 'never', 'yet', 'just'],
    correct: 1,
    explanation: '"Never" с Present Perfect означает "никогда"',
  },
  {
    id: 14, level: 'B1', type: 'fill_blank',
    question: 'If I ___ rich, I would travel the world.',
    options: ['am', 'was', 'were', 'be'],
    correct: 2,
    explanation: 'Second Conditional: If + were (для всех лиц), would + verb',
  },
  {
    id: 15, level: 'B1', type: 'reading',
    text: 'Daniyar is a third-year student at Nazarbayev University. He is studying Computer Science and hopes to work in artificial intelligence after graduation. Recently, he won a competition for the best student project in Kazakhstan.',
    question: 'What does Daniyar want to do after graduation?',
    options: ['Study abroad', 'Work in AI', 'Teach computer science', 'Start a business'],
    correct: 1,
    explanation: 'В тексте: "hopes to work in artificial intelligence"',
  },
  {
    id: 16, level: 'B1', type: 'multiple_choice',
    question: 'The book ___ by millions of people worldwide.',
    options: ['read', 'is read', 'reads', 'reading'],
    correct: 1,
    explanation: 'Passive Voice в Present Simple: is/are + V3',
  },
  {
    id: 17, level: 'B1', type: 'word_order',
    question: 'Расставь слова в правильном порядке',
    words: ['told', 'me', 'She', 'that', 'was', 'tired', 'she'],
    correct: 'She told me that she was tired',
    explanation: 'Reported speech: согласование времён',
  },
  {
    id: 18, level: 'B1', type: 'multiple_choice',
    question: 'I wish I ___ more time to read.',
    options: ['have', 'had', 'has', 'having'],
    correct: 1,
    explanation: 'I wish + Past Simple для сожаления о настоящем',
  },

  // ═══════ B2 (19–24) ═══════
  {
    id: 19, level: 'B2', type: 'multiple_choice',
    question: 'If I had known about the test, I ___ harder.',
    options: ['would study', 'would have studied', 'studied', 'will study'],
    correct: 1,
    explanation: 'Third Conditional: If + Past Perfect, would have + V3',
  },
  {
    id: 20, level: 'B2', type: 'fill_blank',
    question: 'She suggested ___ to the new restaurant.',
    options: ['to go', 'going', 'go', 'went'],
    correct: 1,
    explanation: 'После "suggest" используется герундий (V-ing)',
  },
  {
    id: 21, level: 'B2', type: 'reading',
    text: 'Climate change has emerged as one of the most pressing issues of our time. Despite numerous international agreements, global emissions continue to rise. Many scientists argue that immediate action is required to prevent catastrophic consequences for future generations.',
    question: 'According to the text, what is the main concern?',
    options: [
      'Lack of international agreements',
      'Rising global emissions despite agreements',
      "Scientists' disagreement",
      'Catastrophic weather events',
    ],
    correct: 1,
    explanation: 'Текст подчёркивает: несмотря на соглашения, выбросы продолжают расти',
  },
  {
    id: 22, level: 'B2', type: 'multiple_choice',
    question: 'No sooner ___ I arrived than it started raining.',
    options: ['have', 'had', 'did', 'was'],
    correct: 1,
    explanation: 'Инверсия с "no sooner...than" требует Past Perfect',
  },
  {
    id: 23, level: 'B2', type: 'multiple_choice',
    question: 'The project ___ by next month.',
    options: ['will complete', 'will be completed', 'will have completed', 'is completed'],
    correct: 1,
    explanation: 'Future Passive: will be + V3',
  },
  {
    id: 24, level: 'B2', type: 'word_order',
    question: 'Расставь слова в правильном порядке',
    words: ['been', 'had', 'I', 'never', 'such', 'seen', 'a', 'beautiful', 'sunset'],
    correct: 'I had never seen such a beautiful sunset',
    explanation: 'Past Perfect: had + never + V3 + such a + adj + noun',
  },

  // ═══════ C1 (25–30) ═══════
  {
    id: 25, level: 'C1', type: 'multiple_choice',
    question: 'Hardly ___ when the phone rang.',
    options: ['I had sat down', 'had I sat down', 'I sat down', 'did I sit down'],
    correct: 1,
    explanation: 'Инверсия с "hardly": had + subject + V3',
  },
  {
    id: 26, level: 'C1', type: 'fill_blank',
    question: "But for your help, I ___ the project on time.",
    options: ["wouldn't finish", "wouldn't have finished", "didn't finish", "haven't finished"],
    correct: 1,
    explanation: '"But for" = условное 3 типа: would have + V3',
  },
  {
    id: 27, level: 'C1', type: 'reading',
    text: 'The paradigm shift in artificial intelligence over the past decade has been nothing short of revolutionary. Large language models have demonstrated unprecedented capabilities, yet they remain fundamentally limited by their training data and lack of true understanding. The question of whether genuine machine consciousness is achievable continues to divide experts in the field.',
    question: 'What does the author imply about AI development?',
    options: [
      'AI has achieved true understanding',
      'AI has made significant progress but has limitations',
      'AI development has slowed down',
      'AI experts have reached consensus',
    ],
    correct: 1,
    explanation: 'Автор отмечает революционный прогресс, но указывает на ограничения',
  },
  {
    id: 28, level: 'C1', type: 'multiple_choice',
    question: 'She insisted that he ___ present at the meeting.',
    options: ['is', 'be', 'was', 'were'],
    correct: 1,
    explanation: 'Subjunctive mood после "insist that" — инфинитив без to',
  },
  {
    id: 29, level: 'C1', type: 'multiple_choice',
    question: 'It was the worst movie ___.',
    options: ['I never saw', 'I had ever seen', 'I have ever seen', 'I ever saw'],
    correct: 2,
    explanation: 'Present Perfect с "ever" для жизненного опыта',
  },
  {
    id: 30, level: 'C1', type: 'word_order',
    question: 'Расставь слова в правильном порядке',
    words: ['hardly', 'is', 'It', 'surprising', 'that', 'she', 'won'],
    correct: 'It is hardly surprising that she won',
    explanation: '"It is hardly surprising that..." — оборот для ожидаемости',
  },
]

export const QUESTIONS_BY_LEVEL: Record<string, PlacementQuestion[]> = {
  A1: PLACEMENT_QUESTIONS.filter(q => q.level === 'A1'),
  A2: PLACEMENT_QUESTIONS.filter(q => q.level === 'A2'),
  B1: PLACEMENT_QUESTIONS.filter(q => q.level === 'B1'),
  B2: PLACEMENT_QUESTIONS.filter(q => q.level === 'B2'),
  C1: PLACEMENT_QUESTIONS.filter(q => q.level === 'C1'),
}

export const LEVEL_ORDER: Array<'A1' | 'A2' | 'B1' | 'B2' | 'C1'> = ['A1', 'A2', 'B1', 'B2', 'C1']