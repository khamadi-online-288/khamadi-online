-- ============================================================
-- 012: B2 Upper-Intermediate — 24 modules × 8 lessons = 192 lessons
-- ============================================================

DO $$
DECLARE
  cid uuid;
  m1  uuid; m2  uuid; m3  uuid; m4  uuid; m5  uuid; m6  uuid;
  m7  uuid; m8  uuid; m9  uuid; m10 uuid; m11 uuid; m12 uuid;
  m13 uuid; m14 uuid; m15 uuid; m16 uuid; m17 uuid; m18 uuid;
  m19 uuid; m20 uuid; m21 uuid; m22 uuid; m23 uuid; m24 uuid;
BEGIN
  SELECT id INTO cid FROM english_courses
  WHERE title = 'B2 Upper-Intermediate' AND category = 'General English' LIMIT 1;

  IF cid IS NULL THEN
    RAISE EXCEPTION 'Course "B2 Upper-Intermediate" not found';
  END IF;

  DELETE FROM english_modules WHERE course_id = cid;

  -- ── Modules ─────────────────────────────────────────────────
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Emotions & Communication',   1) RETURNING id INTO m1;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Dreams & Ambitions',         2) RETURNING id INTO m2;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Tenses Mastery I',           3) RETURNING id INTO m3;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Tenses Mastery II',          4) RETURNING id INTO m4;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Friendship & People',        5) RETURNING id INTO m5;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Work & Business',            6) RETURNING id INTO m6;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Conditionals Mastery',       7) RETURNING id INTO m7;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Passive Voice Mastery',      8) RETURNING id INTO m8;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Reported Speech Mastery',    9) RETURNING id INTO m9;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Advanced Grammar I',        10) RETURNING id INTO m10;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Adrenaline & Adventure',    11) RETURNING id INTO m11;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Health & Lifestyle',        12) RETURNING id INTO m12;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Mysteries & Progress',      13) RETURNING id INTO m13;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Food & Home',               14) RETURNING id INTO m14;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Phrasal Verbs & Idioms',    15) RETURNING id INTO m15;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Word Formation Mastery',    16) RETURNING id INTO m16;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Reading Skills',            17) RETURNING id INTO m17;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Writing Skills',            18) RETURNING id INTO m18;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Listening & Speaking',      19) RETURNING id INTO m19;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Society & Global Issues',   20) RETURNING id INTO m20;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Self Expression & Identity',21) RETURNING id INTO m21;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Winners & Losers',          22) RETURNING id INTO m22;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Movement & Sport',          23) RETURNING id INTO m23;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'The Final Mile',            24) RETURNING id INTO m24;

  -- ── MODULE 1: Emotions & Communication ──────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m1, 'Impressions & Feelings — Gradable/Ungradable Adjectives', 1, 'grammar'),
    (cid, m1, 'Types of Communication — Present Perfect Review',          2, 'grammar'),
    (cid, m1, 'Body Language — Participle I (Present Participle)',        3, 'grammar'),
    (cid, m1, 'Expressing Emotions — Participle II (Past Participle)',    4, 'grammar'),
    (cid, m1, 'Misunderstandings — Stative Verbs Review',                 5, 'grammar'),
    (cid, m1, 'Difficult Conversations — Vocabulary in Context',          6, 'vocabulary'),
    (cid, m1, 'Cultural Communication — Collocations',                    7, 'vocabulary'),
    (cid, m1, 'Module Review & Test',                                     8, 'review');

  -- ── MODULE 2: Dreams & Ambitions ────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m2, 'Life Goals — Used To / Would',                            1, 'grammar'),
    (cid, m2, 'Get Used To — Be Used To',                                2, 'grammar'),
    (cid, m2, 'Dreams & Reality — I Wish / If Only / I''d Rather',       3, 'grammar'),
    (cid, m2, 'Ambitions & Achievements — Complex Object',               4, 'grammar'),
    (cid, m2, 'Success Stories — I Want You To Do',                      5, 'grammar'),
    (cid, m2, 'Role Models — Vocabulary',                                6, 'vocabulary'),
    (cid, m2, 'Amazing People — Collocations',                           7, 'vocabulary'),
    (cid, m2, 'Module Review & Test',                                    8, 'review');

  -- ── MODULE 3: Tenses Mastery I ──────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m3, 'Present Tenses Review — Active Voice',                    1, 'grammar'),
    (cid, m3, 'Present Tenses Review — Passive Voice',                   2, 'grammar'),
    (cid, m3, 'Past Tenses Review — Active Voice',                       3, 'grammar'),
    (cid, m3, 'Past Tenses Review — Passive Voice',                      4, 'grammar'),
    (cid, m3, 'Present Perfect Continuous — Have Been Doing',            5, 'grammar'),
    (cid, m3, 'Past Perfect Continuous — Had Been Doing',                6, 'grammar'),
    (cid, m3, 'Tenses in Context — Mixed Practice',                      7, 'grammar'),
    (cid, m3, 'Module Review & Test',                                    8, 'review');

  -- ── MODULE 4: Tenses Mastery II ─────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m4, 'Future Will vs Going To — Review',                        1, 'grammar'),
    (cid, m4, 'Future Continuous — Will Be Doing',                       2, 'grammar'),
    (cid, m4, 'Future Perfect — Will Have Done',                         3, 'grammar'),
    (cid, m4, 'Future Perfect Continuous — Will Have Been Doing',        4, 'grammar'),
    (cid, m4, 'Future in the Past — Was Going To',                       5, 'grammar'),
    (cid, m4, 'Present Simple & Continuous for Future',                  6, 'grammar'),
    (cid, m4, 'Future Tenses in Context — Mixed Practice',               7, 'grammar'),
    (cid, m4, 'Module Review & Test',                                    8, 'review');

  -- ── MODULE 5: Friendship & People ───────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m5, 'Best Friends Forever — Gerunds vs Infinitives I',         1, 'grammar'),
    (cid, m5, 'Friendship Vocabulary — Gerunds vs Infinitives II',       2, 'grammar'),
    (cid, m5, 'Describing People — Advanced Adjectives',                 3, 'vocabulary'),
    (cid, m5, 'Personality Types — Prefixes & Suffixes I',               4, 'vocabulary'),
    (cid, m5, 'Relationships & Trust — Idioms I',                        5, 'vocabulary'),
    (cid, m5, 'Social Circles — Collocations',                           6, 'vocabulary'),
    (cid, m5, 'Amazing People — Extended Vocabulary',                    7, 'vocabulary'),
    (cid, m5, 'Module Review & Test',                                    8, 'review');

  -- ── MODULE 6: Work & Business ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m6, 'Career & Ambition — Modal Verbs Review',                  1, 'grammar'),
    (cid, m6, 'Money & Business — Modals for Past',                      2, 'grammar'),
    (cid, m6, 'Workplace Culture — Modal Perfect',                       3, 'grammar'),
    (cid, m6, 'Professional Communication — Formal Language',            4, 'vocabulary'),
    (cid, m6, 'Business Writing — Advanced Emails',                      5, 'vocabulary'),
    (cid, m6, 'Negotiations — Business Vocabulary',                      6, 'vocabulary'),
    (cid, m6, 'Entrepreneurship — Collocations',                         7, 'vocabulary'),
    (cid, m6, 'Module Review & Test',                                    8, 'review');

  -- ── MODULE 7: Conditionals Mastery ──────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m7, 'Zero & First Conditional — Review',                       1, 'grammar'),
    (cid, m7, 'Second Conditional — Review',                             2, 'grammar'),
    (cid, m7, 'Third Conditional — Review',                              3, 'grammar'),
    (cid, m7, 'Mixed Conditionals — Type 2+3',                           4, 'grammar'),
    (cid, m7, 'Mixed Conditionals — Type 3+2',                           5, 'grammar'),
    (cid, m7, 'I Prefer / I''d Prefer / I''d Rather',                    6, 'grammar'),
    (cid, m7, 'Conditionals in Context — Mixed Practice',                7, 'grammar'),
    (cid, m7, 'Module Review & Test',                                    8, 'review');

  -- ── MODULE 8: Passive Voice Mastery ─────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m8, 'Passive Voice — All Tenses Review',                       1, 'grammar'),
    (cid, m8, 'Passive with Modals',                                     2, 'grammar'),
    (cid, m8, 'Passive with Have Something Done',                        3, 'grammar'),
    (cid, m8, 'Passive in News & Media',                                 4, 'grammar'),
    (cid, m8, 'Impersonal Passive — It Is Said That',                    5, 'grammar'),
    (cid, m8, 'Passive in Academic Writing',                             6, 'grammar'),
    (cid, m8, 'Passive Voice — Mixed Practice',                          7, 'grammar'),
    (cid, m8, 'Module Review & Test',                                    8, 'review');

  -- ── MODULE 9: Reported Speech Mastery ───────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m9, 'Reported Statements — Tense Backshift',                   1, 'grammar'),
    (cid, m9, 'Reported Questions — Word Order',                         2, 'grammar'),
    (cid, m9, 'Reported Commands — Tell/Ask/Order',                      3, 'grammar'),
    (cid, m9, 'Reporting Verbs — Advanced',                              4, 'grammar'),
    (cid, m9, 'Sequence of Tenses — Agreement',                          5, 'grammar'),
    (cid, m9, 'Reported Speech in Media',                                6, 'listening'),
    (cid, m9, 'Reported Speech — Mixed Practice',                        7, 'grammar'),
    (cid, m9, 'Module Review & Test',                                    8, 'review');

  -- ── MODULE 10: Advanced Grammar I ───────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m10, 'Relative Clauses — Advanced',                            1, 'grammar'),
    (cid, m10, 'Participle Clauses — Replacing Relative',                2, 'grammar'),
    (cid, m10, 'Articles — Advanced Usage',                              3, 'grammar'),
    (cid, m10, 'Determiners — Advanced',                                 4, 'grammar'),
    (cid, m10, 'Comparison — Advanced Forms',                            5, 'grammar'),
    (cid, m10, 'Inversion — Never Have I...',                            6, 'grammar'),
    (cid, m10, 'Emphasis — Cleft Sentences',                             7, 'grammar'),
    (cid, m10, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 11: Adrenaline & Adventure ───────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m11, 'Extreme Sports — Vocabulary',                            1, 'vocabulary'),
    (cid, m11, 'Homebody vs Adventurer — Discussion',                    2, 'listening'),
    (cid, m11, 'Travel & Adventure — Idioms II',                         3, 'vocabulary'),
    (cid, m11, 'Risk & Safety — Collocations',                           4, 'vocabulary'),
    (cid, m11, 'Stories & Anecdotes — Narrative Tenses',                 5, 'grammar'),
    (cid, m11, 'Accidents & Mishaps — Vocabulary',                       6, 'vocabulary'),
    (cid, m11, 'Survival Stories — Extended Reading',                    7, 'vocabulary'),
    (cid, m11, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 12: Health & Lifestyle ───────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m12, 'Healthy Living — Advanced Vocabulary',                   1, 'vocabulary'),
    (cid, m12, 'Addiction & Habits — Collocations',                      2, 'vocabulary'),
    (cid, m12, 'Beauty — Ungradable Adjectives',                         3, 'grammar'),
    (cid, m12, 'Mental Wellbeing — Sensitive Language',                  4, 'vocabulary'),
    (cid, m12, 'Diet & Fitness — Formal Language',                       5, 'vocabulary'),
    (cid, m12, 'Medical Vocabulary — Academic Style',                    6, 'vocabulary'),
    (cid, m12, 'Lifestyle Choices — Discussion',                         7, 'listening'),
    (cid, m12, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 13: Mysteries & Progress ─────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m13, 'Secrets & Mysteries — Speculation Language',             1, 'vocabulary'),
    (cid, m13, 'Science & Technology — Academic Vocabulary',             2, 'vocabulary'),
    (cid, m13, 'Progress & Development — Collocations',                  3, 'vocabulary'),
    (cid, m13, 'Truth or Fiction — Critical Thinking',                   4, 'listening'),
    (cid, m13, 'Conspiracy Theories — Hedging Language',                 5, 'vocabulary'),
    (cid, m13, 'Future of Technology — Predictions',                     6, 'vocabulary'),
    (cid, m13, 'Innovation — Extended Vocabulary',                       7, 'vocabulary'),
    (cid, m13, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 14: Food & Home ───────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m14, 'Gastronomic World — Food Vocabulary',                    1, 'vocabulary'),
    (cid, m14, 'Cooking Methods — Collocations',                         2, 'vocabulary'),
    (cid, m14, 'Home Sweet Home — Idioms III',                           3, 'vocabulary'),
    (cid, m14, 'Interior Design — Descriptive Language',                 4, 'vocabulary'),
    (cid, m14, 'Memories & Nostalgia — Past Tenses',                     5, 'grammar'),
    (cid, m14, 'Etiquette & Manners — Formal Language',                  6, 'vocabulary'),
    (cid, m14, 'Cultural Food — Extended Vocabulary',                    7, 'vocabulary'),
    (cid, m14, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 15: Phrasal Verbs & Idioms ───────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m15, 'Phrasal Verbs — Get/Take/Put Advanced',                  1, 'vocabulary'),
    (cid, m15, 'Phrasal Verbs — Come/Go/Turn Advanced',                  2, 'vocabulary'),
    (cid, m15, 'Phrasal Verbs — Look/Make/Give Advanced',                3, 'vocabulary'),
    (cid, m15, 'Idioms I — Emotions & Relationships',                    4, 'vocabulary'),
    (cid, m15, 'Idioms II — Work & Money',                               5, 'vocabulary'),
    (cid, m15, 'Idioms III — Life & Time',                               6, 'vocabulary'),
    (cid, m15, 'Fixed Expressions — Common Phrases',                     7, 'vocabulary'),
    (cid, m15, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 16: Word Formation Mastery ───────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m16, 'Prefixes — Advanced Usage',                              1, 'vocabulary'),
    (cid, m16, 'Suffixes — Advanced Usage',                              2, 'vocabulary'),
    (cid, m16, 'Word Formation in Context',                              3, 'vocabulary'),
    (cid, m16, 'Collocations — Advanced I',                              4, 'vocabulary'),
    (cid, m16, 'Collocations — Advanced II',                             5, 'vocabulary'),
    (cid, m16, 'Easily Confused Words — False Friends',                  6, 'vocabulary'),
    (cid, m16, 'Register — Formal vs Informal',                          7, 'vocabulary'),
    (cid, m16, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 17: Reading Skills ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m17, 'Reading Unadapted Texts — Strategies',                   1, 'vocabulary'),
    (cid, m17, 'News Articles — Critical Reading',                       2, 'vocabulary'),
    (cid, m17, 'Literary Texts — Analysis',                              3, 'vocabulary'),
    (cid, m17, 'Academic Articles — University Level',                   4, 'vocabulary'),
    (cid, m17, 'Abstract Topics — Reading Skills',                       5, 'vocabulary'),
    (cid, m17, 'IELTS/FCE Reading — Exam Strategies',                    6, 'vocabulary'),
    (cid, m17, 'Mixed Reading Practice',                                 7, 'vocabulary'),
    (cid, m17, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 18: Writing Skills ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m18, 'Advanced Essay Structure',                               1, 'grammar'),
    (cid, m18, 'Argument & Counter-argument',                            2, 'grammar'),
    (cid, m18, 'Formal & Informal Letters',                              3, 'grammar'),
    (cid, m18, 'Reports & Reviews',                                      4, 'grammar'),
    (cid, m18, 'Describing Data — Advanced Charts',                      5, 'vocabulary'),
    (cid, m18, 'Academic Writing Style',                                 6, 'grammar'),
    (cid, m18, 'IELTS/FCE Writing — Exam Strategies',                    7, 'grammar'),
    (cid, m18, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 19: Listening & Speaking ─────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m19, 'Fast Native Speech — Strategies',                        1, 'listening'),
    (cid, m19, 'News & TV Programs — Real English',                      2, 'listening'),
    (cid, m19, 'Discussions — Advanced Opinion Language',                3, 'listening'),
    (cid, m19, 'Debates — Formal Argumentation',                         4, 'listening'),
    (cid, m19, 'Presentations — Advanced Public Speaking',               5, 'vocabulary'),
    (cid, m19, 'IELTS/FCE Speaking — Exam Strategies',                   6, 'vocabulary'),
    (cid, m19, 'Mixed Listening Practice',                               7, 'listening'),
    (cid, m19, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 20: Society & Global Issues ──────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m20, 'Environment & Climate — Academic Vocabulary',            1, 'vocabulary'),
    (cid, m20, 'Global Problems — Collocations',                         2, 'vocabulary'),
    (cid, m20, 'Politics & Society — Formal Language',                   3, 'vocabulary'),
    (cid, m20, 'Education Systems — Discussion',                         4, 'listening'),
    (cid, m20, 'Poverty & Inequality — Sensitive Language',              5, 'vocabulary'),
    (cid, m20, 'Human Rights — Extended Vocabulary',                     6, 'vocabulary'),
    (cid, m20, 'Future of Society — Predictions',                        7, 'vocabulary'),
    (cid, m20, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 21: Self Expression & Identity ───────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m21, 'Who Am I? — Identity Vocabulary',                        1, 'vocabulary'),
    (cid, m21, 'Self Expression — Advanced Adjectives',                  2, 'vocabulary'),
    (cid, m21, 'Art & Creativity — Descriptive Language',                3, 'vocabulary'),
    (cid, m21, 'Fashion & Style — Collocations',                         4, 'vocabulary'),
    (cid, m21, 'Social Media Identity — Digital Vocabulary',             5, 'vocabulary'),
    (cid, m21, 'Cultural Identity — Discussion Language',                6, 'listening'),
    (cid, m21, 'Personal Values — Idioms',                               7, 'vocabulary'),
    (cid, m21, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 22: Winners & Losers ──────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m22, 'Success & Failure — Life Philosophy',                    1, 'vocabulary'),
    (cid, m22, 'Motivation & Mindset — Collocations',                    2, 'vocabulary'),
    (cid, m22, 'Overcoming Challenges — Narrative Language',             3, 'vocabulary'),
    (cid, m22, 'Competition & Fairness — Discussion',                    4, 'listening'),
    (cid, m22, 'Role Models & Inspiration — Extended Vocabulary',        5, 'vocabulary'),
    (cid, m22, 'Life Lessons — Idioms & Expressions',                    6, 'vocabulary'),
    (cid, m22, 'Growth Mindset — Academic Language',                     7, 'vocabulary'),
    (cid, m22, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 23: Movement & Sport ──────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m23, 'Sport & Competition — Advanced Vocabulary',              1, 'vocabulary'),
    (cid, m23, 'Olympic Spirit — Collocations',                          2, 'vocabulary'),
    (cid, m23, 'Extreme Challenges — Narrative Tenses',                  3, 'grammar'),
    (cid, m23, 'Body & Movement — Descriptive Language',                 4, 'vocabulary'),
    (cid, m23, 'Sport Psychology — Academic Vocabulary',                 5, 'vocabulary'),
    (cid, m23, 'Sport & Society — Discussion',                           6, 'listening'),
    (cid, m23, 'Famous Athletes — Extended Reading',                     7, 'vocabulary'),
    (cid, m23, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 24: The Final Mile ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m24, 'Grammar Review I — Tenses & Passive',                    1, 'grammar'),
    (cid, m24, 'Grammar Review II — Modals & Conditionals',              2, 'grammar'),
    (cid, m24, 'Grammar Review III — Reported Speech & Inversion',       3, 'grammar'),
    (cid, m24, 'Grammar Review IV — Articles & Comparisons',             4, 'grammar'),
    (cid, m24, 'Vocabulary Review I — Modules 1–12',                     5, 'vocabulary'),
    (cid, m24, 'Vocabulary Review II — Modules 13–23',                   6, 'vocabulary'),
    (cid, m24, 'Mock Test — IELTS/FCE Style',                            7, 'review'),
    (cid, m24, 'Final Test & Certificate',                               8, 'review');

END $$;
