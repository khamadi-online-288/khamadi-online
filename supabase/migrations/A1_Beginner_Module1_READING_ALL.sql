-- ================================================================
-- A1 Beginner / Module 1 — READING sections (order_index = 2)
-- ================================================================

-- Lesson 1: Meet & Greet — Verb To Be
UPDATE english_lesson_sections
SET content = '{
  "title": "Hello! My Name Is Asel",
  "passage": "My name is Asel. I am a student at Nazarbayev University in Astana. I am from Almaty, the largest city in Kazakhstan. My teacher is Professor Smith. He is from the United Kingdom. We are in English class together. There are fifteen students in our group. Some students are from Astana and others are from different cities. The classroom is large and bright. The chairs are comfortable and the tables are clean. Our university is modern and beautiful. I am happy to study English. It is an important language for my future career. My classmates are friendly and hardworking.",
  "true_false": [
    {"id": 1, "statement": "Asel is a professor at the university.", "answer": false},
    {"id": 2, "statement": "Asel is from Almaty.", "answer": true},
    {"id": 3, "statement": "Professor Smith is from the United States.", "answer": false},
    {"id": 4, "statement": "There are fifteen students in the group.", "answer": true},
    {"id": 5, "statement": "The classroom is described as large and bright.", "answer": true}
  ],
  "multiple_choice": [
    {"id": 1, "question": "What is Asel?", "options": ["A professor", "A student", "A doctor", "A teacher"], "answer": "A student"},
    {"id": 2, "question": "Where is Asel from?", "options": ["Astana", "London", "Almaty", "Moscow"], "answer": "Almaty"},
    {"id": 3, "question": "Where is Professor Smith from?", "options": ["The United States", "Russia", "Kazakhstan", "The United Kingdom"], "answer": "The United Kingdom"},
    {"id": 4, "question": "How many students are in the class?", "options": ["Ten", "Twelve", "Fifteen", "Twenty"], "answer": "Fifteen"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: am, is, are, large, fifteen",
    "sentences": [
      {"id": 1, "text": "My name ___ Asel.", "answer": "is"},
      {"id": 2, "text": "I ___ a student at Nazarbayev University.", "answer": "am"},
      {"id": 3, "text": "My classmates ___ friendly and hardworking.", "answer": "are"},
      {"id": 4, "text": "The classroom is ___ and bright.", "answer": "large"},
      {"id": 5, "text": "There are ___ students in the group.", "answer": "fifteen"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 1
)
AND type = 'reading';

-- Lesson 2: The Alphabet & Sounds — Articles a/an/the
UPDATE english_lesson_sections
SET content = '{
  "title": "Letters, Sounds, and Articles",
  "passage": "The English alphabet has twenty-six letters. There are five vowels: A, E, I, O, and U. All other letters are consonants. In English, we use articles before nouns. We use a before a consonant sound: a book, a student, a pen. We use an before a vowel sound: an apple, an engineer, an hour. The article the is definite. We use the when we know exactly which thing we mean. For example: Please open the textbook on page ten. We do not use an article before most countries and languages. We say Kazakhstan, not the Kazakhstan. We say English, not the English.",
  "true_false": [
    {"id": 1, "statement": "The English alphabet has twenty-six letters.", "answer": true},
    {"id": 2, "statement": "A, E, I, O, U are consonants.", "answer": false},
    {"id": 3, "statement": "We use an before a consonant sound.", "answer": false},
    {"id": 4, "statement": "The is used when we know exactly which thing is meant.", "answer": true},
    {"id": 5, "statement": "We say the Kazakhstan in correct English.", "answer": false}
  ],
  "multiple_choice": [
    {"id": 1, "question": "How many vowels are in the English alphabet?", "options": ["Three", "Four", "Five", "Six"], "answer": "Five"},
    {"id": 2, "question": "Which article is used before a vowel sound?", "options": ["a", "an", "the", "no article"], "answer": "an"},
    {"id": 3, "question": "Which is correct?", "options": ["a engineer", "an engineer", "the engineer always", "a engineers"], "answer": "an engineer"},
    {"id": 4, "question": "When do we use the?", "options": ["Before all nouns", "Before vowels only", "When we know which specific thing", "Before names"], "answer": "When we know which specific thing"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: a, an, the, vowels, consonants",
    "sentences": [
      {"id": 1, "text": "I need ___ pen for the exam.", "answer": "a"},
      {"id": 2, "text": "She is ___ engineer at the company.", "answer": "an"},
      {"id": 3, "text": "Please open ___ door.", "answer": "the"},
      {"id": 4, "text": "A, E, I, O, U are ___.", "answer": "vowels"},
      {"id": 5, "text": "B, C, D, F, G are ___.", "answer": "consonants"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 2
)
AND type = 'reading';

-- Lesson 3: This or That? — This/That/These/Those
UPDATE english_lesson_sections
SET content = '{
  "title": "A Walk Around the Classroom",
  "passage": "Look at this classroom. This room is large and modern. These chairs are comfortable. Those desks near the window are for advanced students. That building across the street is the main library. This pen on my desk is blue. That pen on the teacher''s desk is red. These books here are for our English course. Those old books on the top shelf are from last year. This is my bag. That is my friend''s bag over there. We use this and these for things that are near. We use that and those for things that are far away.",
  "true_false": [
    {"id": 1, "statement": "This and these refer to things that are near.", "answer": true},
    {"id": 2, "statement": "The library is across the street.", "answer": true},
    {"id": 3, "statement": "The blue pen is on the teacher desk.", "answer": false},
    {"id": 4, "statement": "Those desks near the window are for beginners.", "answer": false},
    {"id": 5, "statement": "That and those refer to things that are far.", "answer": true}
  ],
  "multiple_choice": [
    {"id": 1, "question": "What is across the street?", "options": ["A cafeteria", "A classroom", "The main library", "A bookstore"], "answer": "The main library"},
    {"id": 2, "question": "Which word is used for plural things that are far?", "options": ["this", "that", "these", "those"], "answer": "those"},
    {"id": 3, "question": "What colour is the pen on my desk?", "options": ["Red", "Green", "Blue", "Black"], "answer": "Blue"},
    {"id": 4, "question": "What are those books on the top shelf?", "options": ["New textbooks", "Books for beginners", "Old books from last year", "English dictionaries"], "answer": "Old books from last year"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: this, that, these, those, near",
    "sentences": [
      {"id": 1, "text": "We use ___ for singular things that are close.", "answer": "this"},
      {"id": 2, "text": "We use ___ for singular things that are far.", "answer": "that"},
      {"id": 3, "text": "We use ___ for plural things that are close.", "answer": "these"},
      {"id": 4, "text": "We use ___ for plural things that are far.", "answer": "those"},
      {"id": 5, "text": "This and these refer to things that are ___.", "answer": "near"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 3
)
AND type = 'reading';

-- Lesson 4: One or Many? — Singular & Plural Nouns
UPDATE english_lesson_sections
SET content = '{
  "title": "Singular and Plural Nouns in English",
  "passage": "In English, nouns can be singular or plural. One book becomes two books. One student becomes three students. Most nouns add -s to form the plural. Nouns ending in -ch, -sh, -s, or -x add -es: one match becomes two matches, one bus becomes two buses. Some nouns are irregular and do not follow the regular pattern. One man becomes two men. One woman becomes two women. One child becomes many children. One tooth becomes many teeth. One foot becomes two feet. Some nouns do not change at all: one sheep is the same as two sheep. Learning these irregular plurals is important for correct English.",
  "true_false": [
    {"id": 1, "statement": "Most nouns add -s to form the plural.", "answer": true},
    {"id": 2, "statement": "The plural of man is mans.", "answer": false},
    {"id": 3, "statement": "Children is the plural of child.", "answer": true},
    {"id": 4, "statement": "Sheep changes to sheeps in the plural.", "answer": false},
    {"id": 5, "statement": "Nouns ending in -sh add -es to form the plural.", "answer": true}
  ],
  "multiple_choice": [
    {"id": 1, "question": "What is the plural of woman?", "options": ["womans", "womens", "women", "wommen"], "answer": "women"},
    {"id": 2, "question": "How do most nouns form the plural?", "options": ["Add -es", "Add -s", "Do not change", "Change completely"], "answer": "Add -s"},
    {"id": 3, "question": "What is the plural of bus?", "options": ["bus", "buss", "busies", "buses"], "answer": "buses"},
    {"id": 4, "question": "Which noun does NOT change in the plural?", "options": ["child", "man", "sheep", "tooth"], "answer": "sheep"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: plural, singular, irregular, children, matches",
    "sentences": [
      {"id": 1, "text": "One book is ___. Two books is plural.", "answer": "singular"},
      {"id": 2, "text": "The ___ form of most nouns adds -s.", "answer": "plural"},
      {"id": 3, "text": "Men and women are ___ plural forms.", "answer": "irregular"},
      {"id": 4, "text": "One child becomes many ___.", "answer": "children"},
      {"id": 5, "text": "Two ___ is the plural of one match.", "answer": "matches"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 4
)
AND type = 'reading';

-- Lesson 5: Describing Things — Adjectives
UPDATE english_lesson_sections
SET content = '{
  "title": "Describing Our University",
  "passage": "Adjectives are words that describe nouns. They tell us about size, colour, age, and quality. In English, adjectives go before the noun they describe. We say a large building, not a building large. Our university has a beautiful campus. The main building is tall and modern. The library is quiet and comfortable. The laboratories are bright and well-equipped. The cafeteria serves hot and delicious food. The garden has colourful flowers in spring. In academic writing, we use precise adjectives. We say significant instead of big. We say comprehensive instead of full. A good adjective makes your writing clear and professional.",
  "true_false": [
    {"id": 1, "statement": "Adjectives go after the noun in English.", "answer": false},
    {"id": 2, "statement": "Adjectives describe nouns.", "answer": true},
    {"id": 3, "statement": "The library is described as quiet and comfortable.", "answer": true},
    {"id": 4, "statement": "In academic writing, big is preferred over significant.", "answer": false},
    {"id": 5, "statement": "The main building is described as tall and modern.", "answer": true}
  ],
  "multiple_choice": [
    {"id": 1, "question": "Where do adjectives go in English?", "options": ["After the noun", "Before the noun", "After the verb", "At the end of a sentence"], "answer": "Before the noun"},
    {"id": 2, "question": "What is an academic alternative for big?", "options": ["large", "huge", "significant", "enormous"], "answer": "significant"},
    {"id": 3, "question": "How is the campus described?", "options": ["old", "small", "beautiful", "quiet"], "answer": "beautiful"},
    {"id": 4, "question": "What do adjectives describe?", "options": ["verbs", "nouns", "adjectives", "pronouns"], "answer": "nouns"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: adjectives, modern, significant, comfortable, before",
    "sentences": [
      {"id": 1, "text": "In English, ___ go before nouns.", "answer": "adjectives"},
      {"id": 2, "text": "The main building is tall and ___.", "answer": "modern"},
      {"id": 3, "text": "In academic writing, use ___ instead of big.", "answer": "significant"},
      {"id": 4, "text": "The library is quiet and ___.", "answer": "comfortable"},
      {"id": 5, "text": "Adjectives come ___ the noun they describe.", "answer": "before"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 5
)
AND type = 'reading';

-- Lesson 7: Contractions — I'm, You're, It's, Don't, Can't
UPDATE english_lesson_sections
SET content = '{
  "title": "Short Forms: Using Contractions in English",
  "passage": "A contraction is a short form of two words joined together. An apostrophe shows where the letters are missing. I am becomes I''m. You are becomes you''re. He is becomes he''s. She is becomes she''s. It is becomes it''s. We are becomes we''re. They are becomes they''re. Do not becomes don''t. Cannot becomes can''t. Does not becomes doesn''t. Did not becomes didn''t. We use contractions in spoken English and informal writing. In formal and academic writing, we prefer full forms. We write do not, not don''t. We write cannot, not can''t. Remember: it''s means it is. Its without an apostrophe shows belonging.",
  "true_false": [
    {"id": 1, "statement": "A contraction joins two words using an apostrophe.", "answer": true},
    {"id": 2, "statement": "Contractions are preferred in formal academic writing.", "answer": false},
    {"id": 3, "statement": "I''m is a contraction of I am.", "answer": true},
    {"id": 4, "statement": "Don''t is a contraction of do not.", "answer": true},
    {"id": 5, "statement": "Its (without apostrophe) means it is.", "answer": false}
  ],
  "multiple_choice": [
    {"id": 1, "question": "What is a contraction?", "options": ["A long word", "A short form of two words", "A type of adjective", "A punctuation mark"], "answer": "A short form of two words"},
    {"id": 2, "question": "What does an apostrophe show in a contraction?", "options": ["The end of a sentence", "A question", "Where letters are missing", "Possession only"], "answer": "Where letters are missing"},
    {"id": 3, "question": "What is the full form of can''t?", "options": ["can not", "cannot", "could not", "will not"], "answer": "cannot"},
    {"id": 4, "question": "Which is correct in formal academic writing?", "options": ["don''t", "do not", "I''m writing", "can''t be"], "answer": "do not"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: contraction, apostrophe, informal, formal, missing",
    "sentences": [
      {"id": 1, "text": "A ___ is a short form of two words.", "answer": "contraction"},
      {"id": 2, "text": "An ___ shows where letters are missing.", "answer": "apostrophe"},
      {"id": 3, "text": "Contractions are common in ___ writing.", "answer": "informal"},
      {"id": 4, "text": "In ___ writing, use do not instead of a contraction.", "answer": "formal"},
      {"id": 5, "text": "In I''m, the letters a and r are ___.", "answer": "missing"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 7
)
AND type = 'reading';

-- Lesson 8: Pronunciation & Sounds — Phonetics
UPDATE english_lesson_sections
SET content = '{
  "title": "The Sounds of English",
  "passage": "English has forty-four sounds called phonemes. The alphabet has only twenty-six letters, but letters can represent many different sounds. The letter A sounds different in cat and cake. The letters TH make two different sounds: the sound in think is voiceless, and the sound in this is voiced. Some letters are silent and we do not pronounce them. The K in knife is silent. The W in write is silent. The B in climb is silent. Phonetic symbols help us understand pronunciation. You can find these symbols in a good dictionary. Regular practice with listening and speaking is the best way to improve your English pronunciation.",
  "true_false": [
    {"id": 1, "statement": "English has twenty-six phonemes.", "answer": false},
    {"id": 2, "statement": "The letter A always sounds the same.", "answer": false},
    {"id": 3, "statement": "The K in knife is silent.", "answer": true},
    {"id": 4, "statement": "Phonetic symbols can be found in a dictionary.", "answer": true},
    {"id": 5, "statement": "Regular practice helps improve pronunciation.", "answer": true}
  ],
  "multiple_choice": [
    {"id": 1, "question": "How many phonemes does English have?", "options": ["Twenty-six", "Thirty", "Forty-four", "Fifty"], "answer": "Forty-four"},
    {"id": 2, "question": "What is a silent letter?", "options": ["A vowel sound", "A consonant cluster", "A letter we write but do not pronounce", "A letter with two sounds"], "answer": "A letter we write but do not pronounce"},
    {"id": 3, "question": "Which letter is silent in the word knife?", "options": ["N", "K", "I", "F"], "answer": "K"},
    {"id": 4, "question": "What helps us understand pronunciation?", "options": ["Grammar rules", "Phonetic symbols", "Capital letters", "Punctuation marks"], "answer": "Phonetic symbols"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: phonemes, silent, symbols, practice, sounds",
    "sentences": [
      {"id": 1, "text": "English has forty-four ___.", "answer": "phonemes"},
      {"id": 2, "text": "The K in knife is a ___ letter.", "answer": "silent"},
      {"id": 3, "text": "A dictionary shows phonetic ___ for each word.", "answer": "symbols"},
      {"id": 4, "text": "Regular ___ helps improve your English.", "answer": "practice"},
      {"id": 5, "text": "Letters can represent many different ___.", "answer": "sounds"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 8
)
AND type = 'reading';

-- Lesson 9: Word Order — Subject + Verb + Object
UPDATE english_lesson_sections
SET content = '{
  "title": "The Right Order: Subject, Verb, Object",
  "passage": "Word order is very important in English. The basic structure of an English sentence is Subject plus Verb plus Object. We say: The student reads the book. The student is the subject. Reads is the verb. The book is the object. We cannot change this order freely as in Russian. Adverbs of time usually come at the end of the sentence: The student reads the book every morning. Adverbs of frequency go before the main verb: She always studies in the library. He never misses a lecture. In questions, the auxiliary verb comes before the subject: Do you study English? Correct word order makes sentences clear and easy to understand.",
  "true_false": [
    {"id": 1, "statement": "The basic English sentence structure is Subject + Verb + Object.", "answer": true},
    {"id": 2, "statement": "We can change word order freely in English.", "answer": false},
    {"id": 3, "statement": "Adverbs of time usually go at the beginning of a sentence.", "answer": false},
    {"id": 4, "statement": "Adverbs of frequency go before the main verb.", "answer": true},
    {"id": 5, "statement": "In questions, the subject comes before the auxiliary verb.", "answer": false}
  ],
  "multiple_choice": [
    {"id": 1, "question": "What is the basic word order in English?", "options": ["Object + Subject + Verb", "Verb + Subject + Object", "Subject + Verb + Object", "Subject + Object + Verb"], "answer": "Subject + Verb + Object"},
    {"id": 2, "question": "In the sentence The student reads the book, what is the verb?", "options": ["student", "reads", "book", "the"], "answer": "reads"},
    {"id": 3, "question": "Where do adverbs of frequency usually go?", "options": ["At the end", "At the beginning", "Before the main verb", "After the object"], "answer": "Before the main verb"},
    {"id": 4, "question": "How is a question formed in English?", "options": ["Subject before everything", "Auxiliary verb before the subject", "Object first", "No change from a statement"], "answer": "Auxiliary verb before the subject"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: subject, verb, object, frequency, auxiliary",
    "sentences": [
      {"id": 1, "text": "In She reads the book, She is the ___.", "answer": "subject"},
      {"id": 2, "text": "In She reads the book, reads is the ___.", "answer": "verb"},
      {"id": 3, "text": "In She reads the book, the book is the ___.", "answer": "object"},
      {"id": 4, "text": "Always and never are adverbs of ___.", "answer": "frequency"},
      {"id": 5, "text": "In questions, the ___ verb comes before the subject.", "answer": "auxiliary"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 9
)
AND type = 'reading';

-- Lesson 10: Vowels & Digraphs
UPDATE english_lesson_sections
SET content = '{
  "title": "Vowels and Special Letter Combinations",
  "passage": "English has five vowel letters: A, E, I, O, and U. Each vowel can make different sounds. The letter A sounds different in cat, cake, and car. A digraph is a combination of two letters that makes one sound. The letters CH together make the sound in chair and child. The letters SH make the sound in ship and shower. The letters TH make the sound in think and the. The letters PH make an F sound, as in phone and photograph. The letters OO can make two sounds: the short sound in book and the long sound in food. Understanding vowels and digraphs helps you read and spell English words correctly.",
  "true_false": [
    {"id": 1, "statement": "English has five vowel letters.", "answer": true},
    {"id": 2, "statement": "The letter A always makes the same sound.", "answer": false},
    {"id": 3, "statement": "A digraph is a combination of two letters that makes one sound.", "answer": true},
    {"id": 4, "statement": "PH makes a V sound.", "answer": false},
    {"id": 5, "statement": "CH is an example of a digraph.", "answer": true}
  ],
  "multiple_choice": [
    {"id": 1, "question": "How many vowel letters are in the English alphabet?", "options": ["Three", "Four", "Five", "Six"], "answer": "Five"},
    {"id": 2, "question": "What is a digraph?", "options": ["Two vowels together", "Two letters that make one sound", "A silent letter", "A double consonant"], "answer": "Two letters that make one sound"},
    {"id": 3, "question": "What sound does PH make?", "options": ["P", "V", "F", "B"], "answer": "F"},
    {"id": 4, "question": "Which is an example of a digraph?", "options": ["AA", "BB", "SH", "TT"], "answer": "SH"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: vowels, digraph, sounds, letters, photograph",
    "sentences": [
      {"id": 1, "text": "A, E, I, O, U are ___.", "answer": "vowels"},
      {"id": 2, "text": "CH and SH are examples of a ___.", "answer": "digraph"},
      {"id": 3, "text": "The letter A makes different ___ in different words.", "answer": "sounds"},
      {"id": 4, "text": "A digraph combines two ___ to make one sound.", "answer": "letters"},
      {"id": 5, "text": "PH makes an F sound, as in ___.", "answer": "photograph"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 10
)
AND type = 'reading';

-- Lesson 11: Verb To Have — Have/Has/Had
UPDATE english_lesson_sections
SET content = '{
  "title": "The Verb Have: Have, Has, Had",
  "passage": "The verb have is very important in English. In the present tense, we use have with I, you, we, and they. We use has with he, she, and it. I have two brothers and one sister. She has a bicycle and a laptop. They have a large flat in Almaty. Our university has excellent laboratories. In the past tense, all subjects use had. Yesterday, I had a meeting with my supervisor. She had an important exam last Monday. The team had a successful presentation last week. We use have and has in many common expressions: I have a cold, he has a headache, they have time. The verb have is irregular, so it is important to learn all its forms.",
  "true_false": [
    {"id": 1, "statement": "We use has with I and you.", "answer": false},
    {"id": 2, "statement": "She has a bicycle is correct English.", "answer": true},
    {"id": 3, "statement": "In the past tense, all subjects use had.", "answer": true},
    {"id": 4, "statement": "Have is a regular verb.", "answer": false},
    {"id": 5, "statement": "I have a cold is an expression using the verb have.", "answer": true}
  ],
  "multiple_choice": [
    {"id": 1, "question": "Which form is correct?", "options": ["She have a bicycle", "She has a bicycle", "She haves a bicycle", "She having a bicycle"], "answer": "She has a bicycle"},
    {"id": 2, "question": "Which pronoun uses have in the present tense?", "options": ["he", "she", "it", "they"], "answer": "they"},
    {"id": 3, "question": "What is the past form of have?", "options": ["haved", "had", "have", "has"], "answer": "had"},
    {"id": 4, "question": "What type of verb is have?", "options": ["Regular", "Modal only", "Irregular", "Auxiliary only"], "answer": "Irregular"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: have, has, had, irregular, present",
    "sentences": [
      {"id": 1, "text": "I ___ two brothers and one sister.", "answer": "have"},
      {"id": 2, "text": "She ___ a bicycle and a laptop.", "answer": "has"},
      {"id": 3, "text": "Yesterday I ___ a meeting with my supervisor.", "answer": "had"},
      {"id": 4, "text": "The verb have is ___.", "answer": "irregular"},
      {"id": 5, "text": "In the ___ tense, we use has with she.", "answer": "present"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 11
)
AND type = 'reading';

-- Lesson 12: Capitalization
UPDATE english_lesson_sections
SET content = '{
  "title": "When to Use Capital Letters",
  "passage": "Capital letters are an important part of English writing. The first word of every sentence begins with a capital letter. The pronoun I is always written with a capital letter. Names of people use capital letters: Asel, Professor Smith, Doctor Johnson. Countries, cities, and continents also use capitals: Kazakhstan, Almaty, Asia, Europe. Days of the week begin with capital letters: Monday, Tuesday, Wednesday. Months of the year are also capitalised: January, February, March. Languages and nationalities use capitals: English, Kazakh, Russian, French. The names of organisations use capitals: Nazarbayev University, the United Nations. The seasons spring, summer, autumn, and winter do not use capital letters.",
  "true_false": [
    {"id": 1, "statement": "The pronoun I is always written with a capital letter.", "answer": true},
    {"id": 2, "statement": "Days of the week start with lowercase letters.", "answer": false},
    {"id": 3, "statement": "Countries and cities use capital letters.", "answer": true},
    {"id": 4, "statement": "The seasons spring and summer use capital letters.", "answer": false},
    {"id": 5, "statement": "The first word of every sentence is capitalised.", "answer": true}
  ],
  "multiple_choice": [
    {"id": 1, "question": "Which word is always written with a capital letter?", "options": ["a", "the", "I", "and"], "answer": "I"},
    {"id": 2, "question": "Which sentence has correct capitalisation?", "options": ["she lives in almaty.", "She lives in Almaty, Kazakhstan.", "She lives in Almaty, kazakhstan.", "she Lives in Almaty."], "answer": "She lives in Almaty, Kazakhstan."},
    {"id": 3, "question": "Which does NOT use a capital letter?", "options": ["Monday", "January", "Kazakhstan", "winter"], "answer": "winter"},
    {"id": 4, "question": "Which uses a capital letter?", "options": ["english class", "English class", "the language", "a book"], "answer": "English class"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: capital, pronoun, months, languages, seasons",
    "sentences": [
      {"id": 1, "text": "The first word of a sentence begins with a ___ letter.", "answer": "capital"},
      {"id": 2, "text": "The ___ I is always capitalised.", "answer": "pronoun"},
      {"id": 3, "text": "January, February, and March are ___.", "answer": "months"},
      {"id": 4, "text": "English, Kazakh, and Russian are ___.", "answer": "languages"},
      {"id": 5, "text": "Spring and summer are ___ that do not use capital letters.", "answer": "seasons"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 12
)
AND type = 'reading';

-- Lesson 13: Punctuation — Periods, Commas, Apostrophes
UPDATE english_lesson_sections
SET content = '{
  "title": "Marks That Help Us Read: Punctuation",
  "passage": "Punctuation marks are symbols that make writing clear and easy to understand. A period ends a declarative sentence. A question mark ends an interrogative sentence. A comma separates items in a list: books, pens, notebooks, and rulers. We also use commas before conjunctions like but and although. An apostrophe has two main uses in English. First, it shows possession: the student''s book belongs to the student. Second, it shows a contraction where letters are missing: do not becomes don''t. An exclamation mark shows strong emotion or surprise. Using correct punctuation is essential for professional and academic writing. Always check your punctuation before submitting any written work.",
  "true_false": [
    {"id": 1, "statement": "A period ends a question.", "answer": false},
    {"id": 2, "statement": "A comma separates items in a list.", "answer": true},
    {"id": 3, "statement": "An apostrophe only shows possession.", "answer": false},
    {"id": 4, "statement": "A question mark ends an interrogative sentence.", "answer": true},
    {"id": 5, "statement": "Punctuation does not affect the clarity of writing.", "answer": false}
  ],
  "multiple_choice": [
    {"id": 1, "question": "What does a period do?", "options": ["Ends a question", "Ends a declarative sentence", "Separates items", "Shows possession"], "answer": "Ends a declarative sentence"},
    {"id": 2, "question": "What does an apostrophe show in don''t?", "options": ["Possession", "A question", "A contraction", "Strong emotion"], "answer": "A contraction"},
    {"id": 3, "question": "Which punctuation separates items in a list?", "options": ["A period", "A comma", "A question mark", "An apostrophe"], "answer": "A comma"},
    {"id": 4, "question": "What are the two uses of an apostrophe?", "options": ["Questions and answers", "Possession and contractions", "Lists and questions", "Periods and commas"], "answer": "Possession and contractions"}
  ],
  "fill_in_blank": {
    "instruction": "Fill in the blanks with: period, comma, apostrophe, question, punctuation",
    "sentences": [
      {"id": 1, "text": "A ___ ends every declarative sentence.", "answer": "period"},
      {"id": 2, "text": "A ___ separates items in a list.", "answer": "comma"},
      {"id": 3, "text": "An ___ shows possession or a contraction.", "answer": "apostrophe"},
      {"id": 4, "text": "A ___ mark ends an interrogative sentence.", "answer": "question"},
      {"id": 5, "text": "Correct ___ makes writing clear and easy to read.", "answer": "punctuation"}
    ]
  }
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 13
)
AND type = 'reading';
