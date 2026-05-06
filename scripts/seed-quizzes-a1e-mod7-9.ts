/**
 * Seed quizzes for A1 Elementary — Modules 7, 8, 9.
 * Run: npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1e-mod7-9.ts
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

  // ═══ MODULE 7: Entertainment & Culture ═══

  'a071be81-e8d4-4bef-be62-490ed8cc5c57':{pass_threshold:70,questions:[  // Movies & Music — Adverbs of Manner
    mc(1,'What does an adverb of manner describe?','a noun','a verb (how something is done)','an adjective','a preposition','B'),
    mc(2,'How do we usually form an adverb of manner?','adjective + -ed','adjective + -ly','adjective + -er','adjective + -ness','B'),
    mc(3,'What is the adverb form of "quick"?','quicker','quickness','quickly','quickish','C'),
    mc(4,'Where does an adverb of manner usually go in a sentence?','before the subject','before the adjective','after the verb or object','before the verb','C'),
    mc(5,'Choose the correct sentence:','She sings beautiful.','She sings beautifully.','She beautiful sings.','She sings beauty.','B'),
    mc(6,'What is the adverb form of "good"?','goodly','goodness','well','better','C'),
    mc(7,'Choose the correct sentence:','He plays the piano good.','He plays the piano goodly.','He plays the piano well.','He plays well the piano.','C'),
    mc(8,'What is the adverb form of "hard"?','hardly','harder','hardily','hard','D'),
    mc(9,'Choose the correct sentence:','She dances graceful.','She dances gracefully.','She gracefully dances good.','She is dances gracefully.','B'),
    mc(10,'What is the adverb form of "careful"?','carefull','carefuller','carefully','carefulness','C'),
    tf(11,'Adverbs of manner usually end in -ly.','true'),
    tf(12,'"She sings good" is grammatically correct.','false'),
    tf(13,'The adverb of "good" is "well", not "goodly".','true'),
    fb(14,'She ___ (quiet/ly) entered the room. He ___ (quick/ly) solved the problem.','quietly, quickly'),
    fb(15,'He plays the violin ___. (well/good) She speaks ___ (clear/clearly) in public.','well, clearly'),
  ]},

  '67efd6cb-850a-4cf0-9243-bcb742529856':{pass_threshold:70,questions:[  // Books & Art — Present Perfect
    mc(1,'How do we form Present Perfect?','subject + did + pp','subject + have/has + pp','subject + am/is + pp','subject + will + pp','B'),
    mc(2,'Choose correct:','She has went to the gallery.','She have gone to the gallery.','She has gone to the gallery.','She has go to the gallery.','C'),
    mc(3,'Complete: "Have you ___ (read) this novel?"','read','reads','reading','readed','A'),
    mc(4,'Which time expression signals Present Perfect?','yesterday','last week','in 2010','already','D'),
    mc(5,'Complete: "I ___ (just/finish) this painting."','just finish','have just finished','just finished','am just finishing','B'),
    mc(6,'Complete: "She ___ (never/see) this exhibition."','didn\'t see','saw never','has never seen','never seen','C'),
    mc(7,'Choose correct question:','Have you ever seen this film?','Did you ever seen it?','Have you ever saw it?','Has you ever seen it?','A'),
    mc(8,'Complete: "He ___ (already/buy) the tickets."','already bought','has already bought','already buyed','have already bought','B'),
    mc(9,'What is the past participle of "write"?','wrote','writed','written','writing','C'),
    mc(10,'Complete: "___ she ___ (be) to this art gallery before?"','Has / been','Have / been','Did / been','Has / was','A'),
    tf(11,'Present Perfect uses have/has + past participle.','true'),
    tf(12,'"She has went" is correct Present Perfect.','false'),
    tf(13,'"Ever" and "never" are common with Present Perfect.','true'),
    fb(14,'I ___ (never/read) that author. Have you ___ (ever/visit) the Louvre?','have never read, ever visited'),
    fb(15,'She ___ (just/finish) her painting. He ___ (already/write) three novels.','has just finished, has already written'),
  ]},

  '83fb6f56-6a2a-4029-beac-b95c1df1ce3f':{pass_threshold:70,questions:[  // Sports Events — Past vs Present Perfect
    mc(1,'Use Past Simple for:','actions with a connection to now','actions completed at a specific past time','recent actions','life experiences','B'),
    mc(2,'Use Present Perfect for:','actions at a specific past time','life experiences and recent events','completed past actions with time stated','past habits','B'),
    mc(3,'Choose the correct tense: "She ___ (win) the tournament last year."','has won','have won','won','wins','C'),
    mc(4,'Choose the correct tense: "He ___ (win) three medals so far."','won','has won','wins','had won','B'),
    mc(5,'Which sentence uses Present Perfect correctly?','I saw that film yesterday.','I have seen that film — it\'s great!','I have seen that film last Tuesday.','I have saw that film.','B'),
    mc(6,'Which sentence uses Past Simple correctly?','She has broken the world record in 2020.','She broke the world record in 2020.','She has broke the world record in 2020.','She break the world record in 2020.','B'),
    mc(7,'Complete: "They ___ (not/play) well last night."','haven\'t played','didn\'t play','don\'t play','weren\'t playing','B'),
    mc(8,'Complete: "He ___ (never/run) a marathon." (life experience)','never ran','has never run','never runs','had never run','B'),
    mc(9,'Choose the correct tense: "I ___ (see) him at the match yesterday."','have seen','has seen','saw','seen','C'),
    mc(10,'Complete: "___ you ever ___ (play) rugby?"','Have / played','Did / played','Have / play','Has / play','A'),
    tf(11,'We use Past Simple with "yesterday", "last year", "in 2020".','true'),
    tf(12,'"I have seen him yesterday" is correct.','false'),
    tf(13,'Present Perfect can describe life experiences without specifying when.','true'),
    fb(14,'She ___ (win, Past Simple) last year. She ___ (win, Present Perfect) three times so far.','won, has won'),
    fb(15,'I ___ (never/eat, PP) sushi. I ___ (eat, PS) sushi last Friday for the first time.','have never eaten, ate'),
  ]},

  '03f03fd4-86ec-4e8d-bb71-eb79886d1a3e':{pass_threshold:70,questions:[  // City Attractions — Superlative Adjectives
    mc(1,'Superlative of "big":','most big','bigger','the biggest','the most big','C'),
    mc(2,'Superlative of "beautiful":','the beautifullest','more beautiful','the most beautiful','beautifulest','C'),
    mc(3,'Superlative of "good":','the goodest','the most good','the better','the best','D'),
    mc(4,'Complete: "The Eiffel Tower is one of ___ (famous) landmarks in the world."','the most famous','the famouser','the famousest','most famous','A'),
    mc(5,'Complete: "It was ___ (bad) traffic jam I\'ve ever seen."','the baddest','the most bad','the worst','the worse','C'),
    mc(6,'Superlative of "far":','the farest','the most far','the farthest/furthest','the farther','C'),
    mc(7,'Choose correct:','This is the most tall building.','This is tallest building.','This is the tallest building.','This is the more tall building.','C'),
    mc(8,'Superlative of "modern":','the modernestt','the most modern','more modern','modernest','B'),
    mc(9,'Complete: "This museum has ___ (large) collection in the country."','the most large','the larger','the largest','most large','C'),
    mc(10,'Superlative of "interesting":','the interestingest','more interesting','the most interesting','most interestingly','C'),
    tf(11,'One-syllable adjectives form superlatives with -est.','true'),
    tf(12,'"The most biggest" is correct.','false'),
    tf(13,'The superlative of "good" is "the best".','true'),
    fb(14,'It is ___ (tall) building in the city. It is ___ (old) monument in the region.','the tallest, the oldest'),
    fb(15,'This is ___ (interesting) museum I\'ve visited. It has ___ (good) collection.','the most interesting, the best'),
  ]},

  '66a6adb2-dddd-4d7e-b38f-dfc3e9fed7dd':{pass_threshold:70,questions:[  // Weekend Plans — Future Simple
    mc(1,'Future Simple is formed with:','will + verb-ing','will + verb-ed','will + base verb','will + to + verb','C'),
    mc(2,'Choose correct:','She will goes.','She will going.','She will go.','She wills go.','C'),
    mc(3,'What is the contraction of "will not"?','willn\'t','won\'t','will\'nt','wont','B'),
    mc(4,'Complete: "I think it ___ (be) sunny this weekend."','is','was','will be','going to be','C'),
    mc(5,'Choose the correct negative:','She won\'t goes.','She will not goes.','She won\'t go.','She wills not go.','C'),
    mc(6,'Which signals a spontaneous decision with "will"?','I planned to study tonight.','Oh, the phone — I\'ll answer it!','She is going to go to the gym.','They decided to meet last week.','B'),
    mc(7,'Choose the correct question:','Will she comes?','Will she come?','Will she coming?','Wills she come?','B'),
    mc(8,'Short answer: "Will you help?" — "Yes, ___."','Yes, I will.','Yes, I won\'t.','Yes, I do.','Yes, I going.','A'),
    mc(9,'Complete: "Don\'t worry — I ___ (help) you with that."','am going to','going to','will','helped','C'),
    mc(10,'Complete: "I think robots ___ (change) the world."','are going to change','change','will change','changes','C'),
    tf(11,'"Will" does not change form for he/she/it.','true'),
    tf(12,'"She will goes home" is correct.','false'),
    tf(13,'"Won\'t" is the contraction of "will not".','true'),
    fb(14,'I think she ___ (win). He ___ (not/come) — he\'s busy.','will win, won\'t come'),
    fb(15,'___ you help me? Yes, I ___. I ___ (not/be) late, I promise.','Will, will, won\'t be'),
  ]},

  'a0f48d3d-3d34-4d89-ac0d-581da57e3f98':{pass_threshold:80,questions:[  // Module 7 Review & Test
    mc(1,'Adverb form of "quick":','quickish','quickness','quickly','quickerly','C'),
    mc(2,'Choose correct:','She sings beautiful.','She sings beautifully.','She beautiful sings.','She sings beauty.','B'),
    mc(3,'Adverb of "good":','goodly','goodness','well','better','C'),
    mc(4,'Present Perfect formed with:','subject + did + pp','subject + have/has + pp','subject + am/is + pp','subject + will + pp','B'),
    mc(5,'Choose correct:','She has went to the gallery.','She have gone.','She has gone to the gallery.','She has go.','C'),
    mc(6,'Which signals Present Perfect?','yesterday','last week','in 2010','already','D'),
    mc(7,'Use Past Simple for:','life experiences','recent events','actions at a specific past time','actions with connection to now','C'),
    mc(8,'Choose correct:','She has won in 2020.','She won in 2020.','She has won in the year 2020.','She have won in 2020.','B'),
    mc(9,'Superlative of "good":','the goodest','the most good','the better','the best','D'),
    mc(10,'Superlative of "big":','most big','bigger','the biggest','the most big','C'),
    mc(11,'Future Simple: "She ___ go."','wills','will goes','will','will going','C'),
    mc(12,'Contraction of "will not":','willn\'t','won\'t','will\'nt','wont','B'),
    mc(13,'Choose correct:','I have seen him yesterday.','I saw him yesterday.','I have saw him yesterday.','I seen him yesterday.','B'),
    mc(14,'Choose correct:','She has never seen this film — it\'s amazing!','She has never saw this.','She never has seen this.','She has never see this.','A'),
    mc(15,'Superlative of "interesting":','more interesting','the interestingest','the most interesting','interestingest','C'),
    tf(16,'"She sings good" is correct.','false'),
    tf(17,'"I have seen him yesterday" is correct.','false'),
    tf(18,'Future Simple is formed with "will + base verb".','true'),
    fb(19,'She plays the violin ___. (well/good) He speaks very ___ (clear/clearly).','well, clearly'),
    fb(20,'She ___ (win, PP) three times. She ___ (win, PS) last year.','has won, won'),
  ]},

  // ═══ MODULE 8: Planning & Travel ═══

  '57b308e8-92ef-4656-8e5b-994975431751':{pass_threshold:70,questions:[  // Holiday Plans — Be Going To
    mc(1,'"Be going to" is used for:','spontaneous decisions','predictions with no evidence','plans and intentions made before','general truths','C'),
    mc(2,'Choose correct:','She going to travel.','She is going to travel.','She go to travel.','She is going travel.','B'),
    mc(3,'Complete: "They ___ (visit) Istanbul next month." (planned)','will visit','are going to visit','go to visit','visit','B'),
    mc(4,'Choose the correct negative:','She isn\'t going to go.','She not going to go.','She going not to go.','She isn\'t go to go.','A'),
    mc(5,'Complete the question: "___ he ___ (study) abroad?"','Is / going to','Are / going to','Will / going to','Does / going to','A'),
    mc(6,'Which time expression signals future plans?','yesterday','last night','next summer','usually','C'),
    mc(7,'Choose correct:','I am going to bought a car.','I going to buy a car.','I am going to buy a car.','I am go to buy a car.','C'),
    mc(8,'Short answer: "Are you going to cook?" — "Yes, ___."','Yes, I will.','Yes, I am.','Yes, I going.','Yes, I going to.','B'),
    mc(9,'Complete: "Look at that ice — we ___ (slip)!"','will slip','is going to slip','are going to slip','slips','C'),
    mc(10,'Complete: "She has packed everything — she ___ (leave) tomorrow."','will leave','is going to leave','going to leave','leaves','B'),
    tf(11,'"Going to" is used for pre-planned intentions.','true'),
    tf(12,'"She is going to sings" is correct.','false'),
    tf(13,'"Are you going to travel?" is a correct question.','true'),
    fb(14,'I ___ (go) to Tokyo next year — I bought the ticket. She ___ (not/come) — she changed her mind.','am going to go, isn\'t going to come'),
    fb(15,'___ (be) they going to move? Yes, they ___.','Are, are'),
  ]},

  '9726e983-8b47-495c-9f7c-369118b3bcdd':{pass_threshold:70,questions:[  // At the Hotel — Polite Requests
    mc(1,'How do you ask for a hotel room politely?','I want a room.','Give me a room.','I\'d like to book a room, please.','Room, now!','C'),
    mc(2,'Complete: "___ I have a wake-up call at 7 am?"','Should','Must','Could','Will','C'),
    mc(3,'"Check in" means:','leave the hotel','arrive and register','pay the bill','book online','B'),
    mc(4,'"Check out" means:','arrive at the hotel','book a room','leave the hotel and pay','take a shower','C'),
    mc(5,'Which is a polite hotel request?','Bring me towels!','More towels!','Could you bring some extra towels, please?','Towels now!','C'),
    mc(6,'Complete: "Is breakfast ___?" (included in the price)','included','include','including','includes','A'),
    mc(7,'What do you say when you arrive at reception?','Goodbye.','I\'d like to check in — I have a reservation.','Check out, please.','Give me my key.','B'),
    mc(8,'Complete: "___ you like a room with a sea view?"','Should','Would','Must','Can\'t','B'),
    mc(9,'Complete: "Do you have any rooms ___?" (available)','available','vacancy','free','Both A and C','D'),
    mc(10,'Which phrase asks for a later checkout?','I want to leave later.','Could I have a late checkout, please?','More time!','Give me more hours.','B'),
    tf(11,'"I\'d like to book a double room" is a correct hotel request.','true'),
    tf(12,'"Check in" means leaving the hotel.','false'),
    tf(13,'"Could I have a later checkout, please?" is polite.','true'),
    fb(14,'I\'d like to ___ (book) a room. ___ (does) it include breakfast?','book, Does'),
    fb(15,'___ (do) you have single rooms? Yes, we ___ (have) some available.','Do, do'),
  ]},

  '6b293408-bcad-485c-a3e3-ec87596c258f':{pass_threshold:70,questions:[  // Weather & Seasons — Future Simple vs Going To
    mc(1,'Use "going to" for:','spontaneous decisions','predictions with evidence (e.g. dark clouds)','offers','general predictions','B'),
    mc(2,'Use "will" for:','plans made in advance','predictions with no specific evidence','intentions decided earlier','actions happening now','B'),
    mc(3,'Choose: "Look at those clouds — it ___ rain!"','will rains','rains','is going to rain','rained','C'),
    mc(4,'Choose: "I think it ___ be sunny tomorrow." (general prediction)','is going to','going to','will','rains','C'),
    mc(5,'Which season comes after summer?','spring','winter','autumn','summer','C'),
    mc(6,'Which word describes weather with strong wind?','foggy','sunny','windy','cloudy','C'),
    mc(7,'Complete: "The forecast says it ___ be 35°C tomorrow."','is going to','going to','will','rains','C'),
    mc(8,'In which season do flowers bloom?','autumn','winter','spring','summer','C'),
    mc(9,'Complete: "She has packed an umbrella — she thinks it ___ (rain)."','will rain','is going to rain','rains','rained','B'),
    mc(10,'Complete: "It\'s freezing — take a coat, it ___ (snow) tonight." (evidence: weather forecast)','will snow','is going to snow','snows','snowed','B'),
    tf(11,'"Is going to rain" is used when there is visible evidence.','true'),
    tf(12,'"Will" and "going to" are always interchangeable.','false'),
    tf(13,'"Spring" comes after winter.','true'),
    fb(14,'In ___ (winter) it is cold. In ___ (summer) it is hot.','winter, summer'),
    fb(15,'The forecast says it ___ (will) be cloudy. Look at those clouds — it ___ (going to) rain.','will, is going to'),
  ]},

  '589a8278-bf6b-4a18-9801-56bb5dec059e':{pass_threshold:70,questions:[  // Travel & Transport — Prepositions of Movement
    mc(1,'Complete: "She walked ___ the bridge." (from one side to the other)','along','across','into','through','B'),
    mc(2,'Complete: "He ran ___ the tunnel." (entering and going through)','across','along','through','up','C'),
    mc(3,'Complete: "She walked ___ the river." (beside it, following its path)','across','along','through','over','B'),
    mc(4,'Complete: "The plane flew ___ the clouds." (above and past)','along','across','through','over','D'),
    mc(5,'Complete: "She climbed ___ the mountain." (to the top)','across','along','through','up','D'),
    mc(6,'Complete: "He jumped ___ the wall." (from one side to the other, vertical)','along','across','through','over','D'),
    mc(7,'Complete: "They walked ___ the park." (from entrance to exit)','along','over','through','across','C'),
    mc(8,'Complete: "The train went ___ the tunnel." (entered and exited)','across','along','through','over','C'),
    mc(9,'Complete: "We walked ___ the beach." (beside it, following the edge)','across','along','through','over','B'),
    mc(10,'Complete: "She swam ___ the lake." (from one side to the other)','along','over','through','across','D'),
    tf(11,'"Through" suggests moving from one end to the other, inside something.','true'),
    tf(12,'"Across" and "along" have exactly the same meaning.','false'),
    tf(13,'"Over" suggests movement above something.','true'),
    fb(14,'She walked ___ (through/across) the tunnel. He swam ___ (across/along) the river.','through, across'),
    fb(15,'The road goes ___ (along/across) the valley. The bird flew ___ (over/along) the trees.','along, over'),
  ]},

  'f3cd21c7-6971-41bd-b450-859374908cdd':{pass_threshold:70,questions:[  // Business Travel — Formal Language
    mc(1,'Which greeting is appropriate in a formal business meeting?','Hey! What\'s up?','Good morning. Pleased to meet you.','Yo!','Hi dude!','B'),
    mc(2,'Which is a formal email opening?','Hey John,','Hi there,','Dear Mr Johnson,','Hello mate,','C'),
    mc(3,'Which is the correct formal email closing?','See ya!','Bye!','Best regards,','Later!','C'),
    mc(4,'Which is a polite formal request?','Do this by Friday.','I need this report.','Could you please send the report by Friday?','Report! Friday!','C'),
    mc(5,'Complete a formal apology: "I ___ for the inconvenience."','sorry','apologise','regret it','am sorry very much','B'),
    mc(6,'What does "CC" mean in an email?','Cancel & Close','Carbon Copy','Current Client','Company Contact','B'),
    mc(7,'Complete: "I am ___ to inform you that the meeting is rescheduled."','pleased','pleasing','please','pleasant','A'),
    mc(8,'Which declines a meeting formally?','I can\'t come.','Not possible for me.','Unfortunately, I am unable to attend.','No, I won\'t come.','C'),
    mc(9,'Complete: "Please ___ the attached file." (look at and review)','see','watch','find enclosed','review','D'),
    mc(10,'Complete a formal introduction: "Allow me to introduce ___ — my name is Dr Park."','me','myself','I','my','B'),
    tf(11,'"Dear Sir/Madam" is a formal email greeting.','true'),
    tf(12,'"Hey boss, need a day off lol" is appropriate formal office language.','false'),
    tf(13,'"Best regards" is a common formal email closing.','true'),
    fb(14,'___ (dear) Ms Kim, I am ___ (write) to confirm our meeting.','Dear, writing'),
    fb(15,'Could you ___ (please) send the agenda? I ___ (apologise) for the short notice.','please, apologise'),
  ]},

  'ce300a92-6e8b-4694-bc2c-6c815099b7d5':{pass_threshold:80,questions:[  // Module 8 Review & Test
    mc(1,'"Going to" is used for:','spontaneous decisions','predictions with no evidence','plans and intentions','general truths','C'),
    mc(2,'Choose correct:','She going to travel.','She is going to travel.','She go to travel.','She is going travel.','B'),
    mc(3,'"Check in" means:','leave the hotel','arrive and register','pay the bill','book online','B'),
    mc(4,'Correct polite hotel request:','Bring me towels!','More towels!','Could you bring some towels, please?','Towels now!','C'),
    mc(5,'Use "going to" for: "Look at the clouds — it ___ rain!"','will rains','rains','is going to rain','rained','C'),
    mc(6,'Use "will" for: "I think it ___ be sunny tomorrow."','is going to','going to','will','rains','C'),
    mc(7,'Correct: "She walked ___ the bridge." (from one side to the other)','along','across','into','through','B'),
    mc(8,'Correct: "He ran ___ the tunnel." (entering and going through)','across','along','through','up','C'),
    mc(9,'Formal email opening:','Hey John,','Hi there,','Dear Mr Park,','Hello mate,','C'),
    mc(10,'Formal email closing:','See ya!','Bye!','Best regards,','Later!','C'),
    mc(11,'Short answer: "Are you going to cook?" — "Yes, ___."','Yes, I will.','Yes, I am.','Yes, I going.','Yes, I going to.','B'),
    mc(12,'Formal apology: "I ___ for the inconvenience."','sorry','apologise','regret','am sorry','B'),
    mc(13,'Correct: "She swam ___ the lake." (from one side to the other)','along','over','through','across','D'),
    mc(14,'Complete: "___ you like a room with a sea view?" (hotel)','Should','Would','Must','Can\'t','B'),
    mc(15,'Which signals a future plan made before?','I will help you now!','I am going to visit Paris — I bought my ticket.','The phone — I\'ll answer it!','I think it will snow.','B'),
    tf(16,'"She is going to sings" is correct.','false'),
    tf(17,'"Check out" means leaving the hotel.','true'),
    tf(18,'"Through" and "across" have exactly the same meaning.','false'),
    fb(19,'I ___ (go, going to) to Rome next summer — I booked. I think it ___ (will) be hot.','am going to go, will'),
    fb(20,'___ (Dear) Ms Lee, I am ___ (write) to confirm our appointment.','Dear, writing'),
  ]},

  // ═══ MODULE 9: The Final Mile ═══

  '792f72d5-cb82-47ce-80de-4c5558799b2c':{pass_threshold:70,questions:[  // Grammar Review I — Tenses Overview
    mc(1,'Present Simple: "She ___ to work every day."','go','went','goes','going','C'),
    mc(2,'Present Continuous: "She ___ (work) from home right now."','works','worked','is working','work','C'),
    mc(3,'Past Simple: "He ___ (go) to the gym yesterday."','go','goes','going','went','D'),
    mc(4,'Present Perfect: "I ___ (never/try) sushi."','never try','never tried','have never tried','had never tried','C'),
    mc(5,'Choose correct (habit): "She ___ (read) every night."','is reading','reads','read','reading','B'),
    mc(6,'Choose correct (now): "Look! She ___ (dance)."','dances','is dancing','danced','will dance','B'),
    mc(7,'Choose correct (past): "They ___ (not/go) to the party."','don\'t go','aren\'t going','didn\'t go','haven\'t gone','C'),
    mc(8,'Choose correct (PP): "Have you ___ (be) to New York?"','was','been','be','being','B'),
    mc(9,'Which signals Past Simple?','now','usually','last week','already','C'),
    mc(10,'Which signals Present Perfect?','yesterday','last night','in 2010','recently','D'),
    tf(11,'"She goes to school" is correct Present Simple.','true'),
    tf(12,'"Did he went?" is a correct Past Simple question.','false'),
    tf(13,'Present Perfect uses have/has + past participle.','true'),
    fb(14,'I ___ (read, habit) every day. Right now I ___ (read, now) a novel.','read, am reading'),
    fb(15,'She ___ (go, PS) to Paris last year. She ___ (go, PP) there twice now.','went, has gone'),
  ]},

  '2e747c24-f469-45be-b558-78e78d618bb4':{pass_threshold:70,questions:[  // Grammar Review II — Modals & Comparatives
    mc(1,'Choose correct:','She can sings.','She can sing.','She cans sing.','She can to sing.','B'),
    mc(2,'"Should" expresses:','ability','certainty','advice','past action','C'),
    mc(3,'Comparative of "big":','more big','bigger','biger','most big','B'),
    mc(4,'Superlative of "good":','the goodest','the most good','the better','the best','D'),
    mc(5,'Complete: "You ___ drink more water." (advice)','can','will','should','must','C'),
    mc(6,'Complete: "She ___ (can, negative) come tonight."','shouldn\'t','can\'t','won\'t','mustn\'t','B'),
    mc(7,'Comparative of "interesting":','interestinger','more interestinger','more interesting','most interesting','C'),
    mc(8,'Superlative of "bad":','the baddest','the most bad','the worse','the worst','D'),
    mc(9,'Complete: "This city is ___ (expensive) ___ I expected."','more expensive / than','expensiver / than','more expensive / that','most expensive / than','A'),
    mc(10,'Complete: "She is ___ (talented) student in the class."','the most talented','the talenteder','the more talented','most talented','A'),
    tf(11,'"Can" does not change form for he/she/it.','true'),
    tf(12,'"You should to exercise" is correct.','false'),
    tf(13,'The superlative of "good" is "the best".','true'),
    fb(14,'I ___ (can) speak French. You ___ (should) practise every day.','can, should'),
    fb(15,'She is ___ (good) player on the team. This is ___ (bad) result ever.','the best, the worst'),
  ]},

  '327c563d-45c0-4bed-9b7f-d86dca697ff2':{pass_threshold:70,questions:[  // Vocabulary Review — All Topics
    mc(1,'Which word means a person who designs buildings?','engineer','lawyer','architect','accountant','C'),
    mc(2,'Which word means to travel from one side to the other?','along','through','across','over','C'),
    mc(3,'What does "check out" mean at a hotel?','arrive','book a room','leave and pay','take a shower','C'),
    mc(4,'Which season comes after summer?','spring','winter','autumn','summer','C'),
    mc(5,'What is the adverb of "good"?','goodly','goodness','well','better','C'),
    mc(6,'Which word is uncountable?','chair','sandwich','furniture','window','C'),
    mc(7,'What does "neither" refer to?','both of two','one of two','not one and not the other','some','C'),
    mc(8,'Which conjunction shows contrast: "She studied hard. ___, she failed."','Therefore','Although','However','Because','C'),
    mc(9,'What is the plural of "criterion"?','criterions','criterias','criteria','criteriones','C'),
    mc(10,'What does "rarely" mean?','100%','75%','50%','almost never','D'),
    tf(11,'"Furniture" is an uncountable noun.','true'),
    tf(12,'An "architect" works in a hospital.','false'),
    tf(13,'"Autumn" is the season between summer and winter.','true'),
    fb(14,'A person who cooks in a restaurant is a ___. A person who flies a plane is a ___.','chef, pilot'),
    fb(15,'The opposite of "hot" is ___. The adverb of "quick" is ___.','cold, quickly'),
  ]},

  '3f19ecb9-4279-4518-83b1-60fc3cc2e891':{pass_threshold:70,questions:[  // Reading Practice — Mixed Texts
    mc(1,'Read: "Asel wakes up at 7 every day. She goes to university by bus." — What tense is used?','Past Simple','Present Continuous','Present Simple','Present Perfect','C'),
    mc(2,'Read: "She has already booked her ticket to Tokyo." — What tense is used?','Past Simple','Present Simple','Future Simple','Present Perfect','D'),
    mc(3,'Read: "Yesterday Tom bought vegetables and cooked soup." — What did Tom do first?','cooked soup','bought vegetables','went to the market','ate dinner','B'),
    mc(4,'Read: "Although it was cold, she wore a t-shirt." — What conjunction is used?','However','Therefore','Although','Because','C'),
    mc(5,'Read: "The new museum is bigger and more modern than the old one." — What grammar is used?','superlatives','comparatives','Present Perfect','Future Simple','B'),
    mc(6,'Read: "He never drinks coffee — he prefers tea." — What does "never" mean here?','sometimes','0% of the time','rarely','not usually','B'),
    mc(7,'Read: "I\'d like to book a double room for two nights, please." — Where is this person?','restaurant','office','hotel','airport','C'),
    mc(8,'Read: "She can play the guitar but she can\'t sing." — What can she do?','sing','both','play guitar','neither','C'),
    mc(9,'Read: "She has been to Paris three times." — Which tense connects past experience to the present?','Past Simple','Present Simple','Present Perfect','Future Simple','C'),
    mc(10,'Read: "Turn left at the lights, then go straight for 200 metres." — What is the first instruction?','go straight','turn right','turn left','stop','C'),
    tf(11,'In a text, "last week" signals Past Simple.','true'),
    tf(12,'"She always drinks coffee" means she sometimes drinks coffee.','false'),
    tf(13,'Story connectors "first", "then", "finally" show the order of events.','true'),
    fb(14,'When you see "yesterday" or "last night" in a text, the verb is in ___ tense.','Past Simple'),
    fb(15,'Read: "She is going to move to London — she got a job offer." The form is ___ because the decision was ___ in advance.','going to, made'),
  ]},

  'ae1074ae-86e5-4f3c-bdd4-ababd3f688e9':{pass_threshold:70,questions:[  // Listening Practice — Mixed Audio
    mc(1,'You hear: "I\'d like to check in — my name is Kim." — What does this person want?','check out','book a room','check in','pay the bill','C'),
    mc(2,'You hear: "Could I have the bill, please?" — Where is this conversation?','hotel','shop','restaurant','bank','C'),
    mc(3,'You hear: "She has already booked her flight." — What tense is used?','Past Simple','Present Simple','Present Perfect','Future Simple','C'),
    mc(4,'You hear: "Turn right at the corner, then take the second left." — What is the first instruction?','take second left','turn left','turn right','go straight','C'),
    mc(5,'You hear: "He can\'t come — he\'s working late." — Why can\'t he come?','he\'s ill','he forgot','he\'s working late','he\'s travelling','C'),
    mc(6,'You hear: "It\'s going to rain — look at those clouds!" — What tense is used?','Past Simple','Present Simple','Future with going to','Future with will','C'),
    mc(7,'You hear: "She went, bought a gift, and came back." — How many actions?','one','two','three','four','C'),
    mc(8,'You hear: "Do you usually take the bus?" — What does "usually" indicate?','action happening now','a habit','a past action','a future plan','B'),
    mc(9,'You hear: "Would you like a dessert?" — Who is likely speaking?','a student','a waiter','a doctor','a teacher','B'),
    mc(10,'You hear: "She became the best student in her year." — "Became" is in:','Present Simple','Present Continuous','Past Simple','Future Simple','C'),
    tf(11,'When you hear "yesterday" or "last week", the speaker uses Past Simple.','true'),
    tf(12,'"Would you like...?" is only used between close friends.','false'),
    tf(13,'Listening for "can\'t", "didn\'t", "won\'t" helps understand negation.','true'),
    fb(14,'You hear "I\'m going to travel next week" — the speaker has a ___ plan for the ___.','fixed/definite, future'),
    fb(15,'You hear "Turn left, then go straight." — the speaker is giving ___.','directions'),
  ]},

  'c781ef1a-8630-446a-adb9-58d58ba2e320':{pass_threshold:80,questions:[  // Final Test & Certificate (25 questions)
    mc(1,'Present Simple: "She ___ to work every day."','go','went','goes','going','C'),
    mc(2,'Present Continuous: "She ___ right now." (work)','works','worked','is working','work','C'),
    mc(3,'Past Simple: "He ___ (go) to the gym yesterday."','go','goes','going','went','D'),
    mc(4,'Present Perfect: "Have you ___ (be) to London?"','was','been','be','being','B'),
    mc(5,'Complete: "She ___ (can, negative) drive yet."','shouldn\'t','can\'t','won\'t','mustn\'t','B'),
    mc(6,'"Should" expresses:','ability','certainty','advice','past action','C'),
    mc(7,'Complete: "This city is ___ (big) than mine."','most big','bigger','biger','the biggest','B'),
    mc(8,'Superlative of "good":','the goodest','the most good','the better','the best','D'),
    mc(9,'Present Perfect: "She ___ (already/finish) the project."','already finished','has already finished','already finishes','have already finished','B'),
    mc(10,'Past Simple negative: "He ___ (not/go) to the party."','doesn\'t go','isn\'t going','didn\'t go','haven\'t gone','C'),
    mc(11,'"Going to" is used for:','spontaneous decisions','predictions with no evidence','plans made before','general truths','C'),
    mc(12,'Future Simple: "I think it ___ (be) sunny tomorrow."','is','was','will be','going to be','C'),
    mc(13,'Adverb of "careful":','carefull','carefuller','carefully','carefulness','C'),
    mc(14,'Complete: "She walked ___ the bridge." (from one side to the other)','along','across','into','through','B'),
    mc(15,'Formal email opening:','Hey John,','Hi there,','Dear Ms Kim,','Hello mate,','C'),
    mc(16,'Conjunction of contrast in one clause: "She studied hard. ___, she failed."','Therefore','Although','However','Because','C'),
    mc(17,'Plural of "criterion":','criterions','criterias','criteria','criteriones','C'),
    mc(18,'Adverb of "good":','goodly','goodness','well','better','C'),
    mc(19,'Complete: "___ it was cold, she wore a t-shirt." (contrast in one clause)','Therefore','However','Although','Because','C'),
    mc(20,'Superlative of "interesting":','more interesting','the interestingest','the most interesting','interestingest','C'),
    tf(21,'"She has went" is correct Present Perfect.','false'),
    tf(22,'"Can" does not change form for he/she/it.','true'),
    tf(23,'"Won\'t" is the contraction of "will not".','true'),
    fb(24,'She ___ (go, PS) to Italy last year. She ___ (go, PP) there twice.','went, has gone'),
    fb(25,'You ___ (should) exercise. She ___ (be, superlative) student in the class.','should, is the best'),
  ]},
}

async function main(){
  const MODULES=[
    {id:'18cc1147-1981-4068-8205-5fd885bb5fe5',n:7,title:'Entertainment & Culture'},
    {id:'a9a6d2c9-8291-4ed2-a797-2a8d57e6754b',n:8,title:'Planning & Travel'},
    {id:'83df414e-21c6-4fc1-ae7e-5985d51310da',n:9,title:'The Final Mile'},
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
  console.log(`\n✅ Готово: ${total} квизов создано для модулей 7–9 A1 Elementary`)
}
main().catch(e=>{console.error(e);process.exit(1)})
