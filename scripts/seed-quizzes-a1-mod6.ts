/**
 * Seed quizzes for A1 Beginner — Module 6 "Looking Back".
 * Run: npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1-mod6.ts
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

  // Lesson 1 — Past Simple Regular
  '9d21847b-e41e-45be-9c0d-d07780d6b11e':{pass_threshold:70,questions:[
    mc(1,'What ending do regular verbs take in Past Simple?','-ing','-ed','-s','-es','B'),
    mc(2,'What is the past of "walk"?','walking','walks','walked','walkd','C'),
    mc(3,'What is the past of "study"?','studyed','studied','studys','studying','B'),
    mc(4,'What is the past of "stop"?','stoped','stopd','stopped','stops','C'),
    mc(5,'Choose the correct sentence:','She work yesterday.','She worked yesterday.','She works yesterday.','She working yesterday.','B'),
    mc(6,'What is the past of "play"?','plaied','plays','playing','played','D'),
    mc(7,'What is the past of "live"?','liveed','lived','living','lives','B'),
    mc(8,'Which time expression signals Past Simple?','every day','right now','yesterday','usually','C'),
    mc(9,'What is the past of "try"?','tryed','tryes','tried','trying','C'),
    mc(10,'Choose the correct sentence:','I watch a film last night.','I watched a film last night.','I watching a film last night.','I watches a film last night.','B'),
    tf(11,'Regular verbs form the past simple by adding -ed (or -d after -e).','true'),
    tf(12,'"She studyed hard" is the correct past form of "study".','false'),
    tf(13,'"Yesterday", "last week" and "ago" are common Past Simple time signals.','true'),
    fb(14,'She ___ (clean) the house. He ___ (cook) dinner.','cleaned, cooked'),
    fb(15,'I ___ (visit) my grandmother last Sunday. They ___ (watch) a film.','visited, watched'),
  ]},

  // Lesson 2 — Irregular Past
  '0184cf88-7b8b-420a-a497-e3ef8057ee28':{pass_threshold:70,questions:[
    mc(1,'What is the past of "go"?','goed','gone','went','goes','C'),
    mc(2,'What is the past of "have"?','haved','had','has','have','B'),
    mc(3,'What is the past of "see"?','seed','seen','sawed','saw','D'),
    mc(4,'What is the past of "take"?','taked','taken','took','takes','C'),
    mc(5,'What is the past of "give"?','gived','given','gave','gives','C'),
    mc(6,'What is the past of "come"?','comed','came','come','comes','B'),
    mc(7,'What is the past of "make"?','maked','made','makes','making','B'),
    mc(8,'What is the past of "know"?','knowed','known','knew','knows','C'),
    mc(9,'Choose the correct sentence:','She goed to the market.','She went to the market.','She gone to the market.','She goes to the market yesterday.','B'),
    mc(10,'What is the past of "get"?','getted','gotten','gets','got','D'),
    tf(11,'Irregular verbs do not add -ed in the past simple.','true'),
    tf(12,'"She maked a cake" is correct.','false'),
    tf(13,'"Went" is the past simple of "go".','true'),
    fb(14,'He ___ (go) to school. She ___ (have) breakfast early.','went, had'),
    fb(15,'They ___ (see) a great film. I ___ (make) a mistake.','saw, made'),
  ]},

  // Lesson 3 — Did You? — Past Simple Negative & Questions
  '407967d5-1bcd-42d6-a1a1-0a60608275fe':{pass_threshold:70,questions:[
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
    fb(14,'I ___ (not/go) to the party. ___ (did/do) you see the news?','didn\'t go, Did'),
    fb(15,'___ she ___ (call) you? No, she ___.','Did, call, didn\'t'),
  ]},

  // Lesson 4 — My Weekend — Past Time Expressions
  'cb791cbd-0e3e-4358-a0cd-12d901715a16':{pass_threshold:70,questions:[
    mc(1,'Which expression means "the day before today"?','last week','yesterday','ago','before','B'),
    mc(2,'Complete: "She called me two days ___."','before','last','ago','since','C'),
    mc(3,'Which is correct?','I saw him in last week.','I saw him on last week.','I saw him last week.','I saw him at last week.','C'),
    mc(4,'Complete: "He left ___ Monday." (the Monday that just passed)','in','at','on','last','D'),
    mc(5,'Complete: "I graduated ___ 2023."','on','at','in','last','C'),
    mc(6,'Which means "7 days before now"?','last night','last month','last week','yesterday','C'),
    mc(7,'Choose the correct sentence:','She visited us in last year.','She visited us last year.','She visited us at last year.','She visited us on last year.','B'),
    mc(8,'Complete: "I met him three years ___."','before','since','last','ago','D'),
    mc(9,'Which time expression goes with Past Simple?','tomorrow','next week','last night','usually','C'),
    mc(10,'Complete: "They got married ___ 14th June, 2020."','in','on','at','last','B'),
    tf(11,'"Yesterday" is used with Past Simple.','true'),
    tf(12,'"I saw her in last Monday" is correct.','false'),
    tf(13,'"Three years ago" means three years before the present moment.','true'),
    fb(14,'I ___ (visit) Paris two years ___. (ago)','visited, ago'),
    fb(15,'She left ___ (last) night. He called me ___ (yesterday) morning.','last, yesterday'),
  ]},

  // Lesson 5 — Storytelling — Past Simple in Context
  '4299e86b-f315-419b-8948-31cbf2295901':{pass_threshold:70,questions:[
    mc(1,'Which word introduces the first event in a story?','Then','After that','Finally','First','D'),
    mc(2,'Which word introduces the last event?','First','Then','Finally','Next','C'),
    mc(3,'Choose the correct story connector: "I woke up. ___ I had breakfast."','First...Next','First...Last','First...After','First...Soon','A'),
    mc(4,'Which is correct Past Simple storytelling?','First, she woke up. Then, she ate breakfast. Finally, she left.','First, she wakes up. Then, she eats. Finally, she leaves.','First, she is waking. Then, she eating. Finally, she leaving.','First, she woke. Then, she is eating. Finally, she left.','A'),
    mc(5,'Complete: "After that, he ___ (take) a shower."','takes','take','taking','took','D'),
    mc(6,'Which connector shows something happened after something else?','First','Then / After that','Finally','However','B'),
    mc(7,'Choose the correct sentence:','Yesterday, I went to the market, buyed vegetables, and cooked soup.','Yesterday, I went to the market, bought vegetables, and cooked soup.','Yesterday, I go to the market, buy vegetables, and cook soup.','Yesterday, I goed to the market, buyed vegetables, and cook soup.','B'),
    mc(8,'Complete the story: "She ___ (wake) up at 7. First, she ___ (brush) her teeth."','waked / brushed','woke / brushed','woke / brush','wake / brushed','B'),
    mc(9,'Which word shows contrast in a story?','Then','Finally','However','After that','C'),
    mc(10,'Choose the correct sentence:','Last night I was go to a party and I danced all night.','Last night I went to a party and danced all night.','Last night I go to a party and dancing all night.','Last night I went to a party and was dancing all night.','B'),
    tf(11,'Story connectors like "first", "then", and "finally" help organise events in order.','true'),
    tf(12,'"After that" introduces the first event in a story.','false'),
    tf(13,'In storytelling, we mainly use Past Simple for completed actions.','true'),
    fb(14,'___ he woke up. ___ he had a shower. ___ he left for work.','First, Then, Finally'),
    fb(15,'She ___ (arrive) at the café. ___ (then) she ___ (order) a coffee.','arrived, Then, ordered'),
  ]},

  // Lesson 6 — Module Review & Test
  'b30012ff-64fb-49c8-8b18-688fdd9b8e9e':{pass_threshold:80,questions:[
    mc(1,'What is the past of "play"?','plaied','plays','playing','played','D'),
    mc(2,'What is the past of "go"?','goed','gone','went','goes','C'),
    mc(3,'What is the past of "have"?','haved','had','has','haves','B'),
    mc(4,'Choose the correct negative:','She didn\'t went.','She didn\'t goes.','She didn\'t go.','She not go yesterday.','C'),
    mc(5,'Choose the correct question:','Did she goes to school?','Did she went?','Did she go to school?','Does she went yesterday?','C'),
    mc(6,'Short answer: "Did they win?" — "No, ___."','No, they don\'t.','No, they didn\'t.','No, they weren\'t.','No, they aren\'t.','B'),
    mc(7,'Which time expression signals Past Simple?','tomorrow','right now','next week','last night','D'),
    mc(8,'Complete: "I met her three years ___."','before','since','last','ago','D'),
    mc(9,'Which connector introduces the last event in a story?','First','Then','After that','Finally','D'),
    mc(10,'What is the past of "take"?','taked','taken','took','takes','C'),
    mc(11,'Choose the correct sentence:','She studyed hard last year.','She studied hard last year.','She study hard last year.','She studies hard last year.','B'),
    mc(12,'After "didn\'t" the verb is in:','past form','base form','-ing form','infinitive with to','B'),
    mc(13,'Complete: "___ she call you? No, she ___."','Did / didn\'t','Does / doesn\'t','Was / wasn\'t','Did / don\'t','A'),
    mc(14,'What is the past of "see"?','seed','seen','sawed','saw','D'),
    mc(15,'Choose the correct sentence:','I saw him in last week.','I saw him on last week.','I saw him last week.','I saw him at last week.','C'),
    tf(16,'"She didn\'t saw" is the correct Past Simple negative.','false'),
    tf(17,'Irregular verbs add -ed in Past Simple.','false'),
    tf(18,'"Yesterday", "last night" and "ago" are Past Simple time signals.','true'),
    fb(19,'First she ___ (wake) up. Then she ___ (have) breakfast.','woke, had'),
    fb(20,'___ (did/do) you go to the party? No, I ___ (not).','Did, didn\'t'),
  ]},
}

async function main(){
  const MODULE_ID='e6c1a9a4-284e-4e81-967d-102d3ecec48e'
  console.log('🔍 Module 6 "Looking Back"...\n')
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
  console.log(`\n✅ Готово: ${created} квизов создано для модуля 6`)
}
main().catch(e=>{console.error(e);process.exit(1)})
