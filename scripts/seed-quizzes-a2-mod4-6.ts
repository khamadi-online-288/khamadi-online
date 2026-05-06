/**
 * Seed quizzes for A2 Pre-Intermediate — Modules 4, 5, 6.
 * Run: npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a2-mod4-6.ts
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

  // ═══ MODULE 4: Everyday Communication ═══

  'e9a76c24-69c9-43e6-9683-98606527d835':{pass_threshold:70,questions:[  // Modal Verbs Review
    mc(1,'Which modal expresses ability?','must','should','can','will','C'),
    mc(2,'Which modal expresses obligation?','can','might','must/have to','should','C'),
    mc(3,'Which modal expresses possibility?','must','can','could/might','should','C'),
    mc(4,'Complete a polite request: "___ you open the window, please?"','Must','Should','Could','Will','C'),
    mc(5,'Complete: "You ___ wear a seatbelt — it\'s the law."','should','might','can','must','D'),
    mc(6,'Complete: "She ___ be at home — the lights are on." (deduction)','should','must','can','will','B'),
    mc(7,'Complete: "You ___ park here — it\'s prohibited." (prohibition)','shouldn\'t','mustn\'t','can\'t park / mustn\'t','Both B and C','D'),
    mc(8,'Complete: "I ___ help you — I\'m free." (offer)','must','should','can','might','C'),
    mc(9,'What is the difference between "must" and "have to"?','No difference','Must = internal obligation; have to = external obligation','Have to = stronger','Must = polite request','B'),
    mc(10,'Complete: "She ___ speak three languages." (ability)','must','should','can','will','C'),
    tf(11,'"Could" is more polite than "can" for requests.','true'),
    tf(12,'"Must" and "have to" are always interchangeable.','false'),
    tf(13,'"Might" expresses a weaker possibility than "may".','true'),
    fb(14,'You ___ (must) wear a helmet. ___ (could) you help me, please?','must, Could'),
    fb(15,'She ___ (can) speak French. He ___ (might) come later — he\'s not sure.','can, might'),
  ]},

  'cc83edf4-44d0-4b05-9eaf-bc571869798e':{pass_threshold:70,questions:[  // Giving Advice — Should/Must/Have to
    mc(1,'"Should" is used for:','obligation by law','strong necessity','advice and recommendation','ability','C'),
    mc(2,'"Must" implies:','weak advice','strong obligation or necessity','possibility','permission','B'),
    mc(3,'"Have to" implies:','internal obligation','advice','external obligation (rules, necessity)','possibility','C'),
    mc(4,'Complete: "You ___ see a doctor — you look very ill."','might','could','should','can','C'),
    mc(5,'Complete: "All passengers ___ wear seatbelts." (rule)','should','might','could','must/have to','D'),
    mc(6,'Choose the negative: "You ___ take photos here — it\'s not allowed."','shouldn\'t','mustn\'t','can\'t/mustn\'t','Both B and C','D'),
    mc(7,'Complete: "Do I ___ bring anything?" (is it necessary?)','should','might','have to','can','C'),
    mc(8,'Choose the correct advice:','You should to eat less sugar.','You should eating less sugar.','You should eat less sugar.','You should eats less sugar.','C'),
    mc(9,'"Needn\'t" means:','you must not do it','it is necessary','it is not necessary','you should do it','C'),
    mc(10,'Complete: "She ___ apply now — the deadline is today!" (strong advice)','might','could','really should/must','can','C'),
    tf(11,'"Should" does not change form for he/she/it.','true'),
    tf(12,'"You should to exercise" is correct.','false'),
    tf(13,'"Mustn\'t" and "don\'t have to" have the same meaning.','false'),
    fb(14,'You ___ (should) drink more water. You ___ (mustn\'t) park here — it\'s illegal.','should, mustn\'t'),
    fb(15,'Do I ___ (have to) bring my passport? No, you ___ (needn\'t/don\'t have to).','have to, needn\'t / don\'t have to'),
  ]},

  '366252fc-01c2-4ed6-b20b-142700ddd473':{pass_threshold:70,questions:[  // May/Might/Could
    mc(1,'Which modal expresses present possibility?','must','should','may/might','can','C'),
    mc(2,'Complete: "She ___ be at the library — I\'m not sure."','must','should','might','will','C'),
    mc(3,'What is the difference between "may" and "might"?','May = past, might = present','May = more certain, might = less certain','Might = more certain, may = less certain','No difference','B'),
    mc(4,'Complete: "It ___ rain later — look at those clouds."','must','should','could/might','will','C'),
    mc(5,'Complete: "You ___ be right — I hadn\'t thought of that."','must','could/may','will','should','B'),
    mc(6,'Which expresses a strong deduction (certainty)?','might','may','must','could','C'),
    mc(7,'Complete: "She ___ have left already — I can\'t reach her."','might','should','could','Both A and C','D'),
    mc(8,'Which modal asks for permission formally?','Can','Will','May','Should','C'),
    mc(9,'Complete: "He ___ come tomorrow — he mentioned it but wasn\'t sure."','must','should','might/may','will definitely','C'),
    mc(10,'Complete: "There ___ be a mistake in the report — please check."','must','could','should','will','B'),
    tf(11,'"Might" implies less certainty than "may".','true'),
    tf(12,'"Must" is used for possibility when we are unsure.','false'),
    tf(13,'"Could" can express possibility in addition to ability.','true'),
    fb(14,'She ___ (might) be in a meeting — I\'m not certain. He ___ (must) be tired — he worked 12 hours.','might, must'),
    fb(15,'It ___ (could) rain later. Take an umbrella just in case. ___ (May) I ask you a question?','could, May'),
  ]},

  '1278364b-7525-449a-8e47-97b1e99e9cee':{pass_threshold:70,questions:[  // Discussion Language
    mc(1,'Which phrase expresses agreement?','I disagree with that.','I\'m not sure about that.','I totally agree.','That\'s not my view.','C'),
    mc(2,'Which phrase politely expresses disagreement?','You\'re wrong!','That\'s nonsense.','I see your point, but I disagree.','Absolutely not!','C'),
    mc(3,'Complete: "___ I ask why you think that?"','Should','Could','Must','Will','B'),
    mc(4,'Which phrase introduces your opinion?','According to me','In my view / I think','From my say','I believe of','B'),
    mc(5,'Which phrase asks for clarification?','I agree completely.','Could you elaborate on that?','I totally disagree.','You\'re mistaken.','B'),
    mc(6,'"That\'s a good point, but..." is used to:','strongly agree','partially agree before adding contrast','strongly disagree','ask a question','B'),
    mc(7,'Which phrase concedes a point?','You\'re absolutely wrong.','I disagree entirely.','You have a point there, however...','That makes no sense.','C'),
    mc(8,'Which phrase summarises your position?','In conclusion / To sum up','For example','Furthermore','However','A'),
    mc(9,'Complete: "I\'m not convinced ___ that argument."','from','by','to','at','B'),
    mc(10,'Which adds another argument?','However','Although','Furthermore / Moreover','Nevertheless','C'),
    tf(11,'"I totally agree" expresses agreement.','true'),
    tf(12,'"That\'s nonsense" is considered a polite way to disagree.','false'),
    tf(13,'"Furthermore" adds another supporting point.','true'),
    fb(14,'___ (In my view), this is the best solution. ___ (However), others may disagree.','In my view, However'),
    fb(15,'I see ___ (your) point, but I have a different ___ (opinion/view). ___ (Furthermore), the data supports my position.','your, opinion / view, Furthermore'),
  ]},

  '0735bff6-567c-4268-9c0d-2a9365d049e0':{pass_threshold:70,questions:[  // Phrasal Verbs I
    mc(1,'What does "give up" mean?','start something','continue','stop doing something/quit','give something away','C'),
    mc(2,'What does "look up" mean?','look downward','search for information','look at something high','ignore','B'),
    mc(3,'What does "run out of" mean?','run away','have no more of something','run towards','overflow','B'),
    mc(4,'What does "put off" mean?','put something on','cancel or postpone','rush to do something','finish quickly','B'),
    mc(5,'What does "break down" mean?','stop working (machine/vehicle)','destroy something','start working','break something small','A'),
    mc(6,'Complete: "She ___ (give) ___ (up) smoking last year."','gave / up','gives / up','given / up','giving / up','A'),
    mc(7,'What does "carry on" mean?','stop doing something','carry something','continue','start something new','C'),
    mc(8,'What does "figure out" mean?','make a shape','find a solution or understand','give up thinking','count numbers','B'),
    mc(9,'What does "take off" mean?','put on (clothes)','land (plane)','remove (clothes) / (plane) leave the ground','take something away','C'),
    mc(10,'What does "set up" mean?','destroy','establish or start','postpone','give away','B'),
    tf(11,'"Give up" means to quit or stop doing something.','true'),
    tf(12,'"Run out of" means to have too much of something.','false'),
    tf(13,'"Put off" means to postpone.','true'),
    fb(14,'My car ___ (break) ___ (down) on the way to work. I need to ___ (figure) ___ (out) the problem.','broke, down, figure, out'),
    fb(15,'She ___ (give) ___ (up) trying. He ___ (set) ___ (up) his own company.','gave, up, set, up'),
  ]},

  '87d9cab3-dff1-4515-97af-cb7f26c6ce8d':{pass_threshold:70,questions:[  // Linking Verbs
    mc(1,'Which is a linking verb?','run','eat','seem','write','C'),
    mc(2,'What follows a linking verb?','an object','an adverb','a subject complement (noun or adjective)','another verb','C'),
    mc(3,'Choose correct: "She ___ tired after the match."','looked','look','looks','looking','C'),
    mc(4,'Which sentence uses a linking verb correctly?','She appears a happy.','She appears happy.','She appears happily.','She appears happiness.','B'),
    mc(5,'Complete: "The soup ___ delicious." (taste)','tastes','taste','is taste','tasting','A'),
    mc(6,'Complete: "He ___ a famous doctor." (become, past)','become','becomes','became','is become','C'),
    mc(7,'Which can be BOTH an action verb and a linking verb?','run','look/feel/smell','write','jump','B'),
    mc(8,'Complete: "The situation ___ (get) worse."','gets','got','is getting','was gotten','C'),
    mc(9,'Choose correct: "She ___ (feel) confident before the interview."','felt','feels','feeling','feel','A'),
    mc(10,'Which sentence contains a linking verb?','She runs fast.','She seems friendly.','She writes well.','She left early.','B'),
    tf(11,'Linking verbs connect the subject to a noun or adjective that describes it.','true'),
    tf(12,'"She seems tiredly" is correct.','false'),
    tf(13,'"Become", "remain", "appear", "seem" are all linking verbs.','true'),
    fb(14,'He ___ (become, past) a lawyer. She ___ (seem, present) very confident.','became, seems'),
    fb(15,'The food ___ (smell, present) amazing. He ___ (look, past) exhausted after the marathon.','smells, looked'),
  ]},

  '4915b1dd-90ee-4e42-b647-44a84041c483':{pass_threshold:70,questions:[  // Substitution — I think so / I hope not
    mc(1,'Complete: "Is she coming?" — "I think ___."','it','so','yes','that','B'),
    mc(2,'Complete: "Will it rain?" — "I hope ___."','no','not','it not','so not','B'),
    mc(3,'"I think so" means:','I don\'t think it will happen','I think it is/will be true','I hope it will happen','I am sure it won\'t happen','B'),
    mc(4,'"I hope not" means:','I hope it happens','I hope it doesn\'t happen','I am sure it won\'t happen','I think it will happen','B'),
    mc(5,'Complete: "Did she pass?" — "I believe ___."','so','it','yes','that so','A'),
    mc(6,'Which is correct for a negative substitute?','I think not / I don\'t think so','I think no','I not think so','I think it not','A'),
    mc(7,'Complete: "Is he going to resign?" — "I\'m afraid ___."','no','so','it','yes','B'),
    mc(8,'What does "I\'m afraid so" mean?','I\'m scared','Unfortunately, it is true','I don\'t think so','I hope so','B'),
    mc(9,'Complete: "Are they going to cancel?" — "I hope ___."','so','no','not','it','C'),
    mc(10,'What does "I suppose so" mean?','I strongly agree','I am very sure','I think so, but not very confidently','I hope so','C'),
    tf(11,'"I think so" is used to avoid repeating a whole clause.','true'),
    tf(12,'"I hope not" means "I hope it will happen."','false'),
    tf(13,'"I\'m afraid so" means unfortunately it is true.','true'),
    fb(14,'"Will she recover?" — "I hope ___." "Is it true?" — "I believe ___.', 'so, so'),
    fb(15,'"Is it going to rain?" — "I\'m afraid ___." "Did he fail?" — "I hope ___.','so, not'),
  ]},

  'edf9029a-3541-4ae1-be34-5645b966de45':{pass_threshold:80,questions:[  // Module 4 Review
    mc(1,'Which modal expresses ability?','must','should','can','will','C'),
    mc(2,'Which modal expresses strong obligation?','can','might','must/have to','should','C'),
    mc(3,'"Should" is for:','obligation by law','strong necessity','advice','ability','C'),
    mc(4,'Complete: "You ___ wear a seatbelt." (rule/law)','should','might','could','must/have to','D'),
    mc(5,'Which expresses weaker possibility?','must','should','might','can','C'),
    mc(6,'Complete: "She ___ be in a meeting — not sure."','must','should','might','will','C'),
    mc(7,'Which phrase politely disagrees?','You\'re wrong!','I see your point, but I disagree.','Nonsense!','Absolutely not!','B'),
    mc(8,'"Furthermore" is used to:','contrast','conclude','add another point','give a reason','C'),
    mc(9,'What does "give up" mean?','start','continue','quit/stop','give away','C'),
    mc(10,'What does "put off" mean?','cancel or postpone','rush','put on','finish','A'),
    mc(11,'Which is a linking verb?','run','eat','seem','write','C'),
    mc(12,'Complete: "She ___ (seem, present) very confident."','seem','seemed','seems','seeming','C'),
    mc(13,'"I think so" means:','I don\'t think so','I think it is true','I hope so','I am sure not','B'),
    mc(14,'"I hope not" means:','I hope it happens','I hope it doesn\'t happen','I am sure','I think so','B'),
    mc(15,'"Mustn\'t" and "don\'t have to" are:','the same','different — mustn\'t = prohibition; don\'t have to = no necessity','both mean no obligation','both mean prohibition','B'),
    tf(16,'"Could" is more polite than "can" for requests.','true'),
    tf(17,'"Give up" means to have too much of something.','false'),
    tf(18,'"I\'m afraid so" means unfortunately it is true.','true'),
    fb(19,'You ___ (must) wear a helmet. She ___ (might) come — she\'s not sure.','must, might'),
    fb(20,'She ___ (give) ___ (up) her job. He ___ (set) ___ (up) his business.','gave, up, set, up'),
  ]},

  // ═══ MODULE 5: Academic Reading ═══

  '04490496-9dd3-4aa9-aa7c-1a86a515cc72':{pass_threshold:70,questions:[  // Reading Strategies
    mc(1,'What is "skimming"?','reading every word carefully','reading quickly for the general idea','reading for specific information','reading only the last paragraph','B'),
    mc(2,'What is "scanning"?','reading everything in detail','reading quickly to find specific information','reading the first paragraph only','reading aloud','B'),
    mc(3,'When would you use skimming?','to find a specific date or name','to check every word','to get a general overview of a text','to read for pleasure word by word','C'),
    mc(4,'When would you use scanning?','to understand the main idea','to find a specific fact quickly','to enjoy the text','to read a novel','B'),
    mc(5,'What is the "main idea" of a paragraph?','the last sentence','the most important point the paragraph makes','a specific detail','the conclusion','B'),
    mc(6,'What does "inference" mean in reading?','reading every word carefully','understanding something not directly stated','translating the text','summarising the text','B'),
    mc(7,'What is a "topic sentence"?','the concluding sentence','a sentence with a specific fact','the sentence that states the main idea of a paragraph','any sentence in the text','C'),
    mc(8,'What does "context" help you do?','ignore unknown words','guess the meaning of unknown words','translate every word','skip difficult sentences','B'),
    mc(9,'What is a "paraphrase"?','a direct quotation','a different way of expressing the same idea','a summary of a whole text','a translation','B'),
    mc(10,'Which strategy helps you decide if a text is useful before reading it fully?','scanning the whole text word by word','skimming the headings and first sentences','reading the conclusion only','ignoring the text','B'),
    tf(11,'Skimming is used to get a general overview of a text quickly.','true'),
    tf(12,'Scanning involves reading every word of the text.','false'),
    tf(13,'Context clues can help you understand the meaning of unknown words.','true'),
    fb(14,'___ (skimming/scanning) gives you the general idea. ___ (scanning/skimming) helps you find a specific fact.','Skimming, Scanning'),
    fb(15,'A topic ___ (sentence) states the main idea. You can use ___ (context) clues to guess unknown words.','sentence, context'),
  ]},

  'f898c167-aae0-4ae9-8895-5886ac2494a7':{pass_threshold:70,questions:[  // Topic Sentences
    mc(1,'A topic sentence usually appears:','at the end of a paragraph','in the middle','at the beginning of a paragraph','anywhere in the paragraph','C'),
    mc(2,'What does a topic sentence do?','gives a specific example','introduces the main idea of the paragraph','concludes the essay','lists all facts','B'),
    mc(3,'Which is a good topic sentence?','Dogs are animals.','Many people have dogs.','Owning a dog offers several important benefits.','Dogs bark.','C'),
    mc(4,'What is a "supporting sentence"?','the topic sentence','a sentence that gives detail or evidence for the topic sentence','the concluding sentence','any sentence in a paragraph','B'),
    mc(5,'A concluding sentence:','introduces a new idea','repeats the topic sentence word for word','summarises the paragraph or links to the next one','gives a specific statistic','C'),
    mc(6,'Which is the best topic sentence for a paragraph about exercise?','Exercise is something people do.','Many people exercise.','Regular exercise has significant benefits for both physical and mental health.','You can do exercise in a gym.','C'),
    mc(7,'Supporting sentences should:','introduce a completely new topic','directly support and develop the topic sentence','contradict the topic sentence','be as short as possible','B'),
    mc(8,'What is the function of a paragraph?','to present one unified idea','to present as many ideas as possible','to be as long as possible','to start with a quote','A'),
    mc(9,'A well-structured paragraph has:','only a topic sentence','only supporting sentences','a topic sentence, supporting sentences, and a conclusion','any sentences in any order','C'),
    mc(10,'What does "coherence" mean in writing?','using many long sentences','having ideas logically connected','using difficult vocabulary','writing very fast','B'),
    tf(11,'A topic sentence states the main idea of a paragraph.','true'),
    tf(12,'Supporting sentences should introduce completely different topics.','false'),
    tf(13,'A paragraph typically presents one main idea.','true'),
    fb(14,'A ___ (topic) sentence introduces the main idea. ___ (Supporting) sentences give details.','topic, Supporting'),
    fb(15,'A well-structured paragraph has a ___ (topic) sentence, ___ (supporting) sentences, and a conclusion.','topic, supporting'),
  ]},

  '624cda07-9ddc-4fb5-9ad1-4fd7511a5d7e':{pass_threshold:70,questions:[  // Word Formation
    mc(1,'What is the noun form of "decide"?','decidable','decidement','decision','decideness','C'),
    mc(2,'What is the adjective form of "success"?','successly','successing','successive','successful','D'),
    mc(3,'What is the adverb form of "careful"?','carefull','carefully','carefulness','carefuly','B'),
    mc(4,'What suffix makes a noun from an adjective (e.g. happy → happiness)?','-ful','-ly','-ness','-tion','C'),
    mc(5,'What is the verb form of "analysis"?','analyze/analyse','analysation','analysm','analysify','A'),
    mc(6,'What prefix makes a word negative (e.g. possible → impossible)?','un-','re-','im-/in-','Both A and C','D'),
    mc(7,'What is the noun form of "communicate"?','communicater','communicative','communication','communicatness','C'),
    mc(8,'What suffix creates an adjective meaning "full of" (e.g. hope → hopeful)?','-ness','-ful','-less','-tion','B'),
    mc(9,'What is the adjective from "create"?','createful','createness','creative','creation','C'),
    mc(10,'What prefix means "again" (e.g. write → rewrite)?','un-','re-','pre-','mis-','B'),
    tf(11,'The suffix "-tion" often creates nouns from verbs (e.g. decide → decision).','true'),
    tf(12,'"Unsuccessfully" is an incorrectly formed word.','false'),
    tf(13,'The prefix "un-" typically creates a negative meaning (e.g. unhappy).','true'),
    fb(14,'happy → ___ (adj, comparative) → ___ (noun)','happier, happiness'),
    fb(15,'create → ___ (noun) → ___ (adj) → ___ (adverb)','creation, creative, creatively'),
  ]},

  'a86c0c59-05f4-46b4-b10f-893404554658':{pass_threshold:70,questions:[  // Academic Vocabulary — Formal vs Informal
    mc(1,'Which is the formal version of "find out"?','discover','check','look up','figure out','A'),
    mc(2,'Which is formal for "start"?','kick off','begin/commence','get going','start up','B'),
    mc(3,'Which is more formal?','kids','teenagers','young people/adolescents','boys and girls','C'),
    mc(4,'Which is the formal version of "show"?','indicate / demonstrate','point to','display','Both A and C','D'),
    mc(5,'Which word is more formal?','get','obtain/acquire','grab','take','B'),
    mc(6,'Which is more formal: "because" or "due to"?','because','due to','they\'re the same','neither is formal','B'),
    mc(7,'Which phrase is informal?','as a consequence','therefore','so','subsequently','C'),
    mc(8,'Which is more formal?','I think','In my opinion / It is argued that','I believe','I feel','B'),
    mc(9,'Which sentence is more formal?','We got good results.','The results were satisfactory.','Results were pretty good.','We had okay results.','B'),
    mc(10,'In academic writing, contractions are generally:','encouraged','neutral','avoided','required','C'),
    tf(11,'Formal writing avoids contractions (e.g. "it\'s" → "it is").','true'),
    tf(12,'"Kids" is appropriate in formal academic writing.','false'),
    tf(13,'"Due to" is generally more formal than "because of".','true'),
    fb(14,'Informal: "find out" → Formal: "___ (discover)". Informal: "start" → Formal: "___ (commence)".','discover, commence'),
    fb(15,'Informal: "so" → Formal: "___ (therefore)". Informal: "kids" → Formal: "___ (children/adolescents)".','therefore, children / adolescents'),
  ]},

  '88ab7597-b113-43e9-beae-e9a35cc2c194':{pass_threshold:70,questions:[  // Reading for Detail — Inference
    mc(1,'What is "inference" in reading?','reading every word aloud','drawing conclusions from information not directly stated','summarising the text','translating the text','B'),
    mc(2,'If a text says "she looked at the door as soon as she heard his car", we can infer:','she was sleeping','she was expecting someone','she was going to leave','she was afraid','B'),
    mc(3,'What does "reading between the lines" mean?','reading very carefully','understanding the implied meaning','reading slowly word by word','reading the footnotes','B'),
    mc(4,'Which is a signal word for contrast in a text?','furthermore','therefore','however','consequently','C'),
    mc(5,'Which signal word indicates a result or consequence?','although','however','yet','therefore','D'),
    mc(6,'If an author uses mostly positive adjectives about a topic, we can infer they:','dislike the topic','are neutral','support or favour the topic','are uncertain','C'),
    mc(7,'What does it mean when a text uses hedging language ("may", "might", "it is possible")?','The author is certain','The author is unsure or is presenting one possibility','The author is lying','The text is fiction','B'),
    mc(8,'Which helps you make an inference?','ignoring context','looking up every word in a dictionary','combining text clues with your own knowledge','re-reading only the first line','C'),
    mc(9,'Signal word for addition:','however','although','furthermore/in addition','therefore','C'),
    mc(10,'If a text says "despite his qualifications, he wasn\'t hired", we can infer:','he was unqualified','he got the job','there was possibly another reason he wasn\'t hired','he applied for the wrong job','C'),
    tf(11,'Inference involves understanding what is implied but not directly stated.','true'),
    tf(12,'"However" signals addition of information.','false'),
    tf(13,'"Therefore" signals a result or conclusion.','true'),
    fb(14,'Signal for contrast: ___ (however/although). Signal for result: ___ (therefore/consequently).','however / although, therefore / consequently'),
    fb(15,'___ (Inference) means understanding what is ___ (implied) but not directly stated.','Inference, implied'),
  ]},

  'f4124b9a-8a09-4282-bdcb-c8f60867f742':{pass_threshold:80,questions:[  // Module 5 Review
    mc(1,'Skimming is used for:','finding specific facts','reading every word','getting a general overview','reading aloud','C'),
    mc(2,'Scanning is used for:','understanding the main idea','finding specific information quickly','enjoying the text','writing a summary','B'),
    mc(3,'A topic sentence:','gives examples','introduces the main idea of a paragraph','concludes the essay','lists all facts','B'),
    mc(4,'The best position for a topic sentence is:','end of paragraph','middle','beginning of paragraph','anywhere','C'),
    mc(5,'Noun form of "decide":','decidable','decidement','decision','decideness','C'),
    mc(6,'Adjective form of "create":','createful','createness','creative','creation','C'),
    mc(7,'Which is more formal?','find out','discover','look up','figure out','B'),
    mc(8,'In academic writing, contractions are:','encouraged','neutral','avoided','required','C'),
    mc(9,'"Inference" means:','reading every word','understanding what is implied','summarising','translating','B'),
    mc(10,'"However" signals:','addition','result','contrast','reason','C'),
    mc(11,'What suffix creates nouns from verbs (e.g. decide → ___)?','-ful','-ly','-ness','-tion','D'),
    mc(12,'Formal version of "start":','kick off','begin/commence','get going','start up','B'),
    mc(13,'A supporting sentence:','introduces a new topic','gives detail supporting the topic sentence','contradicts the topic','summarises everything','B'),
    mc(14,'Signal word for addition:','however','although','furthermore','therefore','C'),
    mc(15,'Signal word for result:','however','although','furthermore','therefore','D'),
    tf(16,'Scanning involves reading every word of the text.','false'),
    tf(17,'Formal writing avoids contractions.','true'),
    tf(18,'Inference means understanding what is directly stated.','false'),
    fb(19,'___ (skimming) = general idea. ___ (scanning) = specific fact.','Skimming, Scanning'),
    fb(20,'Informal: "find out" → Formal: "___". Informal: "kids" → Formal: "___".','discover, children / adolescents'),
  ]},

  // ═══ MODULE 6: Academic Writing ═══

  'd7a776ef-c759-47ca-a448-a1a65365baeb':{pass_threshold:70,questions:[  // Paragraph Structure
    mc(1,'A well-structured paragraph contains:','only a topic sentence','topic sentence, supporting sentences, concluding sentence','as many ideas as possible','just examples','B'),
    mc(2,'What is "unity" in a paragraph?','all sentences are long','all sentences relate to one main idea','using many different ideas','having many examples','B'),
    mc(3,'What is "coherence" in writing?','using difficult vocabulary','ideas logically connected with smooth transitions','writing very quickly','using many quotations','B'),
    mc(4,'Which transition shows addition?','However','Although','Furthermore / In addition','Therefore','C'),
    mc(5,'Which transition shows contrast?','In addition','Furthermore','However / On the other hand','Therefore','C'),
    mc(6,'Which transition shows result?','Moreover','However','Although','Therefore / As a result','D'),
    mc(7,'A concluding sentence:','introduces a new idea','restates the main idea or links to the next paragraph','gives a new example','starts with "First"','B'),
    mc(8,'Which is a good transition to start a second supporting point?','However','Although','Secondly / Furthermore','Therefore','C'),
    mc(9,'What does "topic sentence + supporting sentences + conclusion" form?','an essay','a paragraph','a chapter','a document','B'),
    mc(10,'What makes a paragraph too long?','having one topic sentence','having three supporting sentences','including several unrelated ideas','having a conclusion','C'),
    tf(11,'A paragraph should present one unified main idea.','true'),
    tf(12,'"However" is used to add more information.','false'),
    tf(13,'"Therefore" signals a result or conclusion.','true'),
    fb(14,'___ (furthermore) is used to add a point. ___ (However) is used to contrast.','Furthermore, However'),
    fb(15,'A ___ (topic) sentence → ___ (supporting) sentences → ___ (concluding) sentence.','topic, supporting, concluding'),
  ]},

  '8281d83e-c9af-421c-aca7-f71477c6d56b':{pass_threshold:70,questions:[  // Linking Ideas
    mc(1,'Which connector adds information?','However','Although','Furthermore / Moreover','Therefore','C'),
    mc(2,'Which connector shows contrast?','In addition','Furthermore','However / Nevertheless','Therefore','C'),
    mc(3,'Which connector shows result?','Moreover','However','Although','Therefore / Consequently','D'),
    mc(4,'Which connector shows concession (unexpected result)?','Furthermore','Therefore','Although / Even though','In addition','C'),
    mc(5,'Complete: "She studied hard. ___, she failed the exam."','Furthermore','Although','However','Therefore','C'),
    mc(6,'Complete: "___ she worked hard, she didn\'t get promoted."','Therefore','Moreover','Although','Furthermore','C'),
    mc(7,'Complete: "He exercises daily. ___, he eats well."','However','Although','Furthermore / Moreover','Therefore','C'),
    mc(8,'Which connector introduces an example?','However','Furthermore','For example / For instance','Therefore','C'),
    mc(9,'Complete: "She was late. ___, she missed the meeting."','Although','However','Therefore / As a result','Furthermore','C'),
    mc(10,'Which connector presents an alternative?','Furthermore','Alternatively / On the other hand','Therefore','Although','B'),
    tf(11,'"Furthermore" adds another supporting point.','true'),
    tf(12,'"Although" shows a result.','false'),
    tf(13,'"Therefore" introduces a conclusion or result.','true'),
    fb(14,'___ (Furthermore), the study showed positive results. ___ (However), there were some limitations.','Furthermore, However'),
    fb(15,'___ (Although) it was difficult, she succeeded. ___ (Therefore), she was promoted.','Although, Therefore'),
  ]},

  'a0603ff0-3c9b-4358-8bc0-7e891ce0086f':{pass_threshold:70,questions:[  // Describing Data — Charts & Graphs
    mc(1,'Which phrase describes a significant increase?','remained stable','rose sharply / increased dramatically','fell slightly','fluctuated','B'),
    mc(2,'Which phrase describes a small decrease?','dropped dramatically','surged','declined slightly / fell marginally','remained constant','C'),
    mc(3,'Complete: "Sales ___ by 20% in Q3."','fell','rose','increased','Both B and C','D'),
    mc(4,'Complete: "The figures ___ at around 500 for three months." (no change)','rose','fell','levelled off / remained stable','fluctuated','C'),
    mc(5,'Which describes fluctuation?','steady growth','constant decline','irregular ups and downs','remaining stable','C'),
    mc(6,'Complete: "There was a ___ (sharp) drop in profits last year."','small','gentle','slight','dramatic/sharp','D'),
    mc(7,'What does "peaked at" mean?','fell to the lowest point','reached the highest point','remained constant','started to decline','B'),
    mc(8,'Complete: "Exports ___ to a record high of 2 million units."','fell','soared / rose','dropped','levelled','B'),
    mc(9,'Which word describes the lowest point?','peak','plateau','trough','surge','C'),
    mc(10,'Complete: "The graph shows a ___ (gradual) increase over ten years."','sudden','gradual / steady','dramatic','sharp','B'),
    tf(11,'"Rose sharply" and "increased dramatically" describe a significant increase.','true'),
    tf(12,'"Levelled off" means the value increased rapidly.','false'),
    tf(13,'"Peaked" means reached the highest point.','true'),
    fb(14,'Sales ___ (rise) ___ (sharp) in Q1. They ___ (fall) ___ (gradual) in Q2.','rose, sharply, fell, gradually'),
    fb(15,'The graph ___ (show) a ___ (steady) increase. Profits ___ (peak) at $5M in 2023.','shows, steady, peaked'),
  ]},

  '73923202-d726-43f4-9479-f2edcf0761b7':{pass_threshold:70,questions:[  // Essay Writing — Introduction & Conclusion
    mc(1,'An essay introduction should:','present all arguments in detail','give background and state the thesis','give the conclusion first','list all examples','B'),
    mc(2,'A thesis statement:','is a general statement','states the main argument or purpose of the essay','gives an example','is the conclusion','B'),
    mc(3,'An essay conclusion should:','introduce new arguments','restate the thesis and summarise main points','start with "First"','give examples only','B'),
    mc(4,'Which phrase is used to introduce a conclusion?','Furthermore','In addition','In conclusion / To conclude','However','C'),
    mc(5,'Which phrase introduces the thesis?','In conclusion','This essay will argue that / The aim of this essay is to','Furthermore','In addition','B'),
    mc(6,'What should a conclusion NOT do?','summarise main points','restate the thesis','introduce a completely new idea','offer a final thought','C'),
    mc(7,'Complete: "___ this essay has demonstrated, climate change requires urgent action."','In addition','Furthermore','As','Therefore','C'),
    mc(8,'Which is a good hook for an introduction?','In conclusion, this is important.','Furthermore, the topic matters.','Have you ever wondered why so many species are disappearing?','First, there are many reasons.','C'),
    mc(9,'The body paragraphs of an essay:','introduce the topic','develop and support the thesis with evidence','summarise everything','provide the hook','B'),
    mc(10,'Complete: "___ in conclusion, the evidence clearly shows that...","as outlined above / in conclusion"','First','Furthermore','As outlined above / In conclusion','However','C'),
    tf(11,'A conclusion should introduce new arguments not discussed in the essay.','false'),
    tf(12,'A thesis statement clearly states the main argument of the essay.','true'),
    tf(13,'"In conclusion" is used to introduce the final paragraph.','true'),
    fb(14,'An introduction should provide ___ (background) and state the ___ (thesis).','background, thesis'),
    fb(15,'A conclusion should ___ (restate) the thesis and ___ (summarise) the main points.','restate, summarise'),
  ]},

  'ad828f4f-5386-4dae-89ad-923885e6519c':{pass_threshold:70,questions:[  // Academic Style
    mc(1,'Which is more appropriate in academic writing?','It\'s a big problem.','The issue is significant.','It\'s a really big deal.','The thing is huge.','B'),
    mc(2,'Academic writing avoids:','technical vocabulary','hedging language','contractions and very informal language','passive voice','C'),
    mc(3,'"However" is used in academic writing to show:','addition','result','contrast','example','C'),
    mc(4,'Complete: "The data ___ (suggest) that further research is required." (hedging)','proves','shows','suggests','demonstrates','C'),
    mc(5,'Which hedging phrase expresses uncertainty?','The results prove that...','It is clear that...','It appears that / It may be argued that...','The evidence confirms that...','C'),
    mc(6,'Passive voice in academic writing:','should always be avoided','is used to focus on the action rather than the doer','is always incorrect','is only used in introductions','B'),
    mc(7,'Which is more formal?','I found out that...','The findings indicate that...','I found out something interesting.','I thought that...','B'),
    mc(8,'Which is appropriate in academic writing?','lots of','a significant amount of','a ton of','heaps of','B'),
    mc(9,'Complete: "___ the evidence is not conclusive, it points in one direction."','Therefore','However','Although','In addition','C'),
    mc(10,'Which sentence is in an appropriate academic style?','Kids often don\'t eat well.','Adolescents frequently consume inadequate nutrition.','Young people eat badly a lot.','Kids eat badly these days.','B'),
    tf(11,'Academic writing uses formal vocabulary and avoids contractions.','true'),
    tf(12,'Personal anecdotes are the main form of evidence in academic writing.','false'),
    tf(13,'Hedging language (may, might, appears to) shows academic caution about claims.','true'),
    fb(14,'Informal: "kids" → Academic: "___". Informal: "lots of" → Academic: "___ (a significant number of)".','adolescents / children, a significant number of'),
    fb(15,'Use ___ (passive) voice to focus on the action. Use ___ (hedging) to avoid overstatement.','passive, hedging'),
  ]},

  '4e5ca7a6-29a8-404c-adbc-60876e848c95':{pass_threshold:80,questions:[  // Module 6 Review
    mc(1,'A well-structured paragraph contains:','only a topic sentence','topic sentence, supporting sentences, conclusion','as many ideas as possible','just examples','B'),
    mc(2,'"Furthermore" is used to:','contrast','show result','add information','give example','C'),
    mc(3,'"However" is used to:','add information','show result','contrast','give example','C'),
    mc(4,'Complete: "Sales ___ by 20% last quarter." (increase)','fell','rose / increased','levelled','fluctuated','B'),
    mc(5,'What does "peaked at" mean?','lowest point','constant value','highest point','started declining','C'),
    mc(6,'An essay introduction should:','present all arguments in detail','give background and state the thesis','give the conclusion first','list all examples','B'),
    mc(7,'"In conclusion" introduces:','the first paragraph','a new argument','the final paragraph','an example','C'),
    mc(8,'Academic writing avoids:','technical vocabulary','passive voice','contractions and informal language','hedging language','C'),
    mc(9,'Which is more academic?','It\'s a huge problem.','The issue is significant.','It\'s a really big deal.','The thing is huge.','B'),
    mc(10,'Hedging in academic writing shows:','certainty','caution about claims','informality','confusion','B'),
    mc(11,'Which connector shows concession?','Furthermore','Therefore','Although / Even though','In addition','C'),
    mc(12,'A thesis statement:','is a general statement','states the main argument of the essay','gives an example','is the conclusion','B'),
    mc(13,'Which describes a sharp increase?','fell slightly','remained stable','rose dramatically','fluctuated','C'),
    mc(14,'"Levelled off" means:','increased rapidly','decreased dramatically','remained stable','fluctuated','C'),
    mc(15,'Passive voice in academic writing is used to:','avoid grammar mistakes','focus on the action rather than the doer','make sentences shorter','avoid using verbs','B'),
    tf(16,'"However" adds more information.','false'),
    tf(17,'"In conclusion" introduces the final paragraph.','true'),
    tf(18,'Hedging language (may, might, appears) is appropriate in academic writing.','true'),
    fb(19,'___ (Furthermore) adds a point. ___ (Although) introduces contrast/concession.','Furthermore, Although'),
    fb(20,'Sales ___ (rise) sharply. They ___ (level) off at the end of the year.','rose, levelled'),
  ]},
}

async function main(){
  const MODULES=[
    {id:'a418b1f5-0e15-4a0f-9720-1843138b4e50',n:4,title:'Everyday Communication'},
    {id:'6c4094b3-6041-4feb-8588-8a56f4ede7a2',n:5,title:'Academic Reading'},
    {id:'529d4e7a-89fb-41bd-ac97-75ca2bd8a1c4',n:6,title:'Academic Writing'},
  ]
  let total=0
  for(const mod of MODULES){
    console.log(`\n🔍 A2 Pre-Intermediate — Module ${mod.n}: "${mod.title}"`)
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
  console.log(`\n✅ Готово: ${total} квизов создано для модулей 4–6 A2 Pre-Intermediate`)
}
main().catch(e=>{console.error(e);process.exit(1)})
