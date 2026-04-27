-- ============================================================
-- 011: B1 Intermediate — 20 modules × 8 lessons = 160 lessons
-- ============================================================

DO $$
DECLARE
  cid uuid;
  m1  uuid; m2  uuid; m3  uuid; m4  uuid; m5  uuid;
  m6  uuid; m7  uuid; m8  uuid; m9  uuid; m10 uuid;
  m11 uuid; m12 uuid; m13 uuid; m14 uuid; m15 uuid;
  m16 uuid; m17 uuid; m18 uuid; m19 uuid; m20 uuid;
BEGIN
  SELECT id INTO cid FROM english_courses
  WHERE title = 'B1 Intermediate' AND category = 'General English' LIMIT 1;

  IF cid IS NULL THEN
    RAISE EXCEPTION 'Course "B1 Intermediate" not found';
  END IF;

  DELETE FROM english_modules WHERE course_id = cid;

  -- ── Modules ─────────────────────────────────────────────────
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Real World English',       1) RETURNING id INTO m1;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Love & Relationships',     2) RETURNING id INTO m2;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Sport & Fitness',          3) RETURNING id INTO m3;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Money & Shopping',         4) RETURNING id INTO m4;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Law & Society',            5) RETURNING id INTO m5;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Modal World',              6) RETURNING id INTO m6;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Conditionals I',           7) RETURNING id INTO m7;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Reported Speech',          8) RETURNING id INTO m8;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Relative Clauses & Articles', 9) RETURNING id INTO m9;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Entertainment & Culture', 10) RETURNING id INTO m10;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Work & Career',           11) RETURNING id INTO m11;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Health & Society',        12) RETURNING id INTO m12;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Phrasal Verbs I',         13) RETURNING id INTO m13;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Phrasal Verbs II',        14) RETURNING id INTO m14;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Word Formation',          15) RETURNING id INTO m15;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Reading Skills',          16) RETURNING id INTO m16;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Writing Skills',          17) RETURNING id INTO m17;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Listening Skills',        18) RETURNING id INTO m18;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Communication Skills',    19) RETURNING id INTO m19;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'The Final Mile',          20) RETURNING id INTO m20;

  -- ── MODULE 1: Real World English ────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m1, 'Likes & Dislikes — Gerunds & Infinitives',              1, 'grammar'),
    (cid, m1, 'The World Around Us — Present Simple vs Continuous Review', 2, 'grammar'),
    (cid, m1, 'Technology Today — Present Perfect Simple',             3, 'grammar'),
    (cid, m1, 'Social Media — Present Perfect Continuous',             4, 'grammar'),
    (cid, m1, 'Action vs State Verbs — Stative Verbs',                 5, 'grammar'),
    (cid, m1, 'Online Communication — Vocabulary in Context',          6, 'vocabulary'),
    (cid, m1, 'Digital World — Collocations',                          7, 'vocabulary'),
    (cid, m1, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 2: Love & Relationships ──────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m2, 'Dating & Romance — Past Simple Review',                 1, 'grammar'),
    (cid, m2, 'Telling Stories — Past Continuous',                     2, 'grammar'),
    (cid, m2, 'When It Happened — Past Simple vs Continuous',          3, 'grammar'),
    (cid, m2, 'Already Done — Past Perfect',                           4, 'grammar'),
    (cid, m2, 'Sequence of Events — Past Perfect vs Past Simple',      5, 'grammar'),
    (cid, m2, 'Family Relationships — Vocabulary',                     6, 'vocabulary'),
    (cid, m2, 'Friendship & Trust — Idioms',                           7, 'vocabulary'),
    (cid, m2, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 3: Sport & Fitness ───────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m3, 'Sport & Training — Future Will vs Going To',            1, 'grammar'),
    (cid, m3, 'Competition — Future Continuous',                       2, 'grammar'),
    (cid, m3, 'Achievements — Future Perfect',                         3, 'grammar'),
    (cid, m3, 'Health & Fitness — Present Continuous for Future',      4, 'grammar'),
    (cid, m3, 'Sports Events — May/Might/Could for Future',            5, 'grammar'),
    (cid, m3, 'Extreme Sports — Vocabulary',                           6, 'vocabulary'),
    (cid, m3, 'Olympic Games — Collocations',                          7, 'vocabulary'),
    (cid, m3, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 4: Money & Shopping ──────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m4, 'Shopping Habits — Comparatives Review',                 1, 'grammar'),
    (cid, m4, 'Money & Finance — As...As / Not As...As',               2, 'grammar'),
    (cid, m4, 'Advertising — Persuasive Language',                     3, 'vocabulary'),
    (cid, m4, 'Consumer Society — Vocabulary',                         4, 'vocabulary'),
    (cid, m4, 'Online Shopping — Phrasal Verbs I',                     5, 'vocabulary'),
    (cid, m4, 'Banking & Saving — Formal Language',                    6, 'vocabulary'),
    (cid, m4, 'Budget & Investment — Collocations',                    7, 'vocabulary'),
    (cid, m4, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 5: Law & Society ─────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m5, 'Crime & Punishment — Passive Voice Simple',             1, 'grammar'),
    (cid, m5, 'News & Media — Passive Voice Continuous',               2, 'grammar'),
    (cid, m5, 'Natural Disasters — Passive Voice Perfect',             3, 'grammar'),
    (cid, m5, 'Social Issues — Have Something Done',                   4, 'grammar'),
    (cid, m5, 'Moral Dilemmas — Passive Voice Review',                 5, 'grammar'),
    (cid, m5, 'Justice System — Vocabulary',                           6, 'vocabulary'),
    (cid, m5, 'Human Rights — Collocations',                           7, 'vocabulary'),
    (cid, m5, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 6: Modal World ────────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m6, 'Ability & Permission — Can/Could/Be Able To',           1, 'grammar'),
    (cid, m6, 'Obligation — Must/Have To/Need To',                     2, 'grammar'),
    (cid, m6, 'Advice — Should/Ought To',                              3, 'grammar'),
    (cid, m6, 'Possibility — May/Might/Could',                         4, 'grammar'),
    (cid, m6, 'Deduction — Must/Can''t/Might',                         5, 'grammar'),
    (cid, m6, 'Criticism — Should Have/Could Have',                    6, 'grammar'),
    (cid, m6, 'Mixed Modals — Review in Context',                      7, 'grammar'),
    (cid, m6, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 7: Conditionals I ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m7, 'Always True — Zero Conditional',                        1, 'grammar'),
    (cid, m7, 'Real Situations — First Conditional',                   2, 'grammar'),
    (cid, m7, 'Unreal Situations — Second Conditional',                3, 'grammar'),
    (cid, m7, 'Past Regrets — Third Conditional',                      4, 'grammar'),
    (cid, m7, 'Wishes & Regrets — I Wish / If Only',                   5, 'grammar'),
    (cid, m7, 'Mixed Conditionals',                                    6, 'grammar'),
    (cid, m7, 'Conditional Linkers — Unless/Provided/As Long As',      7, 'grammar'),
    (cid, m7, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 8: Reported Speech ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m8, 'What They Said — Reported Statements',                  1, 'grammar'),
    (cid, m8, 'What They Asked — Reported Questions',                  2, 'grammar'),
    (cid, m8, 'What They Told Me — Reported Commands',                 3, 'grammar'),
    (cid, m8, 'Indirect Questions — Polite Questions',                 4, 'grammar'),
    (cid, m8, 'Reporting Verbs I — Say/Tell/Ask/Advise',               5, 'grammar'),
    (cid, m8, 'Reporting Verbs II — Claim/Deny/Suggest',               6, 'grammar'),
    (cid, m8, 'Reported Speech in News — Media Language',              7, 'listening'),
    (cid, m8, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 9: Relative Clauses & Articles ───────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m9, 'Defining Clauses — Who/Which/That',                     1, 'grammar'),
    (cid, m9, 'Non-defining Clauses — With Commas',                    2, 'grammar'),
    (cid, m9, 'Reduced Relative Clauses',                              3, 'grammar'),
    (cid, m9, 'Articles I — A/An vs The',                              4, 'grammar'),
    (cid, m9, 'Articles II — Zero Article',                            5, 'grammar'),
    (cid, m9, 'Articles in Context — Common Mistakes',                 6, 'grammar'),
    (cid, m9, 'Determiners — All/Both/Neither/Either',                 7, 'grammar'),
    (cid, m9, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 10: Entertainment & Culture ──────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m10, 'Television & Film — Describing & Reviewing',           1, 'vocabulary'),
    (cid, m10, 'Music & Art — Expressing Preferences',                 2, 'vocabulary'),
    (cid, m10, 'Books & Literature — Book Reviews',                    3, 'vocabulary'),
    (cid, m10, 'Advertising — Persuasive Language',                    4, 'vocabulary'),
    (cid, m10, 'Parties & Events — Inviting & Responding',             5, 'listening'),
    (cid, m10, 'Cinema Industry — Vocabulary',                         6, 'vocabulary'),
    (cid, m10, 'Cultural Differences — Idioms & Expressions',          7, 'vocabulary'),
    (cid, m10, 'Module Review & Test',                                 8, 'review');

  -- ── MODULE 11: Work & Career ─────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m11, 'Job Interviews — Formal Language',                     1, 'vocabulary'),
    (cid, m11, 'Workplace Communication — Business English',           2, 'vocabulary'),
    (cid, m11, 'Career Goals — Ambition & Achievement',                3, 'vocabulary'),
    (cid, m11, 'Work-Life Balance — Discussion Language',              4, 'listening'),
    (cid, m11, 'Professional Emails — Writing Skills',                 5, 'vocabulary'),
    (cid, m11, 'Meetings & Presentations — Vocabulary',                6, 'vocabulary'),
    (cid, m11, 'Entrepreneurship — Collocations',                      7, 'vocabulary'),
    (cid, m11, 'Module Review & Test',                                 8, 'review');

  -- ── MODULE 12: Health & Society ──────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m12, 'Health & Beauty — Lifestyle Vocabulary',               1, 'vocabulary'),
    (cid, m12, 'Mental Health — Sensitive Language',                   2, 'vocabulary'),
    (cid, m12, 'Elderly & Society — Social Issues',                    3, 'vocabulary'),
    (cid, m12, 'Education System — Discussion',                        4, 'listening'),
    (cid, m12, 'Environment — Eco Vocabulary',                         5, 'vocabulary'),
    (cid, m12, 'Climate Change — Formal Language',                     6, 'vocabulary'),
    (cid, m12, 'Global Problems — Collocations',                       7, 'vocabulary'),
    (cid, m12, 'Module Review & Test',                                 8, 'review');

  -- ── MODULE 13: Phrasal Verbs I ───────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m13, 'Get — Get up/Get on/Get over',                         1, 'vocabulary'),
    (cid, m13, 'Take — Take off/Take up/Take on',                      2, 'vocabulary'),
    (cid, m13, 'Put — Put off/Put on/Put up with',                     3, 'vocabulary'),
    (cid, m13, 'Come — Come across/Come up with',                      4, 'vocabulary'),
    (cid, m13, 'Go — Go on/Go off/Go through',                         5, 'vocabulary'),
    (cid, m13, 'Turn — Turn up/Turn down/Turn into',                   6, 'vocabulary'),
    (cid, m13, 'Mixed Phrasal Verbs — In Context',                     7, 'vocabulary'),
    (cid, m13, 'Module Review & Test',                                 8, 'review');

  -- ── MODULE 14: Phrasal Verbs II ──────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m14, 'Look — Look after/Look up/Look into',                  1, 'vocabulary'),
    (cid, m14, 'Make — Make up/Make out/Make for',                     2, 'vocabulary'),
    (cid, m14, 'Give — Give up/Give away/Give in',                     3, 'vocabulary'),
    (cid, m14, 'Break — Break up/Break down/Break into',               4, 'vocabulary'),
    (cid, m14, 'Bring — Bring up/Bring about/Bring in',                5, 'vocabulary'),
    (cid, m14, 'Call — Call off/Call for/Call on',                     6, 'vocabulary'),
    (cid, m14, 'Mixed Phrasal Verbs — In Context',                     7, 'vocabulary'),
    (cid, m14, 'Module Review & Test',                                 8, 'review');

  -- ── MODULE 15: Word Formation ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m15, 'Prefixes I — Un/Dis/In/Im',                            1, 'vocabulary'),
    (cid, m15, 'Prefixes II — Re/Over/Under/Out',                      2, 'vocabulary'),
    (cid, m15, 'Suffixes I — Tion/Sion/Ment/Ness',                     3, 'vocabulary'),
    (cid, m15, 'Suffixes II — Ful/Less/Able/Ible',                     4, 'vocabulary'),
    (cid, m15, 'Compound Words — Formation Rules',                     5, 'vocabulary'),
    (cid, m15, 'Collocations I — Common Word Partnerships',            6, 'vocabulary'),
    (cid, m15, 'Collocations II — Topic Collocations',                 7, 'vocabulary'),
    (cid, m15, 'Module Review & Test',                                 8, 'review');

  -- ── MODULE 16: Reading Skills ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m16, 'Skimming & Scanning — Reading Strategies',             1, 'vocabulary'),
    (cid, m16, 'Main Idea — Topic Sentences',                          2, 'vocabulary'),
    (cid, m16, 'Reading for Detail — Inference Skills',                3, 'vocabulary'),
    (cid, m16, 'Understanding Articles — News & Magazines',            4, 'vocabulary'),
    (cid, m16, 'Academic Texts — University Level',                    5, 'vocabulary'),
    (cid, m16, 'Opinion Pieces — Critical Reading',                    6, 'vocabulary'),
    (cid, m16, 'IELTS Reading — Exam Strategies',                      7, 'vocabulary'),
    (cid, m16, 'Module Review & Test',                                 8, 'review');

  -- ── MODULE 17: Writing Skills ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m17, 'Paragraph Structure — Topic & Supporting',             1, 'grammar'),
    (cid, m17, 'Linking Words — Conjunctions & Connectors',            2, 'grammar'),
    (cid, m17, 'Describing Data — Charts & Graphs',                    3, 'vocabulary'),
    (cid, m17, 'Informal Letters — Structure & Style',                 4, 'grammar'),
    (cid, m17, 'Formal Letters — Business Writing',                    5, 'grammar'),
    (cid, m17, 'Opinion Essays — Argument & Counter-argument',         6, 'grammar'),
    (cid, m17, 'IELTS Writing — Exam Strategies',                      7, 'grammar'),
    (cid, m17, 'Module Review & Test',                                 8, 'review');

  -- ── MODULE 18: Listening Skills ──────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m18, 'Fast Speech — Reduction & Linking',                    1, 'listening'),
    (cid, m18, 'Accents & Dialects — Awareness',                       2, 'listening'),
    (cid, m18, 'Note-Taking — Listening Strategies',                   3, 'listening'),
    (cid, m18, 'Podcasts & Radio — Real English',                      4, 'listening'),
    (cid, m18, 'Academic Lectures — University Listening',             5, 'listening'),
    (cid, m18, 'IELTS Listening — Exam Strategies',                    6, 'listening'),
    (cid, m18, 'Mixed Listening Practice',                             7, 'listening'),
    (cid, m18, 'Module Review & Test',                                 8, 'review');

  -- ── MODULE 19: Communication Skills ─────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m19, 'Expressing Opinions — Discussion Language',            1, 'listening'),
    (cid, m19, 'Agreeing & Disagreeing — Formal & Informal',           2, 'listening'),
    (cid, m19, 'Debates — Structuring Arguments',                      3, 'listening'),
    (cid, m19, 'Presentations — Public Speaking',                      4, 'vocabulary'),
    (cid, m19, 'Negotiations — Business Communication',                5, 'vocabulary'),
    (cid, m19, 'Small Talk — Social English',                          6, 'listening'),
    (cid, m19, 'Interviews — Question & Answer Practice',              7, 'listening'),
    (cid, m19, 'Module Review & Test',                                 8, 'review');

  -- ── MODULE 20: The Final Mile ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m20, 'Grammar Review I — Tenses Active & Passive',           1, 'grammar'),
    (cid, m20, 'Grammar Review II — Modals & Conditionals',            2, 'grammar'),
    (cid, m20, 'Grammar Review III — Reported Speech & Relatives',     3, 'grammar'),
    (cid, m20, 'Grammar Review IV — Articles & Word Formation',        4, 'grammar'),
    (cid, m20, 'Vocabulary Review I — Modules 1–10',                   5, 'vocabulary'),
    (cid, m20, 'Vocabulary Review II — Modules 11–19',                 6, 'vocabulary'),
    (cid, m20, 'Mock Test — IELTS Style',                              7, 'review'),
    (cid, m20, 'Final Test & Certificate',                             8, 'review');

END $$;
