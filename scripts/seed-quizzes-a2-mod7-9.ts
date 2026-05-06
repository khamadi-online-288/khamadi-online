/**
 * Seed quizzes for A2 Pre-Intermediate — Modules 7, 8, 9.
 * Run: npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a2-mod7-9.ts
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

  // ═══ MODULE 7: Listening & Speaking ═══

  'c577c52a-c10c-4c83-af6d-70881d26f38b':{pass_threshold:70,questions:[  // Fast Speech — Listening Strategies
    mc(1,'What is "elision" in fast speech?','adding extra sounds','dropping sounds or syllables','slowing down','stressing every word','B'),
    mc(2,'What is "liaison" (linking) in fast speech?','pausing between words','connecting the end of one word to the start of the next','adding sounds','speaking slowly','B'),
    mc(3,'What does "gonna" represent in fast speech?','going','going to','got a','getting','B'),
    mc(4,'What does "wanna" represent in fast speech?','want a','want to','will want','went to','B'),
    mc(5,'What does "gotta" represent in fast speech?','got a','going to','got to/have got to','getting','C'),
    mc(6,'What is "weak form" in pronunciation?','when stressed syllables are emphasised','when function words are reduced (e.g. "and" → /ən/)','when speaking very loudly','when vowels are elongated','B'),
    mc(7,'Which word is typically unstressed in fast speech?','the main verb','the subject noun','function words (a, the, of, to)','adjectives','C'),
    mc(8,'What is a useful strategy when you don\'t understand a speaker?','pretend you understood','ask them to repeat or clarify','stop listening','reply randomly','B'),
    mc(9,'What does "dunno" represent?','don\'t go','don\'t know','doing now','done no','B'),
    mc(10,'Which is a good listening strategy?','focus on every single word','listen for key content words and overall meaning','ignore the first sentence','only listen to grammar','B'),
    tf(11,'"Gonna" is the informal/fast-speech pronunciation of "going to".','true'),
    tf(12,'In fast speech, every word is pronounced clearly and completely.','false'),
    tf(13,'Function words (a, the, of) are often weak/reduced in natural speech.','true'),
    fb(14,'"Wanna" = "___ (want to)". "Gonna" = "___ (going to)".','want to, going to'),
    fb(15,'"Gotta" = "___ (have got to/must)". "Dunno" = "___ (don\'t know)".','have got to / got to, don\'t know'),
  ]},

  '757df2a4-acc2-46b6-946f-c13d8a0fa117':{pass_threshold:70,questions:[  // Presentations — Public Speaking
    mc(1,'How should you begin a presentation?','Jump straight into details','Greet the audience and introduce your topic','Read from your notes immediately','Tell a long joke','B'),
    mc(2,'Which phrase signals a transition to a new point?','Furthermore','Moving on to...','However','In conclusion','B'),
    mc(3,'Complete: "Let me begin by ___." (introducing the first point)','concluding','summarising','outlining my main point','asking a question first','C'),
    mc(4,'What is "eye contact" important for in a presentation?','it is not important','it engages the audience and shows confidence','it helps you read your notes','it makes you speak faster','B'),
    mc(5,'Which phrase signals the conclusion?','Moving on...','Furthermore...','Let me now turn to...','To conclude / In summary...','D'),
    mc(6,'What is the purpose of signposting language?','to confuse the audience','to guide the audience through the structure of your talk','to fill time','to ask questions','B'),
    mc(7,'Complete: "I\'d like to draw your attention to ___."','the first slide','the conclusion','the key point on this slide / this important data','nothing in particular','C'),
    mc(8,'Which is a good way to handle a question you don\'t know?','make up an answer','say nothing','say "That\'s a great question — I\'ll look into that."','ask the audience','C'),
    mc(9,'What does "to elaborate" mean?','to summarise','to repeat exactly','to explain in more detail','to conclude','C'),
    mc(10,'Which phrase invites questions?','Please be quiet now.','Any questions so far?','I\'m done speaking.','Next slide please.','B'),
    tf(11,'Eye contact with the audience is important in a presentation.','true'),
    tf(12,'Reading directly from notes is the best presentation technique.','false'),
    tf(13,'Signposting language helps the audience follow the structure of a talk.','true'),
    fb(14,'"Moving on to ___" signals a ___ (transition). "To conclude" signals the ___ (conclusion).','the next point, transition, conclusion'),
    fb(15,'"I\'d like to draw your ___ (attention) to this key ___ (point/data)."','attention, point / data'),
  ]},

  'ec82ac73-2a51-4a49-bbe0-5ddab18671f1':{pass_threshold:70,questions:[  // Discussions — Expressing Opinions
    mc(1,'Which phrase introduces your opinion?','In my opinion / I think / I believe','According to everyone','It is a fact that','People say','A'),
    mc(2,'Which phrase asks for someone\'s opinion?','I think so.','What\'s your view on this?','I totally agree.','In my opinion...','B'),
    mc(3,'Which phrase shows you partially agree?','I completely disagree.','That\'s wrong.','I see your point, but...','Absolutely not!','C'),
    mc(4,'Which is a formal way to disagree?','You\'re wrong!','That\'s nonsense.','I\'m afraid I disagree with that view.','No way!','C'),
    mc(5,'Complete: "I tend to ___ with that point." (agree)','disagree','concur/agree','refuse','oppose','B'),
    mc(6,'Which phrase introduces a counter-argument?','Furthermore','In addition','On the other hand / However','Therefore','C'),
    mc(7,'Complete: "That\'s an interesting point. ___, I\'m not fully convinced."','Furthermore','In addition','Nevertheless','Therefore','C'),
    mc(8,'Which phrase gives someone the floor (invites them to speak)?','I agree completely.','Furthermore...','What do you think about this?','In conclusion...','C'),
    mc(9,'Which is an appropriate phrase to interrupt politely?','Shut up!','Wait, I haven\'t finished.','Sorry to interrupt, but could I add something?','Be quiet, please.','C'),
    mc(10,'Complete: "From my perspective, this is the most ___ (important) issue."','interesting','common','important/significant','unusual','C'),
    tf(11,'"In my opinion" introduces a personal view.','true'),
    tf(12,'"You\'re wrong!" is considered a polite disagreement.','false'),
    tf(13,'"I see your point, but..." shows partial agreement before contrasting.','true'),
    fb(14,'___ (In my opinion), this policy needs to change. ___ (On the other hand), others may disagree.','In my opinion, On the other hand'),
    fb(15,'___ (Nevertheless), I remain unconvinced. What is your ___ (view/opinion) on this?','Nevertheless, view / opinion'),
  ]},

  '9eee2f88-40a4-4873-bf76-f3dcee7501ef':{pass_threshold:70,questions:[  // Debates — Agreeing & Disagreeing Formally
    mc(1,'Which phrase formally supports an argument?','The evidence clearly demonstrates that...','I think so.','Everybody knows that...','It\'s obvious that...','A'),
    mc(2,'Which phrase formally challenges an argument?','You\'re wrong.','That\'s not true.','However, this argument fails to account for...','That\'s nonsense.','C'),
    mc(3,'Complete: "I would like to ___ the point made by the previous speaker."','disagree','challenge/refute','ignore','accept fully','B'),
    mc(4,'Which is an appropriate formal concession?','OK, you\'re right.','I suppose.','I concede that this point has some merit, however...','Fine, whatever.','C'),
    mc(5,'Complete: "The data ___ (show) that this approach is effective." (present simple)','showed','shows','are showing','have shown','B'),
    mc(6,'Which phrase introduces counter-evidence?','Furthermore, the data shows...','In addition, more evidence...','However, it should be noted that...','Therefore, we conclude...','C'),
    mc(7,'A formal debate uses:','casual language and slang','structured formal language and evidence','personal stories only','emotional appeals only','B'),
    mc(8,'Complete: "I respectfully ___ with the previous argument."','agree','support','disagree','accept','C'),
    mc(9,'Which phrase introduces a supporting example?','However','Nevertheless','For instance / For example','Therefore','C'),
    mc(10,'Complete: "In conclusion, the evidence ___ that our position is correct."','suggests','suggest','are suggesting','suggested','A'),
    tf(11,'Formal debates use structured arguments supported by evidence.','true'),
    tf(12,'"You\'re absolutely wrong!" is appropriate formal debate language.','false'),
    tf(13,'"I concede that..." is a formal way to acknowledge an opposing point.','true'),
    fb(14,'___ (However), this argument overlooks key evidence. ___ (Furthermore), the data supports our position.','However, Furthermore'),
    fb(15,'I ___ (respectfully) disagree. The evidence ___ (clearly) demonstrates our case.','respectfully, clearly'),
  ]},

  'bd32b101-0311-4b2b-ab41-3ad4d006d71d':{pass_threshold:70,questions:[  // University Skills — Note-Taking
    mc(1,'What is the purpose of note-taking?','to write down every single word','to record key information efficiently for later review','to write a full essay during a lecture','to draw diagrams only','B'),
    mc(2,'What does "abbreviation" mean in note-taking?','writing everything in full','using shortened forms of words','drawing symbols','copying directly','B'),
    mc(3,'Which is a common abbreviation for "for example"?','ie','eg','nb','cf','B'),
    mc(4,'Which is a common abbreviation for "that is"?','eg','nb','ie','cf','C'),
    mc(5,'What is the "Cornell method" of note-taking?','writing in full sentences','a structured system with cue column, notes, and summary sections','only using bullet points','recording audio','B'),
    mc(6,'What does "NB" mean in notes?','note bene — important note','for example','that is','see also','A'),
    mc(7,'Which is a good note-taking strategy during a lecture?','write down every word','only write headings','listen for key words and signal phrases','copy from the textbook','C'),
    mc(8,'What signal phrase shows a lecturer is about to make a key point?','By the way...','The main point here is...','Anyway...','Moving on quickly...','B'),
    mc(9,'Why is reviewing notes after a lecture important?','it isn\'t important','to consolidate learning and fill gaps while memory is fresh','to correct spelling','to memorise every word','B'),
    mc(10,'What does "cf." mean in academic notes?','compare with / contrast','for example','that is','important','A'),
    tf(11,'Good notes capture key ideas, not every word.','true'),
    tf(12,'"eg" is an abbreviation for "that is".','false'),
    tf(13,'Reviewing notes soon after a lecture improves retention.','true'),
    fb(14,'"eg" = "___ (for example)". "ie" = "___ (that is)". "NB" = "___ (important note)".','for example, that is, important note / nota bene'),
    fb(15,'Good notes focus on ___ (key) ideas. The ___ (Cornell) method uses a cue column and summary.','key, Cornell'),
  ]},

  '57a8b1c8-b7e0-40f1-afe9-cebb2d7c5d10':{pass_threshold:80,questions:[  // Module 7 Review
    mc(1,'What does "gonna" represent?','going','going to','got a','getting','B'),
    mc(2,'What does "wanna" represent?','want a','want to','will want','went to','B'),
    mc(3,'Function words in fast speech are often:','stressed','silent','reduced/weak','louder','C'),
    mc(4,'How should you begin a presentation?','Jump into details','Greet audience and introduce topic','Read from notes','Tell a long joke','B'),
    mc(5,'Which phrase signals a new point in a presentation?','Moving on to...','Furthermore','However','In conclusion','A'),
    mc(6,'Which introduces your opinion?','In my opinion / I believe','According to everyone','It is a fact','People say','A'),
    mc(7,'Which shows partial agreement?','I completely disagree.','That\'s wrong.','I see your point, but...','Absolutely not!','C'),
    mc(8,'A formal way to challenge an argument:','You\'re wrong.','That\'s nonsense.','However, this argument fails to account for...','That\'s not true.','C'),
    mc(9,'"eg" stands for:','important note','that is','for example','compare with','C'),
    mc(10,'"NB" stands for:','for example','nota bene (important note)','that is','see also','B'),
    mc(11,'Good note-taking involves:','writing every word','only drawing diagrams','recording key ideas efficiently','copying from the book','C'),
    mc(12,'Signposting language in a presentation:','confuses the audience','guides the audience through the structure','fills time','replaces content','B'),
    mc(13,'Which phrase invites questions in a presentation?','Please be quiet.','Any questions so far?','I\'m done.','Next slide.','B'),
    mc(14,'What does "I concede that..." mean in a debate?','I strongly disagree','I acknowledge the opposing point has some merit','I refuse to discuss','I agree completely','B'),
    mc(15,'Reviewing notes soon after a lecture is important because:','it isn\'t important','it consolidates learning while memory is fresh','it helps correct spelling','it replaces the lecture','B'),
    tf(16,'"Gonna" is the fast-speech form of "going to".','true'),
    tf(17,'Reading directly from notes is the best presentation technique.','false'),
    tf(18,'"ie" is an abbreviation for "for example".','false'),
    fb(19,'"Gotta" = "___ (have got to)". "Dunno" = "___ (don\'t know)".','have got to, don\'t know'),
    fb(20,'"Moving on to ___" signals a ___. "In conclusion" signals the ___.','the next point, transition, conclusion'),
  ]},

  // ═══ MODULE 8: Complex Language ═══

  '4425323b-f61c-4e51-a5a8-ac19171faf9e':{pass_threshold:70,questions:[  // Relative Clauses — Who/Which/That
    mc(1,'Use "who" for:','things','places','people','animals only','C'),
    mc(2,'Use "which" for:','people','things or animals','places','actions','B'),
    mc(3,'Use "that" for:','people only','things only','people or things (informal)','places only','C'),
    mc(4,'Complete: "The woman ___ called you is my manager."','which','who','whom','that or who','D'),
    mc(5,'Complete: "The report ___ you sent me was very helpful."','who','whom','which / that','whose','C'),
    mc(6,'Choose the correct relative clause:','The man which called me was angry.','The man who called me was angry.','The man that called me was angry.','Both B and C are correct.','D'),
    mc(7,'Complete: "The book ___ I bought yesterday is fascinating."','who','whom','which / that','whose','C'),
    mc(8,'Use "whose" for:','the subject','the object','possession','place','C'),
    mc(9,'Complete: "The student ___ essay won first prize was very talented."','who','which','whose','that','C'),
    mc(10,'Complete: "Is that the restaurant ___ you recommended?"','who','whom','which / that','whose','C'),
    tf(11,'"That" can be used for both people and things in defining relative clauses.','true'),
    tf(12,'"The man which called me" is correct.','false'),
    tf(13,'"Whose" shows possession in relative clauses.','true'),
    fb(14,'The woman ___ (who) helped me was very kind. The book ___ (which/that) I read was excellent.','who, which / that'),
    fb(15,'The student ___ (whose) work won the prize was surprised. The city ___ (where/which) I was born is beautiful.','whose, where / which'),
  ]},

  'be837c9b-2849-4396-8d6a-9240775aa477':{pass_threshold:70,questions:[  // Defining & Non-defining Relative Clauses
    mc(1,'A defining relative clause:','gives extra information about a noun','identifies which person/thing we mean','is separated by commas','can be removed without changing the meaning','B'),
    mc(2,'A non-defining relative clause:','identifies which person/thing we mean','is essential to understanding the sentence','gives extra (non-essential) information, separated by commas','can never use "that"','C'),
    mc(3,'Can "that" be used in non-defining relative clauses?','Yes, always','Yes, sometimes','No, never','Yes, but only for people','C'),
    mc(4,'Which sentence is a non-defining relative clause?','The man who called me was angry.','My father, who is a doctor, lives in Almaty.','The book that I read was great.','The woman who helped me left quickly.','B'),
    mc(5,'In non-defining relative clauses, the clause is:','never used with commas','separated by commas','attached directly with no punctuation','always shorter','B'),
    mc(6,'Can you omit the relative pronoun in a defining clause when it is the object?','Never','Yes, e.g. "The book I read was great."','Only with "which"','Only in writing','B'),
    mc(7,'Choose the correct non-defining relative clause:','My sister who is a nurse works in London.','My sister, who is a nurse, works in London.','My sister that is a nurse works in London.','My sister, that is a nurse, works in London.','B'),
    mc(8,'Complete (defining): "The city ___ I grew up has changed a lot."','who','where/that/which','whom','whose','B'),
    mc(9,'Complete (non-defining): "Paris, ___ is the capital of France, is beautiful."','that','who','which','whom','C'),
    mc(10,'Which sentence has a non-defining relative clause?','The student who won is smart.','The report that she wrote was good.','My manager, who studied at Oxford, is brilliant.','The car that he drives is new.','C'),
    tf(11,'Non-defining relative clauses are separated by commas.','true'),
    tf(12,'"That" can be used in non-defining relative clauses.','false'),
    tf(13,'In a defining relative clause, the relative pronoun can sometimes be omitted when it is the object.','true'),
    fb(14,'Defining: "The man ___ (who) helped me." Non-defining: "My mother, ___ (who) is a teacher, ..."','who, who'),
    fb(15,'Non-defining: "London, ___ (which) is in England, is huge." Defining: "The film ___ (that) I saw was brilliant."','which, that'),
  ]},

  '85b272c2-4375-4169-9838-3a477a2f47b4':{pass_threshold:70,questions:[  // Emphasis — Cleft Sentences
    mc(1,'What is a cleft sentence?','a sentence with a relative clause','a way of giving extra emphasis to part of a sentence','a passive sentence','a reported speech sentence','B'),
    mc(2,'Complete: "___ she said that surprised me." (emphasising "what")','That','It was','What','Which','C'),
    mc(3,'Complete: "___ was John who broke the window." (emphasising "John")','What','It','That','Which','B'),
    mc(4,'Which is an "It-cleft" sentence?','What I need is more time.','She bought a red car.','It was the manager who made the decision.','I need more time.','C'),
    mc(5,'Which is a "Wh-cleft" sentence?','It was the dog that barked.','She needs more support.','What she needs is more support.','The dog that barked was mine.','C'),
    mc(6,'Complete: "It was ___ the problem occurred." (emphasising place)','that','where','what','who','B'),
    mc(7,'Complete: "___ I find surprising is her attitude."','It','That','What','Which','C'),
    mc(8,'Cleft sentences are used to:','shorten sentences','give special emphasis to one element','make sentences passive','use reported speech','B'),
    mc(9,'Complete: "It is hard work ___ leads to success." (It-cleft)','who','what','where','that','D'),
    mc(10,'Complete: "___ he needs is a long holiday." (Wh-cleft)','It','That','What','Which','C'),
    tf(11,'Cleft sentences add emphasis to a specific part of the sentence.','true'),
    tf(12,'"It-cleft" and "Wh-cleft" sentences serve exactly the same purpose.','false'),
    tf(13,'"What I need is more sleep" is a Wh-cleft sentence.','true'),
    fb(14,'It ___ (was) John who broke the window. ___ (What) I love is good coffee.','was, What'),
    fb(15,'"It was ___ (the manager) who ___ (decided)." "___ (What) she needs is ___ (rest)."','the manager, decided, What, rest'),
  ]},

  '65770567-2eff-4aee-a698-23c6cf8a7a1d':{pass_threshold:70,questions:[  // Phrasal Verbs II
    mc(1,'What does "look into" mean?','look at something high','investigate or research','look downward','avoid','B'),
    mc(2,'What does "come across" mean?','come towards','encounter unexpectedly / find by chance','cross something','come back','B'),
    mc(3,'What does "take up" mean?','finish','start a new activity or hobby','take something down','give up','B'),
    mc(4,'What does "bring up" mean?','lower something','raise (a child) / mention (a topic)','bring forward','bring back','B'),
    mc(5,'What does "get over" mean?','get something above','recover from (illness, shock, or relationship)','get under','get around','B'),
    mc(6,'What does "make up" mean?','destroy','invent a story / reconcile after an argument','make something smaller','make something smaller','B'),
    mc(7,'What does "turn down" mean?','increase volume','reject an offer or invitation','decrease something','turn something over','B'),
    mc(8,'What does "go through" mean?','pass physically through','experience something difficult / examine carefully','go above','go underneath','B'),
    mc(9,'What does "keep up with" mean?','fall behind','stay at the same level/speed as someone/something','stop progressing','look up at','B'),
    mc(10,'What does "stand for" mean?','stand upright','represent or mean something','stand in a queue','stand on something','B'),
    tf(11,'"Look into" means to investigate.','true'),
    tf(12,'"Turn down" means to increase the volume.','false'),
    tf(13,'"Get over" means to recover from something.','true'),
    fb(14,'She ___ (take) ___ (up) yoga last year. He ___ (get) ___ (over) the flu quickly.','took, up, got, over'),
    fb(15,'They ___ (turn) ___ (down) the offer. She ___ (come) ___ (across) an old photo.','turned, down, came, across'),
  ]},

  'c4324945-5b63-4300-a0ba-e460d1af0e73':{pass_threshold:70,questions:[  // Collocations
    mc(1,'Which is the correct collocation?','make a mistake','do a mistake','take a mistake','get a mistake','A'),
    mc(2,'Which is correct?','do homework','make homework','take homework','get homework','A'),
    mc(3,'Which is correct?','make a decision','do a decision','take a decision','get a decision','A'),
    mc(4,'Which is correct?','do a photo','make a photo','take a photo','get a photo','C'),
    mc(5,'Which is correct?','make exercise','do exercise','take exercise','get exercise','B'),
    mc(6,'Which is correct?','make progress','do progress','take progress','get progress','A'),
    mc(7,'Which is the correct collocation with "heavy"?','heavy food','heavy rain','heavy music','heavy work','B'),
    mc(8,'Which is correct?','make research','do research','take research','get research','B'),
    mc(9,'Which is the correct collocation?','strong tea','powerful tea','heavy tea','big tea','A'),
    mc(10,'Which is correct?','make a speech','do a speech','take a speech','get a speech','A'),
    tf(11,'"Make a mistake" is the correct collocation.','true'),
    tf(12,'"Do a photo" is the correct collocation.','false'),
    tf(13,'"Strong tea" is a common English collocation.','true'),
    fb(14,'You ___ (make/do) homework. You ___ (make/do) a decision.','do, make'),
    fb(15,'She ___ (take) a photo. He ___ (make) a speech. They ___ (do) research.','took, made, did'),
  ]},

  '4bb2e1bd-f220-466d-959c-89b228c15d60':{pass_threshold:80,questions:[  // Module 8 Review
    mc(1,'Use "who" for:','things','places','people','animals only','C'),
    mc(2,'Complete: "The book ___ I bought was great."','who','whom','which / that','whose','C'),
    mc(3,'A defining relative clause:','gives extra information','is separated by commas','identifies which person/thing we mean','can always be removed','C'),
    mc(4,'A non-defining relative clause:','is essential to meaning','gives extra non-essential information','uses "that"','has no commas','B'),
    mc(5,'"It-cleft" sentence: "It was ___ who broke the window."','that','what','John','where','C'),
    mc(6,'"Wh-cleft" sentence: "___ I need is more sleep."','It','That','What','Which','C'),
    mc(7,'What does "look into" mean?','look upward','investigate/research','look downward','avoid','B'),
    mc(8,'What does "turn down" mean?','increase volume','reject','decrease slowly','turn over','B'),
    mc(9,'Correct collocation:','do a mistake','make a mistake','take a mistake','get a mistake','B'),
    mc(10,'Correct collocation:','make exercise','take exercise','do exercise','get exercise','C'),
    mc(11,'"That" in relative clauses can refer to:','people only','things only','people or things','places only','C'),
    mc(12,'Non-defining relative clauses use:','no commas','commas before and after','only "that"','no relative pronoun','B'),
    mc(13,'What does "get over" mean?','get above','recover from something','get under','get around','B'),
    mc(14,'Correct collocation:','make research','take research','do research','get research','C'),
    mc(15,'Complete: "My father, ___ is a doctor, lives in Almaty." (non-defining)','that','which','who','whose','C'),
    tf(16,'"That" can be used in non-defining relative clauses.','false'),
    tf(17,'Cleft sentences add emphasis to a specific element.','true'),
    tf(18,'"Make a mistake" is the correct collocation.','true'),
    fb(19,'The woman ___ (who) helped me was kind. She ___ (took) ___ (up) painting last year.','who, took, up'),
    fb(20,'It was ___ (the teacher) who explained it. ___ (What) I find difficult is grammar.','the teacher, What'),
  ]},

  // ═══ MODULE 9: The Final Mile ═══

  '56cba216-4c7a-438d-80dd-215173607145':{pass_threshold:70,questions:[  // Grammar Review I — Tenses & Conditionals
    mc(1,'Present Perfect: "She ___ (visit) Paris twice."','visited','visits','has visited','had visited','C'),
    mc(2,'Complete: "I have lived here ___ 2019."','for','during','since','ago','C'),
    mc(3,'Zero Conditional: "If you heat water, it ___ (boil)."','boils','will boil','boiled','would boil','A'),
    mc(4,'First Conditional: "If she studies, she ___ (pass)."','pass','passed','will pass','would pass','C'),
    mc(5,'Second Conditional: "If I ___ (be) rich, I would travel."','am','is','was/were','will be','C'),
    mc(6,'Past Simple vs PP: "She ___ (win) last year." (specific time)','has won','won','wins','will win','B'),
    mc(7,'Complete: "I wish I ___ (speak) Chinese." (I can\'t)','spoke','speak','will speak','am speaking','A'),
    mc(8,'Complete: "If only I ___ (study) harder then!" (past regret)','studied','study','had studied','would study','C'),
    mc(9,'Correct sentence:','I have seen him yesterday.','I saw him yesterday.','I have saw him.','I seen him.','B'),
    mc(10,'Complete: "She ___ (win, PP) three times so far."','won','has won','wins','had won','B'),
    tf(11,'"For" is used with a period of time; "since" with a starting point.','true'),
    tf(12,'First Conditional uses past simple in the if-clause.','false'),
    tf(13,'"I wish I were taller" correctly expresses a present wish.','true'),
    fb(14,'If I ___ (be, 2nd cond.) a doctor, I would help people. If it ___ (rain, 1st cond.), I will stay home.','were, rains'),
    fb(15,'She ___ (live, PP) here since 2020. I wish I ___ (know) the answer now.','has lived, knew'),
  ]},

  '410b6f28-bfa0-4e5f-a4a6-e887de5f9a48':{pass_threshold:70,questions:[  // Grammar Review II — Passives & Reported Speech
    mc(1,'Passive formed with:','subject + have + pp','subject + be + pp','subject + do + pp','subject + will + pp','B'),
    mc(2,'Change to passive: "They built this bridge in 1990."','This bridge was built in 1990.','This bridge built in 1990.','This bridge is built in 1990.','This bridge has been built.','A'),
    mc(3,'Present Passive: "Rice ___ (grow) in Asia."','grew','grows','is grown','has grown','C'),
    mc(4,'Reported: "I am tired," he said. → He said he ___ tired.','is','are','was','were','C'),
    mc(5,'"Will" in reported speech becomes:','will','shall','would','should','C'),
    mc(6,'Reported question: "Where do you live?" → She asked where I ___.','live','lived','do live','living','B'),
    mc(7,'In reported questions, the word order is:','inverted','normal statement order','depends','same as direct','B'),
    mc(8,'Change to passive: "They speak French here."','French spoken here.','French is spoken here.','French was spoken here.','French speaks here.','B'),
    mc(9,'Reported: "I will call you," he said. → He said he ___ call me.','will','shall','would','should','C'),
    mc(10,'Change: "Have you finished?" she asked. → She asked if I ___ finished.','have','had','has','having','B'),
    tf(11,'"The book wrote by Tolkien" is correct passive.','false'),
    tf(12,'Tenses shift back one tense in reported speech.','true'),
    tf(13,'"If" or "whether" introduces reported yes/no questions.','true'),
    fb(14,'English ___ (speak, present passive) worldwide. "I am happy," she said → She said she ___ (be) happy.','is spoken, was'),
    fb(15,'"I have finished," he said → He said he ___ (finish). She asked where I ___ (live).','had finished, lived'),
  ]},

  '5072d128-b4e6-4d68-919a-19a67532a60b':{pass_threshold:70,questions:[  // Vocabulary Review
    mc(1,'What does "Nevertheless" mean?','in addition','as a result','despite this / however','furthermore','C'),
    mc(2,'Formal version of "find out":','look up','discover/ascertain','check','figure out','B'),
    mc(3,'What does "elaborate" mean?','summarise','repeat','explain in more detail','simplify','C'),
    mc(4,'What does "liaison" mean in pronunciation?','dropping sounds','linking words together in speech','stressing syllables','speaking slowly','B'),
    mc(5,'Correct collocation:','make research','do research','take research','get research','B'),
    mc(6,'What does "get over" mean?','get above','recover from','get under','avoid','B'),
    mc(7,'What does "infer" mean?','state directly','read quickly','draw a conclusion from available information','summarise a text','C'),
    mc(8,'What does "skimming" mean?','reading every word','reading for specific info','reading quickly for the general idea','reading aloud','C'),
    mc(9,'What does "it-cleft" do?','creates passive','emphasises a specific element of a sentence','reports speech','creates a relative clause','B'),
    mc(10,'Formal for "start":','kick off','commence/begin','get going','start up','B'),
    tf(11,'"NB" stands for "nota bene" — an important note.','true'),
    tf(12,'"Turn down" means to increase something.','false'),
    tf(13,'"In my view" is used to express a personal opinion.','true'),
    fb(14,'"eg" = "___ (for example)". "ie" = "___ (that is)".','for example, that is'),
    fb(15,'___ (Skimming) = general overview. ___ (Scanning) = specific information.','Skimming, Scanning'),
  ]},

  '895b62b7-c6b5-4a5d-b9e3-17469be3bd5a':{pass_threshold:70,questions:[  // Reading Practice — IELTS Style
    mc(1,'In IELTS reading, "True/False/Not Given" means:','T=correct, F=wrong, NG=not mentioned','T=likely, F=unlikely, NG=unknown','T=always, F=never, NG=sometimes','T=correct, F=opposite, NG=irrelevant','A'),
    mc(2,'Read: "Although the study had limitations, its findings were significant." — What does "although" signal?','addition','contrast/concession','result','reason','B'),
    mc(3,'Read: "The data suggests that further research is needed." — "Suggests" indicates:','certainty','a command','hedging/uncertainty','a question','C'),
    mc(4,'Read: "Consequently, the project was cancelled." — What does "consequently" signal?','contrast','addition','result/consequence','reason','C'),
    mc(5,'Read: "The author implies that..." — "Implies" means:','states directly','suggests without directly saying','asks about','proves','B'),
    mc(6,'Read: "Despite the challenges, they succeeded." — "Despite" shows:','reason','addition','contrast/concession','result','C'),
    mc(7,'In IELTS matching headings, you should:','read every word carefully first','skim paragraphs and match main ideas to headings','read only the first sentence','only look at the heading list','B'),
    mc(8,'Read: "It can be argued that technology has transformed education." — This is an example of:','a definite fact','hedging language','a conclusion','a definition','B'),
    mc(9,'Read: "Nevertheless, the results were promising." — "Nevertheless" means:','in addition','therefore','despite this/however','because of this','C'),
    mc(10,'In a "matching information" IELTS task, you need to:','find specific details in paragraphs','match headings to paragraphs','answer True/False','summarise the text','A'),
    tf(11,'"Not Given" in IELTS True/False/Not Given means the information is not mentioned in the text.','true'),
    tf(12,'"Despite" introduces a result.','false'),
    tf(13,'Hedging language (may, suggests, appears) is common in academic texts.','true'),
    fb(14,'"Although" signals ___ (contrast). "Therefore" signals ___ (result).','contrast, result'),
    fb(15,'"Consequently" = ___ (result signal). "Nevertheless" = ___ (contrast/concession signal).','result, contrast / concession'),
  ]},

  'ba592041-7244-4729-b5b7-9efa492ed4b0':{pass_threshold:70,questions:[  // Listening Practice — IELTS Style
    mc(1,'In IELTS listening, "Note Completion" requires:','writing long sentences','filling gaps with words from the audio','drawing diagrams','ranking options','B'),
    mc(2,'What does "paraphrase" mean in IELTS listening?','the same words as the audio','different words that express the same idea','a translation','a quotation','B'),
    mc(3,'You hear: "The meeting has been postponed." "Postponed" means:','cancelled','moved to a later time','moved to an earlier time','confirmed','B'),
    mc(4,'You hear: "Despite the rain, the event went ahead." What does "despite" signal?','addition','contrast/concession','result','reason','B'),
    mc(5,'In IELTS listening Section 4, the topic is usually:','a conversation between two students','a social conversation','an academic monologue/lecture','a job interview','C'),
    mc(6,'You hear: "The population has risen significantly over the past decade." "Significantly" means:','slightly','noticeably/considerably','gradually','a little','B'),
    mc(7,'What should you do before each IELTS listening section begins?','write your answers immediately','read the questions carefully to predict content','close your eyes','wait and do nothing','B'),
    mc(8,'You hear: "It is estimated that..." — This is an example of:','a definite fact','hedging language','a request','a comparison','B'),
    mc(9,'You hear a number: "1,350,000" — How is this said?','one million three hundred fifty thousand','one point three five million','one million, three hundred and fifty thousand','one three five zero zero zero','C'),
    mc(10,'What is a key strategy for IELTS listening?','Translate every word','Listen for keywords and paraphrase','Write everything you hear','Guess randomly','B'),
    tf(11,'In IELTS Listening, answers often use paraphrase rather than exact words from the audio.','true'),
    tf(12,'You should write full sentences in IELTS Listening note-completion tasks.','false'),
    tf(13,'Reading questions before listening helps predict the content.','true'),
    fb(14,'"Postponed" means ___ (moved to a later time). "Significant" means ___ (considerable/notable).','moved to a later time, considerable / notable'),
    fb(15,'In IELTS Listening, answers often ___ (paraphrase) the audio. Read questions ___ (before) the audio starts.','paraphrase, before'),
  ]},

  '52ba0711-86d6-4b2f-ba4d-3395da88a157':{pass_threshold:80,questions:[  // Final Test & Certificate (25 questions)
    mc(1,'Present Perfect: "She ___ (visit) Paris twice."','visited','visits','has visited','had visited','C'),
    mc(2,'Complete: "I have lived here ___ 2019." (starting point)','for','during','since','ago','C'),
    mc(3,'Passive: "This bridge ___ (build) in 1990."','build','builds','was built','is building','C'),
    mc(4,'Change to passive: "They speak English here."','English spoken here.','English is spoken here.','English was spoken here.','English speaks here.','B'),
    mc(5,'Reported: "I am happy," she said. → She said she ___ happy.','is','are','was','were','C'),
    mc(6,'"Will" in reported speech becomes:','will','shall','would','should','C'),
    mc(7,'Zero Conditional: "If you heat water, it ___ (boil)."','boils','will boil','boiled','would boil','A'),
    mc(8,'Second Conditional: "If I ___ (be) rich, I would travel."','am','is','was/were','will be','C'),
    mc(9,'Complete: "I wish I ___ (speak) Japanese." (present wish)','speak','spoke','will speak','am speaking','B'),
    mc(10,'Gerund or infinitive: "She enjoys ___ (swim)."','swim','swims','swimming','to swimming','C'),
    mc(11,'Gerund or infinitive: "He decided ___ (leave) early."','leaving','leave','to leave','left','C'),
    mc(12,'Which modal expresses strong obligation?','can','might','must/have to','should','C'),
    mc(13,'Which modal expresses possibility?','must','can','could/might','should','C'),
    mc(14,'Complete: "The woman ___ (who/which) helped me was kind." (relative clause)','which','that','who','whose','C'),
    mc(15,'Non-defining relative clause: "My father, ___ is a doctor, lives here."','that','which','who','whose','C'),
    mc(16,'What does "look into" mean?','look upward','investigate','look downward','avoid','B'),
    mc(17,'Correct collocation:','do a mistake','make a mistake','take a mistake','get a mistake','B'),
    mc(18,'"Skimming" is used for:','finding specific info','reading every word','getting a general overview','reading aloud','C'),
    mc(19,'Which connector shows contrast?','Furthermore','In addition','However / Nevertheless','Therefore','C'),
    mc(20,'Cleft sentence: "___ I need is more sleep." (Wh-cleft)','It','That','What','Which','C'),
    tf(21,'"I have seen him yesterday" is correct.','false'),
    tf(22,'Present Perfect uses have/has + past participle.','true'),
    tf(23,'"That" can be used in non-defining relative clauses.','false'),
    fb(24,'If she ___ (study, 1st cond.), she will pass. If I ___ (be, 2nd cond.) taller, I would play basketball.','studies, were'),
    fb(25,'She ___ (visit, PP) Paris. He said he ___ (be) tired. (reported speech)','has visited, was'),
  ]},
}

async function main(){
  const MODULES=[
    {id:'bfc7d837-2ff5-452a-bcb2-13f9eee0fcbd',n:7,title:'Listening & Speaking'},
    {id:'a5628ce8-032a-4580-bc78-6f1df289de5c',n:8,title:'Complex Language'},
    {id:'73adba59-b4ac-4038-900e-e1a425005abe',n:9,title:'The Final Mile'},
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
  console.log(`\n✅ Готово: ${total} квизов создано для модулей 7–9 A2 Pre-Intermediate`)
}
main().catch(e=>{console.error(e);process.exit(1)})
