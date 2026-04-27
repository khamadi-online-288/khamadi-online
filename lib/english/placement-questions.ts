export interface PlacementQuestion {
  id: number
  section: 'grammar' | 'reading' | 'vocabulary'
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  question: string
  passage?: string
  options: string[]
  answer: string
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // GRAMMAR — 20 questions
  { id:1,  section:'grammar', level:'A1', question:'I ___ a student.', options:['am','is','are','be'], answer:'am' },
  { id:2,  section:'grammar', level:'A1', question:'She ___ from Kazakhstan.', options:['come','comes','is come','coming'], answer:'comes' },
  { id:3,  section:'grammar', level:'A1', question:'There ___ two books on the table.', options:['is','are','am','be'], answer:'are' },
  { id:4,  section:'grammar', level:'A1', question:'___ you like coffee?', options:['Do','Does','Are','Is'], answer:'Do' },
  { id:5,  section:'grammar', level:'A2', question:'I ___ TV when she called.', options:['watched','was watching','have watched','watch'], answer:'was watching' },
  { id:6,  section:'grammar', level:'A2', question:'She has lived here ___ 2010.', options:['for','since','from','during'], answer:'since' },
  { id:7,  section:'grammar', level:'A2', question:'___ more tea?', options:['Do you want','Would you like','Are you wanting','Will you like'], answer:'Would you like' },
  { id:8,  section:'grammar', level:'A2', question:'The book is ___ interesting than the film.', options:['more','most','much','very'], answer:'more' },
  { id:9,  section:'grammar', level:'B1', question:'If I ___ you, I would study harder.', options:['am','was','were','be'], answer:'were' },
  { id:10, section:'grammar', level:'B1', question:'The report ___ by tomorrow.', options:['will finish','will be finished','is finishing','finishes'], answer:'will be finished' },
  { id:11, section:'grammar', level:'B1', question:'I wish I ___ speak French better.', options:['can','could','would','should'], answer:'could' },
  { id:12, section:'grammar', level:'B1', question:'Despite ___ tired, she continued working.', options:['be','been','being','to be'], answer:'being' },
  { id:13, section:'grammar', level:'B2', question:'Had she studied harder, she ___ the exam.', options:['would pass','would have passed','had passed','will pass'], answer:'would have passed' },
  { id:14, section:'grammar', level:'B2', question:'___ the rain, the match continued.', options:['Despite of','In spite','Despite','Although'], answer:'Despite' },
  { id:15, section:'grammar', level:'B2', question:'She ___ for the company for ten years before she retired.', options:['worked','has worked','had worked','was working'], answer:'had worked' },
  { id:16, section:'grammar', level:'B2', question:'The suspect is alleged ___ the building.', options:['entering','to enter','to have entered','having entered'], answer:'to have entered' },
  { id:17, section:'grammar', level:'C1', question:'Not only ___ late, but he also forgot the documents.', options:['he was','was he','he is','is he'], answer:'was he' },
  { id:18, section:'grammar', level:'C1', question:'___ she may be, she still makes mistakes.', options:['Intelligent as','As intelligent','However intelligent','Despite intelligent'], answer:'However intelligent' },
  { id:19, section:'grammar', level:'C1', question:'The findings ___ to suggest a new approach is needed.', options:['appear','are appeared','have appeared','appearing'], answer:'appear' },
  { id:20, section:'grammar', level:'C1', question:'I would rather you ___ about this to anyone.', options:['not talk','not talked','not to talk','not talking'], answer:'not talked' },

  // VOCABULARY — 20 questions
  { id:21, section:'vocabulary', level:'A1', question:'What is the opposite of "hot"?', options:['warm','cold','cool','mild'], answer:'cold' },
  { id:22, section:'vocabulary', level:'A1', question:'Which word means "very big"?', options:['tiny','huge','narrow','shallow'], answer:'huge' },
  { id:23, section:'vocabulary', level:'A1', question:'I ___ to the gym every morning.', options:['go','went','goes','going'], answer:'go' },
  { id:24, section:'vocabulary', level:'A1', question:'The ___ shines in the sky during the day.', options:['moon','star','sun','cloud'], answer:'sun' },
  { id:25, section:'vocabulary', level:'A2', question:'She felt ___ after running 5km.', options:['exhausted','bored','curious','anxious'], answer:'exhausted' },
  { id:26, section:'vocabulary', level:'A2', question:'The company ___ 200 new employees last year.', options:['hired','fired','resigned','retired'], answer:'hired' },
  { id:27, section:'vocabulary', level:'A2', question:'What does "frequently" mean?', options:['rarely','sometimes','often','never'], answer:'often' },
  { id:28, section:'vocabulary', level:'A2', question:'The weather forecast ___ heavy rain tomorrow.', options:['predicts','prevents','produces','protests'], answer:'predicts' },
  { id:29, section:'vocabulary', level:'B1', question:'The new policy will ___ all employees equally.', options:['affect','effect','infect','reflect'], answer:'affect' },
  { id:30, section:'vocabulary', level:'B1', question:'She made a ___ decision without thinking carefully.', options:['hasty','lengthy','steady','timely'], answer:'hasty' },
  { id:31, section:'vocabulary', level:'B1', question:'The scientist made a ___ discovery that changed medicine.', options:['groundbreaking','heartbreaking','breathtaking','painstaking'], answer:'groundbreaking' },
  { id:32, section:'vocabulary', level:'B1', question:'He tends to ___ problems rather than solve them.', options:['avoid','enjoy','create','discuss'], answer:'avoid' },
  { id:33, section:'vocabulary', level:'B2', question:'The report was ___ in its analysis of the data.', options:['comprehensive','comprehensible','comprehending','comprehended'], answer:'comprehensive' },
  { id:34, section:'vocabulary', level:'B2', question:'The government ___ strict measures to control inflation.', options:['implemented','improvised','imitated','implicated'], answer:'implemented' },
  { id:35, section:'vocabulary', level:'B2', question:'Her argument was so ___ that everyone agreed immediately.', options:['compelling','compiling','competing','composing'], answer:'compelling' },
  { id:36, section:'vocabulary', level:'B2', question:'The new regulation will ___ small businesses significantly.', options:['hinder','hasten','promote','ignore'], answer:'hinder' },
  { id:37, section:'vocabulary', level:'C1', question:'The politician\'s speech was full of ___ designed to mislead voters.', options:['rhetoric','empathy','sincerity','clarity'], answer:'rhetoric' },
  { id:38, section:'vocabulary', level:'C1', question:'The research findings were ___ by three independent studies.', options:['corroborated','elaborated','generated','moderated'], answer:'corroborated' },
  { id:39, section:'vocabulary', level:'C1', question:'Her ___ approach to management inspired her entire team.', options:['pragmatic','dogmatic','systematic','diplomatic'], answer:'pragmatic' },
  { id:40, section:'vocabulary', level:'C1', question:'The treaty was designed to ___ tensions between the two nations.', options:['alleviate','aggravate','alienate','allocate'], answer:'alleviate' },

  // READING — 20 questions
  { id:41, section:'reading', level:'A1',
    passage:'My name is Sarah. I am 22 years old. I am a student at Almaty University. I study English and French. I live with my parents in a small apartment. Every morning I take the bus to university. I have classes from 9am to 3pm. After classes, I go to the library to study.',
    question:'Where does Sarah study?', options:['At home','At Almaty University','At a language school','Online'], answer:'At Almaty University' },
  { id:42, section:'reading', level:'A1',
    passage:'My name is Sarah. I am 22 years old. I am a student at Almaty University. I study English and French. I live with my parents in a small apartment. Every morning I take the bus to university. I have classes from 9am to 3pm. After classes, I go to the library to study.',
    question:'How does Sarah get to university?', options:['By car','By train','By bus','On foot'], answer:'By bus' },
  { id:43, section:'reading', level:'A2',
    passage:'My name is Sarah. I am 22 years old. I am a student at Almaty University. I study English and French. I live with my parents in a small apartment. Every morning I take the bus to university. I have classes from 9am to 3pm. After classes, I go to the library to study.',
    question:'What does Sarah do after classes?', options:['Goes home','Goes to the library','Meets friends','Works part-time'], answer:'Goes to the library' },
  { id:44, section:'reading', level:'A2',
    passage:'My name is Sarah. I am 22 years old. I am a student at Almaty University. I study English and French. I live with my parents in a small apartment. Every morning I take the bus to university. I have classes from 9am to 3pm. After classes, I go to the library to study.',
    question:'How many languages does Sarah study?', options:['One','Two','Three','Four'], answer:'Two' },
  { id:45, section:'reading', level:'A2',
    passage:'My name is Sarah. I am 22 years old. I am a student at Almaty University. I study English and French. I live with my parents in a small apartment. Every morning I take the bus to university. I have classes from 9am to 3pm. After classes, I go to the library to study.',
    question:'Sarah lives alone.', options:['True','False','Not stated','Partially true'], answer:'False' },
  { id:46, section:'reading', level:'B1',
    passage:'Remote work has transformed the modern workplace significantly. Studies show that employees who work from home report higher job satisfaction and productivity compared to those in traditional office settings. However, remote work also presents challenges. Many workers struggle with isolation, blurred boundaries between work and personal life, and limited opportunities for spontaneous collaboration. Companies are now experimenting with hybrid models that combine the flexibility of remote work with the social benefits of office environments.',
    question:'What do remote workers report according to the text?', options:['Lower productivity','Higher job satisfaction','More collaboration','Less flexibility'], answer:'Higher job satisfaction' },
  { id:47, section:'reading', level:'B1',
    passage:'Remote work has transformed the modern workplace significantly. Studies show that employees who work from home report higher job satisfaction and productivity compared to those in traditional office settings. However, remote work also presents challenges. Many workers struggle with isolation, blurred boundaries between work and personal life, and limited opportunities for spontaneous collaboration. Companies are now experimenting with hybrid models that combine the flexibility of remote work with the social benefits of office environments.',
    question:'What is one challenge of remote work mentioned?', options:['Low salary','Isolation','Long commutes','Strict schedules'], answer:'Isolation' },
  { id:48, section:'reading', level:'B1',
    passage:'Remote work has transformed the modern workplace significantly. Studies show that employees who work from home report higher job satisfaction and productivity compared to those in traditional office settings. However, remote work also presents challenges. Many workers struggle with isolation, blurred boundaries between work and personal life, and limited opportunities for spontaneous collaboration. Companies are now experimenting with hybrid models that combine the flexibility of remote work with the social benefits of office environments.',
    question:'What solution are companies trying?', options:['Full remote work','Returning to offices','Hybrid models','Shorter working hours'], answer:'Hybrid models' },
  { id:49, section:'reading', level:'B2',
    passage:'Artificial intelligence is rapidly reshaping industries worldwide. While proponents argue that AI will create new job categories and increase overall productivity, critics warn of significant displacement in sectors such as manufacturing, transportation, and customer service. The key challenge for governments and educational institutions is to prepare the workforce for an AI-driven economy through reskilling programmes and updated curricula. Without proactive intervention, the benefits of AI may remain concentrated among a small technological elite.',
    question:'What do critics of AI warn about?', options:['Increased productivity','Job displacement','Better education','New industries'], answer:'Job displacement' },
  { id:50, section:'reading', level:'B2',
    passage:'Artificial intelligence is rapidly reshaping industries worldwide. While proponents argue that AI will create new job categories and increase overall productivity, critics warn of significant displacement in sectors such as manufacturing, transportation, and customer service. The key challenge for governments and educational institutions is to prepare the workforce for an AI-driven economy through reskilling programmes and updated curricula. Without proactive intervention, the benefits of AI may remain concentrated among a small technological elite.',
    question:'What does the author suggest is needed to address AI impact?', options:['Banning AI','Reskilling programmes','Reducing technology','More automation'], answer:'Reskilling programmes' },
  { id:51, section:'reading', level:'B2',
    passage:'Artificial intelligence is rapidly reshaping industries worldwide. While proponents argue that AI will create new job categories and increase overall productivity, critics warn of significant displacement in sectors such as manufacturing, transportation, and customer service. The key challenge for governments and educational institutions is to prepare the workforce for an AI-driven economy through reskilling programmes and updated curricula. Without proactive intervention, the benefits of AI may remain concentrated among a small technological elite.',
    question:'AI benefits are currently shared equally.', options:['True','False','Not stated','Partially true'], answer:'False' },
  { id:52, section:'reading', level:'C1',
    passage:'The phenomenon of linguistic relativity, commonly known as the Sapir-Whorf hypothesis, posits that the language one speaks fundamentally shapes cognitive processes and perception of reality. While the strong version of this hypothesis — that language determines thought entirely — has been largely discredited, the weaker version, suggesting that language influences certain aspects of cognition, continues to attract empirical support. Cross-cultural studies have demonstrated that speakers of languages with multiple colour terms perceive colour distinctions more readily than speakers of languages with fewer such terms.',
    question:'What does the weak Sapir-Whorf hypothesis claim?', options:['Language determines thought entirely','Language has no effect on thought','Language influences certain aspects of cognition','Language and thought are unrelated'], answer:'Language influences certain aspects of cognition' },
  { id:53, section:'reading', level:'C1',
    passage:'The phenomenon of linguistic relativity, commonly known as the Sapir-Whorf hypothesis, posits that the language one speaks fundamentally shapes cognitive processes and perception of reality. While the strong version of this hypothesis — that language determines thought entirely — has been largely discredited, the weaker version, suggesting that language influences certain aspects of cognition, continues to attract empirical support. Cross-cultural studies have demonstrated that speakers of languages with multiple colour terms perceive colour distinctions more readily than speakers of languages with fewer such terms.',
    question:'What has happened to the strong version of the hypothesis?', options:['It has been proven','It has been largely discredited','It is still debated','It has been ignored'], answer:'It has been largely discredited' },
  { id:54, section:'reading', level:'C1',
    passage:'The phenomenon of linguistic relativity, commonly known as the Sapir-Whorf hypothesis, posits that the language one speaks fundamentally shapes cognitive processes and perception of reality. While the strong version of this hypothesis — that language determines thought entirely — has been largely discredited, the weaker version, suggesting that language influences certain aspects of cognition, continues to attract empirical support. Cross-cultural studies have demonstrated that speakers of languages with multiple colour terms perceive colour distinctions more readily than speakers of languages with fewer such terms.',
    question:'Speakers with more colour terms in their language ___.', options:['Speak more languages','Perceive colours more readily','Have better memory','Learn faster'], answer:'Perceive colours more readily' },
  { id:55, section:'reading', level:'C1',
    passage:'The phenomenon of linguistic relativity, commonly known as the Sapir-Whorf hypothesis, posits that the language one speaks fundamentally shapes cognitive processes and perception of reality. While the strong version of this hypothesis — that language determines thought entirely — has been largely discredited, the weaker version, suggesting that language influences certain aspects of cognition, continues to attract empirical support. Cross-cultural studies have demonstrated that speakers of languages with multiple colour terms perceive colour distinctions more readily than speakers of languages with fewer such terms.',
    question:'The Sapir-Whorf hypothesis is another name for linguistic relativity.', options:['True','False','Not stated','Partially true'], answer:'True' },
  { id:56, section:'vocabulary', level:'C1', question:'To ___ an argument means to weaken it by finding flaws.', options:['undermine','undertake','underline','understate'], answer:'undermine' },
  { id:57, section:'grammar',    level:'C1', question:'___ have I seen such dedication to a cause.', options:['Rarely','Never','Seldom','Hardly'], answer:'Seldom' },
  { id:58, section:'vocabulary', level:'B2', question:'The evidence was ___ — it could not be denied.', options:['irrefutable','irrelevant','irregular','irrational'], answer:'irrefutable' },
  { id:59, section:'grammar',    level:'B2', question:'She ___ the report by the time the meeting starts.', options:['will finish','will have finished','is finishing','has finished'], answer:'will have finished' },
  { id:60, section:'vocabulary', level:'B1', question:'The manager asked us to ___ the deadline for the project.', options:['extend','expend','expand','expose'], answer:'extend' },
]

export function calculateLevel(g: number, r: number, v: number): string {
  const total = Math.round((g + r + v) / 3)
  if (total >= 80) return 'C1'
  if (total >= 60) return 'B2'
  if (total >= 45) return 'B1'
  if (total >= 30) return 'A2'
  return 'A1'
}

export const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A1: 'Начальный уровень. Вы можете понимать и использовать знакомые повседневные выражения.',
  A2: 'Элементарный уровень. Вы можете общаться на простые темы в рутинных ситуациях.',
  B1: 'Средний уровень. Вы можете понимать основные идеи в текстах на знакомые темы.',
  B2: 'Выше среднего. Вы можете понимать сложные тексты и общаться достаточно бегло.',
  C1: 'Продвинутый уровень. Вы можете эффективно и гибко использовать язык в академической среде.',
}
