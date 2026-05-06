/**
 * Seed quizzes for A1 Beginner — Module 8 "Out & About".
 * Run: npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1-mod8.ts
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

  // Lesson 1 — Shopping & Money — How much/many
  '37fa2cfe-f90a-48ee-99c8-837cded932a2':{pass_threshold:70,questions:[
    mc(1,'"How much" is used with:','countable nouns','uncountable nouns','plural nouns only','adjectives','B'),
    mc(2,'"How many" is used with:','uncountable nouns','singular nouns','countable plural nouns','adjectives','C'),
    mc(3,'Complete: "___ does it cost?" (price)','How many','How much','What many','How often','B'),
    mc(4,'Complete: "___ apples do you need?"','How much','How often','How many','What much','C'),
    mc(5,'Choose the correct sentence:','How much books did you buy?','How many books did you buy?','How much book did you buy?','How many money did you spend?','B'),
    mc(6,'Complete: "That shirt ___ 5,000 tenge." (cost)','costs','cost','costing','is costing','A'),
    mc(7,'Which phrase is used to ask the price?','How many is it?','How much is it?','How much are they?','Both B and C','D'),
    mc(8,'Complete: "I don\'t have ___ money left."','many','a few','much','a lot','C'),
    mc(9,'Choose the correct sentence:','How many milk do you want?','How much milk do you want?','How many milks are there?','How much milks are there?','B'),
    mc(10,'What do you say when something is too expensive?','It\'s cheap.','It\'s affordable.','It\'s too expensive.','It\'s free.','C'),
    tf(11,'"How much" asks about price or quantity of uncountable nouns.','true'),
    tf(12,'"How many money do you have?" is correct.','false'),
    tf(13,'"How many students are in the class?" is correct.','true'),
    fb(14,'___ is a cup of coffee? It ___ (cost) $3.','How much, costs'),
    fb(15,'___ people are there? There are ___. ___ water do you need?','How many, many (many people), How much'),
  ]},

  // Lesson 2 — Eating Out — Ordering & Requests
  '6eac6358-c2a6-491d-9ecd-33b2d8051894':{pass_threshold:70,questions:[
    mc(1,'How do you politely order food in a restaurant?','Give me a pizza.','I want pizza.','I\'d like a pizza, please.','Pizza now!','C'),
    mc(2,'What does "I\'d like" mean?','I don\'t want','I wanted','I would like','I liked','C'),
    mc(3,'Complete a polite request: "___ I have the menu, please?"','Should','Would','Could','Must','C'),
    mc(4,'Which is the most polite way to ask for something?','Give me water.','Water!','Could I have some water, please?','I want water now.','C'),
    mc(5,'What does a waiter say when taking your order?','Are you ready?','What do you want?','May I take your order?','Order now!','C'),
    mc(6,'Complete: "I\'ll ___ the chicken soup." (ordering)','want','have','take','Both B and C','D'),
    mc(7,'What do you say when you want the bill?','More food, please.','Could we have the bill, please?','Where is the exit?','Table for two, please.','B'),
    mc(8,'Complete: "___ you like a dessert?" (waiter asking)','Would','Should','Must','Could','A'),
    mc(9,'Which phrase books a table?','A table for two, please.','Two tables, please.','I want to sit.','Give me a table.','A'),
    mc(10,'What do you say if the food is delicious?','This is terrible.','Could I complain?','This is excellent / delicious!','I\'d like less.','C'),
    tf(11,'"I\'d like" is a polite way to order or request something.','true'),
    tf(12,'"Give me a coffee!" is considered polite in formal restaurant situations.','false'),
    tf(13,'"Could I have the bill, please?" is a polite way to ask for the check.','true'),
    fb(14,'___ I have a glass of water, please? I ___ like the pasta.','Could, \'d (would)'),
    fb(15,'___ you like anything to drink? Yes, I ___ like a lemonade.','Would, \'d (would)'),
  ]},

  // Lesson 3 — Getting Around — Directions & Transport
  'fbff31bd-7306-442c-ad18-66700e5999fc':{pass_threshold:70,questions:[
    mc(1,'What does "Turn left" mean?','go straight ahead','turn to the right side','turn to the left side','go back','C'),
    mc(2,'What does "Go straight ahead" mean?','turn left','turn right','continue in the same direction','stop','C'),
    mc(3,'Complete: "The bank is ___ the right." (on your right side)','in','at','on','by','C'),
    mc(4,'Complete: "Take the ___ exit on the roundabout." (second)','two','second','twice','2nd both B and D','D'),
    mc(5,'What do you say to ask for directions?','Where are you?','Excuse me, how do I get to the station?','Take me to the station!','Where is going the station?','B'),
    mc(6,'Which transport is used on rails?','bus','taxi','train','plane','C'),
    mc(7,'Complete: "___ the bus number 5 to the city centre."','Go','Take','Ride','Drive','B'),
    mc(8,'What does "It\'s about 10 minutes on foot" mean?','10 minutes by car','10 minutes walking','10 minutes by bus','10 minutes by taxi','B'),
    mc(9,'Complete: "The museum is ___ the left side of the street."','in','at','on','by','C'),
    mc(10,'What does "opposite" mean in directions?','next to','behind','across from','in front of','C'),
    tf(11,'"Turn left at the traffic lights" is a correct direction.','true'),
    tf(12,'"Take the bus" means you drive the bus yourself.','false'),
    tf(13,'"Excuse me, could you tell me the way to the station?" is a polite way to ask for directions.','true'),
    fb(14,'Go ___ (straight/left) at the lights. Then turn ___ (right/left) at the corner.','straight, right'),
    fb(15,'___ the number 3 bus. Get ___ at the central square.','Take, off'),
  ]},

  // Lesson 4 — At the Hotel — Polite Requests
  '72ef76e4-5eb8-4626-b410-1f65b8d748b4':{pass_threshold:70,questions:[
    mc(1,'How do you ask for a hotel room?','I want a room.','Give me a room.','I\'d like to book a room, please.','Room, now!','C'),
    mc(2,'Complete: "___ I have a wake-up call at 7 am?"','Should','Must','Could','Will','C'),
    mc(3,'What does "check in" mean at a hotel?','leave the hotel','arrive and register at the hotel','pay the bill','book online','B'),
    mc(4,'What does "check out" mean?','arrive at the hotel','book a room','leave the hotel and pay','take a shower','C'),
    mc(5,'Complete: "Do you have any ___ available?" (rooms)','rooms','vacancy','availability','Both A and B','D'),
    mc(6,'Which is a polite request at a hotel?','Bring me towels!','More towels!','Could you bring me some extra towels, please?','Towels now!','C'),
    mc(7,'Complete: "Is breakfast ___?" (included in the price)','included','include','including','includes','A'),
    mc(8,'What do you say when you arrive at the reception desk?','Goodbye.','I\'d like to check in — I have a reservation.','Check out, please.','Give me my key.','B'),
    mc(9,'Complete: "___ you like a room with a sea view?"','Should','Would','Must','Can\'t','B'),
    mc(10,'What do you say if the Wi-Fi is not working?','I need to check out.','Could you help me with the Wi-Fi? It\'s not working.','Book me a new room.','I want a refund.','B'),
    tf(11,'"I\'d like to book a double room" is a correct hotel request.','true'),
    tf(12,'"Check in" means leaving the hotel.','false'),
    tf(13,'"Could I have a later check-out, please?" is a polite hotel request.','true'),
    fb(14,'I\'d like to ___ (check/book) a room. ___ it include breakfast?','book, Does'),
    fb(15,'___ you have any single rooms? Yes, we ___ (have) rooms available.','Do, do'),
  ]},

  // Lesson 5 — In the Office — Formal Language Basics
  'd4799ffc-7e50-417f-adae-eb29b92c4a10':{pass_threshold:70,questions:[
    mc(1,'Which greeting is appropriate in a formal office setting?','Hey! What\'s up?','Good morning, how are you?','Yo!','Hi dude!','B'),
    mc(2,'Which phrase is a formal way to introduce yourself?','I\'m just John.','Hi, I\'m John.','Good morning. My name is John Smith. Pleased to meet you.','Hey, call me John!','C'),
    mc(3,'Complete a formal email opening: "___ Ms Johnson,"','Hey','Hi there','Dear','Hello dear','C'),
    mc(4,'Which is the correct formal closing for an email?','See ya!','Bye!','Best regards,','Later!','C'),
    mc(5,'Which is a polite office request?','Do this report now.','Could you please prepare the report by Friday?','Report! Friday!','I need the report.','B'),
    mc(6,'What does "CC" mean in an email?','Cancel & Close','Carbon Copy (sending to another person)','Current Client','Company Contact','B'),
    mc(7,'Complete: "I am ___ to inform you that the meeting has been rescheduled."','pleased','pleasing','please','pleasant','A'),
    mc(8,'Which phrase apologises formally?','Oops, my bad.','Sorry about that.','I apologise for the inconvenience.','My mistake!','C'),
    mc(9,'Complete: "Please ___ the attached document." (look at)','see','watch','review / find','search','C'),
    mc(10,'Which is the correct formal way to decline a meeting?','I can\'t come.','Not possible.','Unfortunately, I am unable to attend.','No, I won\'t come.','C'),
    tf(11,'"Dear Sir/Madam" is a formal email greeting.','true'),
    tf(12,'"Hey boss, I need a day off lol" is appropriate formal office language.','false'),
    tf(13,'"Best regards" is a common formal email closing.','true'),
    fb(14,'___ Ms Park, I am ___ to write regarding our upcoming meeting.','Dear, writing'),
    fb(15,'Could you ___ send me the document? I ___ for the delay. (apologise)','please, apologise'),
  ]},

  // Lesson 6 — Module Review & Test
  'db0e1b22-2847-4cfa-a243-1d90e5537c61':{pass_threshold:80,questions:[
    mc(1,'"How much" is used with:','countable nouns','uncountable nouns','plural nouns','proper nouns','B'),
    mc(2,'Complete: "___ apples do you need?"','How much','How often','How many','What much','C'),
    mc(3,'How do you politely order food?','Give me a pizza.','I want pizza.','I\'d like a pizza, please.','Pizza now!','C'),
    mc(4,'What does "I\'d like" mean?','I don\'t want','I would like','I liked','I want urgently','B'),
    mc(5,'What does "Turn left" mean in directions?','go straight','turn to the right','turn to the left','go back','C'),
    mc(6,'Complete: "___ the bus number 5 to the city centre."','Go','Take','Ride','Drive','B'),
    mc(7,'What does "check in" mean at a hotel?','leave the hotel','arrive and register','pay the bill','book online','B'),
    mc(8,'Complete: "___ I have a wake-up call at 7 am?" (polite)','Should','Must','Could','Will','C'),
    mc(9,'Which greeting is formal in an office?','Hey! What\'s up?','Good morning. Pleased to meet you.','Yo dude!','Hi mate!','B'),
    mc(10,'Complete a formal email: "___ Ms Johnson,"','Hey','Hi','Dear','Hello dear','C'),
    mc(11,'Complete: "___ does it cost?" (price)','How many','How much','What many','How often','B'),
    mc(12,'Which is the most polite request?','Give me water.','Water, now.','Could I have some water, please?','I want water.','C'),
    mc(13,'Complete: "The bank is ___ the right."','in','at','on','by','C'),
    mc(14,'What does "check out" mean at a hotel?','arrive','book a room','leave and pay','take a shower','C'),
    mc(15,'Which is the correct formal email closing?','See ya!','Bye!','Best regards,','Later!','C'),
    tf(16,'"How many money do you have?" is correct.','false'),
    tf(17,'"Could you bring me some towels, please?" is a polite hotel request.','true'),
    tf(18,'"Go straight ahead" means continue in the same direction.','true'),
    fb(19,'___ is a room for one night? It ___ (cost) $50.','How much, costs'),
    fb(20,'___ Ms Kim, I ___ (write) to confirm our meeting on Friday.','Dear, am writing'),
  ]},
}

async function main(){
  const MODULE_ID='12fa730a-4417-45c0-b856-3523d59e2abd'
  console.log('🔍 Module 8 "Out & About"...\n')
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
  console.log(`\n✅ Готово: ${created} квизов создано для модуля 8`)
}
main().catch(e=>{console.error(e);process.exit(1)})
