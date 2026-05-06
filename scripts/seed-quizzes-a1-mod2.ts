/**
 * Seed missing quizzes for A1 Beginner — Module 2 "Close to Home".
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1-mod2.ts
 */

import * as fs   from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const f = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(f)) return
  fs.readFileSync(f, 'utf-8').split('\n').forEach(line => {
    const t = line.trim()
    if (!t || t.startsWith('#')) return
    const i = t.indexOf('=')
    if (i < 0) return
    const key = t.slice(0, i).trim()
    const val = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')
    if (key && !(key in process.env)) process.env[key] = val
  })
}
loadEnv()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

type MC = { id: number; type: 'multiple_choice'; question: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: 'A' | 'B' | 'C' | 'D' }
type TF = { id: number; type: 'true_false'; question: string; correct_answer: 'true' | 'false' }
type FB = { id: number; type: 'fill_blank'; question: string; correct_answer: string }
type Question = MC | TF | FB

const mc  = (id: number, question: string, a: string, b: string, c: string, d: string, ans: 'A'|'B'|'C'|'D'): MC =>
  ({ id, type: 'multiple_choice', question, option_a: a, option_b: b, option_c: c, option_d: d, correct_answer: ans })
const tf  = (id: number, question: string, ans: 'true'|'false'): TF =>
  ({ id, type: 'true_false', question, correct_answer: ans })
const fb  = (id: number, question: string, ans: string): FB =>
  ({ id, type: 'fill_blank', question, correct_answer: ans })

// ── quiz data ─────────────────────────────────────────────────────────────────

const QUIZZES: Record<string, { pass_threshold: number; questions: Question[] }> = {

  // Lesson 1 — My Family — Possessive Case
  'd4f6f860-3fc2-4240-aecd-ae4291bb8113': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Which is the correct possessive form?', "my brother's car", 'my brothers car', "my brother car's", 'my car brother', 'A'),
      mc(2,  'Choose the correct sentence.', 'This is she bag.', 'This is her bag.', 'This is hers bag.', 'This is she\'s bag.', 'B'),
      mc(3,  'What does "their" mean?', 'belonging to him', 'belonging to her', 'belonging to them', 'belonging to us', 'C'),
      mc(4,  'Complete: "___ name is Ahmed." (he)', 'His', 'Her', 'Its', 'Their', 'A'),
      mc(5,  'Which shows possession correctly?', 'the dog of Tom', "Tom's dog", 'dog Tom', 'Tom dog', 'B'),
      mc(6,  'Complete: "We love ___ parents." (we)', 'our', 'us', 'we', 'ours', 'A'),
      mc(7,  'Choose the correct possessive adjective for "she":',  'him', 'his', 'her', 'hers', 'C'),
      mc(8,  'Which sentence is correct?', "The children's toys are here.", "The childrens' toys are here.", "The childrens toys are here.", "The children toy's are here.", 'A'),
      mc(9,  'Complete: "___ is my sister." (pointing at one girl)', 'She', 'Her', 'Hers', 'His', 'A'),
      mc(10, '"Its" refers to:', 'a person', 'an animal or thing', 'two people', 'yourself', 'B'),
      tf(11, '"My" and "mine" have exactly the same grammatical use in all sentences.', 'false'),
      tf(12, "We add 's to a noun to show it belongs to someone (e.g. Anna's book).", 'true'),
      tf(13, '"Their" is the possessive adjective for "they".', 'true'),
      fb(14, '___ (she) mother is a doctor. ___ (he) father is an engineer.', 'Her, His'),
      fb(15, 'This is ___ (I) book and that is ___ (you) pen.', 'my, your'),
    ],
  },

  // Lesson 2 — Countries & Nationalities — Nouns & Proper Nouns
  'd6367a13-df05-4c8e-8336-dadc763fd586': {
    pass_threshold: 70,
    questions: [
      mc(1,  'What is the nationality for someone from France?', 'Frenchian', 'Frances', 'French', 'Frenchy', 'C'),
      mc(2,  'Proper nouns always start with a:', 'lowercase letter', 'capital letter', 'number', 'symbol', 'B'),
      mc(3,  'Which is a proper noun?', 'city', 'country', 'Kazakhstan', 'language', 'C'),
      mc(4,  'What is the nationality for Japan?', 'Japanish', 'Japaner', 'Japanian', 'Japanese', 'D'),
      mc(5,  'Which sentence is correct?', 'She is from germany.', 'She is from Germany.', 'she is from Germany.', 'She is from GERMANY.', 'B'),
      mc(6,  'The nationality for Germany is:', 'Germanian', 'German', 'Germish', 'Germane', 'B'),
      mc(7,  'Which country matches the nationality "British"?', 'France', 'Australia', 'the United Kingdom', 'Canada', 'C'),
      mc(8,  'Which is NOT a proper noun?', 'London', 'Astana', 'university', 'Pacific Ocean', 'C'),
      mc(9,  'The nationality for China is:', 'Chinian', 'Chines', 'Chinese', 'Chinish', 'C'),
      mc(10, 'Complete: "He is ___ — he comes from Russia."', 'Russian', 'Russish', 'Russianer', 'Russic', 'A'),
      tf(11, 'Countries and nationalities must always be written with a capital letter.', 'true'),
      tf(12, '"american" written with a lowercase "a" is correct in English.', 'false'),
      tf(13, 'A common noun refers to a specific, unique person or place (e.g. "city" means one specific city).', 'false'),
      fb(14, 'She is from ___ (Italy). She is ___ (Italian).', 'Italy, Italian'),
      fb(15, '___ (Kazakhstan) is a beautiful country. People from there are ___ (Kazakhstani/Kazakh).', 'Kazakhstan, Kazakhstani'),
    ],
  },

  // Lesson 3 — Numbers & Colors — Cardinal Numbers
  '423506a4-cba2-4a6b-ae81-eef1defecaef': {
    pass_threshold: 70,
    questions: [
      mc(1,  'How do you say 15 in English?', 'fifty', 'fifteen', 'fiveteen', 'fiften', 'B'),
      mc(2,  'Which number comes after nineteen?', 'ninety', 'twenteen', 'twenty', 'eleventeen', 'C'),
      mc(3,  'How do you say 100?', 'ten hundred', 'one hundreds', 'a hundred', 'hundredth', 'C'),
      mc(4,  'What color is the sky on a clear day?', 'green', 'blue', 'red', 'yellow', 'B'),
      mc(5,  'How do you say 42?', 'four and two', 'forty-two', 'four-twenty', 'fourty two', 'B'),
      mc(6,  'Which is the correct spelling?', 'eigth', 'eihgt', 'eight', 'eightt', 'C'),
      mc(7,  'How do you say 13?', 'thirty', 'threeten', 'thirteen', 'thirdteen', 'C'),
      mc(8,  'What color do you get by mixing red and white?', 'orange', 'purple', 'pink', 'brown', 'C'),
      mc(9,  'How do you write "seventy" in numbers?', '17', '77', '700', '70', 'D'),
      mc(10, 'Which word describes the color of grass?', 'blue', 'green', 'grey', 'yellow', 'B'),
      tf(11, '"Fourty" is the correct spelling of 40.', 'false'),
      tf(12, 'The number 12 is called "twelve" in English.', 'true'),
      tf(13, 'Cardinal numbers are used to count things (one, two, three…).', 'true'),
      fb(14, 'Write in words: 16 = ___ and 60 = ___.', 'sixteen, sixty'),
      fb(15, 'The color of the sun is ___ and the color of night is ___.', 'yellow, black'),
    ],
  },

  // Lesson 4 — Food & Drinks — There is / There are
  '2f757615-0cfd-4c1e-8f05-0195ee82754d': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Choose the correct form: "___ a cat in the garden."', 'There are', 'There is', 'There be', 'There am', 'B'),
      mc(2,  'Choose the correct form: "___ three apples on the table."', 'There is', 'There am', 'There are', 'There be', 'C'),
      mc(3,  'Which is the negative of "There is a book"?', 'There are not a book.', 'There is not a book.', 'There not is a book.', 'Not there is a book.', 'B'),
      mc(4,  'Which food is a drink?', 'bread', 'rice', 'water', 'cheese', 'C'),
      mc(5,  'Complete: "___ any milk in the fridge?" (question)', 'Is there', 'Are there', 'There is', 'There are', 'A'),
      mc(6,  'Complete: "___ many students in the class."', 'There is', 'There are', 'There have', 'There be', 'B'),
      mc(7,  'Which is correct?', 'There are a sugar on the shelf.', 'There is some sugar on the shelf.', 'There is a sugar on the shelf.', 'There are sugar on the shelf.', 'B'),
      mc(8,  'What does "there are" refer to?', 'singular nouns', 'plural nouns', 'uncountable nouns', 'adjectives', 'B'),
      mc(9,  'Choose the question form: "There is an egg."', 'Are there an egg?', 'Is there an egg?', 'There is an egg?', 'Have there an egg?', 'B'),
      mc(10, 'Which is a food item?', 'cup', 'spoon', 'pizza', 'plate', 'C'),
      tf(11, '"There is" is used with plural countable nouns.', 'false'),
      tf(12, '"There are" can be used with plural nouns (e.g. There are two chairs).', 'true'),
      tf(13, '"Is there any water?" is the correct question form for an uncountable noun.', 'true'),
      fb(14, '___ a orange on the table. ___ two bananas in the bag.', 'There is, There are'),
      fb(15, '___ (positive) some eggs in the fridge. ___ (negative) any bread left.', 'There are, There is not / There isn\'t'),
    ],
  },

  // Lesson 5 — Where is it? — Prepositions of Place
  '07d03636-7b62-44b0-97ae-19dd83769cfc': {
    pass_threshold: 70,
    questions: [
      mc(1,  'The book is ___ the table. (touching the surface)', 'in', 'on', 'at', 'under', 'B'),
      mc(2,  'The cat is ___ the box. (inside)', 'on', 'at', 'in', 'next to', 'C'),
      mc(3,  'She is standing ___ the door. (right beside)', 'in', 'on', 'next to', 'under', 'C'),
      mc(4,  'The dog is ___ the chair. (below)', 'on', 'in', 'at', 'under', 'D'),
      mc(5,  'The bank is ___ the hotel and the café.', 'next to', 'between', 'behind', 'in front of', 'B'),
      mc(6,  'I meet you ___ the airport.', 'in', 'on', 'at', 'between', 'C'),
      mc(7,  'The tree is ___ the house. (you can\'t see the house because of the tree)', 'in front of', 'behind', 'next to', 'between', 'A'),
      mc(8,  'They live ___ 14 Baker Street.', 'in', 'on', 'at', 'under', 'C'),
      mc(9,  'The picture is ___ the wall.', 'in', 'on', 'at', 'under', 'B'),
      mc(10, 'The car is ___ the garage. (inside the building)', 'on', 'at', 'in', 'next to', 'C'),
      tf(11, '"At" is used for specific addresses and locations (e.g. at the station).', 'true'),
      tf(12, '"In front of" and "behind" mean the same thing.', 'false'),
      tf(13, '"On" is used when something is touching a surface.', 'true'),
      fb(14, 'The keys are ___ the drawer. The pen is ___ the desk.', 'in, on'),
      fb(15, 'The school is ___ (between) the park and the library. The bus stop is ___ (in front of) the school.', 'between, in front of'),
    ],
  },

  // Lesson 7 — Negation — Negative Sentences & Not
  '8faf28e3-bcfc-4bff-8946-280af0b36d82': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Make "I am happy" negative:', 'I am not happy.', 'I not am happy.', 'I am no happy.', 'Not I am happy.', 'A'),
      mc(2,  'Make "She is a teacher" negative:', 'She not is a teacher.', 'She is no a teacher.', 'She is not a teacher.', 'She not a teacher.', 'C'),
      mc(3,  'What is the contraction of "is not"?', "isn't", "not's", "i'sn't", "is'nt", 'A'),
      mc(4,  'Make "They are from Spain" negative:', 'They are not from Spain.', 'They not are from Spain.', 'They are no from Spain.', 'No they are from Spain.', 'A'),
      mc(5,  'What is the contraction of "are not"?', "arn't", "aren't", "are'nt", "n'tare", 'B'),
      mc(6,  'Which is correct?', "He don't like coffee.", "He doesn't likes coffee.", "He doesn't like coffee.", "He not likes coffee.", 'C'),
      mc(7,  'Make "I have a car" negative (present simple):', "I don't have a car.", "I not have a car.", "I haven't a car.", "I doesn't have a car.", 'A'),
      mc(8,  'Which is the negative of "There is milk"?', 'There is not milk.', 'There not is milk.', 'No there is milk.', 'There milk not is.', 'A'),
      mc(9,  'Complete: "She ___ speak French." (negative, present simple)', "don't", "doesn't", "not", "isn't", 'B'),
      mc(10, 'Which sentence is correct?', "We doesn't go there.", "We don't go there.", "We not go there.", "We goes not there.", 'B'),
      tf(11, '"I\'m not" is the correct contraction of "I am not".', 'true'),
      tf(12, '"He don\'t like it" is grammatically correct.', 'false'),
      tf(13, 'In negative sentences with "to be", we put "not" after the verb (e.g. She is not tired).', 'true'),
      fb(14, 'He ___ (is not) my brother. They ___ (are not) from here.', "isn't, aren't"),
      fb(15, 'I ___ (do not) like spicy food. She ___ (does not) work here.', "don't, doesn't"),
    ],
  },

  // Lesson 8 — Irregular Plurals — Men/Women/Children/Feet/Teeth
  '23a0744f-c262-4d10-9c9b-70e75fd8e98a': {
    pass_threshold: 70,
    questions: [
      mc(1,  'What is the plural of "man"?', 'mans', 'mens', 'men', 'manes', 'C'),
      mc(2,  'What is the plural of "woman"?', 'womans', 'womens', 'women', 'womanses', 'C'),
      mc(3,  'What is the plural of "child"?', 'childs', 'children', 'childes', 'childrens', 'B'),
      mc(4,  'What is the plural of "tooth"?', 'tooths', 'teethes', 'toothes', 'teeth', 'D'),
      mc(5,  'What is the plural of "foot"?', 'foots', 'feets', 'feet', 'footies', 'C'),
      mc(6,  'What is the plural of "mouse"?', 'mouses', 'mousies', 'mice', 'meese', 'C'),
      mc(7,  'What is the plural of "goose"?', 'gooses', 'goosies', 'geese', 'goose', 'C'),
      mc(8,  'Which sentence is correct?', 'Three mens are here.', 'Three man are here.', 'Three men are here.', 'Three menes are here.', 'C'),
      mc(9,  'Which word has a regular plural?', 'man', 'child', 'cat', 'tooth', 'C'),
      mc(10, 'Complete: "Two ___ (woman) are in the office."', 'womans', 'women', 'womens', 'womenx', 'B'),
      tf(11, 'Irregular plurals follow the normal rule of adding -s or -es.', 'false'),
      tf(12, 'The plural of "foot" is "feet".', 'true'),
      tf(13, '"Childrens" is the correct plural of "child".', 'false'),
      fb(14, 'Singular: man → Plural: ___. Singular: woman → Plural: ___.', 'men, women'),
      fb(15, 'Singular: tooth → Plural: ___. Singular: child → Plural: ___.', 'teeth, children'),
    ],
  },

  // Lesson 9 — Ordinal Numbers — First/Second/Third
  '36b9e4d2-08b8-48f0-a5ac-6e8982ce6218': {
    pass_threshold: 70,
    questions: [
      mc(1,  'What is the ordinal form of 1?', 'oneth', 'first', 'firsted', 'onest', 'B'),
      mc(2,  'What is the ordinal form of 2?', 'twoth', 'twond', 'second', 'secondly', 'C'),
      mc(3,  'What is the ordinal form of 3?', 'threeth', 'third', 'thrird', 'thirdly', 'B'),
      mc(4,  'What is the ordinal form of 5?', 'fiveth', 'fifthed', 'fifth', 'fived', 'C'),
      mc(5,  'What is the ordinal form of 20?', 'twentith', 'twentieth', 'twentyth', 'twentied', 'B'),
      mc(6,  'We use ordinal numbers to talk about:', 'counting things', 'positions and dates', 'measurements', 'colours', 'B'),
      mc(7,  'How do you say "the 4th floor"?', 'the four floor', 'the fourth floor', 'the foured floor', 'the fourthy floor', 'B'),
      mc(8,  'Which is correct for a date?', 'May the one', 'May first', 'May the oneth', 'One of May', 'B'),
      mc(9,  'What is the ordinal form of 12?', 'twelveth', 'twelfth', 'twelvteenth', 'twelvth', 'B'),
      mc(10, 'He finished ___ in the race. (position 3)', 'three', 'third', 'thirdly', 'threeth', 'B'),
      tf(11, 'Ordinal numbers are used to show the position or order of things.', 'true'),
      tf(12, 'The ordinal form of 8 is "eighteenth".', 'false'),
      tf(13, '"She lives on the second floor" uses an ordinal number correctly.', 'true'),
      fb(14, '1st = ___, 2nd = ___, 3rd = ___.', 'first, second, third'),
      fb(15, 'Today is the ___ (21) of May. She came ___ (1st) in the competition.', 'twenty-first, first'),
    ],
  },

  // Lesson 10 — Indirect Object — I gave him a book
  '00ec2f50-ac39-48c5-b5ba-64e8a6036e57': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Identify the indirect object: "She gave me a gift."', 'She', 'gave', 'me', 'gift', 'C'),
      mc(2,  'Which sentence has an indirect object?', 'I eat pizza.', 'She sings beautifully.', 'He sent her a letter.', 'They run fast.', 'C'),
      mc(3,  'Rewrite with "to": "I gave him the book."', 'I gave the book to him.', 'I gave to the book him.', 'I to him gave the book.', 'I gave him to the book.', 'A'),
      mc(4,  'Choose the correct sentence:', 'She showed to me her photo.', 'She showed her photo me.', 'She showed me her photo.', 'She to me showed her photo.', 'C'),
      mc(5,  'What is the indirect object in: "They sent us a postcard."?', 'They', 'sent', 'us', 'postcard', 'C'),
      mc(6,  'Which verb is commonly used with an indirect object?', 'run', 'sleep', 'give', 'arrive', 'C'),
      mc(7,  'Complete: "Can you tell ___ the answer?" (me/I)', 'I', 'me', 'my', 'mine', 'B'),
      mc(8,  'Which is correct?', 'I bought for her flowers.', 'I bought her flowers.', 'I bought her to flowers.', 'I her bought flowers.', 'B'),
      mc(9,  'What does an indirect object tell us?', 'what the action is', 'when it happened', 'who receives something', 'where it happened', 'C'),
      mc(10, 'Choose the sentence with the correct word order (no preposition):', 'He read his son a story.', 'He read to his son a story.', 'He read a story to son his.', 'He son read a story.', 'A'),
      tf(11, 'The indirect object always comes before the direct object when no preposition is used.', 'true'),
      tf(12, '"I gave to him a book" is the most natural English word order.', 'false'),
      tf(13, 'Both "I gave her the keys" and "I gave the keys to her" are correct.', 'true'),
      fb(14, 'She taught ___ (we) English. He showed ___ (they) the way.', 'us, them'),
      fb(15, 'Rewrite: "I gave a present to her." → "I gave ___ a ___."', 'her, present'),
    ],
  },

  // Lesson 11 — Numbers & Measurements — km/kg/°C
  'f9ade03e-8ba9-4f90-9351-c96b62b95127': {
    pass_threshold: 70,
    questions: [
      mc(1,  'What does "km" stand for?', 'kilomitre', 'kilometre', 'kilomarket', 'kilomed', 'B'),
      mc(2,  'How do you say "5 kg" in English?', 'five kilos', 'five kilogrammes', 'five kilograms', 'Both B and C are correct', 'D'),
      mc(3,  'What does "°C" measure?', 'weight', 'distance', 'temperature', 'volume', 'C'),
      mc(4,  'How do you say "2.5 m"?', 'two point five metres', 'two comma five metres', 'two and five metres', 'two five metres', 'A'),
      mc(5,  'Which unit measures liquid volume?', 'kg', 'km', 'litres', 'metres', 'C'),
      mc(6,  'How do you say "100°C"?', 'one hundred degrees Celsius', 'one hundred Celsius degrees', 'one hundred degree Celsius', 'one hundred Celsius', 'A'),
      mc(7,  'The distance from Almaty to Astana is about 1,300 ___.',  'kg', 'km', 'ml', 'litres', 'B'),
      mc(8,  'How do you say "0.5 kg"?', 'zero point five kilogramme', 'half a kilogram', 'nought five kilograms', 'a half kilograms', 'B'),
      mc(9,  'Which is correct?', 'It is 30 degrees Celsius today.', 'It is 30 degree Celsius today.', 'It is Celsius 30 degrees today.', 'Today is 30 Celsius degrees.', 'A'),
      mc(10, 'How do you read "1,000"?', 'one thousand', 'ten hundred', 'one hundred hundred', 'a thousand and zero', 'A'),
      tf(11, '"km" is the abbreviation for "kilometre".', 'true'),
      tf(12, 'You say "It is 20 degrees Celsius" to describe temperature.', 'true'),
      tf(13, '"Litre" is a unit used to measure weight.', 'false'),
      fb(14, 'The bottle holds 1.5 ___ of water. The bag weighs 3 ___.', 'litres, kilograms / kg'),
      fb(15, 'The temperature today is 25 ___ Celsius. The road is 200 ___ long.', 'degrees, km / kilometres'),
    ],
  },

  // Lesson 12 — Module Review & Test (20 questions, threshold 80)
  '57151b7a-a2e2-4703-b18e-afb84bf04362': {
    pass_threshold: 80,
    questions: [
      // Possessives
      mc(1,  'Choose the correct possessive: "___ name is Asel." (she)', 'She', 'Her', 'Hers', 'Him', 'B'),
      mc(2,  'Which shows possession correctly?', "Ali's book", 'book of Ali', 'Ali book', 'Alis book', 'A'),
      // Countries & Nationalities
      mc(3,  'What is the nationality for someone from Japan?', 'Japanish', 'Japaner', 'Japanese', 'Japanic', 'C'),
      mc(4,  'Which sentence is correct?', 'She is from france.', 'She is from France.', 'she is from France.', 'She is from france', 'B'),
      // Numbers & Colors
      mc(5,  'How do you say 15 in English?', 'fifty', 'fiveteen', 'fifteen', 'fiften', 'C'),
      mc(6,  'What color is the sky on a clear day?', 'green', 'blue', 'red', 'yellow', 'B'),
      // There is / There are
      mc(7,  'Complete: "___ three apples on the table."', 'There is', 'There are', 'There have', 'There be', 'B'),
      mc(8,  'Complete: "___ a cat on the sofa."', 'There are', 'There is', 'There am', 'There be', 'B'),
      // Prepositions of Place
      mc(9,  'The book is ___ the table. (touching the surface)', 'in', 'at', 'on', 'under', 'C'),
      mc(10, 'The bank is ___ the hotel and the café.', 'next to', 'between', 'behind', 'in front of', 'B'),
      // Negation
      mc(11, 'Make "She is a doctor" negative:', "She isn't a doctor.", "She not is a doctor.", "She is no a doctor.", "Not she is a doctor.", 'A'),
      mc(12, 'Complete: "He ___ like spicy food." (negative)', "don't", "doesn't", "isn't", "not", 'B'),
      // Irregular Plurals
      mc(13, 'What is the plural of "child"?', 'childs', 'childes', 'childrens', 'children', 'D'),
      mc(14, 'What is the plural of "tooth"?', 'tooths', 'teeth', 'teethes', 'toothes', 'B'),
      // Ordinal Numbers
      mc(15, 'What is the ordinal form of 3?', 'threeth', 'thrird', 'third', 'thirdly', 'C'),
      // Indirect Object
      mc(16, 'Identify the indirect object: "She gave me a gift."', 'She', 'gave', 'me', 'gift', 'C'),
      // True / False
      tf(17, '"Aren\'t" is the contraction of "are not".', 'true'),
      tf(18, 'The plural of "man" is "mans".', 'false'),
      // Fill blank
      fb(19, '___ (she) father is a teacher. ___ (he) mother is a nurse.', 'Her, His'),
      fb(20, 'There ___ (be) three books on the table. She ___ (be, negative) from Spain.', "are, isn't"),
    ],
  },
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const MODULE_ID = '23972388-e833-45e8-bad1-06d49679c7a7'

  console.log('🔍 Checking A1 Beginner — Module 2 "Close to Home" quiz status...\n')

  const { data: lessons, error: lessonsErr } = await supabase
    .from('english_lessons')
    .select('id, title, order_index')
    .eq('module_id', MODULE_ID)
    .order('order_index')

  if (lessonsErr) throw new Error('Failed to load lessons: ' + lessonsErr.message)

  const lessonIds = lessons!.map(l => l.id)

  const { data: existing, error: quizErr } = await supabase
    .from('english_quizzes')
    .select('lesson_id')
    .in('lesson_id', lessonIds)

  if (quizErr) throw new Error('Failed to load quizzes: ' + quizErr.message)

  const existingSet = new Set((existing ?? []).map(q => q.lesson_id))
  const missing = lessons!.filter(l => !existingSet.has(l.id))

  console.log(`📋 Total lessons: ${lessons!.length}`)
  console.log(`✅ Already have quiz: ${existingSet.size}`)
  console.log(`❌ Missing quiz: ${missing.length}\n`)

  if (missing.length === 0) {
    console.log('✅ All lessons already have quizzes. Nothing to do.')
    return
  }

  let created = 0

  for (const lesson of missing) {
    const quizData = QUIZZES[lesson.id]

    if (!quizData) {
      console.log(`⚠️  Skipped [${lesson.order_index}] ${lesson.title} — no quiz data defined`)
      continue
    }

    const { error: insertErr } = await supabase
      .from('english_quizzes')
      .insert({
        lesson_id:      lesson.id,
        questions:      quizData.questions,
        pass_threshold: quizData.pass_threshold,
      })

    if (insertErr) {
      console.error(`❌ Failed: "${lesson.title}": ${insertErr.message}`)
      continue
    }

    console.log(`✅ Вставлен квиз: ${lesson.title} — ${quizData.questions.length} вопросов`)
    created++
  }

  console.log(`\n✅ Готово: ${created} квизов создано для модуля 2 A1 Beginner`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })