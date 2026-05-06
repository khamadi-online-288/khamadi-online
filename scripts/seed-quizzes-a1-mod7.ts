/**
 * Seed quizzes for A1 Beginner — Module 7 "Planning Ahead".
 * Run: npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1-mod7.ts
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

  // Lesson 1 — Future Plans — Be Going To
  '1b02e118-c5d8-4c6e-933e-06193fa9bd79':{pass_threshold:70,questions:[
    mc(1,'How do we form "be going to"?','subject + will + going to + verb','subject + am/is/are + going to + base verb','subject + going to + verb','subject + be + going + verb','B'),
    mc(2,'Choose the correct sentence:','She going to travel.','She is going to travel.','She go to travel.','She is going travel.','B'),
    mc(3,'"Be going to" is used for:','spontaneous decisions','predictions with no evidence','plans and intentions','general facts','C'),
    mc(4,'Complete: "They ___ (visit) their grandparents next weekend."','will visit','are going to visit','go to visit','visit','B'),
    mc(5,'Choose the correct negative:','She isn\'t going to go.','She not going to go.','She going not to go.','She isn\'t go to go.','A'),
    mc(6,'Complete the question: "___ he ___ (study) abroad?"','Is / going to','Are / going to','Will / going to','Does / going to','A'),
    mc(7,'Which time expression signals future plans?','yesterday','last night','next year','usually','C'),
    mc(8,'Choose the correct sentence:','I am going to bought a new car.','I am going to buy a new car.','I going to buy a new car.','I am go to buy a new car.','B'),
    mc(9,'Short answer: "Are you going to cook tonight?" — "Yes, ___."','Yes, I will.','Yes, I am.','Yes, I going.','Yes, I going to.','B'),
    mc(10,'Complete: "Look at those clouds — it ___ (rain)!"','will rains','is going to rain','rains','going to rain','B'),
    tf(11,'"Going to" is used for pre-planned intentions and decisions.','true'),
    tf(12,'"She is going to sings" is correct.','false'),
    tf(13,'"Are you going to travel?" is a correct question.','true'),
    fb(14,'I ___ (go) to the gym tomorrow. She ___ (not/come) to the party.','am going to go, isn\'t going to come'),
    fb(15,'___ (be) they going to move? Yes, they ___.','Are, are'),
  ]},

  // Lesson 2 — Predictions — Future Simple Will
  '654e71b5-aa18-48b6-8eb4-20d73ca0756d':{pass_threshold:70,questions:[
    mc(1,'How do we form Future Simple (will)?','subject + will + verb-ing','subject + will + base verb','subject + will + verb-ed','subject + will be + verb','B'),
    mc(2,'Choose the correct sentence:','She will goes to London.','She will going to London.','She will go to London.','She wills go to London.','C'),
    mc(3,'"Will" is used for:','past habits','current actions','predictions and spontaneous decisions','plans made before','C'),
    mc(4,'Choose the correct negative:','She won\'t goes.','She will not goes.','She won\'t go.','She wills not go.','C'),
    mc(5,'What is the contraction of "will not"?','willn\'t','won\'t','will\'nt','wont','B'),
    mc(6,'Complete: "I think it ___ (be) sunny tomorrow."','is','was','will be','going to be','C'),
    mc(7,'Choose the correct question:','Will she comes?','Will she go?','Will she going?','Wills she go?','B'),
    mc(8,'Short answer: "Will they win?" — "Yes, ___."','Yes, they will.','Yes, they won\'t.','Yes, they do.','Yes, they going to.','A'),
    mc(9,'Which signals a spontaneous decision with "will"?','I\'m going to study tonight — I planned it yesterday.','Oh, the phone is ringing — I\'ll answer it!','She is going to visit Paris next month.','They planned to go last week.','B'),
    mc(10,'Complete: "Don\'t worry, I ___ (help) you."','am going to help','helping','will help','helped','C'),
    tf(11,'"Will" does not change for he/she/it (no -s added).','true'),
    tf(12,'"She will goes home" is correct.','false'),
    tf(13,'"Won\'t" is the contraction of "will not".','true'),
    fb(14,'I think she ___ (win) the competition. He ___ (not/come) tomorrow.','will win, won\'t come'),
    fb(15,'___ you help me? Yes, I ___.','Will, will'),
  ]},

  // Lesson 3 — Making Plans — Future Simple vs Going To
  '58b4696d-5aac-4cf0-86ea-63ea14952378':{pass_threshold:70,questions:[
    mc(1,'Use "going to" for:','spontaneous decisions made at the moment','plans decided before now','predictions based on no evidence','offers to help','B'),
    mc(2,'Use "will" for:','plans made in advance','intentions you decided earlier','spontaneous decisions and predictions','ongoing actions','C'),
    mc(3,'Choose "going to" or "will": "Look out! That vase ___ fall!"','is going to','will','goes to','falls','A'),
    mc(4,'Choose "going to" or "will": "The phone is ringing — I ___ get it!"','am going to','going to','will','am going','C'),
    mc(5,'Choose the correct sentence for a plan made in advance:','I will visit my aunt next Sunday — I booked the tickets last week.','I am going to visit my aunt next Sunday — I booked the tickets last week.','I visit my aunt next Sunday.','I am visit my aunt next Sunday.','B'),
    mc(6,'Choose "going to" or "will": "I think robots ___ replace many jobs."','are going to','goes to','will','going to','C'),
    mc(7,'Complete: "She has bought the ingredients — she ___ (make) a cake."','will make','makes','is going to make','made','C'),
    mc(8,'Which is a spontaneous offer?','I\'m going to carry your bag — I decided last night.','I will carry your bag!','I carry your bag.','I carried your bag.','B'),
    mc(9,'Complete: "Don\'t worry — I ___ (not/tell) anyone your secret."','am not going to tell','going to not tell','won\'t tell','will not to tell','C'),
    mc(10,'Which sentence uses "going to" correctly?','I going to study medicine.','I am going to study medicine.','I am going study medicine.','I am go to study medicine.','B'),
    tf(11,'"Going to" is used when there is evidence or a plan made before speaking.','true'),
    tf(12,'"Will" and "going to" are always interchangeable.','false'),
    tf(13,'"I\'ll call you back" is a correct use of "will" for a spontaneous decision.','true'),
    fb(14,'She ___ (going to) travel to Japan — she bought her ticket last month. It looks cloudy — it ___ (will) rain.','is going to, will'),
    fb(15,'I ___ (will/offer) help you carry those bags! They ___ (going to/plan) get married in June.','will, are going to'),
  ]},

  // Lesson 4 — Weather & Seasons — Future in Context
  'ed97b267-5529-44e2-872f-ed6eb7bf76ab':{pass_threshold:70,questions:[
    mc(1,'Which word describes hot, sunny weather?','cloudy','rainy','sunny','snowy','C'),
    mc(2,'Complete: "It ___ (will/be) cold tomorrow." (prediction)','is','was','will be','going to','C'),
    mc(3,'Which season comes after summer?','spring','winter','autumn/fall','summer','C'),
    mc(4,'What is the weather like when it rains?','sunny','windy','rainy','snowy','C'),
    mc(5,'Complete: "Look at the dark clouds — it ___ (rain)!" (evidence)','will rains','rains','is going to rain','rained','C'),
    mc(6,'Which word means very cold weather with ice falling from the sky?','fog','rain','snow','hail','C'),
    mc(7,'Complete: "The forecast says it ___ (be) hot on Saturday."','is','was','will be','going to','C'),
    mc(8,'In which season do leaves fall from trees?','spring','summer','autumn','winter','C'),
    mc(9,'Complete: "I ___ (going to / take) an umbrella — it might rain."','will take','am going to take','take','taking','B'),
    mc(10,'Which describes weather with strong air movement?','cloudy','windy','sunny','snowy','B'),
    tf(11,'"It is going to rain" is correct when we see evidence (e.g. dark clouds).','true'),
    tf(12,'Spring comes after winter.','true'),
    tf(13,'"It will snows tomorrow" is correct.','false'),
    fb(14,'In ___ (winter/summer) it is cold. In ___ (summer/winter) it is hot.','winter, summer'),
    fb(15,'The forecast says it ___ (will) be cloudy. Take a coat — it ___ (going to) be cold.','will, is going to'),
  ]},

  // Lesson 5 — Travel Plans — Future Review
  'f77357c2-56bc-4a57-aa61-127c4b16792a':{pass_threshold:70,questions:[
    mc(1,'Complete: "We ___ (going to) fly to Istanbul next month." (planned)','will fly','are going to fly','fly','flying','B'),
    mc(2,'Complete: "I think the flight ___ (be) on time." (prediction)','is going to be','going to be','will be','be','C'),
    mc(3,'Which means the same as "an aeroplane journey"?','train ride','cruise','flight','road trip','C'),
    mc(4,'Complete: "Our hotel ___ (have) a swimming pool." (prediction / belief)','is going to have','going to have','will have','having','C'),
    mc(5,'Choose the correct question:','Are you going to book the tickets?','You are going to book the tickets?','Will you going to book?','Are you will book the tickets?','A'),
    mc(6,'Complete: "I\'ve already packed — I ___ (not/forget) anything." (plan)','won\'t forget','am not going to forget','will not to forget','going to not forget','B'),
    mc(7,'Which word means to reserve a hotel room or flight seat?','cancel','pay','book','leave','C'),
    mc(8,'Complete: "It\'s a short trip — we ___ (will/be back) by Sunday."','are going to be back','are back','will be back','going to be back','C'),
    mc(9,'Complete: "She is excited because she ___ (going to) visit New York for the first time."','will visit','is going to visit','visit','visiting','B'),
    mc(10,'Choose the correct sentence:','I will to visit Paris next summer.','I going to visit Paris next summer.','I am going to visit Paris next summer.','I will visiting Paris next summer.','C'),
    tf(11,'"Going to" is preferred for travel plans made in advance.','true'),
    tf(12,'"Will" cannot be used to talk about travel.','false'),
    tf(13,'"Are you going to take the train?" is a correct question about a travel plan.','true'),
    fb(14,'We ___ (going to) stay at a 4-star hotel. I think we ___ (will) have a great time.','are going to, will'),
    fb(15,'___ (will/going to) you fly or take the train? I ___ (going to) fly — I already booked.','Will, am going to'),
  ]},

  // Lesson 6 — Module Review & Test
  'bc5450c4-176f-423d-826a-5e8449ef9494':{pass_threshold:80,questions:[
    mc(1,'How do we form "be going to"?','subject + will + going to + verb','subject + am/is/are + going to + base verb','subject + going to + verb','subject + be + going + verb','B'),
    mc(2,'Choose the correct sentence:','She going to travel.','She is going to travel.','She will going to travel.','She going travel.','B'),
    mc(3,'How do we form Future Simple (will)?','will + verb-ing','will + verb-ed','will + base verb','will + to + verb','C'),
    mc(4,'What is the contraction of "will not"?','willn\'t','will\'nt','won\'t','wont','C'),
    mc(5,'Choose "going to": "Look at the clouds — it ___ rain!"','will','is going to','rains','rained','B'),
    mc(6,'Choose "will": "The phone is ringing — I ___ answer it!"','am going to','going to','will','am going','C'),
    mc(7,'Complete: "I think it ___ (be) sunny tomorrow."','is','was','will be','going to be','C'),
    mc(8,'Which is the correct negative?','She won\'t goes.','She will not goes.','She won\'t go.','She wills not go.','C'),
    mc(9,'Short answer: "Will they win?" — "Yes, ___."','Yes, they will.','Yes, they won\'t.','Yes, they do.','Yes, they are.','A'),
    mc(10,'Short answer: "Are you going to cook?" — "No, ___."','No, I won\'t.','No, I\'m not.','No, I don\'t.','No, I going not.','B'),
    mc(11,'Which word describes very cold weather with ice falling?','fog','rain','snow','hail','C'),
    mc(12,'Which season comes after winter?','autumn','summer','spring','winter','C'),
    mc(13,'Complete: "She has bought the ingredients — she ___ (make) a cake."','will make','is going to make','makes','made','B'),
    mc(14,'Which is a spontaneous offer using "will"?','I\'m going to help you — I planned it.','I will help you!','I help you.','I helped you.','B'),
    mc(15,'Complete: "We ___ (going to) fly to Paris — we booked last month."','will fly','are going to fly','fly','flying','B'),
    tf(16,'"She will goes home" is correct.','false'),
    tf(17,'"Going to" is used for plans decided before speaking.','true'),
    tf(18,'"Won\'t" is the contraction of "will not".','true'),
    fb(19,'I ___ (going to) study tonight — I already made a plan. Oh, the door — I ___ (will) get it!','am going to, will'),
    fb(20,'___ it ___ (rain) tomorrow? I think it ___ (will).','Will, rain, will'),
  ]},
}

async function main(){
  const MODULE_ID='9c4c45b8-de08-43cb-910d-adfc8f6dad0d'
  console.log('🔍 Module 7 "Planning Ahead"...\n')
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
  console.log(`\n✅ Готово: ${created} квизов создано для модуля 7`)
}
main().catch(e=>{console.error(e);process.exit(1)})
