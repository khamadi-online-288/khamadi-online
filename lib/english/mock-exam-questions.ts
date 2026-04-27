export type QuestionType = 'mc' | 'tfng' | 'fill'

export interface MockQuestion {
  id: number
  passage: 1 | 2 | 3
  type: QuestionType
  question: string
  options?: string[]
  answer: string
}

export interface MockPassage {
  id: 1 | 2 | 3
  title: string
  text: string
}

export const MOCK_PASSAGES: MockPassage[] = [
  {
    id: 1,
    title: 'The Digital Divide and Social Inequality',
    text: `The proliferation of digital technology over the past three decades has fundamentally altered how societies function, communicate, and access knowledge. While the internet has democratised information in unprecedented ways, it has simultaneously created a new axis of social stratification known as the digital divide — the gap between those who have reliable access to digital technology and those who do not.

This divide operates across multiple dimensions. The most visible is the infrastructure gap: in many developing regions, reliable broadband connectivity remains prohibitively expensive or simply unavailable. Even within affluent nations, rural communities frequently lag behind urban centres in terms of connection speed and reliability. A household without stable internet access finds itself progressively excluded from an economy increasingly organised around digital services, remote employment, and online education.

Beyond access, however, lies a subtler but equally significant dimension: digital literacy. Possessing a device and a connection does not automatically translate into the ability to use these tools productively. Research consistently demonstrates that individuals from lower socioeconomic backgrounds, older generations, and communities with limited educational resources are less equipped to critically evaluate online information, navigate complex digital systems, or exploit the full range of opportunities that digital platforms offer.

The consequences of this disparity are compounding. During the COVID-19 pandemic, for instance, the shift to remote work and online schooling exposed and deepened existing inequalities. Students without devices or internet access at home fell dramatically behind their connected peers, effects that educators and sociologists predict will reverberate throughout these individuals' economic trajectories for years to come.

Governments and international organisations have responded with varying degrees of urgency. Some nations have pursued ambitious digital inclusion programmes, subsidising connectivity for low-income households and integrating digital skills training into public education curricula. Others have treated the issue as peripheral, assuming market forces will eventually resolve infrastructure deficits. The evidence increasingly suggests, however, that without deliberate structural intervention, the digital divide will continue to mirror and magnify pre-existing social inequalities, creating a self-reinforcing cycle of disadvantage.`,
  },
  {
    id: 2,
    title: 'Ocean Acidification: A Silent Crisis',
    text: `Beneath the surface of the world's oceans, a chemical transformation is underway that scientists describe as one of the most significant environmental threats of the twenty-first century. Ocean acidification — the ongoing decrease in the pH of the Earth's oceans — is a direct consequence of the absorption of atmospheric carbon dioxide produced by human industrial activity.

Since the Industrial Revolution, oceans have absorbed approximately 30 percent of all anthropogenic carbon dioxide emissions. When carbon dioxide dissolves in seawater, it forms carbonic acid, which subsequently dissociates to release hydrogen ions, lowering the ocean's pH. Pre-industrial ocean pH averaged around 8.2; today it stands at approximately 8.1, representing a 26 percent increase in acidity. If current emission trajectories continue, models project a further decline to 7.8 by the end of this century.

The biological implications of this acidification are profound. Marine organisms that rely on calcium carbonate to build shells and skeletal structures — including oysters, mussels, sea urchins, and corals — face severe physiological stress as carbonate ions, essential for shell formation, become increasingly scarce in more acidic waters. Laboratory studies have documented reduced shell thickness, impaired growth rates, and elevated mortality in affected species. Coral reefs, which support approximately 25 percent of all marine species despite covering less than one percent of the ocean floor, are particularly vulnerable.

The economic ramifications extend well beyond ecological concern. Global fisheries and aquaculture industries, which provide livelihoods for hundreds of millions of people and a primary protein source for over a billion, are integrally dependent on the health of marine ecosystems. Preliminary economic analyses suggest that the decline of shellfish industries alone could cost billions of dollars annually within decades.

Mitigation strategies focus primarily on reducing carbon emissions, but some researchers are exploring more direct interventions, including the addition of alkaline substances to localised marine environments to counteract acidification. These approaches remain experimental and carry their own ecological risks. The scientific consensus is unambiguous: without substantial reductions in global carbon emissions, ocean acidification will continue to accelerate, with consequences for marine biodiversity, food security, and coastal economies that are difficult to overstate.`,
  },
  {
    id: 3,
    title: 'The Science of Learning: Memory, Practice, and the Brain',
    text: `Understanding how the human brain acquires and retains knowledge has been one of the most productive frontiers of cognitive science over the past half century. Research in this domain has not only illuminated the neural mechanisms underlying memory formation but has also generated practical insights that challenge many deeply entrenched assumptions about effective pedagogy.

Central to contemporary learning science is the concept of consolidation — the process by which newly acquired information is stabilised into long-term memory. Consolidation occurs most robustly during sleep, when the hippocampus replays recently encoded experiences and transfers representations to the neocortex for durable storage. This finding has significant implications for study habits: cramming the night before an examination, while capable of supporting short-term recall, consistently produces inferior long-term retention compared to distributed practice spread across multiple sessions.

The spacing effect — the empirically robust finding that information is better retained when study is distributed over time rather than massed — is among the most replicated phenomena in psychological research. Yet educational systems worldwide continue to organise curricula around intensive examination preparation, seemingly indifferent to this evidence. Similarly, the testing effect — the observation that actively retrieving information from memory strengthens retention more effectively than equivalent time spent re-reading — has been demonstrated across diverse subject domains and age groups, yet passive re-reading remains the dominant study strategy among students globally.

Interleaving, another evidence-based learning strategy, involves alternating between different topics or problem types during a study session rather than completing all practice in one category before moving to the next. Although interleaving typically produces worse performance during the practice phase itself, it consistently yields superior performance on delayed tests of transfer, suggesting that the apparent difficulty of interleaved practice facilitates more robust learning.

These findings collectively point toward a central principle: the conditions that produce the most comfortable, fluent learning experience in the short term are frequently not those that produce the most durable knowledge. Effective learning, it appears, is inherently difficult — a conclusion that has profound implications for how educational institutions design curricula and how students approach their own study.`,
  },
]

export const MOCK_QUESTIONS: MockQuestion[] = [
  // PASSAGE 1 — Technology & Society (13 questions)
  { id:1,  passage:1, type:'mc',   question:'What is the primary cause of the digital divide according to the text?',                              options:['Lack of interest in technology','Infrastructure gaps and digital literacy differences','Government policies','High cost of devices'],                             answer:'Infrastructure gaps and digital literacy differences' },
  { id:2,  passage:1, type:'mc',   question:'Which groups are identified as having lower digital literacy?',                                        options:['Urban professionals','Young people only','Lower socioeconomic backgrounds and older generations','All rural communities'],                    answer:'Lower socioeconomic backgrounds and older generations' },
  { id:3,  passage:1, type:'mc',   question:'What does the text say happened during the COVID-19 pandemic?',                                        options:['Technology improved education for all','The digital divide was eliminated','Existing inequalities were exposed and deepened','Remote work became equally accessible'], answer:'Existing inequalities were exposed and deepened' },
  { id:4,  passage:1, type:'mc',   question:'What approach do some governments take regarding the digital divide?',                                  options:['Treating it as a top priority','Assuming markets will resolve it','Banning social media','Taxing technology companies'],                                           answer:'Assuming markets will resolve it' },
  { id:5,  passage:1, type:'mc',   question:'What does the author suggest without deliberate intervention?',                                        options:['Technology will become cheaper','The divide will mirror social inequalities','New solutions will emerge','Young people will benefit most'],                    answer:'The divide will mirror social inequalities' },
  { id:6,  passage:1, type:'tfng', question:'Broadband connectivity is equally available in rural and urban areas in all countries.',               options:['True','False','Not Given'],                                                                                                                               answer:'False' },
  { id:7,  passage:1, type:'tfng', question:'Digital literacy only refers to having access to a device and internet connection.',                   options:['True','False','Not Given'],                                                                                                                               answer:'False' },
  { id:8,  passage:1, type:'tfng', question:'The COVID-19 pandemic created the digital divide for the first time.',                                 options:['True','False','Not Given'],                                                                                                                               answer:'False' },
  { id:9,  passage:1, type:'tfng', question:'Some governments subsidise internet access for low-income households.',                                options:['True','False','Not Given'],                                                                                                                               answer:'True' },
  { id:10, passage:1, type:'tfng', question:'The author believes market forces are sufficient to eliminate the digital divide.',                    options:['True','False','Not Given'],                                                                                                                               answer:'False' },
  { id:11, passage:1, type:'mc',   question:'The word "proliferation" in paragraph 1 is closest in meaning to:',                                   options:['decline','widespread growth','regulation','invention'],                                                                                                   answer:'widespread growth' },
  { id:12, passage:1, type:'mc',   question:'The phrase "compounding consequences" suggests the effects of the digital divide are:',               options:['temporary','getting worse over time','being resolved','unpredictable'],                                                                                    answer:'getting worse over time' },
  { id:13, passage:1, type:'mc',   question:'The author\'s overall stance on the digital divide can best be described as:',                        options:['optimistic','neutral','concerned','dismissive'],                                                                                                          answer:'concerned' },

  // PASSAGE 2 — Ecology & Climate (13 questions)
  { id:14, passage:2, type:'mc',   question:'What is ocean acidification primarily caused by?',                                                     options:['Plastic pollution','Absorption of carbon dioxide','Nuclear waste','Overfishing'],                                                                         answer:'Absorption of carbon dioxide' },
  { id:15, passage:2, type:'mc',   question:'What percentage of human CO2 emissions have oceans absorbed since industrialisation?',                 options:['10 percent','20 percent','30 percent','50 percent'],                                                                                                      answer:'30 percent' },
  { id:16, passage:2, type:'mc',   question:'Which organisms are most directly threatened by ocean acidification?',                                 options:['Deep-sea fish','Shell-forming marine organisms','Migratory birds','Freshwater species'],                                                                    answer:'Shell-forming marine organisms' },
  { id:17, passage:2, type:'mc',   question:'What percentage of marine species do coral reefs support?',                                           options:['10 percent','15 percent','25 percent','40 percent'],                                                                                                      answer:'25 percent' },
  { id:18, passage:2, type:'mc',   question:'What is the primary mitigation strategy mentioned in the text?',                                       options:['Adding alkaline substances','Reducing carbon emissions','Banning fishing','Planting seaweed'],                                                          answer:'Reducing carbon emissions' },
  { id:19, passage:2, type:'tfng', question:'Ocean pH has increased since pre-industrial times.',                                                   options:['True','False','Not Given'],                                                                                                                               answer:'False' },
  { id:20, passage:2, type:'tfng', question:'Laboratory studies confirm that acidification reduces shell thickness in some species.',               options:['True','False','Not Given'],                                                                                                                               answer:'True' },
  { id:21, passage:2, type:'tfng', question:'Ocean acidification only affects organisms in tropical regions.',                                      options:['True','False','Not Given'],                                                                                                                               answer:'Not Given' },
  { id:22, passage:2, type:'tfng', question:'Adding alkaline substances to the ocean is a proven, widely used solution.',                          options:['True','False','Not Given'],                                                                                                                               answer:'False' },
  { id:23, passage:2, type:'tfng', question:'Over one billion people depend on marine sources as their primary protein.',                          options:['True','False','Not Given'],                                                                                                                               answer:'True' },
  { id:24, passage:2, type:'fill', question:'When CO2 dissolves in seawater, it forms ___.', answer:'carbonic acid' },
  { id:25, passage:2, type:'fill', question:'The pre-industrial average ocean pH was approximately ___.', answer:'8.2' },
  { id:26, passage:2, type:'fill', question:'Coral reefs cover less than ___ percent of the ocean floor.', answer:'one' },

  // PASSAGE 3 — Psychology & Education (14 questions)
  { id:27, passage:3, type:'mc',   question:'When does memory consolidation most effectively occur according to the text?',                         options:['During intensive study','During sleep','During exercise','During morning hours'],                                                                          answer:'During sleep' },
  { id:28, passage:3, type:'mc',   question:'What is the "spacing effect"?',                                                                       options:['Studying in a quiet space','Distributing study over time produces better retention','Taking longer breaks','Using larger textbooks'],                    answer:'Distributing study over time produces better retention' },
  { id:29, passage:3, type:'mc',   question:'What is the "testing effect"?',                                                                       options:['Taking more exams improves grades','Actively retrieving information strengthens retention','Tests cause anxiety','Multiple-choice tests are most effective'], answer:'Actively retrieving information strengthens retention' },
  { id:30, passage:3, type:'mc',   question:'What is interleaving?',                                                                               options:['Studying only one topic at a time','Alternating between different topics during study','Reading textbooks repeatedly','Using multiple textbooks'],          answer:'Alternating between different topics during study' },
  { id:31, passage:3, type:'mc',   question:'What does interleaving typically produce during the practice phase?',                                  options:['Better performance','Worse performance','No change','Faster completion'],                                                                                 answer:'Worse performance' },
  { id:32, passage:3, type:'mc',   question:'What is the central principle the findings point to?',                                                 options:['Easy learning produces durable knowledge','The most comfortable learning is not the most effective','Technology improves learning outcomes','Sleep is the most important factor'], answer:'The most comfortable learning is not the most effective' },
  { id:33, passage:3, type:'tfng', question:'Cramming the night before an exam is highly effective for long-term retention.',                       options:['True','False','Not Given'],                                                                                                                               answer:'False' },
  { id:34, passage:3, type:'tfng', question:'The spacing effect has only been demonstrated in language learning contexts.',                         options:['True','False','Not Given'],                                                                                                                               answer:'False' },
  { id:35, passage:3, type:'tfng', question:'Most students globally prefer re-reading as their dominant study strategy.',                          options:['True','False','Not Given'],                                                                                                                               answer:'True' },
  { id:36, passage:3, type:'tfng', question:'Interleaving produces better results than blocked practice on delayed tests.',                        options:['True','False','Not Given'],                                                                                                                               answer:'True' },
  { id:37, passage:3, type:'tfng', question:'Educational systems worldwide have fully adopted evidence-based learning strategies.',                 options:['True','False','Not Given'],                                                                                                                               answer:'False' },
  { id:38, passage:3, type:'fill', question:'The hippocampus replays experiences during ___ for memory consolidation.', answer:'sleep' },
  { id:39, passage:3, type:'fill', question:'The practice of alternating between different topics during a session is called ___.', answer:'interleaving' },
  { id:40, passage:3, type:'fill', question:'Actively retrieving information from memory is more effective than ___.', answer:'re-reading' },
]

export function getBandScore(score: number): number {
  if (score >= 39) return 9.0
  if (score >= 37) return 8.5
  if (score >= 35) return 8.0
  if (score >= 33) return 7.5
  if (score >= 30) return 7.0
  if (score >= 27) return 6.5
  if (score >= 23) return 6.0
  if (score >= 19) return 5.5
  if (score >= 15) return 5.0
  if (score >= 13) return 4.5
  return 4.0
}
