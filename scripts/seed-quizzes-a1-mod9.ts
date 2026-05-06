/**
 * Seed quizzes for A1 Beginner — Module 9 "The Final Mile".
 * Run: npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1-mod9.ts
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

  // Lesson 1 — Grammar Review I — To Be, Present Simple, Past Simple
  'bca5d5a9-cefa-4da7-b856-703288598509':{pass_threshold:70,questions:[
    mc(1,'Choose the correct form of "to be": "They ___ students."','am','is','are','be','C'),
    mc(2,'Choose the correct Present Simple: "She ___ to work by bus."','go','went','goes','going','C'),
    mc(3,'Choose the correct Past Simple: "He ___ a film last night."','watch','watches','watching','watched','D'),
    mc(4,'Complete: "I ___ not happy yesterday."','am','is','was','were','C'),
    mc(5,'Choose the correct negative (Present Simple): "She ___ like coffee."','don\'t','doesn\'t','isn\'t','wasn\'t','B'),
    mc(6,'Choose the correct Past Simple: "They ___ (go) to the beach."','go','goes','went','gone','C'),
    mc(7,'Choose the correct question (Present Simple): "___ she work here?"','Is','Are','Does','Did','C'),
    mc(8,'Choose the correct question (Past Simple): "___ you see the film?"','Do','Does','Are','Did','D'),
    mc(9,'Complete: "We ___ (to be, past) very tired after the journey."','are','is','was','were','D'),
    mc(10,'Choose the correct sentence:','She doesn\'t went yesterday.','She didn\'t went.','She didn\'t go.','She don\'t go yesterday.','C'),
    tf(11,'"She goes to school" is correct Present Simple.','true'),
    tf(12,'"Did he went?" is a correct Past Simple question.','false'),
    tf(13,'"I was" and "they were" are both correct past forms of "to be".','true'),
    fb(14,'She ___ (be, present) a teacher. He ___ (go, past) to the gym yesterday.','is, went'),
    fb(15,'___ (do/does) she work here? No, she ___ (not).','Does, doesn\'t'),
  ]},

  // Lesson 2 — Grammar Review II — Can, Going To, Will
  'ab1e6c76-0cbc-4b3d-ae92-56f2427244ef':{pass_threshold:70,questions:[
    mc(1,'Choose the correct sentence:','She can sings.','She can sing.','She cans sing.','She can to sing.','B'),
    mc(2,'Choose the correct "going to": "We ___ (visit) Rome next summer."','will visit','are going to visit','go to visit','visit','B'),
    mc(3,'Complete with "will": "I think it ___ (be) cold tomorrow."','is','was','will be','going to be','C'),
    mc(4,'Choose "going to" or "will": "Look — that ladder is falling! It ___ hit him!"','will','is going to','going to','hits','B'),
    mc(5,'Choose "going to" or "will": "The phone is ringing — I ___ answer it!"','am going to','going to','will','was going to','C'),
    mc(6,'Complete: "___ he drive?" — "No, he ___ (can, negative)."','Can / can\'t','Does / doesn\'t','Is / isn\'t','Will / won\'t','A'),
    mc(7,'What is the contraction of "will not"?','willn\'t','won\'t','will\'nt','wont','B'),
    mc(8,'Short answer: "Are you going to study?" — "Yes, ___."','Yes, I will.','Yes, I am.','Yes, I going.','Yes, I going to.','B'),
    mc(9,'Choose the correct sentence:','I can to swim.','I can swims.','I can swim.','I cans swim.','C'),
    mc(10,'Complete: "She has already bought the tickets — she ___ (fly) to London."','will fly','is going to fly','flies','flying','B'),
    tf(11,'"Can" does not change form for he/she/it.','true'),
    tf(12,'"Going to" and "will" are always interchangeable.','false'),
    tf(13,'"Won\'t" is the contraction of "will not".','true'),
    fb(14,'I ___ (can, negative) drive but I ___ (can) ride a bike.','can\'t, can'),
    fb(15,'She ___ (going to) travel to Paris — she bought tickets. I think she ___ (will) love it.','is going to, will'),
  ]},

  // Lesson 3 — Vocabulary Review — All Topics
  '4fce7dc5-2e20-4da1-a368-54cb56ba929b':{pass_threshold:70,questions:[
    mc(1,'Which word means a person who treats sick people?','teacher','pilot','doctor','engineer','C'),
    mc(2,'Which word is a hobby?','homework','sleeping','painting','studying','C'),
    mc(3,'What is the opposite of "hot"?','warm','cool','cold','nice','C'),
    mc(4,'Which word means "a place where you sleep when travelling"?','restaurant','hotel','school','office','B'),
    mc(5,'Which word is a day of the week?','January','Monday','spring','evening','B'),
    mc(6,'What does "How much?" ask about?','quantity of countable things','price or uncountable quantity','position','time','B'),
    mc(7,'Which word is a body part?','table','tooth','window','carpet','B'),
    mc(8,'Which is a room in a house?','sofa','fridge','bedroom','lamp','C'),
    mc(9,'What does "cloudy" describe?','food','weather','a person','a feeling','B'),
    mc(10,'Which word means to move your body rhythmically to music?','sing','dance','play','run','B'),
    tf(11,'"Kitchen" is a room in a house.','true'),
    tf(12,'"Pilot" is a person who works in a hospital.','false'),
    tf(13,'"Autumn" is the season between summer and winter.','true'),
    fb(14,'A person who cooks in a restaurant is a ___. A person who flies a plane is a ___.','chef, pilot'),
    fb(15,'The opposite of "old" is ___. The opposite of "hot" is ___.','young, cold'),
  ]},

  // Lesson 4 — Reading Practice — Mixed Texts
  'cdf4301d-0098-4d7c-8d79-f5372c04c5fc':{pass_threshold:70,questions:[
    mc(1,'Read: "Asel wakes up at 7 am every day. She has breakfast, then goes to university." — What does Asel do first?','goes to university','wakes up','has breakfast','studies','B'),
    mc(2,'Read: "Yesterday Tom went to the market. He bought vegetables and cooked soup." — What did Tom buy?','soup','vegetables','fruit','bread','B'),
    mc(3,'Read: "She is going to fly to London next month. She has already booked her ticket." — Is the trip planned or spontaneous?','spontaneous','unplanned','planned','uncertain','C'),
    mc(4,'Read: "There is a sofa in the living room. The TV is on the wall." — Where is the TV?','on the sofa','on the floor','on the wall','in the bedroom','C'),
    mc(5,'Read: "He can play the guitar but he can\'t sing." — What CAN\'T he do?','play guitar','sing','both','neither','B'),
    mc(6,'Read: "She always drinks coffee in the morning." — Which adverb of frequency is used?','sometimes','usually','always','never','C'),
    mc(7,'Read: "Turn left at the traffic lights, then go straight for 200 metres." — What is the first instruction?','go straight','turn right','turn left','stop','C'),
    mc(8,'Read: "I\'d like a table for two, please." — Where is this person?','at a hotel','in a shop','at a restaurant','at a school','C'),
    mc(9,'Read: "The team is training hard because they want to win the championship." — Why are they training?','they are bored','they want to win','the coach told them','it is required','B'),
    mc(10,'Read: "First she woke up. Then she had a shower. Finally, she left for work." — What was the last event?','woke up','had a shower','had breakfast','left for work','D'),
    tf(11,'In a text, "yesterday" signals Past Simple tense.','true'),
    tf(12,'"She always drinks coffee" means she drinks coffee sometimes.','false'),
    tf(13,'Story connectors like "first", "then", "finally" show the order of events.','true'),
    fb(14,'When you see "last week" or "yesterday" in a text, the verb is in ___ tense.','Past Simple'),
    fb(15,'Read: "He is going to study medicine — he already applied." The verb form is ___ because the plan was ___ in advance.','going to, made'),
  ]},

  // Lesson 5 — Listening Practice — Mixed Audio
  'd8b2a947-6b4d-4ad7-add5-5cd2bc5fad05':{pass_threshold:70,questions:[
    mc(1,'You hear: "Could I have a table for two, please?" — Where is this conversation happening?','at a hotel reception','in a shop','at a restaurant','at an airport','C'),
    mc(2,'You hear: "Turn right at the corner, then take the second left." — What is the first direction?','take the second left','turn left','turn right','go straight','C'),
    mc(3,'You hear: "I\'d like to check in — my name is Park." — What does this person want?','check out','book a room','check in','pay the bill','C'),
    mc(4,'You hear: "How much is that shirt?" — What is being asked?','the colour of the shirt','the size of the shirt','the price of the shirt','the material of the shirt','C'),
    mc(5,'You hear: "She can\'t come to the meeting — she\'s ill." — Why can\'t she come?','she is busy','she forgot','she is ill','she is travelling','C'),
    mc(6,'You hear: "It\'s going to rain — look at those clouds!" — What tense is used?','Past Simple','Present Simple','Future with going to','Future with will','C'),
    mc(7,'You hear: "I went to the market, bought some fruit, and came home." — How many actions are described?','one','two','three','four','C'),
    mc(8,'You hear: "Do you usually walk to school?" — What does "usually" tell us?','it happens right now','it is a habit','it happened in the past','it will happen','B'),
    mc(9,'You hear: "Would you like a dessert?" — Who is likely speaking?','a student','a waiter','a doctor','a teacher','B'),
    mc(10,'You hear: "She became a nurse after five years of study." — The verb "became" is in:','Present Simple','Present Continuous','Past Simple','Future Simple','C'),
    tf(11,'When you hear "yesterday" or "last week", the speaker is using Past Simple.','true'),
    tf(12,'"Would you like...?" is informal language used between close friends only.','false'),
    tf(13,'Listening for key words like "can\'t", "didn\'t", "won\'t" helps you understand negation.','true'),
    fb(14,'You hear "I\'m going to travel next week" — the speaker has a ___ plan for the ___.','fixed/definite, future'),
    fb(15,'You hear "Turn left, then go straight." — the speaker is giving ___.','directions'),
  ]},

  // Lesson 6 — Final Test & Certificate (25 questions, threshold 80)
  '59ab8a1f-1efb-40a5-9fb6-8cd1a0ee103d':{pass_threshold:80,questions:[
    // To Be
    mc(1,'Complete: "They ___ my best friends."','am','is','are','be','C'),
    // Present Simple
    mc(2,'Complete: "She ___ to work every day."','go','went','goes','going','C'),
    // Past Simple
    mc(3,'What is the past of "go"?','goed','gone','went','goes','C'),
    mc(4,'Choose the correct Past Simple negative:','She didn\'t went.','She didn\'t go.','She not go.','She doesn\'t go yesterday.','B'),
    // Present Continuous
    mc(5,'Choose the correct Present Continuous:','She reading.','She is read.','She is reading.','She are reading.','C'),
    // Simple vs Continuous
    mc(6,'Which signals Present Continuous?','always','usually','right now','every day','C'),
    // Can
    mc(7,'Choose the correct sentence:','She can sings.','She cans sing.','She can to sing.','She can sing.','D'),
    // Going To
    mc(8,'Complete: "We ___ (going to) fly to Rome next month." (planned trip)','will fly','are going to fly','fly','flying','B'),
    // Will
    mc(9,'Complete: "I think it ___ (be) sunny tomorrow."','is','was','will be','going to be','C'),
    // Articles
    mc(10,'Complete: "___ apple a day keeps the doctor away."','A','An','The','No article','B'),
    // Pronouns
    mc(11,'What is the object pronoun for "she"?','hers','herself','her','she','C'),
    mc(12,'What is the reflexive pronoun for "he"?','hisself','himself','him','his','B'),
    // Quantifiers
    mc(13,'Choose the correct sentence:','There are many water.','I have much friends.','She has some apples.','How many money?','C'),
    // Prepositions
    mc(14,'Complete: "I have class ___ Monday ___ 9 am."','in/at','on/at','at/in','on/in','B'),
    // Conjunctions
    mc(15,'Complete: "It was raining, ___ I stayed inside."','but','because','or','so','D'),
    // Imperatives
    mc(16,'Choose the correct negative imperative:','Don\'t run!','Not run!','No run!','Doesn\'t run!','A'),
    // Directions / Requests
    mc(17,'Complete a polite restaurant order:','Give me a pizza.','I want pizza now.','I\'d like a pizza, please.','Pizza!','C'),
    // Adverbs of Frequency
    mc(18,'Choose the correct sentence:','She goes always to the gym.','Always she goes to the gym.','She always goes to the gym.','She goes to always the gym.','C'),
    // Exclamations
    mc(19,'Complete: "___ a wonderful day!"','How','So','What','Very','C'),
    // Subject-Verb Agreement
    mc(20,'Complete: "Everyone ___ ready."','are','were','is','have','C'),
    // True / False
    tf(21,'"She didn\'t went" is correct Past Simple negative.','false'),
    tf(22,'"Won\'t" is the contraction of "will not".','true'),
    tf(23,'"Can" does not change form for he/she/it.','true'),
    // Fill blank
    fb(24,'She ___ (go, past) to the market. Then she ___ (cook, past) dinner.','went, cooked'),
    fb(25,'I ___ (can, negative) drive. She ___ (going to) study abroad — she already applied.','can\'t, is going to'),
  ]},
}

async function main(){
  const MODULE_ID='7a303275-b0d8-409c-bd21-df93cb414df6'
  console.log('🔍 Module 9 "The Final Mile"...\n')
  const{data:lessons,error:le}=await supabase.from('english_lessons').select('id,title,order_index').eq('module_id',MODULE_ID).order('order_index')
  if(le)throw le
  const{data:existing,error:qe}=await supabase.from('english_quizzes').select('lesson_id').in('lesson_id',lessons!.map(l=>l.id))
  if(qe)throw qe
  const ex=new Set((existing??[]).map(q=>q.lesson_id))
  const missing=lessons!.filter(l=>!ex.has(l.id))
  console.log(`📋 Total: ${lessons!.length} | ✅ Have quiz: ${ex.size} | ❌ Missing: ${missing.length}\n`)
  let created=0
  for(const lesson of missing){
    const d=QUIZZES[lesson.id]
    if(!d){console.log(`⚠️  Skipped [${lesson.order_index}] ${lesson.title}`);continue}
    const{error}=await supabase.from('english_quizzes').insert({lesson_id:lesson.id,questions:d.questions,pass_threshold:d.pass_threshold})
    if(error){console.error(`❌ Failed: ${lesson.title}: ${error.message}`);continue}
    console.log(`✅ Вставлен квиз: ${lesson.title} — ${d.questions.length} вопросов`)
    created++
  }
  console.log(`\n✅ Готово: ${created} квизов создано для модуля 9`)
}
main().catch(e=>{console.error(e);process.exit(1)})
