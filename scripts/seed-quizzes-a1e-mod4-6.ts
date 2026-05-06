/**
 * Seed quizzes for A1 Elementary — Modules 4, 5, 6.
 * Run: npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1e-mod4-6.ts
 */
import * as fs from 'fs'; import * as path from 'path'; import { createClient } from '@supabase/supabase-js'
function loadEnv(){const f=path.join(process.cwd(),'.env.local');if(!fs.existsSync(f))return;fs.readFileSync(f,'utf-8').split('\n').forEach(line=>{const t=line.trim();if(!t||t.startsWith('#'))return;const i=t.indexOf('=');if(i<0)return;const key=t.slice(0,i).trim();const val=t.slice(i+1).trim().replace(/^['"]|['"]$/g,'');if(key&&!(key in process.env))process.env[key]=val})}
loadEnv()
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!)
type MC={id:number;type:'multiple_choice';question:string;option_a:string;option_b:string;option_c:string;option_d:string;correct_answer:'A'|'B'|'C'|'D'}
type TF={id:number;type:'true_false';question:string;correct_answer:'true'|'false'}
type FB={id:number;type:'fill_blank';question:string;correct_answer:string}
type Q=MC|TF|FB
const mc=(id:number,q:string,a:string,b:string,c:string,d:string,ans:'A'|'B'|'C'|'D'):MC=>({id,type:'multiple_choice',question:q,option_a:a,option_b:b,option_c:c,option_d:d,correct_answer:ans})
const tf=(id:number,q:string,ans:'true'|'false'):TF=>({id,type:'true_false',question:q,correct_answer:ans})
const fb=(id:number,q:string,ans:string):FB=>({id,type:'fill_blank',question:q,correct_answer:ans})

const QUIZZES:Record<string,{pass_threshold:number;questions:Q[]}>={

  // ═══ MODULE 4: Food & Health ═══

  '6180e59a-a6ed-463e-91bb-768c1cb69fad':{pass_threshold:70,questions:[  // Food & Drinks — Countable & Uncountable
    mc(1,'Which noun is uncountable?','apple','egg','rice','banana','C'),
    mc(2,'Which noun is countable?','milk','water','sandwich','bread','C'),
    mc(3,'Complete: "How much ___ do you need?" (sugar)','sugars','pieces of sugar','sugar','a sugar','C'),
    mc(4,'Complete: "How many ___ are in the recipe?" (egg)','egg','eggs','eggses','piece of egg','B'),
    mc(5,'Which is correct?','I\'d like a bread.','I\'d like some bread.','I\'d like a breads.','I\'d like bread a piece.','B'),
    mc(6,'Which is correct?','There are much apples.','There are many apples.','There is many apples.','There are much apple.','B'),
    mc(7,'Complete: "There isn\'t ___ milk left." (not much)','many','a few','much','a lot','C'),
    mc(8,'Which foods are countable?','rice, pasta, flour','egg, apple, sandwich','milk, water, juice','sugar, salt, pepper','B'),
    mc(9,'Complete: "Can I have ___ coffee, please?" (some)','a','an','some','much','C'),
    mc(10,'Which is correct?','She ate a rice.','She ate some rice.','She ate rices.','She ate a piece rice.','B'),
    tf(11,'"Water" and "rice" are uncountable nouns.','true'),
    tf(12,'"How many milk do you want?" is correct.','false'),
    tf(13,'Countable nouns can be preceded by "a/an" or a number.','true'),
    fb(14,'I need ___ (some/a) bread and ___ (some/two) eggs.','some, two'),
    fb(15,'How ___ (much/many) coffee do you drink? How ___ (much/many) cups a day?','much, many'),
  ]},

  'cfe57aac-e2bd-4f46-9946-4321cbb9c9cb':{pass_threshold:70,questions:[  // At the Restaurant — How much/many
    mc(1,'Complete: "___ does this dish cost?"','How many','How much','What much','How often','B'),
    mc(2,'Complete: "___ people are waiting for a table?"','How much','How often','How many','What many','C'),
    mc(3,'How do you politely order food?','Give me a steak.','I want steak.','I\'d like the steak, please.','Steak now!','C'),
    mc(4,'What does "I\'d like" mean?','I don\'t want','I would like','I liked','I need urgently','B'),
    mc(5,'Complete: "___ you like a dessert?" (waiter asking)','Would','Should','Must','Could','A'),
    mc(6,'Complete: "Could we have the ___, please?" (asking for the total to pay)','receipt','order','bill','menu','C'),
    mc(7,'Which phrase is used to book a table?','A table for two, please.','Two tables, please.','I want to sit.','Give me a table.','A'),
    mc(8,'Complete: "How much ___ this meal come to?" (total price)','is','does','do','are','B'),
    mc(9,'What do you say if the food is not what you ordered?','Delicious!','Excuse me, I think this isn\'t what I ordered.','More, please!','Check, please!','B'),
    mc(10,'Complete: "___ glasses of water are on the table?" — "Two."','How much','How many','How often','What number','B'),
    tf(11,'"How much" asks about the price or quantity of uncountable nouns.','true'),
    tf(12,'"How many water do you want?" is correct.','false'),
    tf(13,'"I\'d like" is more polite than "I want" when ordering.','true'),
    fb(14,'___ is the soup? It ___ (cost) $5. ___ portions would you like?','How much, costs, How many'),
    fb(15,'___ would you like to drink? I ___ (would) like a lemonade, please.','What, \'d / would'),
  ]},

  'dca9fd08-85cb-42a8-a845-6e5da16bbbb6':{pass_threshold:70,questions:[  // Sport & Fitness — Present Perfect intro
    mc(1,'How do we form Present Perfect?','subject + did + past participle','subject + have/has + past participle','subject + am/is/are + past participle','subject + will + past participle','B'),
    mc(2,'Choose the correct sentence:','She has ran a marathon.','She has run a marathon.','She have run a marathon.','She has runned a marathon.','B'),
    mc(3,'Complete: "He ___ (never/try) sushi."','never tries','has never tried','never tried','had never tried','B'),
    mc(4,'Which time expression signals Present Perfect?','yesterday','last week','in 2020','already','D'),
    mc(5,'Complete: "I ___ (just/finish) my workout."','just finish','have just finished','just finished','just finishing','B'),
    mc(6,'"Have" is used with:','he, she, it','I, you, we, they','all subjects','none','B'),
    mc(7,'Complete: "She ___ (not/play) tennis before."','didn\'t play','hasn\'t played','don\'t play','not played','B'),
    mc(8,'Choose the correct question:','Have you ever seen the sea?','Did you ever seen the sea?','Have you ever saw the sea?','Has you ever seen the sea?','A'),
    mc(9,'Complete: "___ you ever ___ (be) to London?"','Have / been','Has / been','Did / been','Have / was','A'),
    mc(10,'What is the past participle of "do"?','did','done','doing','does','B'),
    tf(11,'Present Perfect is formed with have/has + past participle.','true'),
    tf(12,'"She has went to the gym" is correct.','false'),
    tf(13,'"Ever" and "never" are common with Present Perfect.','true'),
    fb(14,'I ___ (never/eat) sushi. Have you ___ (ever/try) it?','have never eaten, ever tried'),
    fb(15,'She ___ (just/finish) a 5km run. He ___ (already/win) three medals.','has just finished, has already won'),
  ]},

  'e07b807e-ff00-484e-9b9c-1d3735625625':{pass_threshold:70,questions:[  // Healthy Living — Should/Shouldn't
    mc(1,'Complete: "You ___ eat more vegetables." (advice)','must','will','should','can','C'),
    mc(2,'Complete: "You ___ smoke." (negative advice)','shouldn\'t','mustn\'t','won\'t','can\'t','A'),
    mc(3,'"Should" expresses:','certainty','obligation','advice or recommendation','ability','C'),
    mc(4,'Complete: "She ___ get more sleep — she looks tired."','can','will','should','must','C'),
    mc(5,'After "should" the verb is always:','base form','gerund (-ing)','past tense','infinitive with to','A'),
    mc(6,'Choose the correct sentence:','You should to eat less sugar.','You should eating less sugar.','You should eat less sugar.','You should eats less sugar.','C'),
    mc(7,'Complete: "___ I take vitamin D?" — "Yes, you should."','Should','Must','Can','Will','A'),
    mc(8,'Complete: "You ___ (negative) stay up too late — it\'s bad for you."','shouldn\'t','can\'t','won\'t','mustn\'t','A'),
    mc(9,'Which is healthy advice?','You should eat a lot of junk food.','You should drink plenty of water.','You shouldn\'t exercise.','You should sleep less.','B'),
    mc(10,'Complete: "Children ___ eat too much sugar."','should','will','shouldn\'t','can','C'),
    tf(11,'"Should" does not change form for he/she/it.','true'),
    tf(12,'"You should to exercise every day" is correct.','false'),
    tf(13,'"Shouldn\'t" is the contracted negative of "should not".','true'),
    fb(14,'You ___ (should) drink 8 glasses of water. You ___ (not/should) skip breakfast.','should, shouldn\'t'),
    fb(15,'___ (should) she see a doctor? Yes, she ___ (should).','Should, should'),
  ]},

  '6c7ab275-ba6f-43c4-8172-5cba3ad7c2de':{pass_threshold:70,questions:[  // Shopping for Food — Articles
    mc(1,'Complete: "She bought ___ apple." (one apple)','a','an','the','no article','B'),
    mc(2,'Complete: "Pass me ___ salt, please." (the salt on the table — specific)','a','an','the','no article','C'),
    mc(3,'Complete: "I eat ___ rice every day." (rice in general)','a','an','the','no article','D'),
    mc(4,'Complete: "She is ___ excellent cook."','a','an','the','no article','B'),
    mc(5,'Complete: "Can I have ___ cup of tea, please?"','a','an','the','no article','A'),
    mc(6,'Complete: "___ Eiffel Tower is in Paris." (unique landmark)','A','An','The','No article','C'),
    mc(7,'Complete: "I\'d like ___ orange juice." (some, uncountable)','a','an','the','no article','D'),
    mc(8,'Complete: "She plays ___ piano." (musical instrument)','a','an','the','no article','C'),
    mc(9,'Complete: "He is ___ honest man."','a','an','the','no article','B'),
    mc(10,'Complete: "We go to ___ school every day." (institution in general)','a','an','the','no article','D'),
    tf(11,'We use "the" for things already mentioned or known to both speaker and listener.','true'),
    tf(12,'"She plays a piano" is correct when talking about musical instruments.','false'),
    tf(13,'"An" is used before words that begin with a vowel sound.','true'),
    fb(14,'I bought ___ (a/an) orange and ___ (a/an) banana at ___ (the/a) market.','an, a, the'),
    fb(15,'She is ___ (a/an) engineer. She works in ___ (a/the) big company.','an, a'),
  ]},

  '2ab85a70-de80-4fb3-b85d-f10a73300341':{pass_threshold:80,questions:[  // Module 4 Review & Test
    mc(1,'Which is uncountable?','apple','egg','rice','banana','C'),
    mc(2,'Complete: "How much ___ do you need?" (sugar)','sugars','pieces of sugar','sugar','a sugar','C'),
    mc(3,'Complete: "___ does this dish cost?"','How many','How much','What much','How often','B'),
    mc(4,'How do you politely order food?','Give me steak.','I want steak.','I\'d like the steak, please.','Steak now!','C'),
    mc(5,'Present Perfect is formed with:','subject + did + pp','subject + have/has + pp','subject + am/is + pp','subject + will + pp','B'),
    mc(6,'Choose correct:','She has ran a marathon.','She have run a marathon.','She has run a marathon.','She has runned.','C'),
    mc(7,'"Should" expresses:','certainty','obligation','advice','ability','C'),
    mc(8,'Choose correct:','You should to exercise.','You should exercising.','You should exercise.','You should exercises.','C'),
    mc(9,'Complete: "She bought ___ apple." (one apple)','a','an','the','no article','B'),
    mc(10,'Complete: "___ Eiffel Tower is in Paris."','A','An','The','No article','C'),
    mc(11,'Which time expression signals Present Perfect?','yesterday','last week','in 2020','already','D'),
    mc(12,'Complete: "You ___ (negative advice) stay up too late."','shouldn\'t','can\'t','won\'t','won\'t','A'),
    mc(13,'Complete: "I eat ___ rice every day." (general)','a','an','the','no article','D'),
    mc(14,'Complete: "___ you ever ___ (be) to Japan?"','Have / been','Has / been','Did / been','Have / was','A'),
    mc(15,'Complete: "How ___ apples are in the bag?"','much','often','many','far','C'),
    tf(16,'"How many milk do you want?" is correct.','false'),
    tf(17,'"Should" does not change form for he/she/it.','true'),
    tf(18,'"She has went" is correct Present Perfect.','false'),
    fb(19,'I ___ (never/eat) caviar. Have you ___ (ever/try) it?','have never eaten, ever tried'),
    fb(20,'You ___ (should) drink more water. You ___ (not/should) eat too much sugar.','should, shouldn\'t'),
  ]},

  // ═══ MODULE 5: Work & Study ═══

  '007d103e-0e53-45da-a39a-aef580ffe574':{pass_threshold:70,questions:[  // Jobs & Workplace — Modal Verb Can
    mc(1,'Choose the correct sentence:','She can sings.','She can sing.','She cans sing.','She can to sing.','B'),
    mc(2,'A person who designs buildings is an:','engineer','architect','accountant','pilot','B'),
    mc(3,'Complete: "___ you use Excel?" — "Yes, I can."','Can','Do','Are','Should','A'),
    mc(4,'After "can" the verb is always:','infinitive with to','base form','gerund (-ing)','past tense','B'),
    mc(5,'Which job involves treating patients?','engineer','lawyer','doctor/nurse','accountant','C'),
    mc(6,'Complete: "She ___ (can, negative) speak German, but she ___ (can) speak French."','can / can\'t','can\'t / can','can / cannot','cans / can\'t','B'),
    mc(7,'Choose the correct sentence:','I can to programme computers.','I can programmes computers.','I can programme computers.','I cans programme computers.','C'),
    mc(8,'Short answer: "Can he drive?" — "No, ___."','No, he can\'t.','No, he don\'t.','No, he couldn\'t.','No, he isn\'t.','A'),
    mc(9,'Which job works in a courtroom?','chef','pilot','teacher','lawyer','D'),
    mc(10,'"Can" is used to express:','past action','obligation','ability or possibility','future plan only','C'),
    tf(11,'"Can" does not change form for he/she/it.','true'),
    tf(12,'"She can sings" is grammatically correct.','false'),
    tf(13,'An architect designs buildings.','true'),
    fb(14,'I ___ (can) speak three languages. She ___ (can, negative) drive yet.','can, can\'t'),
    fb(15,'___ (can) he code? Yes, he ___. ___ (can) she design? No, she ___.','Can, can, Can, can\'t'),
  ]},

  '46883220-6ab9-4fe8-ba54-1abeab832c5f':{pass_threshold:70,questions:[  // At the Office — Imperative
    mc(1,'How do we form a positive imperative?','You + verb','Base form of the verb (no subject)','Subject + verb-ing','Do + subject + verb','B'),
    mc(2,'Which is an imperative?','She opens the door.','Open the door.','She is opening the door.','Does she open the door?','B'),
    mc(3,'How do we form a negative imperative?','No + verb','Don\'t + base verb','Not + verb','Doesn\'t + verb','B'),
    mc(4,'Choose the correct imperative:','You send the email please.','Sends the email please.','Send the email, please.','Sending the email please.','C'),
    mc(5,'Choose the correct negative imperative:','Don\'t be late to meetings!','Not be late!','No being late!','Doesn\'t be late!','A'),
    mc(6,'Imperatives are used for:','describing past events','instructions, orders, or advice','talking about future plans','expressing habits','B'),
    mc(7,'Complete: "___ quiet in the office." (be)','Being','Are','Be','Is','C'),
    mc(8,'Complete: "___ (not/use) your phone during meetings."','Don\'t use','Not use','No use','Doesn\'t use','A'),
    mc(9,'Which is a polite office instruction?','Do it now!','Give that here!','Please review the report by Friday.','Stop talking!','C'),
    mc(10,'Which sentence gives an office instruction?','She printed the document.','Print two copies and send them.','She is printing.','She will print.','B'),
    tf(11,'The subject "you" is always stated in an imperative sentence.','false'),
    tf(12,'"Don\'t forget to attach the file!" is a correct negative imperative.','true'),
    tf(13,'Imperatives can be softened by adding "please".','true'),
    fb(14,'___ (send) the report by Monday. ___ (not/forget) to copy the manager.','Send, Don\'t forget'),
    fb(15,'___ (turn off) your phone. ___ (be) ready for the 9 am meeting.','Turn off, Be'),
  ]},

  'c0631147-2d5e-4ea0-af54-6737a66e881e':{pass_threshold:70,questions:[  // Skills & Abilities — Can vs Should
    mc(1,'"Can" expresses:','advice','obligation','ability','prediction','C'),
    mc(2,'"Should" expresses:','ability','certainty','advice or recommendation','past action','C'),
    mc(3,'Complete: "You ___ practise more — you\'ll improve." (advice)','can','will','should','must','C'),
    mc(4,'Complete: "She ___ play the violin — she\'s very talented." (ability)','should','can','must','will','B'),
    mc(5,'Choose the correct sentence:','You should can do it.','You can should do it.','You should do it.','You can should it.','C'),
    mc(6,'Complete: "___ you speak any other languages?" (ability)','Should','Must','Can','Will','C'),
    mc(7,'Complete: "He ___ eat less junk food." (advice)','can','will','should','is','C'),
    mc(8,'Choose the sentence that gives advice:','She can swim very fast.','You should get more exercise.','He can speak four languages.','They can code in Python.','B'),
    mc(9,'Complete: "She ___ (can, negative) come tonight — she has work."','shouldn\'t','can\'t','won\'t','mustn\'t','B'),
    mc(10,'Which is correct?','You should to study more.','You should study more.','You should studying more.','You should studies more.','B'),
    tf(11,'"Can" and "should" have the same meaning.','false'),
    tf(12,'"Should" does not add -s for he/she/it.','true'),
    tf(13,'"She can swim" talks about ability. "She should swim more" gives advice.','true'),
    fb(14,'I ___ (can) drive but I ___ (should) probably take the bus more often.','can, should'),
    fb(15,'___ (can) you code? Yes, I ___. ___ (should) I take a course? Yes, you ___.','Can, can, Should, should'),
  ]},

  '07cf3b13-e14e-4bab-8115-de56db27aa4e':{pass_threshold:70,questions:[  // School & Education — Plural Nouns
    mc(1,'What is the plural of "class"?','classs','classis','classes','class','C'),
    mc(2,'What is the plural of "university"?','universitys','universityies','universities','universityes','C'),
    mc(3,'What is the plural of "child"?','childs','children','childes','childrens','B'),
    mc(4,'What is the plural of "syllabus"?','syllabuss','syllabi or syllabuses','syllabusis','syllabes','B'),
    mc(5,'What is the plural of "thesis"?','thesises','thesiees','theses','theses','D'),
    mc(6,'What is the plural of "exam"?','exames','examses','exams','exam','C'),
    mc(7,'Which sentence is correct?','There are three childs in the class.','There are three children in the class.','There are three childrens in the class.','There are three child in the class.','B'),
    mc(8,'What is the plural of "library"?','librarys','libraries','libraryes','librareis','B'),
    mc(9,'What is the plural of "man"?','mans','mens','men','manes','C'),
    mc(10,'Which is correct?','She has two homeworks.','She has two pieces of homework.','She has two homework.','She has two homeseork.','B'),
    tf(11,'"Childrens" is the correct plural of "child".','false'),
    tf(12,'"Homeworks" is an incorrect form — "homework" is uncountable.','true'),
    tf(13,'Words ending in consonant + y form their plural by changing -y to -ies.','true'),
    fb(14,'One class → many ___. One university → many ___.','classes, universities'),
    fb(15,'One child → many ___. One woman → many ___.','children, women'),
  ]},

  '04e6614e-3cca-4fb5-b98a-2d1b129e3a9d':{pass_threshold:70,questions:[  // Evaluating Work — Superlative Adjectives
    mc(1,'What is the superlative form of "big"?','most big','bigger','the biggest','the most big','C'),
    mc(2,'What is the superlative form of "good"?','the goodest','the most good','the better','the best','D'),
    mc(3,'What is the superlative form of "bad"?','the baddest','the most bad','the worst','the worse','C'),
    mc(4,'Complete: "She is ___ (intelligent) student in the class."','the most intelligent','the intelligenter','most intelligent','intelligent most','A'),
    mc(5,'Complete: "This is ___ (difficult) exam I have ever taken."','the difficultest','the most difficult','most difficult','more difficult','B'),
    mc(6,'What is the superlative of "far"?','the farest','the most far','the farthest/furthest','the farther','C'),
    mc(7,'Choose the correct sentence:','She is the most tall student.','She is the tallest student.','She is tallest student.','She is the more tall student.','B'),
    mc(8,'What is the superlative of "happy"?','the happyest','the most happy','the happiest','the most happiest','C'),
    mc(9,'Complete: "It was ___ (interesting) lecture of the semester."','the interestingest','the most interesting','most interestingly','more interesting','B'),
    mc(10,'What is the superlative of "little" (amount)?','the least','the fewest','the littlest','the most little','A'),
    tf(11,'One-syllable adjectives form superlatives with -est.','true'),
    tf(12,'"The most biggest" is correct.','false'),
    tf(13,'The superlative of "good" is "the best".','true'),
    fb(14,'She is ___ (tall) girl in her class. This is ___ (hard) question.','the tallest, the hardest'),
    fb(15,'He is ___ (good) player on the team. It was ___ (bad) match of the season.','the best, the worst'),
  ]},

  'a3f40a83-2991-4e2b-a5bd-4b793b0915d7':{pass_threshold:80,questions:[  // Module 5 Review & Test
    mc(1,'Choose correct:','She can sings.','She cans sing.','She can to sing.','She can sing.','D'),
    mc(2,'Which job designs buildings?','engineer','lawyer','architect','accountant','C'),
    mc(3,'Which is an imperative?','She opens the door.','Open the door.','She is opening.','Does she open?','B'),
    mc(4,'Correct negative imperative:','Don\'t be late!','Not be late!','No being late!','Doesn\'t be late!','A'),
    mc(5,'"Should" expresses:','ability','certainty','advice','past action','C'),
    mc(6,'Correct:','You should to study.','You should studying.','You should study.','You should studies.','C'),
    mc(7,'Plural of "class":','classs','classis','classes','class','C'),
    mc(8,'Plural of "child":','childs','childes','childrens','children','D'),
    mc(9,'Superlative of "good":','the goodest','the most good','the better','the best','D'),
    mc(10,'Superlative of "big":','most big','bigger','the biggest','the most big','C'),
    mc(11,'"Can" is used for:','advice','obligation','ability','prediction','C'),
    mc(12,'Complete: "She ___ (can, negative) come tonight."','shouldn\'t','can\'t','won\'t','mustn\'t','B'),
    mc(13,'Correct:','She is the most tall student.','She is tallest student.','She is the tallest student.','She is the more tall student.','C'),
    mc(14,'Plural of "university":','universitys','universityies','universities','universityes','C'),
    mc(15,'Complete: "He ___ (should) get more sleep."','can','will','should','must','C'),
    tf(16,'"Can" does not change form for he/she/it.','true'),
    tf(17,'"Childrens" is the correct plural of "child".','false'),
    tf(18,'The superlative of "bad" is "the worst".','true'),
    fb(19,'I ___ (can) speak Spanish. You ___ (should) practise every day.','can, should'),
    fb(20,'She is ___ (good) student in class. He is ___ (bad) at punctuation.','the best, the worst'),
  ]},

  // ═══ MODULE 6: Looking Back ═══

  '65a99711-40e9-4791-999b-e6b2df026e90':{pass_threshold:70,questions:[  // Last Weekend — Past Simple Regular
    mc(1,'What ending do regular verbs take in Past Simple?','-ing','-ed','-s','-es','B'),
    mc(2,'What is the past of "visit"?','visitd','visitting','visited','visits','C'),
    mc(3,'What is the past of "study"?','studyed','studied','studys','studying','B'),
    mc(4,'What is the past of "stop"?','stoped','stopd','stopped','stops','C'),
    mc(5,'Choose the correct sentence:','She work last weekend.','She worked last weekend.','She works last weekend.','She working last weekend.','B'),
    mc(6,'What is the past of "carry"?','carryed','carryes','carried','carrying','C'),
    mc(7,'What is the past of "live"?','liveed','lived','living','lives','B'),
    mc(8,'Which time expression signals Past Simple?','every day','right now','last weekend','usually','C'),
    mc(9,'What is the past of "plan"?','planed','plans','planned','planing','C'),
    mc(10,'Choose the correct sentence:','I watch a film last Sunday.','I watched a film last Sunday.','I watching a film last Sunday.','I watches a film last Sunday.','B'),
    tf(11,'Regular verbs form Past Simple by adding -ed (or -d after -e).','true'),
    tf(12,'"She studyed hard" is correct.','false'),
    tf(13,'"Last night", "last week", "yesterday" are Past Simple time signals.','true'),
    fb(14,'She ___ (clean) the house. He ___ (cook) a special meal.','cleaned, cooked'),
    fb(15,'I ___ (visit) my friend last Friday. They ___ (watch) a film together.','visited, watched'),
  ]},

  'c93df12a-096d-4c79-84e2-b58560a1b363':{pass_threshold:70,questions:[  // What Happened? — Past Simple Irregular
    mc(1,'What is the past of "go"?','goed','gone','went','goes','C'),
    mc(2,'What is the past of "see"?','seed','seen','sawed','saw','D'),
    mc(3,'What is the past of "write"?','writed','wrote','written','writes','B'),
    mc(4,'What is the past of "think"?','thinked','thought','thinks','thinking','B'),
    mc(5,'What is the past of "buy"?','buyed','bought','buyd','buys','B'),
    mc(6,'What is the past of "find"?','finded','found','find','finds','B'),
    mc(7,'Choose the correct sentence:','She goed to the concert.','She went to the concert.','She gone to the concert.','She goes to the concert yesterday.','B'),
    mc(8,'What is the past of "tell"?','telled','told','tell','tells','B'),
    mc(9,'What is the past of "lose"?','losed','lost','lose','loses','B'),
    mc(10,'What is the past of "begin"?','beginned','began','begun','begins','B'),
    tf(11,'Irregular verbs do not add -ed in Past Simple.','true'),
    tf(12,'"She buyed a new laptop" is correct.','false'),
    tf(13,'"Went" is the Past Simple of "go".','true'),
    fb(14,'She ___ (go) to the market. He ___ (buy) a gift for his mother.','went, bought'),
    fb(15,'I ___ (think) it was a great idea. They ___ (find) a solution.','thought, found'),
  ]},

  '70f657db-acff-4c0e-ae4a-925ec5f3474c':{pass_threshold:70,questions:[  // Did You? — Past Simple Questions & Negative
    mc(1,'How do we form a Past Simple negative?','subject + not + past verb','subject + didn\'t + base verb','subject + doesn\'t + past verb','subject + wasn\'t + verb','B'),
    mc(2,'Choose the correct negative:','She didn\'t went.','She didn\'t go.','She not go.','She doesn\'t go yesterday.','B'),
    mc(3,'How do we form a Past Simple question?','Did + subject + past verb?','Did + subject + base verb?','Does + subject + base verb?','Was + subject + verb?','B'),
    mc(4,'Choose the correct question:','Did she went to school?','Did she goes to school?','Did she go to school?','Does she went to school?','C'),
    mc(5,'Short answer: "Did you eat breakfast?" — "No, ___."','No, I didn\'t.','No, I don\'t.','No, I wasn\'t.','No, I didn\'t ate.','A'),
    mc(6,'Choose the correct sentence:','He didn\'t cooked dinner.','He didn\'t cook dinner.','He not cooked dinner.','He doesn\'t cook dinner yesterday.','B'),
    mc(7,'Complete: "___ they watch the match?" — "Yes, they ___."','Did / did','Does / did','Were / were','Did / does','A'),
    mc(8,'Choose the correct negative:','I didn\'t saw him.','I not saw him.','I didn\'t see him.','I wasn\'t see him.','C'),
    mc(9,'After "didn\'t" the verb is in:','past form','base form','gerund','infinitive with to','B'),
    mc(10,'Choose the correct question:','Where did she went?','Where did she go?','Where she went?','Where does she went?','B'),
    tf(11,'"Didn\'t" is the negative auxiliary for all subjects in Past Simple.','true'),
    tf(12,'"Did he went home?" is a correct question.','false'),
    tf(13,'After "didn\'t" we always use the base form of the verb.','true'),
    fb(14,'I ___ (not/go) to the party. ___ (did) you see the news?','didn\'t go, Did'),
    fb(15,'___ she ___ (call) you? No, she ___.','Did, call, didn\'t'),
  ]},

  '599757d0-ca6b-4499-9461-49d724e351fc':{pass_threshold:70,questions:[  // Holidays & Celebrations — Past Time Expressions
    mc(1,'Which expression means "the day before today"?','last week','yesterday','ago','before','B'),
    mc(2,'Complete: "She graduated three years ___."','before','last','ago','since','C'),
    mc(3,'Which is correct?','I saw him in last year.','I saw him on last year.','I saw him last year.','I saw him at last year.','C'),
    mc(4,'Complete: "He left ___ Monday." (the Monday that just passed)','in','at','on','last','D'),
    mc(5,'Complete: "I was born ___ 2001."','on','at','in','last','C'),
    mc(6,'Which means "7 days before now"?','last night','last month','last week','yesterday','C'),
    mc(7,'Choose the correct sentence:','She visited us in last summer.','She visited us last summer.','She visited us at last summer.','She visited us on last summer.','B'),
    mc(8,'Complete: "I met her five years ___."','before','since','last','ago','D'),
    mc(9,'Which time expression goes with Past Simple?','tomorrow','next week','last night','usually','C'),
    mc(10,'Complete: "They got married ___ 14th June."','in','on','at','last','B'),
    tf(11,'"Yesterday" and "last week" are used with Past Simple.','true'),
    tf(12,'"I saw her in last Monday" is correct.','false'),
    tf(13,'"Five years ago" means five years before the present moment.','true'),
    fb(14,'I ___ (visit) my family two weeks ___ (ago).','visited, ago'),
    fb(15,'She left ___ (last) night. He called me ___ (yesterday) morning.','last, yesterday'),
  ]},

  'c23888e8-5a0d-41fd-9673-40d6a565f3a2':{pass_threshold:70,questions:[  // My Life Story — Past Simple in Context
    mc(1,'Which connector introduces the first event?','Then','After that','Finally','First','D'),
    mc(2,'Which connector introduces the last event?','First','Then','Finally','Next','C'),
    mc(3,'Choose the correct story connector: "I arrived at the café. ___ I ordered a coffee."','First...Next / Then','First...Last','First...After','First...Soon','A'),
    mc(4,'Which is correct storytelling?','First she woke. Then she is eating. Finally she left.','First she woke up. Then she ate. Finally she left.','First she wakes up. Then she eats. Finally she leaves.','First she woke up. Then she is eating. Finally she leaving.','B'),
    mc(5,'Complete: "After that, he ___ (take) a shower and got dressed."','takes','take','taking','took','D'),
    mc(6,'Which connector shows something happened after something else?','First','Then / After that','Finally','However','B'),
    mc(7,'Choose the correct sentence:','Yesterday I went to the market, buyed fruit, and cooked.','Yesterday I went to the market, bought fruit, and cooked.','Yesterday I go to the market, buy fruit, and cook.','Yesterday I goed to the market, buy fruit, cooked.','B'),
    mc(8,'Complete: "She ___ (wake) up at 6. Then she ___ (have) breakfast."','waked / had','woke / had','woke / have','wake / had','B'),
    mc(9,'Which word shows contrast in a story?','Then','Finally','However','After that','C'),
    mc(10,'Choose the correct sentence:','Last year I was go to Italy and I see the Colosseum.','Last year I went to Italy and saw the Colosseum.','Last year I go to Italy and seeing the Colosseum.','Last year I went to Italy and was seeing the Colosseum.','B'),
    tf(11,'"First", "then", "finally" help organise events in order.','true'),
    tf(12,'"After that" introduces the first event in a story.','false'),
    tf(13,'In storytelling, Past Simple is used for completed actions.','true'),
    fb(14,'___ she arrived. ___ she ordered food. ___ she left.','First, Then, Finally'),
    fb(15,'She ___ (arrive) at 8. ___ (then) she ___ (meet) her friend.','arrived, Then, met'),
  ]},

  '24b2a8a4-5fe1-4425-91e9-4448284fd737':{pass_threshold:80,questions:[  // Module 6 Review & Test
    mc(1,'Past of "visit"?','visitd','visitting','visited','visits','C'),
    mc(2,'Past of "go"?','goed','gone','went','goes','C'),
    mc(3,'Past of "buy"?','buyed','bought','buyd','buys','B'),
    mc(4,'Correct negative:','She didn\'t went.','She didn\'t goes.','She didn\'t go.','She not go yesterday.','C'),
    mc(5,'Correct question:','Did she goes?','Did she went?','Did she go?','Does she went?','C'),
    mc(6,'Short answer: "Did they win?" — "No, ___."','No, they don\'t.','No, they didn\'t.','No, they weren\'t.','No, they aren\'t.','B'),
    mc(7,'Which signals Past Simple?','tomorrow','right now','next week','last night','D'),
    mc(8,'Complete: "I met her five years ___."','before','since','last','ago','D'),
    mc(9,'Connector for last event?','First','Then','After that','Finally','D'),
    mc(10,'Past of "think"?','thinked','thought','thinks','thinking','B'),
    mc(11,'Correct sentence:','She studyed hard last year.','She studied hard last year.','She study hard last year.','She studies hard last year.','B'),
    mc(12,'After "didn\'t" the verb is in:','past form','base form','-ing form','infinitive with to','B'),
    mc(13,'Complete: "___ she call you? No, she ___."','Did / didn\'t','Does / doesn\'t','Was / wasn\'t','Did / don\'t','A'),
    mc(14,'Past of "write"?','writed','wrote','written','writes','B'),
    mc(15,'Which is correct?','I saw him in last week.','I saw him on last week.','I saw him last week.','I saw him at last week.','C'),
    tf(16,'"She didn\'t saw" is correct Past Simple negative.','false'),
    tf(17,'Irregular verbs add -ed in Past Simple.','false'),
    tf(18,'"Yesterday" and "last night" are Past Simple time signals.','true'),
    fb(19,'First she ___ (wake) up. Then she ___ (have) breakfast.','woke, had'),
    fb(20,'___ (did) you go to the party? No, I ___ (not).','Did, didn\'t'),
  ]},
}

async function main(){
  const MODULES=[
    {id:'547d96f9-f9ca-4524-bce3-ad20f1be4ead',n:4,title:'Food & Health'},
    {id:'5659472a-1dae-4509-8887-0325833b00b1',n:5,title:'Work & Study'},
    {id:'01ad3894-e9fc-4ac3-8b1a-cbb2e42712f5',n:6,title:'Looking Back'},
  ]
  let total=0
  for(const mod of MODULES){
    console.log(`\n🔍 A1 Elementary — Module ${mod.n}: "${mod.title}"`)
    const{data:lessons,error:le}=await supabase.from('english_lessons').select('id,title,order_index').eq('module_id',mod.id).order('order_index')
    if(le)throw le
    const{data:existing,error:qe}=await supabase.from('english_quizzes').select('lesson_id').in('lesson_id',lessons!.map(l=>l.id))
    if(qe)throw qe
    const ex=new Set((existing??[]).map(q=>q.lesson_id))
    const missing=lessons!.filter(l=>!ex.has(l.id))
    console.log(`📋 Total: ${lessons!.length} | ✅ Have: ${ex.size} | ❌ Missing: ${missing.length}`)
    for(const lesson of missing){
      const d=QUIZZES[lesson.id]
      if(!d){console.log(`⚠️  Skipped: ${lesson.title}`);continue}
      const{error}=await supabase.from('english_quizzes').insert({lesson_id:lesson.id,questions:d.questions,pass_threshold:d.pass_threshold})
      if(error){console.error(`❌ Failed: ${lesson.title}: ${error.message}`);continue}
      console.log(`✅ Вставлен квиз: ${lesson.title} — ${d.questions.length} вопросов`)
      total++
    }
  }
  console.log(`\n✅ Готово: ${total} квизов создано для модулей 4–6 A1 Elementary`)
}
main().catch(e=>{console.error(e);process.exit(1)})
