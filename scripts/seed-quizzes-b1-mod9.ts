/**
 * B1 Intermediate — Module 9 (Relative Clauses & Articles — 11 lessons).
 * Run: npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-b1-mod9.ts
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

  'b5eca84f-604b-4ed4-8f9c-925f37c5e82d':{pass_threshold:70,questions:[ // Defining Relative Clauses
    mc(1,'A defining relative clause:','adds extra non-essential info','is separated by commas','identifies which person/thing we mean','can always be omitted','C'),
    mc(2,'Use "who" for:','things','places','people','animals only','C'),
    mc(3,'Use "which" or "that" for:','people','places only','things or animals','adverbs','C'),
    mc(4,'Complete: "The researcher ___ conducted the study published her findings."','which','who','whom','where','B'),
    mc(5,'Complete: "The methodology ___ they used was innovative."','who','whom','which / that','whose','C'),
    mc(6,'Can "that" be used for people in defining clauses?','Never','Yes, informally','Only in writing','Only in subject position','B'),
    mc(7,'When can the relative pronoun be omitted?','always','when it is the subject','when it is the object of the clause','never','C'),
    mc(8,'Complete: "The study ___ I cited has been retracted." (pronoun can be omitted)','who','which/that (or omit)','whom','whose','B'),
    mc(9,'Complete: "The university ___ she graduated has an excellent reputation."','which','that','where / from which','whose','C'),
    mc(10,'Complete: "The scholar ___ work influenced this field enormously."','who','which','whose','that','C'),
    tf(11,'Defining relative clauses identify which specific person or thing is meant.','true'),
    tf(12,'"That" can be used in defining relative clauses for both people and things.','true'),
    tf(13,'The relative pronoun can be omitted when it functions as the object.','true'),
    fb(14,'The paper ___ (which/that) she submitted was accepted. The professor ___ (who) supervises me is an expert.','which/that, who'),
    fb(15,'This is the university ___ (where) I studied. The data ___ (which/that) we collected supports the hypothesis.','where, which/that'),
  ]},
  '4b7bd9ad-408c-4c8b-879f-3df3c667e0be':{pass_threshold:70,questions:[ // Non-defining Relative Clauses
    mc(1,'A non-defining relative clause:','identifies which noun is meant','gives essential information','adds extra (non-essential) information','is never separated by commas','C'),
    mc(2,'Non-defining clauses are separated by:','no punctuation','commas','brackets','dashes only','B'),
    mc(3,'Can "that" be used in non-defining clauses?','Yes, always','Yes, sometimes','No, never','Only in American English','C'),
    mc(4,'Choose the non-defining relative clause:','The student who passed first got a scholarship.','Dr Park, who published extensively, won the prize.','The paper that was cited most was hers.','The university that she attended is prestigious.','B'),
    mc(5,'Complete: "The professor, ___ I greatly admire, gave a brilliant lecture."','that','which','who(m)','whose','C'),
    mc(6,'Complete: "The research, ___ took three years, has now been published."','that','who','which','whose','C'),
    mc(7,'Can you omit the relative pronoun in a non-defining clause?','Always','Never — the pronoun is always required','Only with "who"','Only in writing','B'),
    mc(8,'Complete: "Her thesis, ___ supervisor praised highly, received full marks."','that the','which the','whose','the','C'),
    mc(9,'Complete: "The study, ___ findings were unexpected, has been widely cited."','that','which','whose','who','C'),
    mc(10,'Non-defining clauses give information that:','is essential to identify the noun','can be removed without changing the core meaning','makes the sentence shorter','contradicts the main clause','B'),
    tf(11,'Non-defining relative clauses are enclosed by commas.','true'),
    tf(12,'"That" can be used in non-defining relative clauses.','false'),
    tf(13,'A non-defining clause can be removed without changing the main meaning of the sentence.','true'),
    fb(14,'Professor Smith, ___ (who) is a leading expert, will present tomorrow. The study, ___ (which) was published last year, is widely cited.','who, which'),
    fb(15,'Her research, ___ (whose) methodology was groundbreaking, changed the field. The conference, ___ (which) I attended, was very informative.','whose, which'),
  ]},
  '35fb5e52-8a2a-4bfb-a79b-edb3ddca3e20':{pass_threshold:70,questions:[ // Reduced Relative Clauses
    mc(1,'A reduced relative clause:','adds commas to a sentence','removes the relative pronoun and "be" to create a shorter form','changes the main verb','uses only "which"','B'),
    mc(2,'Reduce: "The study which was conducted in 2020 showed..." → "The study ___ in 2020 showed..."','which','conducted','which conducting','that conducted','B'),
    mc(3,'Active participle (-ing) is used in reduced clauses when:','the relative clause has a passive meaning','the relative clause has an active meaning','the verb is stative','always','B'),
    mc(4,'Past participle is used when:','the clause has an active meaning','the verb is irregular','the relative clause has a passive meaning','never','C'),
    mc(5,'Reduce: "Participants who are studying for their PhD are eligible." → "Participants ___ for their PhD are eligible."','who are studying','studying','studied','having studied','B'),
    mc(6,'Reduce: "The data which were collected over three years were analysed." → "The data ___ over three years were analysed."','which were collected','collecting','collected','having been collected','C'),
    mc(7,'Reduce: "The researcher who is presenting first will cover the methodology." → "The researcher ___ first will cover..."','presenting','presented','who presenting','having presented','A'),
    mc(8,'Reduced relative clauses are more common in:','spoken everyday English','academic and formal written English','colloquial conversation','poetry only','B'),
    mc(9,'Reduce: "The university which was founded in 1848 is one of the oldest." → "The university ___ in 1848 is one of the oldest."','founding','which founding','found','founded','D'),
    mc(10,'Reduce: "Studies which show a correlation are more publishable." → "Studies ___ a correlation are more publishable."','which show','showing','shown','showed','B'),
    tf(11,'Reduced relative clauses are formed by removing the relative pronoun and "be".','true'),
    tf(12,'Active participles are used in reduced clauses with passive meaning.','false'),
    tf(13,'Reduced relative clauses are common in academic writing.','true'),
    fb(14,'"The paper (which was) ___ (submit) last year was accepted." Reduced form uses: ___ (past participle).','submitted, past participle'),
    fb(15,'"Researchers (who are) ___ (work) in this area face many challenges." Uses: ___ (-ing form).','working, -ing form'),
  ]},
  '0729b5b2-f17c-4904-8d96-71a05526202b':{pass_threshold:70,questions:[ // Articles I — A/An vs The
    mc(1,'Use "a/an" for:','a specific known noun','a noun mentioned for the second time','first mention of a singular countable noun','uncountable nouns','C'),
    mc(2,'Use "the" for:','first mention of any noun','all nouns','specific known nouns or unique things','uncountable nouns only','C'),
    mc(3,'Complete: "She published ___ article. ___ article was widely cited."','an / The','the / A','a / The','an / An','C'),
    mc(4,'Complete: "___ sun is ___ star."','A / a','The / a','The / the','A / the','B'),
    mc(5,'Complete: "He plays ___ piano."','a','an','the','no article','C'),
    mc(6,'Complete: "She is ___ expert in ___ field of linguistics."','an / the','a / the','an / a','the / the','A'),
    mc(7,'Complete: "___ data from ___ previous study contradicted this."','The / a','A / the','The / the','A / a','C'),
    mc(8,'Complete: "She is ___ honest researcher."','a','an','the','no article','B'),
    mc(9,'Complete: "___ Nile is ___ longest river in Africa."','A / the','The / the','The / a','A / a','B'),
    mc(10,'Complete: "He is ___ professor at ___ university."','a / the','the / a','a / a','the / the','C'),
    tf(11,'We use "a" before consonant sounds and "an" before vowel sounds.','true'),
    tf(12,'"The" is used with unique things (the sun, the moon).','true'),
    tf(13,'"She plays a piano" is correct when referring to musical instruments.','false'),
    fb(14,'She submitted ___ (a/the) paper. ___ (A/The) paper received excellent reviews.','a, The'),
    fb(15,'___ (The) Pacific Ocean is ___ (the) largest ocean. He is ___ (an) experienced researcher.','The, the, an'),
  ]},
  '8dc05609-f0d5-4cb1-a694-f7c9b768f28a':{pass_threshold:70,questions:[ // Articles II — Zero Article
    mc(1,'Zero article is used with:','unique objects','specific known nouns','uncountable nouns in general statements','singular countable nouns','C'),
    mc(2,'Complete: "___ research is essential to academic progress." (general)','A','An','The','No article','D'),
    mc(3,'Complete: "She studies ___ psychology at ___ university."','the / the','no article / a','a / the','the / a','B'),
    mc(4,'Complete: "He works at ___ night."','the','a','an','no article','D'),
    mc(5,'Complete: "___ poverty is a global challenge." (general concept)','The','A','No article','An','C'),
    mc(6,'Complete: "She is good at ___ public speaking."','the','a','no article','an','C'),
    mc(7,'Complete: "___ English is spoken worldwide." (the language in general)','The','A','No article','An','C'),
    mc(8,'Complete: "He had ___ breakfast before the conference."','a','an','the','no article','D'),
    mc(9,'Complete: "She is studying ___ law." (field/subject)','the','a','no article','an','C'),
    mc(10,'Complete: "They spoke ___ French fluently."','the','a','an','no article','D'),
    tf(11,'Zero article is used for languages, school subjects, and meals when speaking generally.','true'),
    tf(12,'"The English is spoken worldwide" is correct.','false'),
    tf(13,'"At night", "at home", "in hospital", "at university" use zero article in British English.','true'),
    fb(14,'___ (no article) Research requires ___ (no article) critical thinking. She studies ___ (no article) linguistics.','-, -, -'),
    fb(15,'"___ (no art.) Justice is blind." He works at ___ (no art.) night. She arrived at ___ (no art.) university.','-, -, -'),
  ]},
  'e9fb3b3d-000d-4747-916f-450a8e47384e':{pass_threshold:70,questions:[ // Articles in Context — Common Mistakes
    mc(1,'Which is correct?','She went to the hospital for treatment (as a patient).','She went to the hospital to visit someone (visiting, not as patient — British English: "the hospital").','In British English, "in hospital" (no article) = as a patient.','Both A and C have different uses.','D'),
    mc(2,'Complete: "He was taken to ___ hospital after the accident." (British English, as patient)','the','a','no article (British)','an','C'),
    mc(3,'Complete: "___ Mount Everest is the highest mountain." ','A','An','The','No article','D'),
    mc(4,'Names of mountain ranges: "___ Alps / ___ Himalayas." Which article?','No article','A','An','The','D'),
    mc(5,'Oceans, rivers, seas: "___ Pacific / ___ Thames." Which article?','No article','A','An','The','D'),
    mc(6,'Names of individual mountains (not ranges): "___ Mount Fuji." Which article?','The','A','No article','An','C'),
    mc(7,'Complete: "She specialises in ___ neuroscience." (field)','the','a','no article','an','C'),
    mc(8,'Complete: "___ breakfast was delicious." (specific, we both know which)','A','An','The','No article','C'),
    mc(9,'Complete: "He left ___ university last year." (British English — as a student)','a','an','the','no article','D'),
    mc(10,'Complete: "They visited ___ Louvre." (unique, specific museum)','a','an','the','no article','C'),
    tf(11,'In British English, "in hospital" (no article) means as a patient, "in the hospital" means in the building.','true'),
    tf(12,'"The Mount Everest" is correct.','false'),
    tf(13,'Oceans and rivers use "the" (the Pacific, the Nile).','true'),
    fb(14,'She was admitted to ___ (no art. British) hospital. They live near ___ (the) Thames.','-, the'),
    fb(15,'___ (The) Andes are in South America. He climbed ___ (no art.) Mount Kilimanjaro.','The, -'),
  ]},
  '038b9e4d-f857-4a9f-a888-f460be52643e':{pass_threshold:70,questions:[ // Determiners — All/Both/Neither/Either
    mc(1,'"Both" refers to:','one of two','two things/people together (positive)','none of two','more than two','B'),
    mc(2,'"Neither" refers to:','both','one or the other','not one and not the other (negative)','all','C'),
    mc(3,'"Either" refers to:','both together','one or the other of two options','neither','all of them','B'),
    mc(4,'Complete: "___ studies support the hypothesis." (both of them)','Neither','Either','Both','All','C'),
    mc(5,'Complete: "I don\'t like ___ approach — both seem flawed."','either','neither','both','all','A'),
    mc(6,'Complete: "___ of the researchers attended — they were both unavailable." (not one, not the other)','Both','Either','Neither','All','C'),
    mc(7,'Complete: "___ you could lead the project — I\'m flexible." (one or the other)','Neither','Both','Either','All','C'),
    mc(8,'"Both...and..." is used to:','present a choice','negate two things','include two things','exclude one of two','C'),
    mc(9,'"Neither...nor..." is used to:','negate two things','include two things','present a choice','affirm two things','A'),
    mc(10,'Complete: "___ the methodology ___ the sample size was problematic — both contributed to the limitation."','Neither / nor','Both / and','Either / or','All / and','A'),
    tf(11,'"Both" is always used with two items.','true'),
    tf(12,'"Either of them are correct" uses correct subject-verb agreement.','false'),
    tf(13,'"Neither...nor..." takes a singular verb when the subjects are singular.','true'),
    fb(14,'___ (Both) studies were rigorous. ___ (Neither) approach worked effectively.','Both, Neither'),
    fb(15,'___ (Either) researcher could lead the study. ___ (Neither) the methodology ___ (nor) the sample was sufficient.','Either, Neither, nor'),
  ]},
  '19ee8a50-1bdd-4f02-9652-03f6a984fed9':{pass_threshold:70,questions:[ // Quantifiers Mastery
    mc(1,'"All" refers to:','a part of','the whole of a group','two things','neither thing','B'),
    mc(2,'"Most" refers to:','all','none','the majority of','exactly half','C'),
    mc(3,'"None" refers to:','all','some','most','not any','D'),
    mc(4,'Complete: "___ the participants completed the survey." (100%)','Most','None','All','Few','C'),
    mc(5,'Complete: "___ of the data supports the hypothesis." (0%)','All','Most','Some','None','D'),
    mc(6,'Complete: "___ of the researchers specialise in this field." (the majority)','All','Most','None','Few','B'),
    mc(7,'"Every" takes:','a plural verb','a singular verb','no verb','a past verb','B'),
    mc(8,'Complete: "Every study ___ (require) ethical approval."','require','requires','required all','requiring','B'),
    mc(9,'"No" + noun: Complete: "___ evidence was found to support the claim."','Some','Any','No','None','C'),
    mc(10,'"None of + plural noun": which verb is preferred?','plural verb (increasingly acceptable)','singular verb (traditionally correct)','both are acceptable in modern English','only a past verb','C'),
    tf(11,'"All of the data was analysed" is correct (data as uncountable mass noun).','true'),
    tf(12,'"Every researchers attended" is correct.','false'),
    tf(13,'"None of the participants" can take either a singular or plural verb in modern English.','true'),
    fb(14,'___ (All) participants gave consent. ___ (Most) of the findings were significant. ___ (None) of the data was missing.','All, Most, None'),
    fb(15,'Every researcher ___ (be) responsible for ethical conduct. ___ (No) bias was detected.','is, No'),
  ]},
  '1c3520bf-313a-40f0-b035-68cf5442a94d':{pass_threshold:70,questions:[ // Participles — Present/Past
    mc(1,'What is a present participle?','the verb + -ed form','the verb + -ing form','the base form','the past form','B'),
    mc(2,'What is a past participle?','the verb + -ing form','the verb + -ed form (or irregular form)','the base form','the infinitive','B'),
    mc(3,'Present participle in a participial phrase shows:','a completed prior action','a simultaneous or ongoing action','a future action','a passive action','B'),
    mc(4,'Past participle in a participial phrase shows:','an active simultaneous action','a passive or completed prior action','a future action','a conditional action','B'),
    mc(5,'Reduce: "She considered all the options and decided to revise." → "___ all the options, she decided to revise."','Having considered','Considered','Considering','Being considered','A'),
    mc(6,'Reduce: "The report which was submitted late was rejected." → "The report ___ late was rejected."','submitting','having submitted','submitted','to be submitted','C'),
    mc(7,'Dangling participle: What is wrong with "Walking through the park, the trees were beautiful."?','The trees were not walking — the subject is missing.','Nothing is wrong.','The tense is wrong.','The participle is wrong.','A'),
    mc(8,'Complete: "___ his analysis, the researcher found a significant correlation." (after completing)','Completing','Having completed','Being completed','Completed','B'),
    mc(9,'Complete: "The data ___ for this study is freely available online." (which was collected)','collecting','having collected','collected','is collecting','C'),
    mc(10,'Present participle can also express:','the reason or cause of the main action','a future action only','a passive action only','a conditional action','A'),
    tf(11,'Present participles are used for simultaneous or ongoing actions.','true'),
    tf(12,'"Having submitted" indicates an action completed before the main verb.','true'),
    tf(13,'A dangling participle is grammatically acceptable.','false'),
    fb(14,'___ (Having completed) the analysis, she submitted the report. The data ___ (collected) was substantial.','Having completed, collected'),
    fb(15,'___ (Considering) the evidence, we revised our hypothesis. The theory ___ (proposed) by Einstein changed physics.','Considering, proposed'),
  ]},
  '722d414c-cd7b-4d42-adb5-7bb8c61bdb20':{pass_threshold:70,questions:[ // Adverbial Clauses Advanced
    mc(1,'An adverbial clause of concession uses:','because/since','although/even though/despite the fact that','when/while/after','if/unless','B'),
    mc(2,'An adverbial clause of purpose uses:','although','because','so that / in order that','when','C'),
    mc(3,'"Despite" is followed by:','a clause with subject and verb','a noun/gerund phrase','an adjective only','a future clause','B'),
    mc(4,'Complete: "___ the methodology was sound, the sample was too small." (concession)','Because','When','Although','Unless','C'),
    mc(5,'Complete: "Researchers use control groups ___ they can isolate variables." (purpose)','although','because','so that','since','C'),
    mc(6,'Complete: "___ conducting the analysis, she noticed an anomaly." (time/while)','While / When','Although','Because','If','A'),
    mc(7,'Complete: "The study was valuable ___ its limitations." (despite)','despite','although','because of','even though','A'),
    mc(8,'"Now that" introduces:','concession','reason (given that something has happened)','condition','time','B'),
    mc(9,'Complete: "___ the results are published, we can discuss them openly." (given that/since)','Although','Now that / Since','Even though','Unless','B'),
    mc(10,'Complete: "She submitted early ___ her supervisor could review it." (purpose)','although','so that','because','despite','B'),
    tf(11,'"Although" introduces a concession clause.','true'),
    tf(12,'"Despite" is followed by a full clause with subject and verb.','false'),
    tf(13,'"So that" introduces a clause of purpose.','true'),
    fb(14,'___ (Although) the findings were significant, the sample was small. She worked overtime ___ (so that) she could meet the deadline.','Although, so that'),
    fb(15,'___ (Despite) its limitations, the study is valuable. ___ (Now that) the data is collected, analysis can begin.','Despite, Now that'),
  ]},
  'f122e6a9-7df8-4268-9597-f7af0faf90a6':{pass_threshold:80,questions:[ // Module 9 Review
    mc(1,'Defining relative clause: "The researcher ___ published this is an expert."','which','who','whom','whose','B'),
    mc(2,'Non-defining: "Her paper, ___ was published last year, is highly cited."','that','who','which','whom','C'),
    mc(3,'Can "that" be used in non-defining clauses?','Yes','No','Only with things','Only in writing','B'),
    mc(4,'Reduced relative: "The data ___ (collect) last year was analysed."','collecting','collected','having collected','which collecting','B'),
    mc(5,'Article: "She published ___ article. ___ article was cited 50 times."','an / The','the / A','a / The','an / An','C'),
    mc(6,'Zero article: "___ research is essential to progress."','The','A','No article','An','C'),
    mc(7,'British English: "He was admitted to ___ hospital." (as a patient)','the','a','no article','an','C'),
    mc(8,'Oceans/rivers: "___ Pacific / ___ Thames." Article?','No article','A/An','The','An','C'),
    mc(9,'"Both" means:','neither','one or the other','two things together (positive)','all','C'),
    mc(10,'"Neither...nor...": "Neither the data ___ the methodology was reliable."','and','but','nor','or','C'),
    mc(11,'"Every" takes:','plural verb','singular verb','no verb','past verb only','B'),
    mc(12,'Present participle in reduced clause shows:','completed prior action','simultaneous/ongoing action','passive action','future action','B'),
    mc(13,'Past participle in reduced clause shows:','active action','future action','passive/completed prior action','conditional','C'),
    mc(14,'Concession clause: "___ the findings were significant, the sample was small."','Because','When','Although','Unless','C'),
    mc(15,'Purpose clause: "She submitted early ___ her supervisor could review it."','although','so that','because','despite','B'),
    tf(16,'Relative pronoun can be omitted when it is the object in a defining clause.','true'),
    tf(17,'"The Mount Everest" is correct.','false'),
    tf(18,'"None of the participants" can take either singular or plural verb in modern English.','true'),
    fb(19,'The study, ___ (whose) results were unexpected, changed the field. ___ (All) participants gave informed consent.','whose, All'),
    fb(20,'___ (Although) the sample was small, the findings were clear. ___ (Having completed) the analysis, she published.','Although, Having completed'),
  ]},
}

async function main(){
  const mod={id:'f8f6c4b7-5f99-47ad-bdb7-be3b604961c3',n:9,title:'Relative Clauses & Articles'}
  console.log(`\n🔍 B1 Intermediate — Module ${mod.n}: "${mod.title}"`)
  const{data:lessons,error:le}=await supabase.from('english_lessons').select('id,title,order_index').eq('module_id',mod.id).order('order_index')
  if(le)throw le
  const{data:existing,error:qe}=await supabase.from('english_quizzes').select('lesson_id').in('lesson_id',lessons!.map(l=>l.id))
  if(qe)throw qe
  const ex=new Set((existing??[]).map(q=>q.lesson_id))
  const missing=lessons!.filter(l=>!ex.has(l.id))
  console.log(`📋 Total: ${lessons!.length} | ✅ Have: ${ex.size} | ❌ Missing: ${missing.length}`)
  let total=0
  for(const lesson of missing){
    const d=QUIZZES[lesson.id]
    if(!d){console.log(`⚠️  Skipped: ${lesson.title}`);continue}
    const{error}=await supabase.from('english_quizzes').insert({lesson_id:lesson.id,questions:d.questions,pass_threshold:d.pass_threshold})
    if(error){console.error(`❌ Failed: ${lesson.title}: ${error.message}`);continue}
    console.log(`✅ Вставлен квиз: ${lesson.title} — ${d.questions.length} вопросов`)
    total++
  }
  console.log(`\n✅ Готово: ${total} квизов создано для модуля 9 B1 Intermediate`)
}
main().catch(e=>{console.error(e);process.exit(1)})
