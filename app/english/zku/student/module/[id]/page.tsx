'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  MOCK_A1_MODULES, MOCK_A11_MODULES, MOCK_A2_MODULES, MOCK_B1_MODULES, MOCK_B2_MODULES, MOCK_C1_MODULES,
  MOCK_LESSONS_M_B1_1, MOCK_LESSONS_M_B1_2, MOCK_LESSONS_M_B1_3, MOCK_LESSONS_M_B1_4, MOCK_LESSONS_M_B1_5, MOCK_LESSONS_M_B1_6, MOCK_LESSONS_M_B1_7, MOCK_LESSONS_M_B1_8, MOCK_LESSONS_M_B1_9, MOCK_LESSONS_M_B1_10, MOCK_LESSONS_M_B1_11, MOCK_LESSONS_M_B1_12, MOCK_LESSONS_M_B1_13, MOCK_LESSONS_M_B1_14, MOCK_LESSONS_M_B1_15, MOCK_LESSONS_M_B1_16, MOCK_LESSONS_M_B1_17, MOCK_LESSONS_M_B1_18, MOCK_LESSONS_M_B1_19, MOCK_LESSONS_M_B1_20, MOCK_LESSONS_M_B1_21, MOCK_LESSONS_M_B1_22, MOCK_LESSONS_M_B1_23, MOCK_LESSONS_M_B1_24, MOCK_LESSONS_M_B1_25, MOCK_LESSONS_M_B1_26,
  MOCK_LESSONS_M_B2_1, MOCK_LESSONS_M_B2_2, MOCK_LESSONS_M_B2_3, MOCK_LESSONS_M_B2_4, MOCK_LESSONS_M_B2_5, MOCK_LESSONS_M_B2_6, MOCK_LESSONS_M_B2_7, MOCK_LESSONS_M_B2_8, MOCK_LESSONS_M_B2_9, MOCK_LESSONS_M_B2_10, MOCK_LESSONS_M_B2_11, MOCK_LESSONS_M_B2_12, MOCK_LESSONS_M_B2_13, MOCK_LESSONS_M_B2_14, MOCK_LESSONS_M_B2_15, MOCK_LESSONS_M_B2_16, MOCK_LESSONS_M_B2_17, MOCK_LESSONS_M_B2_18, MOCK_LESSONS_M_B2_19, MOCK_LESSONS_M_B2_20, MOCK_LESSONS_M_B2_21, MOCK_LESSONS_M_B2_22, MOCK_LESSONS_M_B2_23, MOCK_LESSONS_M_B2_24, MOCK_LESSONS_M_B2_25, MOCK_LESSONS_M_B2_26,
  MOCK_LESSONS_M_C1_1, MOCK_LESSONS_M_C1_2, MOCK_LESSONS_M_C1_3, MOCK_LESSONS_M_C1_4, MOCK_LESSONS_M_C1_5, MOCK_LESSONS_M_C1_6, MOCK_LESSONS_M_C1_7, MOCK_LESSONS_M_C1_8, MOCK_LESSONS_M_C1_9, MOCK_LESSONS_M_C1_10, MOCK_LESSONS_M_C1_11, MOCK_LESSONS_M_C1_12, MOCK_LESSONS_M_C1_13, MOCK_LESSONS_M_C1_14, MOCK_LESSONS_M_C1_15, MOCK_LESSONS_M_C1_16, MOCK_LESSONS_M_C1_17, MOCK_LESSONS_M_C1_18, MOCK_LESSONS_M_C1_19, MOCK_LESSONS_M_C1_20, MOCK_LESSONS_M_C1_21, MOCK_LESSONS_M_C1_22, MOCK_LESSONS_M_C1_23, MOCK_LESSONS_M_C1_24, MOCK_LESSONS_M_C1_25, MOCK_LESSONS_M_C1_26, MOCK_LESSONS_M_C1_27, MOCK_LESSONS_M_C1_28, MOCK_LESSONS_M_C1_29, MOCK_LESSONS_M_C1_30, MOCK_LESSONS_M_C1_31, MOCK_LESSONS_M_C1_32,
  MOCK_LESSONS_M1, MOCK_LESSONS_M2, MOCK_LESSONS_M3, MOCK_LESSONS_M4, MOCK_LESSONS_M5, MOCK_LESSONS_M6, MOCK_LESSONS_M7, MOCK_LESSONS_M8, MOCK_LESSONS_M9, MOCK_LESSONS_M10, MOCK_LESSONS_M11, MOCK_LESSONS_M12, MOCK_LESSONS_M13, MOCK_LESSONS_M14, MOCK_LESSONS_M15, MOCK_LESSONS_M16, MOCK_LESSONS_M_A11_1, MOCK_LESSONS_M_A11_2, MOCK_LESSONS_M_A11_3, MOCK_LESSONS_M_A11_4, MOCK_LESSONS_M_A11_5, MOCK_LESSONS_M_A11_6, MOCK_LESSONS_M_A11_7, MOCK_LESSONS_M_A11_8, MOCK_LESSONS_M_A11_9, MOCK_LESSONS_M_A11_10, MOCK_LESSONS_M_A11_11, MOCK_LESSONS_M_A11_12, MOCK_LESSONS_M_A11_13, MOCK_LESSONS_M_A11_14, MOCK_LESSONS_M_A11_15, MOCK_LESSONS_M_A11_16, MOCK_LESSONS_M_A11_17, MOCK_LESSONS_M_A11_18, MOCK_LESSONS_M_A2_1, MOCK_LESSONS_M_A2_2, MOCK_LESSONS_M_A2_3, MOCK_LESSONS_M_A2_4, MOCK_LESSONS_M_A2_5, MOCK_LESSONS_M_A2_6, MOCK_LESSONS_M_A2_7, MOCK_LESSONS_M_A2_8, MOCK_LESSONS_M_A2_9, MOCK_LESSONS_M_A2_10, MOCK_LESSONS_M_A2_11, MOCK_LESSONS_M_A2_12, MOCK_LESSONS_M_A2_13, MOCK_LESSONS_M_A2_14, MOCK_LESSONS_M_A2_15, MOCK_LESSONS_M_A2_16, MOCK_LESSONS_M_A2_17, MOCK_LESSONS_M_A2_18, MOCK_LESSONS_M_A2_19, MOCK_LESSONS_M_A2_20, MOCK_LESSONS_M_A2_21, MOCK_LESSONS_M_A2_22, MOCK_LESSONS_M_A2_23, MOCK_LESSONS_M_A2_24,
} from '@/lib/english/mockData'
import { useZkuLang } from '../../zku-lang'
import { createEnglishClient } from '@/lib/english/supabase-client'
import {
  IcBookOpen, IcHeadphones, IcEdit, IcBook, IcTarget,
  IcCheck, IcLock, IcClock, IcStar, IcArrowRight, IcCheckCircle, IcX,
} from '../../_icons'

// ── Colors ──────────────────────────────────────────────────────
const N   = '#003876'
const G   = '#C9933B'
const T   = '#1D9E75'
const MU  = '#64748B'
const BG  = '#F4F6FA'
const BDR = 'rgba(0,56,118,0.09)'

// ── Lesson type config ───────────────────────────────────────────
type TypeCfgEntry = { label: string; color: string; bg: string; border: string; icon: React.ReactElement }
const TYPE_CFG_STARTER: Record<string, TypeCfgEntry> = {
  reading:   { label: 'Reading',    color: '#1B8FC4', bg: '#DBEAFE', border: '#93C5FD', icon: <IcBookOpen   size={18} color="#1B8FC4" /> },
  listening: { label: 'Listening',  color: '#7C3AED', bg: '#EDE9FE', border: '#C4B5FD', icon: <IcHeadphones size={18} color="#7C3AED" /> },
  grammar:   { label: 'Grammar',    color: N,         bg: '#EEF2F7', border: 'rgba(0,56,118,0.2)', icon: <IcEdit size={18} color={N} /> },
  writing:   { label: 'Writing',    color: T,         bg: '#DCFCE7', border: '#86EFAC', icon: <IcEdit       size={18} color={T} /> },
  vocabulary:{ label: 'Vocabulary', color: '#0F766E', bg: '#CCFBF1', border: '#5EEAD4', icon: <IcBook       size={18} color="#0F766E" /> },
  test:      { label: 'Final Test', color: G,         bg: '#FEF3C7', border: '#FCD34D', icon: <IcTarget     size={18} color={G} /> },
}
const TYPE_CFG_A11: Record<string, TypeCfgEntry> = {
  reading:   { label: 'Reading',    color: T, bg: '#D1FAE5', border: '#6EE7B7', icon: <IcBookOpen   size={18} color={T} /> },
  listening: { label: 'Listening',  color: T, bg: '#D1FAE5', border: '#6EE7B7', icon: <IcHeadphones size={18} color={T} /> },
  grammar:   { label: 'Grammar',    color: N, bg: '#EEF2F7', border: 'rgba(0,56,118,0.2)', icon: <IcEdit size={18} color={N} /> },
  writing:   { label: 'Writing',    color: T, bg: '#D1FAE5', border: '#6EE7B7', icon: <IcEdit       size={18} color={T} /> },
  vocabulary:{ label: 'Vocabulary', color: T, bg: '#D1FAE5', border: '#6EE7B7', icon: <IcBook       size={18} color={T} /> },
  test:      { label: 'Final Test', color: G, bg: '#FEF3C7', border: '#FCD34D', icon: <IcTarget     size={18} color={G} /> },
}

// ── Module objectives ────────────────────────────────────────────
const MODULE_OBJECTIVES: Record<string, string[]> = {
  'm-1':  ['Represent yourself in English', 'Ask basic questions (name, age, city)', 'Use am / is / are correctly', 'Write a short personal profile'],
  'm-2':  ['Talk about your family members', 'Use have / has', 'Use possessive adjectives (my, his, her)', 'Describe family relationships'],
  'm-3':  ['Name everyday objects', 'Use this / that / these / those', 'Ask "What is this?"', 'Describe your things'],
  'm-4':  ['Talk about daily routines', 'Use Present Simple tense', 'Use adverbs of frequency', 'Write about your typical day'],
  'm-5':  ["Say what you can and can't do", "Use can / can't correctly", 'Ask questions with Can you...?', 'Write about your skills and abilities'],
  'm-6':  ['Talk about hobbies and free time activities', 'Describe someone\'s hobbies (he / she + verb-s)', 'Ask "What do you do in your free time?"', 'Write a hobby profile about yourself'],
  'm-7':  ['Talk about food and drinks you like', 'Use some and any correctly', 'Ask "How much / How many?"', 'Write your food diary for one day'],
  'm-8':  ['Describe rooms and furniture in your home', 'Use there is / there are correctly', 'Ask "Is there a...? / Are there any...?"', 'Write about your home and a letter to a friend'],
  'm-9':  ['Describe what is happening right now', 'Form Present Continuous (am/is/are + verb-ing)', 'Contrast Present Simple vs Present Continuous', 'Write about your activities using -ing forms'],
  'm-10': ['Use was / were correctly in the past', 'Describe what happened yesterday', 'Ask and answer "Where were you?" and "Was it...?"', 'Write a paragraph about your day yesterday'],
  'm-11': ['Use regular Past Simple verbs (verb + -ed)', 'Talk about what you did last weekend', 'Use spelling rules: stopped, studied, played', 'Write about a past event using time expressions'],
  'm-12': ['Use prepositions of place (in, on, at, next to, between)', 'Describe where places and things are', 'Ask and answer "Where is...? / How do I get to...?"', 'Write about a trip or travel experience'],
  'm-13': ['Say and write numbers from 1 to 1,000', 'Talk about prices and money in English', 'Use "How much is it?" and "It costs..."', 'Write about your monthly student budget'],
  'm-14': ['Describe the weather using adjectives (sunny, cold, windy)', 'Talk about clothes and what you are wearing', 'Use comparative adjectives (warmer, colder, more comfortable)', 'Write about your perfect outfit for different weather'],
  'm-15': ['Use "going to" for plans and intentions', 'Talk about your future after university', 'Understand the difference between "will" and "going to"', 'Write about your plans for the next year'],
  'm-16': ['Complete the full A1 Reading & Use of English exam', 'Complete the A1 Listening exam (4 parts)', 'Complete the A1 Writing exam (2 tasks)', 'Earn your official WKU A1 English Certificate'],
  // A1.1 Elementary
  'm-a11-1':  ['Use can / can\'t to talk about present ability', 'Use could / couldn\'t for past ability', 'Ask and answer "Can you...? / Could you...?"', 'Write about your skills and goals for the future'],
  'm-a11-2':  ['Name parts of the body and common illnesses', 'Use "have got" for physical descriptions', 'Use have to / don\'t have to for obligation', 'Write a letter giving health advice to a friend'],
  'm-a11-3':  ['Use public transport vocabulary confidently', 'Give and understand directions using imperatives', 'Use prepositions of movement (along, across, past)', 'Write clear directions from one place to another'],
  'm-a11-4':  ['Distinguish countable and uncountable nouns', 'Use a / an / some / any / much / many correctly', 'Order food and ask about prices in a café', 'Write a short restaurant review with opinions'],
  'm-a11-5':  ['Talk about technology and social media habits', 'Use frequency adverbs with Present Simple', 'Use verb + infinitive: want to, need to, prefer to', 'Write a paragraph about your digital habits'],
  'm-a11-6':  ['Form superlatives: the biggest, the most beautiful', 'Use extreme adjectives: enormous, tiny, fantastic', 'Compare places and animals using superlatives', 'Write about the most amazing place you have seen'],
  'm-a11-7':  ['Tell a story using Past Simple (regular & irregular)', 'Use narrative time expressions: first, then, finally', 'Understand a spoken personal narrative', 'Write a short personal story about a past event'],
  'm-a11-8':  ['Use "used to" to describe past habits and states', 'Distinguish "used to" from simple Past Simple', 'Understand traditions and cultural celebrations', 'Write about traditions in your family or culture'],
  'm-a11-9':  ['Form Present Perfect with have / has + past participle', 'Use ever, never, already and yet correctly', 'Understand the difference between Present Perfect and Past Simple', 'Write about 5 things you have or have never done'],
  'm-a11-10': ['Use should / shouldn\'t to give advice', 'Use must / mustn\'t for rules and prohibition', 'Use have to / don\'t have to for obligation vs choice', 'Write a list of advice for a new university student'],
  'm-a11-11': ['Form zero conditional: if + present, present', 'Form first conditional: if + present, will', 'Talk about real and likely future situations', 'Write about what you will do if you pass your exams'],
  'm-a11-12': ['Use verb + -ing: enjoy, love, hate, prefer, avoid', 'Use verb + to + infinitive: want, decide, hope, plan', 'Discuss feelings and express emotions in English', 'Write a personal paragraph about your feelings and interests'],
  'm-a11-13': ['Use Present Perfect with for (duration) and since (start point)', 'Distinguish Present Perfect vs Past Simple', 'Talk about sport activities and gym routines', 'Write about your favourite sport and how long you have played it'],
  'm-a11-14': ['Use high-frequency collocations with do, make, have, take', 'Describe jobs and workplace responsibilities', 'Understand and participate in a simple job interview', 'Write a paragraph about your dream job'],
  'm-a11-15': ['Form passive voice: is/are + past participle', 'Convert active sentences to passive correctly', 'Discuss environmental problems and solutions', 'Write a short essay on what we can do for the environment'],
  'm-a11-16': ['Use too + adjective and adjective + enough', 'Describe clothes using size, colour and material', 'Talk about shopping habits and preferences', 'Write about your personal fashion style and a shopping list'],
  'm-a11-17': ['Form relative clauses using who, which and that', 'Use relative clauses to define and describe', 'Talk about films, books and cultural events', 'Write a structured review of a film or book'],
  'm-a11-18': ['Complete the full A1.1 Reading & Use of English exam', 'Complete the A1.1 Listening exam (4 parts)', 'Complete the A1.1 Writing exam (2 tasks)', 'Earn your official WKU A1.1 Elementary Certificate'],
  // A2 Pre-Intermediate
  'm-a2-1':  ['Use Present Simple and adverbs of frequency correctly', 'Form and use adverbs of manner (quickly, well)', 'Talk about your weekly routine in detail', 'Write a paragraph about your typical week at WKU'],
  'm-a2-2':  ['Form Present Continuous with am/is/are + -ing', 'Distinguish Present Continuous from Present Simple', 'Describe ongoing actions and temporary situations', 'Write about what is happening around you right now'],
  'm-a2-3':  ['Form Past Continuous with was/were + -ing', 'Use when/while with Past Continuous + Past Simple', 'Tell a story about interrupted actions in the past', 'Write a personal narrative using both past tenses'],
  'm-a2-4':  ['Use going to for plans and intentions', 'Use will for predictions and spontaneous decisions', 'Talk about future arrangements and predictions', 'Write about your plans for the next year'],
  'm-a2-5':  ['Form comparatives with -er and more + adjective', 'Form superlatives with -est and most + adjective', 'Use irregular comparative/superlative forms correctly', 'Write a comparison of two places or things you know'],
  'm-a2-6':  ['Use irregular past participles in Present Perfect', 'Use time expressions: ever, never, already, yet, just', 'Distinguish Present Perfect from Past Simple', 'Write about five important experiences in your life'],
  'm-a2-7':  ['Distinguish must/have to/don\'t have to correctly', 'Use should/ought to for giving advice', 'Use needn\'t for lack of obligation', 'Write an advice letter using all modal verbs learned'],
  'm-a2-8':  ['Use much, many, a lot of, a little, a few correctly', 'Use too much / too many / not enough in context', 'Talk about food quantities and shopping preferences', 'Write a short article about healthy eating habits'],
  'm-a2-9':  ['Form indirect questions: Could you tell me…?', 'Form and use question tags correctly', 'Ask polite questions in formal and informal contexts', 'Write a list of interview questions for a person you admire'],
  'm-a2-10': ['Use prepositions of place: at / in / on correctly', 'Use prepositions of movement: across / along / through', 'Give and understand directions using prepositions', 'Write directions from one place to another in your city'],
  'm-a2-11': ['Form Second Conditional: if + past simple, would', 'Distinguish First and Second Conditional', 'Talk about unreal/imaginary situations', 'Write about what you would do if you could change something'],
  'm-a2-12': ['Report statements using said / told + that', 'Report questions and commands in indirect speech', 'Make tense changes in reported speech', 'Write a summary of a conversation or lecture'],
  'm-a2-13': ['Use separable phrasal verbs correctly', 'Use inseparable phrasal verbs correctly', 'Recognise and use 20 common phrasal verbs', 'Write a short personal story using phrasal verbs'],
  'm-a2-14': ['Use relative clauses with who / which / where', 'Use adjective order correctly before nouns', 'Describe and define people, places and things', 'Write a detailed description of a person or place'],
  'm-a2-15': ['Form passive voice: was/were + past participle', 'Choose between active and passive correctly', 'Describe processes and events using passive voice', 'Write about how something is made or produced'],
  'm-a2-16': ['Use gerund after enjoy, mind, avoid, suggest', 'Use infinitive after decide, want, hope, manage', 'Identify when to use gerund vs infinitive', 'Write about your habits, decisions and goals this year'],
  'm-a2-17': ['Use definite article the with unique or specific nouns', 'Use zero article for general statements and names', 'Apply article rules in reading and writing contexts', 'Write an opinion paragraph about technology in education'],
  'm-a2-18': ['Name body parts and common health problems', 'Use should/shouldn\'t to give health advice', 'Use have to / don\'t have to for medical rules', 'Write an advice text about healthy student life'],
  'm-a2-19': ['Use vocabulary for travel, transport and accommodation', 'Use future forms to talk about travel plans', 'Understand and use travel collocations and fixed phrases', 'Write an ideal travel plan using future tenses'],
  'm-a2-20': ['Describe work experience using Present Perfect Continuous', 'Use have been + -ing correctly', 'Talk about jobs, careers and workplace situations', 'Write a cover letter for an internship position'],
  'm-a2-21': ['Form Past Perfect: had + past participle', 'Use sequencers: after, before, when, by the time', 'Understand the difference between Past Simple and Past Perfect', 'Write a short story using narrative tenses'],
  'm-a2-22': ['Use passive voice across different tenses', 'Talk about environmental problems and solutions', 'Learn wildlife and nature vocabulary in context', 'Write an essay about environmental issues'],
  'm-a2-23': ['Use contrast linkers: although, even though, despite', 'Use addition/result linkers: furthermore, therefore', 'Structure a persuasive or opinion text effectively', 'Write an opinion essay using a variety of linking words'],
  'm-a2-24': ['Complete the A2 Reading & Use of English exam', 'Complete the A2 Listening exam (4 parts)', 'Complete the A2 Writing exam (2 tasks)', 'Earn your official WKU A2 Pre-Intermediate Certificate'],
}
const DEFAULT_OBJECTIVES = ['Complete the reading text', 'Learn key vocabulary', 'Practice grammar patterns', 'Pass the final test']

// ── Vocab lesson IDs per module ───────────────────────────────────
const VOCAB_LESSON_ID: Record<string, string> = {
  'm-1': 'l1-1',
  'm-2': 'l2-v',
  'm-3': 'l3-v',
  'm-4': 'l4-v',
  'm-5': 'l5-v',
  'm-6': 'l6-v',
  'm-7': 'l7-v',
  'm-8': 'l8-v',
  'm-9':  'l9-v',
  'm-10': 'l10-v',
  'm-11': 'l11-v',
  'm-12': 'l12-v',
  'm-13': 'l13-v',
  'm-14': 'l14-v',
  'm-15': 'l15-v',
  // A1.1
  'm-a11-1':  'l17-v', 'm-a11-2':  'l18-v', 'm-a11-3':  'l19-v', 'm-a11-4':  'l20-v',
  'm-a11-5':  'l21-v', 'm-a11-6':  'l22-v', 'm-a11-7':  'l23-v', 'm-a11-8':  'l24-v',
  'm-a11-9':  'l25-v', 'm-a11-10': 'l26-v', 'm-a11-11': 'l27-v', 'm-a11-12': 'l28-v',
  'm-a11-13': 'l29-v', 'm-a11-14': 'l30-v', 'm-a11-15': 'l31-v', 'm-a11-16': 'l32-v',
  'm-a11-17': 'l33-v',
  // A2
  'm-a2-1':  'l35-v', 'm-a2-2':  'l36-v', 'm-a2-3':  'l37-v', 'm-a2-4':  'l38-v',
  'm-a2-5':  'l39-v', 'm-a2-6':  'l40-v', 'm-a2-7':  'l41-v', 'm-a2-8':  'l42-v',
  'm-a2-9':  'l43-v', 'm-a2-10': 'l44-v', 'm-a2-11': 'l45-v', 'm-a2-12': 'l46-v',
  'm-a2-13': 'l47-v', 'm-a2-14': 'l48-v', 'm-a2-15': 'l49-v', 'm-a2-16': 'l50-v',
  'm-a2-17': 'l51-v', 'm-a2-18': 'l52-v', 'm-a2-19': 'l53-v',
  'm-a2-20': 'l54-v', 'm-a2-21': 'l55-v', 'm-a2-22': 'l56-v', 'm-a2-23': 'l57-v',
}

// ── All lesson data per module ────────────────────────────────────
const ALL_LESSONS: Record<string, typeof MOCK_LESSONS_M1> = {
  'm-1': MOCK_LESSONS_M1,
  'm-2': MOCK_LESSONS_M2,
  'm-3': MOCK_LESSONS_M3,
  'm-4': MOCK_LESSONS_M4,
  'm-5': MOCK_LESSONS_M5,
  'm-6': MOCK_LESSONS_M6,
  'm-7': MOCK_LESSONS_M7,
  'm-8': MOCK_LESSONS_M8,
  'm-9':  MOCK_LESSONS_M9,
  'm-10': MOCK_LESSONS_M10,
  'm-11': MOCK_LESSONS_M11,
  'm-12': MOCK_LESSONS_M12,
  'm-13': MOCK_LESSONS_M13,
  'm-14': MOCK_LESSONS_M14,
  'm-15': MOCK_LESSONS_M15,
  'm-16': MOCK_LESSONS_M16,
  // A1.1 Elementary
  'm-a11-1':  MOCK_LESSONS_M_A11_1,  'm-a11-2':  MOCK_LESSONS_M_A11_2,  'm-a11-3':  MOCK_LESSONS_M_A11_3,
  'm-a11-4':  MOCK_LESSONS_M_A11_4,  'm-a11-5':  MOCK_LESSONS_M_A11_5,  'm-a11-6':  MOCK_LESSONS_M_A11_6,
  'm-a11-7':  MOCK_LESSONS_M_A11_7,  'm-a11-8':  MOCK_LESSONS_M_A11_8,  'm-a11-9':  MOCK_LESSONS_M_A11_9,
  'm-a11-10': MOCK_LESSONS_M_A11_10, 'm-a11-11': MOCK_LESSONS_M_A11_11, 'm-a11-12': MOCK_LESSONS_M_A11_12,
  'm-a11-13': MOCK_LESSONS_M_A11_13, 'm-a11-14': MOCK_LESSONS_M_A11_14, 'm-a11-15': MOCK_LESSONS_M_A11_15,
  'm-a11-16': MOCK_LESSONS_M_A11_16, 'm-a11-17': MOCK_LESSONS_M_A11_17, 'm-a11-18': MOCK_LESSONS_M_A11_18,
  // A2 Pre-Intermediate
  'm-a2-1':  MOCK_LESSONS_M_A2_1,  'm-a2-2':  MOCK_LESSONS_M_A2_2,  'm-a2-3':  MOCK_LESSONS_M_A2_3,
  'm-a2-4':  MOCK_LESSONS_M_A2_4,  'm-a2-5':  MOCK_LESSONS_M_A2_5,  'm-a2-6':  MOCK_LESSONS_M_A2_6,
  'm-a2-7':  MOCK_LESSONS_M_A2_7,  'm-a2-8':  MOCK_LESSONS_M_A2_8,  'm-a2-9':  MOCK_LESSONS_M_A2_9,
  'm-a2-10': MOCK_LESSONS_M_A2_10, 'm-a2-11': MOCK_LESSONS_M_A2_11, 'm-a2-12': MOCK_LESSONS_M_A2_12,
  'm-a2-13': MOCK_LESSONS_M_A2_13, 'm-a2-14': MOCK_LESSONS_M_A2_14, 'm-a2-15': MOCK_LESSONS_M_A2_15,
  'm-a2-16': MOCK_LESSONS_M_A2_16, 'm-a2-17': MOCK_LESSONS_M_A2_17, 'm-a2-18': MOCK_LESSONS_M_A2_18,
  'm-a2-19': MOCK_LESSONS_M_A2_19, 'm-a2-20': MOCK_LESSONS_M_A2_20, 'm-a2-21': MOCK_LESSONS_M_A2_21,
  'm-a2-22': MOCK_LESSONS_M_A2_22, 'm-a2-23': MOCK_LESSONS_M_A2_23, 'm-a2-24': MOCK_LESSONS_M_A2_24,
  // B1 Intermediate
  'm-b1-1':  MOCK_LESSONS_M_B1_1,  'm-b1-2':  MOCK_LESSONS_M_B1_2,  'm-b1-3':  MOCK_LESSONS_M_B1_3,
  'm-b1-4':  MOCK_LESSONS_M_B1_4,  'm-b1-5':  MOCK_LESSONS_M_B1_5,  'm-b1-6':  MOCK_LESSONS_M_B1_6,
  'm-b1-7':  MOCK_LESSONS_M_B1_7,  'm-b1-8':  MOCK_LESSONS_M_B1_8,  'm-b1-9':  MOCK_LESSONS_M_B1_9,
  'm-b1-10': MOCK_LESSONS_M_B1_10, 'm-b1-11': MOCK_LESSONS_M_B1_11, 'm-b1-12': MOCK_LESSONS_M_B1_12,
  'm-b1-13': MOCK_LESSONS_M_B1_13, 'm-b1-14': MOCK_LESSONS_M_B1_14, 'm-b1-15': MOCK_LESSONS_M_B1_15,
  'm-b1-16': MOCK_LESSONS_M_B1_16, 'm-b1-17': MOCK_LESSONS_M_B1_17, 'm-b1-18': MOCK_LESSONS_M_B1_18,
  'm-b1-19': MOCK_LESSONS_M_B1_19, 'm-b1-20': MOCK_LESSONS_M_B1_20, 'm-b1-21': MOCK_LESSONS_M_B1_21,
  'm-b1-22': MOCK_LESSONS_M_B1_22, 'm-b1-23': MOCK_LESSONS_M_B1_23, 'm-b1-24': MOCK_LESSONS_M_B1_24,
  'm-b1-25': MOCK_LESSONS_M_B1_25, 'm-b1-26': MOCK_LESSONS_M_B1_26,
  // B2 Upper-Intermediate
  'm-b2-1':  MOCK_LESSONS_M_B2_1,  'm-b2-2':  MOCK_LESSONS_M_B2_2,  'm-b2-3':  MOCK_LESSONS_M_B2_3,
  'm-b2-4':  MOCK_LESSONS_M_B2_4,  'm-b2-5':  MOCK_LESSONS_M_B2_5,  'm-b2-6':  MOCK_LESSONS_M_B2_6,
  'm-b2-7':  MOCK_LESSONS_M_B2_7,  'm-b2-8':  MOCK_LESSONS_M_B2_8,  'm-b2-9':  MOCK_LESSONS_M_B2_9,
  'm-b2-10': MOCK_LESSONS_M_B2_10, 'm-b2-11': MOCK_LESSONS_M_B2_11, 'm-b2-12': MOCK_LESSONS_M_B2_12,
  'm-b2-13': MOCK_LESSONS_M_B2_13, 'm-b2-14': MOCK_LESSONS_M_B2_14, 'm-b2-15': MOCK_LESSONS_M_B2_15,
  'm-b2-16': MOCK_LESSONS_M_B2_16, 'm-b2-17': MOCK_LESSONS_M_B2_17, 'm-b2-18': MOCK_LESSONS_M_B2_18,
  'm-b2-19': MOCK_LESSONS_M_B2_19, 'm-b2-20': MOCK_LESSONS_M_B2_20, 'm-b2-21': MOCK_LESSONS_M_B2_21,
  'm-b2-22': MOCK_LESSONS_M_B2_22, 'm-b2-23': MOCK_LESSONS_M_B2_23, 'm-b2-24': MOCK_LESSONS_M_B2_24,
  'm-b2-25': MOCK_LESSONS_M_B2_25, 'm-b2-26': MOCK_LESSONS_M_B2_26,
  // C1 Advanced
  'm-c1-1':  MOCK_LESSONS_M_C1_1,  'm-c1-2':  MOCK_LESSONS_M_C1_2,  'm-c1-3':  MOCK_LESSONS_M_C1_3,
  'm-c1-4':  MOCK_LESSONS_M_C1_4,  'm-c1-5':  MOCK_LESSONS_M_C1_5,  'm-c1-6':  MOCK_LESSONS_M_C1_6,
  'm-c1-7':  MOCK_LESSONS_M_C1_7,  'm-c1-8':  MOCK_LESSONS_M_C1_8,  'm-c1-9':  MOCK_LESSONS_M_C1_9,
  'm-c1-10': MOCK_LESSONS_M_C1_10, 'm-c1-11': MOCK_LESSONS_M_C1_11, 'm-c1-12': MOCK_LESSONS_M_C1_12,
  'm-c1-13': MOCK_LESSONS_M_C1_13, 'm-c1-14': MOCK_LESSONS_M_C1_14, 'm-c1-15': MOCK_LESSONS_M_C1_15,
  'm-c1-16': MOCK_LESSONS_M_C1_16, 'm-c1-17': MOCK_LESSONS_M_C1_17, 'm-c1-18': MOCK_LESSONS_M_C1_18,
  'm-c1-19': MOCK_LESSONS_M_C1_19, 'm-c1-20': MOCK_LESSONS_M_C1_20, 'm-c1-21': MOCK_LESSONS_M_C1_21,
  'm-c1-22': MOCK_LESSONS_M_C1_22, 'm-c1-23': MOCK_LESSONS_M_C1_23, 'm-c1-24': MOCK_LESSONS_M_C1_24,
  'm-c1-25': MOCK_LESSONS_M_C1_25, 'm-c1-26': MOCK_LESSONS_M_C1_26, 'm-c1-27': MOCK_LESSONS_M_C1_27,
  'm-c1-28': MOCK_LESSONS_M_C1_28, 'm-c1-29': MOCK_LESSONS_M_C1_29, 'm-c1-30': MOCK_LESSONS_M_C1_30,
  'm-c1-31': MOCK_LESSONS_M_C1_31, 'm-c1-32': MOCK_LESSONS_M_C1_32,
}

export default function ModulePage() {
  const { t }   = useZkuLang()
  const params  = useParams()
  const id      = params.id as string

  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const mod = MOCK_A1_MODULES.find(m => m.id === id) ?? MOCK_A11_MODULES.find(m => m.id === id) ?? MOCK_A2_MODULES.find(m => m.id === id) ?? MOCK_B1_MODULES.find(m => m.id === id) ?? MOCK_B2_MODULES.find(m => m.id === id) ?? MOCK_C1_MODULES.find(m => m.id === id)
  const lessons = ALL_LESSONS[id] ?? MOCK_LESSONS_M1.map(l => ({
    ...l,
    module_id: id,
    id: l.id.replace('l1-', `l${mod?.order_num ?? 1}-`),
    completed: false, score: null,
  }))

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return
      const { data } = await supabase
        .from('english_lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)
      if (!data) return
      type LPRow = { lesson_id: string | null; completed: boolean }
      const done = new Set<string>((data as LPRow[]).filter(r => r.completed).map(r => r.lesson_id as string))
      setCompleted(done)
    }
    load()
  }, [])

  // ── Auto-upgrade current_level when final exam is complete ──
  useEffect(() => {
    const FINAL_EXAMS: Record<string, string> = {
      'm-16':     'A1.1',
      'm-a11-18': 'A2',
      'm-a2-24':  'B1',
    }
    const nextLevel = FINAL_EXAMS[id]
    if (!nextLevel) return

    const allDone = lessons.length > 0 && lessons.every(l => completed.has(l.id))
    if (!allDone) return

    async function upgradeLevel() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return
      const { data: profile } = await supabase
        .from('english_user_profiles')
        .select('current_level')
        .eq('user_id', user.id)
        .single()
      const LEVEL_ORDER = ['A1', 'A1.1', 'A2', 'B1', 'B2', 'C1']
      const currentIdx = LEVEL_ORDER.indexOf(profile?.current_level ?? 'A1')
      const nextIdx    = LEVEL_ORDER.indexOf(nextLevel)
      if (nextIdx <= currentIdx) return
      await supabase
        .from('english_user_profiles')
        .upsert({ user_id: user.id, current_level: nextLevel }, { onConflict: 'user_id' })
    }
    upgradeLevel()
  }, [completed, id, lessons])

  if (!mod) return (
    <div style={{ padding: 60, textAlign: 'center', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: N }}>{t.module.not_found}</div>
      <Link href="/english/zku/student/course" style={{ color: '#1B8FC4', textDecoration: 'none' }}>{t.module.back_label}</Link>
    </div>
  )

  const objectives   = MODULE_OBJECTIVES[id] ?? DEFAULT_OBJECTIVES
  // Override cfg labels with translated versions
  const cfgBase      = (id.startsWith('m-a11-') || id.startsWith('m-a2-') || id.startsWith('m-b1-')) ? TYPE_CFG_A11 : TYPE_CFG_STARTER
  const cfg = {
    ...cfgBase,
    reading:    { ...cfgBase.reading,    label: t.module.type_reading    },
    listening:  { ...cfgBase.listening,  label: t.module.type_listening  },
    grammar:    { ...cfgBase.grammar,    label: t.module.type_grammar    },
    writing:    { ...cfgBase.writing,    label: t.module.type_writing    },
    vocabulary: { ...cfgBase.vocabulary, label: t.module.type_vocabulary },
    test:       { ...cfgBase.test,       label: t.module.type_test       },
  }
  const totalXp      = lessons.reduce((s, l) => s + l.xp_reward, 0)
  const totalMin     = lessons.reduce((s, l) => s + l.duration_min, 0)
  const doneCount    = lessons.filter(l => completed.has(l.id)).length
  const pct          = lessons.length > 0 ? Math.round((doneCount / lessons.length) * 100) : 0

  const doneLessons  = lessons.filter(l => l.type !== 'test' && completed.has(l.id))
  const todoLessons  = lessons.filter(l => l.type !== 'test' && !completed.has(l.id))
  const testLesson   = lessons.find(l => l.type === 'test')
  const testDone     = testLesson ? completed.has(testLesson.id) : false

  // first uncompleted lesson (the one to start/continue)
  const currentLesson = todoLessons[0] ?? testLesson

  function LessonCard({ lesson, status }: { lesson: typeof lessons[0]; status: 'done' | 'current' | 'todo' | 'locked' }) {
    const c = cfg[lesson.type] ?? cfg.reading
    const isLocked = status === 'locked'

    const href = isLocked
      ? '#'
      : lesson.type === 'vocabulary'
        ? `/english/zku/student/vocab/lesson/${VOCAB_LESSON_ID[id] ?? 'l1-1'}`
        : `/english/zku/student/lesson/${lesson.id}`

    return (
      <Link
        href={href}
        onClick={e => isLocked && e.preventDefault()}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', borderRadius: 12, marginBottom: 6,
          background: status === 'done' ? '#F0FDF4'
            : status === 'current' ? '#fff'
            : status === 'locked' ? '#FAFAFA'
            : '#fff',
          border: status === 'done' ? '1px solid #86EFAC'
            : status === 'current' ? `1.5px solid ${c.color}`
            : '1px solid rgba(0,56,118,0.08)',
          opacity: isLocked ? 0.5 : 1,
          cursor: isLocked ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
          boxShadow: status === 'current' ? `0 2px 12px ${c.color}22` : 'none',
        }}>
          {/* Type icon */}
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: status === 'done' ? '#DCFCE7' : isLocked ? '#F1F5F9' : c.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {status === 'done'
              ? <IcCheck size={16} color={T} />
              : isLocked
                ? <IcLock size={15} color="#94A3B8" />
                : c.icon}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 12, fontWeight: 700,
              color: status === 'done' ? T : isLocked ? '#94A3B8' : N,
              marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {lesson.title}
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 10, color: MU }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <IcClock size={10} color={MU} />{lesson.duration_min} min
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <IcStar size={10} color={G} />+{lesson.xp_reward} XP
              </span>
              {status === 'done' && lesson.score != null && (
                <span style={{ color: T, fontWeight: 700 }}>{lesson.score}%</span>
              )}
            </div>
          </div>

          {/* Arrow / badge */}
          {status === 'current' && (
            <div style={{
              background: c.color, color: '#fff', borderRadius: 8,
              padding: '4px 10px', fontSize: 10, fontWeight: 700, flexShrink: 0,
            }}>{t.course.start_btn}</div>
          )}
          {status === 'todo' && (
            <IcArrowRight size={14} color="#94A3B8" />
          )}
          {status === 'done' && (
            <IcCheckCircle size={18} color={T} />
          )}
        </div>
      </Link>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── Sticky top bar ── */}
      <div style={{
        background: '#fff', borderBottom: `1px solid ${BDR}`,
        padding: '0 32px', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          {(() => {
            const isA11 = id.startsWith('m-a11-')
            const isA2  = id.startsWith('m-a2-')
            const isB1  = id.startsWith('m-b1-')
            const isB2  = id.startsWith('m-b2-')
            const isC1  = id.startsWith('m-c1-')
            const levelSlug = isA11 ? 'a11' : isA2 ? 'a2' : isB1 ? 'b1' : isB2 ? 'b2' : isC1 ? 'c1' : 'a1'
            const levelLabel = isA11 ? 'A1.1' : isA2 ? 'A2' : isB1 ? 'B1' : isB2 ? 'B2' : isC1 ? 'C1' : 'A1'
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link href={`/english/zku/student/course/${levelSlug}`} style={{ fontSize: 12, fontWeight: 600, color: MU, textDecoration: 'none' }}>
                  {t.module.back_course} {levelLabel}
                </Link>
                <span style={{ color: '#E2E8F0' }}>|</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: N }}>{t.module.module_label} {mod.order_num} · {mod.title}</span>
              </div>
            )
          })()}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 11, color: MU }}>
              {doneCount}/{lessons.length} {t.module.lessons_word}
            </div>
            <div style={{ width: 100, height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: N, borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: N }}>{pct}%</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 32px 56px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>

        {/* ══ LEFT: Module info ══ */}
        <div>
          {/* Hero card */}
          <div style={{
            background: `linear-gradient(135deg, ${N} 0%, #0a4fa8 100%)`,
            borderRadius: 22, padding: '32px 36px', marginBottom: 20, color: '#fff',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', right: 60, bottom: -50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              {id.startsWith('m-a11-') ? 'A1.1 Elementary' : id.startsWith('m-a2-') ? 'A2 Pre-Intermediate' : id.startsWith('m-b1-') ? 'B1 Intermediate' : 'A1 Beginner'} · Модуль {mod.order_num}
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em' }}>{mod.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>{mod.grammar_focus} · {mod.vocab_count} {t.module.words_word}</div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 28 }}>
              {[
                { v: lessons.length, l: t.module.lessons_word },
                { v: `${totalMin} ${t.module.min_word}`, l: t.module.total_word },
                { v: `${totalXp} XP`, l: t.module.earn_word },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning objectives */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 16, border: `1px solid ${BDR}`, boxShadow: '0 2px 12px rgba(0,56,118,0.06)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: N, marginBottom: 16 }}>
              {t.module.after_module}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {objectives.map((obj, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: doneCount > i ? '#DCFCE7' : '#EEF2F7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {doneCount > i
                      ? <IcCheck size={12} color={T} />
                      : <span style={{ fontSize: 10, fontWeight: 800, color: N }}>{i + 1}</span>}
                  </div>
                  <span style={{ fontSize: 13, color: doneCount > i ? MU : '#334155', lineHeight: 1.5, textDecoration: doneCount > i ? 'line-through' : 'none' }}>
                    {obj}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Learning Path ── */}
          <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, boxShadow: '0 2px 12px rgba(0,56,118,0.06)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(0,56,118,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IcBookOpen size={18} color={N} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: N }}>{t.module.plan_title}</div>
                  <div style={{ fontSize: 11, color: MU }}>{doneCount} из {lessons.filter(l => l.type !== 'test').length} уроков пройдено</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { n: doneLessons.length, label: 'пройдено', color: T, bg: '#DCFCE7' },
                  { n: todoLessons.length, label: 'осталось', color: N, bg: '#EEF2F7' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', background: s.bg, borderRadius: 10, padding: '6px 12px' }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: 9, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lesson rows grouped by status */}
            {(() => {
              const nonTestLessons = lessons.filter(l => l.type !== 'test')
              const nextLesson = nonTestLessons.find(l => !completed.has(l.id))

              return nonTestLessons.map((l, i) => {
                const c = cfg[l.type] ?? cfg.reading
                const isDone = completed.has(l.id)
                const isNext = l.id === nextLesson?.id
                const href = l.type === 'vocabulary'
                  ? `/english/zku/student/vocab/lesson/${lessons.find(x => x.type === 'reading')?.id ?? l.id}`
                  : `/english/zku/student/lesson/${l.id}`

                return (
                  <Link key={l.id} href={href} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{
                      display: 'flex', gap: 14, padding: '14px 22px',
                      borderTop: i > 0 ? '1px solid rgba(0,56,118,0.05)' : 'none',
                      background: isDone ? '#FAFFFE' : isNext ? `${N}06` : '#fff',
                      borderLeft: isNext ? `3px solid ${N}` : isDone ? `3px solid ${T}` : '3px solid transparent',
                      cursor: 'pointer', transition: 'background 0.12s',
                      position: 'relative',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = c.bg }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isDone ? '#FAFFFE' : isNext ? `${N}06` : '#fff' }}>

                      {/* Step icon */}
                      <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isDone ? '#DCFCE7' : isNext ? N : c.bg,
                        border: `1.5px solid ${isDone ? '#86EFAC' : isNext ? N : c.border}`,
                      }}>
                        {isDone
                          ? <IcCheck size={15} color={T} />
                          : isNext
                            ? <span style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>{i + 1}</span>
                            : <span style={{ fontSize: 11, fontWeight: 900, color: c.color }}>{i + 1}</span>}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: isDone ? T : isNext ? N : c.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            {c.label}
                          </span>
                          {isDone && (
                            <span style={{ fontSize: 9, fontWeight: 800, color: T, background: '#DCFCE7', padding: '1px 7px', borderRadius: 99 }}>
                              {t.common.done_badge}
                            </span>
                          )}
                          {isNext && !isDone && (
                            <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', background: N, padding: '1px 7px', borderRadius: 99 }}>
                              → Следующий
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: isDone ? '#64748B' : N, textDecoration: isDone ? 'line-through' : 'none', marginBottom: 1 }}>
                          {l.title}
                        </div>
                        <div style={{ fontSize: 11, color: MU }}>{l.duration_min} {t.module.min_word} · +{l.xp_reward} XP</div>
                      </div>

                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        <IcArrowRight size={15} color={isDone ? T : isNext ? N : '#CBD5E1'} />
                      </div>
                    </div>
                  </Link>
                )
              })
            })()}

            {/* Final test row */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(0,56,118,0.07)', background: testDone ? '#FFFBEB' : '#F8FBFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: testDone ? '#FEF3C7' : '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {testDone ? <IcCheck size={15} color={G} /> : <IcStar size={15} color={G} />}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: testDone ? G : MU }}>{t.module.unlock_test}</div>
                  <div style={{ fontSize: 11, color: testDone ? G : '#94A3B8' }}>
                    {testDone ? '✓ Тест пройден' : `Завершите все уроки чтобы разблокировать`}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: G }}>+{testLesson?.xp_reward ?? 120} XP</div>
            </div>
          </div>

          {/* CTA — start/continue button */}
          {currentLesson && (
            <Link href={`/english/zku/student/lesson/${currentLesson.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                marginTop: 20, background: N, color: '#fff', borderRadius: 14,
                padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 6px 20px rgba(0,56,118,0.28)', cursor: 'pointer',
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 3 }}>
                    {doneCount === 0 ? t.module.start_module : `${t.module.continue_module} · ${t.module.lesson_word} ${doneCount + 1} ${t.module.of_word} ${lessons.length}`}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{currentLesson.title}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>+{currentLesson.xp_reward} XP</span>
                  <IcArrowRight size={20} color="#fff" />
                </div>
              </div>
            </Link>
          )}

          {/* A1 Certificate button — only for m-16 when all exam parts done */}
          {id === 'm-16' && !currentLesson && doneCount >= 3 && (
            <Link href="/english/zku/student/certificates/a1" style={{ textDecoration: 'none' }}>
              <div style={{
                marginTop: 20, borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(201,147,59,0.35)', cursor: 'pointer',
              }}>
                <div style={{ background: 'linear-gradient(135deg, #C9933B, #8B6427)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.module.exam_complete}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{t.module.get_cert_a1}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{t.module.save_pdf}</div>
                  </div>
                  <div style={{ fontSize: 40 }}>🎓</div>
                </div>
              </div>
            </Link>
          )}

          {/* A1.1 Certificate button — only for m-a11-18 when all exam parts done */}
          {id === 'm-a11-18' && !currentLesson && doneCount >= 3 && (
            <Link href="/english/zku/student/certificates/a11" style={{ textDecoration: 'none' }}>
              <div style={{
                marginTop: 20, borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(22,163,74,0.30)', cursor: 'pointer',
              }}>
                <div style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.module.exam_complete}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{t.module.get_cert_a11}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{t.module.save_pdf}</div>
                  </div>
                  <div style={{ fontSize: 40 }}>🎓</div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* ══ RIGHT: Lesson navigator ══ */}
        <div>
          <div style={{ position: 'sticky', top: 76 }}>

            {/* ── Section 1: COMPLETED ── */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '18px 16px', marginBottom: 12, border: `1px solid ${BDR}`, boxShadow: '0 2px 8px rgba(0,56,118,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: doneLessons.length > 0 ? 14 : 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IcCheck size={14} color={T} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: T }}>{t.module.completed_label}</div>
                  <div style={{ fontSize: 10, color: MU }}>{doneLessons.length} {t.module.of_word} {lessons.filter(l => l.type !== 'test').length} {t.module.lessons_word}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 900, color: T }}>{doneLessons.length}</div>
              </div>

              {doneLessons.length === 0 ? (
                <div style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', padding: '10px 0', fontStyle: 'italic' }}>
                  {t.module.no_done}
                </div>
              ) : (
                doneLessons.map(l => <LessonCard key={l.id} lesson={l} status="done" />)
              )}
            </div>

            {/* ── Section 2: TO COMPLETE — grouped by type ── */}
            <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, boxShadow: '0 2px 8px rgba(0,56,118,0.05)', marginBottom: 12, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 16px 12px' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IcBookOpen size={14} color={N} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: N }}>{t.module.to_complete}</div>
                  <div style={{ fontSize: 10, color: MU }}>{todoLessons.length} {t.module.lessons_word} {t.module.left}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 900, color: N }}>{todoLessons.length}</div>
              </div>

              {todoLessons.length === 0 ? (
                <div style={{ fontSize: 12, color: T, textAlign: 'center', padding: '12px 0 16px', fontWeight: 600 }}>
                  {t.module.all_done}
                </div>
              ) : (
                /* Group by type */
                (() => {
                  const typeOrder = ['reading', 'listening', 'grammar', 'writing', 'vocabulary']
                  const grouped = typeOrder
                    .map(type => ({ type, items: todoLessons.filter(l => l.type === type) }))
                    .filter(g => g.items.length > 0)

                  return grouped.map((group, gi) => {
                    const cfg = ((id.startsWith('m-a11-') || id.startsWith('m-a2-')) ? TYPE_CFG_A11 : TYPE_CFG_STARTER)[group.type]
                    return (
                      <div key={group.type} style={{ borderTop: gi === 0 ? '1px solid rgba(0,56,118,0.06)' : 'none' }}>
                        {/* Type header */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8px 16px', background: `${cfg.bg}`,
                          borderTop: gi > 0 ? '1px solid rgba(0,56,118,0.06)' : 'none',
                          borderBottom: '1px solid rgba(0,56,118,0.06)',
                        }}>
                          <div style={{ width: 22, height: 22, borderRadius: 6, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${cfg.border}`, flexShrink: 0 }}>
                            {React.cloneElement(cfg.icon as React.ReactElement<{ size?: number }>, { size: 12 })}
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 800, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {cfg.label}
                          </span>
                          <span style={{ marginLeft: 'auto', fontSize: 10, color: MU, fontWeight: 600 }}>
                            {group.items.length} {t.module.lesson_word}
                          </span>
                        </div>
                        {/* Lessons in this type */}
                        <div style={{ padding: '6px 8px' }}>
                          {group.items.map((l, i) => {
                            const globalI = todoLessons.indexOf(l)
                            return (
                              <LessonCard
                                key={l.id}
                                lesson={l}
                                status={globalI === 0 ? 'current' : 'todo'}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                })()
              )}
            </div>

            {/* ── Section 3: TEST ── */}
            {testLesson && (
              <div style={{
                background: testDone ? '#F0FDF4' : '#fff',
                borderRadius: 18, padding: '18px 16px',
                border: testDone ? '1.5px solid #86EFAC' : `1.5px solid ${G}44`,
                boxShadow: testDone ? '0 2px 12px rgba(29,158,117,0.1)' : `0 2px 12px ${G}18`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: testDone ? '#DCFCE7' : '#FEF3C7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {testDone ? <IcCheck size={14} color={T} /> : <IcTarget size={14} color={G} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: testDone ? T : G }}>
                      {testDone ? t.module.test_passed : t.module.final_test}
                    </div>
                    <div style={{ fontSize: 10, color: MU }}>
                      {testDone ? t.module.module_done : `${t.module.unlocks_after} · +${testLesson.xp_reward} XP`}
                    </div>
                  </div>
                </div>

                <Link
                  href={todoLessons.length === 0 ? `/english/zku/student/lesson/${testLesson.id}` : '#'}
                  onClick={e => todoLessons.length > 0 && e.preventDefault()}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div style={{
                    background: testDone ? T : todoLessons.length === 0 ? G : '#F1F5F9',
                    color: todoLessons.length === 0 || testDone ? '#fff' : '#94A3B8',
                    borderRadius: 10, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: todoLessons.length === 0 ? 'pointer' : 'not-allowed',
                    boxShadow: (todoLessons.length === 0 && !testDone) ? `0 4px 14px ${G}44` : 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>{testLesson.title}</div>
                      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                        {testLesson.duration_min} {t.module.min_word} · +{testLesson.xp_reward} XP
                      </div>
                    </div>
                    {todoLessons.length > 0
                      ? <IcLock size={16} color="#94A3B8" />
                      : testDone
                        ? <IcCheckCircle size={20} color="rgba(255,255,255,0.9)" />
                        : <IcArrowRight size={16} color="#fff" />}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
