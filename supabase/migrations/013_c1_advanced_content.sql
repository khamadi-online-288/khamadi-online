-- ============================================================
-- 013: C1 Advanced — 20 modules × 8 lessons = 160 lessons
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
  WHERE title = 'C1 Advanced' AND category = 'General English' LIMIT 1;

  IF cid IS NULL THEN
    RAISE EXCEPTION 'Course "C1 Advanced" not found';
  END IF;

  DELETE FROM english_modules WHERE course_id = cid;

  -- ── Modules ─────────────────────────────────────────────────
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Personality & Identity',           1) RETURNING id INTO m1;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Emotions & Feelings',              2) RETURNING id INTO m2;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Work & Workplace',                 3) RETURNING id INTO m3;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Health & Medicine',                4) RETURNING id INTO m4;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Politics & Law',                   5) RETURNING id INTO m5;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Technology & Progress',            6) RETURNING id INTO m6;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Education & Learning',             7) RETURNING id INTO m7;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Environment & Society',            8) RETURNING id INTO m8;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Conflict & Warfare',               9) RETURNING id INTO m9;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Travel & Leisure',                10) RETURNING id INTO m10;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Books, Film & Art',               11) RETURNING id INTO m11;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Food & Gastronomy',               12) RETURNING id INTO m12;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Phrasal Verbs & Idioms Mastery',  13) RETURNING id INTO m13;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Word Formation & Collocation Mastery', 14) RETURNING id INTO m14;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Advanced Grammar Consolidation',  15) RETURNING id INTO m15;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Reading Skills — CAE Level',      16) RETURNING id INTO m16;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Writing Skills — CAE Level',      17) RETURNING id INTO m17;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Listening Skills — CAE Level',    18) RETURNING id INTO m18;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Speaking Skills — CAE Level',     19) RETURNING id INTO m19;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'The Final Mile',                  20) RETURNING id INTO m20;

  -- ── MODULE 1: Personality & Identity ────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m1, 'Character & Personality — Compound Nouns',               1, 'vocabulary'),
    (cid, m1, 'Human Voice & Sounds — Discourse Markers I',             2, 'grammar'),
    (cid, m1, 'Self & Society — Ellipsis in Speech',                    3, 'grammar'),
    (cid, m1, 'Identity Crisis — Complex Object Review',                4, 'grammar'),
    (cid, m1, 'Personal Growth — Modal Perfect I (Must Have Done)',     5, 'grammar'),
    (cid, m1, 'Cultural Identity — Advanced Collocations',              6, 'vocabulary'),
    (cid, m1, 'Image & Perception — Idiomatic Expressions I',          7, 'vocabulary'),
    (cid, m1, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 2: Emotions & Feelings ───────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m2, 'Complex Emotions — Gradable/Ungradable Advanced',        1, 'grammar'),
    (cid, m2, 'Emotional Intelligence — Discourse Markers II',          2, 'grammar'),
    (cid, m2, 'Empathy & Conflict — Inversion I (Never Have I...)',     3, 'grammar'),
    (cid, m2, 'Psychological States — Modal Perfect II (Should Have Done)', 4, 'grammar'),
    (cid, m2, 'Expressing Nuance — Cleft Sentences I (What I Like Is...)', 5, 'grammar'),
    (cid, m2, 'Emotional Language — Advanced Vocabulary',               6, 'vocabulary'),
    (cid, m2, 'Reading Emotions — Collocations',                        7, 'vocabulary'),
    (cid, m2, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 3: Work & Workplace ──────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m3, 'Career Development — All Tenses Review Active',          1, 'grammar'),
    (cid, m3, 'Workplace Culture — All Tenses Review Passive',          2, 'grammar'),
    (cid, m3, 'Leadership & Management — Inversion II',                 3, 'grammar'),
    (cid, m3, 'Professional Communication — Formal Register',           4, 'vocabulary'),
    (cid, m3, 'Business Writing — Advanced Emails & Reports',           5, 'vocabulary'),
    (cid, m3, 'Negotiations — Complex Discourse Markers',               6, 'grammar'),
    (cid, m3, 'Entrepreneurship — Advanced Collocations',               7, 'vocabulary'),
    (cid, m3, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 4: Health & Medicine ─────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m4, 'Healthcare Systems — Impersonal Constructions I',        1, 'grammar'),
    (cid, m4, 'Medical Vocabulary — Impersonal Constructions II',       2, 'grammar'),
    (cid, m4, 'Mental Health — Modal Perfect III (Could Have Done)',    3, 'grammar'),
    (cid, m4, 'Sport & Performance — Complex Conditionals Review',      4, 'grammar'),
    (cid, m4, 'Diet & Wellbeing — Advanced Collocations',               5, 'vocabulary'),
    (cid, m4, 'Medical Research — Academic Language',                   6, 'vocabulary'),
    (cid, m4, 'Future of Medicine — Speculation Language',              7, 'vocabulary'),
    (cid, m4, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 5: Politics & Law ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m5, 'Political Systems — Mixed Conditionals I (2+3)',         1, 'grammar'),
    (cid, m5, 'Law & Justice — Mixed Conditionals II (3+2)',            2, 'grammar'),
    (cid, m5, 'Human Rights — Inversion in Conditionals (Were He...)',  3, 'grammar'),
    (cid, m5, 'Government & Society — Discourse Markers III',           4, 'grammar'),
    (cid, m5, 'International Relations — Formal Academic Style',        5, 'vocabulary'),
    (cid, m5, 'Democracy & Freedom — Advanced Vocabulary',              6, 'vocabulary'),
    (cid, m5, 'Conflict & Resolution — Collocations',                   7, 'vocabulary'),
    (cid, m5, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 6: Technology & Progress ─────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m6, 'Digital Revolution — Cleft Sentences II',                1, 'grammar'),
    (cid, m6, 'AI & Future — Ellipsis Advanced',                        2, 'grammar'),
    (cid, m6, 'Social Media Impact — Complex Passive Structures',       3, 'grammar'),
    (cid, m6, 'Technology Ethics — Modal Perfect Review',               4, 'grammar'),
    (cid, m6, 'Innovation & Research — Academic Vocabulary',            5, 'vocabulary'),
    (cid, m6, 'Tech & Society — Discourse Markers IV',                  6, 'grammar'),
    (cid, m6, 'Future Technology — Speculation & Hedging',              7, 'vocabulary'),
    (cid, m6, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 7: Education & Learning ──────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m7, 'Education Systems — He Was To Do / About To Do',         1, 'grammar'),
    (cid, m7, 'Ways of Learning — He Happened To Do',                   2, 'grammar'),
    (cid, m7, 'Academic Life — He Was Set To Do',                       3, 'grammar'),
    (cid, m7, 'Critical Thinking — Complex Discourse Markers',          4, 'grammar'),
    (cid, m7, 'University Skills — Academic Writing I',                 5, 'vocabulary'),
    (cid, m7, 'Research Skills — Academic Writing II',                  6, 'vocabulary'),
    (cid, m7, 'Education Future — Discussion Language',                 7, 'listening'),
    (cid, m7, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 8: Environment & Society ─────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m8, 'Climate Change — Advanced Passive Structures',           1, 'grammar'),
    (cid, m8, 'Environmental Policy — Inversion III',                   2, 'grammar'),
    (cid, m8, 'Sustainability — Complex Conditionals',                  3, 'grammar'),
    (cid, m8, 'Natural World — Discourse Markers V',                    4, 'grammar'),
    (cid, m8, 'Global Issues — Hedging Language',                       5, 'vocabulary'),
    (cid, m8, 'Social Responsibility — Academic Vocabulary',            6, 'vocabulary'),
    (cid, m8, 'Future of Planet — Speculation Language',                7, 'vocabulary'),
    (cid, m8, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 9: Conflict & Warfare ────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m9, 'Historical Conflicts — Narrative Tenses Advanced',       1, 'grammar'),
    (cid, m9, 'War & Peace — Complex Passive',                          2, 'grammar'),
    (cid, m9, 'Diplomacy — Formal Register Advanced',                   3, 'vocabulary'),
    (cid, m9, 'Humanitarian Issues — Modal Perfect Mixed',              4, 'grammar'),
    (cid, m9, 'Post-conflict Society — Discourse Markers VI',           5, 'grammar'),
    (cid, m9, 'Conflict Resolution — Academic Language',                6, 'vocabulary'),
    (cid, m9, 'Peace & Security — Collocations',                        7, 'vocabulary'),
    (cid, m9, 'Module Review & Test',                                   8, 'review');

  -- ── MODULE 10: Travel & Leisure ─────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m10, 'Travel Culture — Gerunds vs Infinitives Advanced',      1, 'grammar'),
    (cid, m10, 'Tourism Impact — Complex Conditionals',                 2, 'grammar'),
    (cid, m10, 'Leisure & Lifestyle — Ellipsis in Context',             3, 'grammar'),
    (cid, m10, 'Adventure & Risk — Modal Perfect Review',               4, 'grammar'),
    (cid, m10, 'Cultural Exchange — Idiomatic Expressions II',          5, 'vocabulary'),
    (cid, m10, 'Responsible Travel — Academic Vocabulary',              6, 'vocabulary'),
    (cid, m10, 'Future of Tourism — Speculation',                       7, 'vocabulary'),
    (cid, m10, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 11: Books, Film & Art ────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m11, 'Literary Analysis — Cleft Sentences III',               1, 'grammar'),
    (cid, m11, 'Film & Cinema — Discourse Markers VII',                 2, 'grammar'),
    (cid, m11, 'Art & Culture — Inversion IV',                          3, 'grammar'),
    (cid, m11, 'Music & Society — Complex Passive',                     4, 'grammar'),
    (cid, m11, 'Media Influence — Modal Perfect Advanced',              5, 'grammar'),
    (cid, m11, 'Creative Industry — Advanced Collocations',             6, 'vocabulary'),
    (cid, m11, 'Cultural Criticism — Academic Style',                   7, 'vocabulary'),
    (cid, m11, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 12: Food & Gastronomy ────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m12, 'Food Culture — Advanced Vocabulary',                    1, 'vocabulary'),
    (cid, m12, 'Gastronomy & Art — Descriptive Language',               2, 'vocabulary'),
    (cid, m12, 'Food Industry — Complex Passive',                       3, 'grammar'),
    (cid, m12, 'Nutrition Science — Academic Language',                 4, 'vocabulary'),
    (cid, m12, 'Global Cuisine — Collocations',                         5, 'vocabulary'),
    (cid, m12, 'Food Ethics — Discourse Markers',                       6, 'grammar'),
    (cid, m12, 'Future of Food — Speculation',                          7, 'vocabulary'),
    (cid, m12, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 13: Phrasal Verbs & Idioms Mastery ───────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m13, 'Phrasal Verbs — Advanced Get/Take/Put',                 1, 'vocabulary'),
    (cid, m13, 'Phrasal Verbs — Advanced Come/Go/Turn',                 2, 'vocabulary'),
    (cid, m13, 'Phrasal Verbs — Advanced Look/Make/Give',               3, 'vocabulary'),
    (cid, m13, 'Idioms I — Abstract Concepts',                          4, 'vocabulary'),
    (cid, m13, 'Idioms II — Professional Context',                      5, 'vocabulary'),
    (cid, m13, 'Idioms III — Social Situations',                        6, 'vocabulary'),
    (cid, m13, 'Fixed Expressions — Native-like Usage',                 7, 'vocabulary'),
    (cid, m13, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 14: Word Formation & Collocation Mastery ─────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m14, 'Compound Nouns — Advanced Formation',                   1, 'vocabulary'),
    (cid, m14, 'Prefixes — Advanced & Rare',                            2, 'vocabulary'),
    (cid, m14, 'Suffixes — Advanced & Rare',                            3, 'vocabulary'),
    (cid, m14, 'Word Formation in Academic Texts',                      4, 'vocabulary'),
    (cid, m14, 'Collocations I — Abstract Topics',                      5, 'vocabulary'),
    (cid, m14, 'Collocations II — Professional Topics',                 6, 'vocabulary'),
    (cid, m14, 'Register & Style — Formal vs Informal',                 7, 'vocabulary'),
    (cid, m14, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 15: Advanced Grammar Consolidation ───────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m15, 'All Conditionals — Mixed Practice',                     1, 'grammar'),
    (cid, m15, 'All Inversions — Mixed Practice',                       2, 'grammar'),
    (cid, m15, 'All Cleft Sentences — Mixed Practice',                  3, 'grammar'),
    (cid, m15, 'Discourse Markers — Full Review',                       4, 'grammar'),
    (cid, m15, 'Ellipsis — Full Review',                                5, 'grammar'),
    (cid, m15, 'Impersonal Constructions — Full Review',                6, 'grammar'),
    (cid, m15, 'Complex Grammar — Mixed Practice',                      7, 'grammar'),
    (cid, m15, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 16: Reading Skills — CAE Level ───────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m16, 'Complex Text Analysis — Strategies',                    1, 'vocabulary'),
    (cid, m16, 'Abstract Topics — Reading Skills',                      2, 'vocabulary'),
    (cid, m16, 'Literary Texts — Critical Analysis',                    3, 'vocabulary'),
    (cid, m16, 'Academic Articles — Advanced Level',                    4, 'vocabulary'),
    (cid, m16, 'News & Opinion — Critical Reading',                     5, 'vocabulary'),
    (cid, m16, 'Multiple Texts — Synthesis Skills',                     6, 'vocabulary'),
    (cid, m16, 'CAE Reading — Exam Strategies',                         7, 'vocabulary'),
    (cid, m16, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 17: Writing Skills — CAE Level ───────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m17, 'Advanced Essay Structure',                              1, 'grammar'),
    (cid, m17, 'Complex Argument & Counter-argument',                   2, 'grammar'),
    (cid, m17, 'Formal Reports — Structure & Style',                    3, 'grammar'),
    (cid, m17, 'Reviews & Proposals',                                   4, 'grammar'),
    (cid, m17, 'Academic Writing — Advanced Style',                     5, 'grammar'),
    (cid, m17, 'Register & Tone — Switching Styles',                    6, 'vocabulary'),
    (cid, m17, 'CAE Writing — Exam Strategies',                         7, 'grammar'),
    (cid, m17, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 18: Listening Skills — CAE Level ─────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m18, 'Fast Native Speech — Advanced Strategies',              1, 'listening'),
    (cid, m18, 'Accents & Varieties — World English',                   2, 'listening'),
    (cid, m18, 'Academic Lectures — Note-Taking Advanced',              3, 'listening'),
    (cid, m18, 'Interviews & Discussions — Real English',               4, 'listening'),
    (cid, m18, 'Podcasts & Radio — Authentic Materials',                5, 'listening'),
    (cid, m18, 'Abstract Topics — Listening Skills',                    6, 'listening'),
    (cid, m18, 'CAE Listening — Exam Strategies',                       7, 'listening'),
    (cid, m18, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 19: Speaking Skills — CAE Level ──────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m19, 'Spontaneous Speech — Fluency Training',                 1, 'listening'),
    (cid, m19, 'Abstract Topics — 4-6 Minute Monologues',              2, 'listening'),
    (cid, m19, 'Debates — Advanced Argumentation',                      3, 'listening'),
    (cid, m19, 'Discussions — Native-like Expressions',                 4, 'listening'),
    (cid, m19, 'Presentations — Advanced Public Speaking',              5, 'vocabulary'),
    (cid, m19, 'Register Switching — Formal & Informal',                6, 'vocabulary'),
    (cid, m19, 'CAE Speaking — Exam Strategies',                        7, 'listening'),
    (cid, m19, 'Module Review & Test',                                  8, 'review');

  -- ── MODULE 20: The Final Mile ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m20, 'Grammar Review I — Tenses & Passive',                   1, 'grammar'),
    (cid, m20, 'Grammar Review II — Modals & Conditionals',             2, 'grammar'),
    (cid, m20, 'Grammar Review III — Inversion & Cleft',                3, 'grammar'),
    (cid, m20, 'Grammar Review IV — Discourse & Ellipsis',              4, 'grammar'),
    (cid, m20, 'Vocabulary Review I — Modules 1–10',                    5, 'vocabulary'),
    (cid, m20, 'Vocabulary Review II — Modules 11–19',                  6, 'vocabulary'),
    (cid, m20, 'Mock Test — Full CAE Style',                            7, 'review'),
    (cid, m20, 'Final Test & Certificate',                              8, 'review');

END $$;
