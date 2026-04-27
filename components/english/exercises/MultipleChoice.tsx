'use client'

import type { EnglishQuizQuestion, QuizAnswer } from '@/types/english/database'

type Props = {
  question:  EnglishQuizQuestion
  index:     number
  selected:  QuizAnswer | undefined
  submitted: boolean
  onSelect:  (qId: string, answer: QuizAnswer) => void
}

const OPTIONS: QuizAnswer[] = ['A', 'B', 'C', 'D']
const OPT_TEXT = (q: EnglishQuizQuestion, key: QuizAnswer) =>
  ({ A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d })[key]

export default function MultipleChoice({ question, index, selected, submitted, onSelect }: Props) {
  return (
    <div>
      <p className="text-sm font-bold text-navy mb-3">{index + 1}. {question.question}</p>
      <div className="space-y-1.5">
        {OPTIONS.map(key => {
          const isSelected = selected === key
          const isCorrect  = question.correct_answer === key
          const isWrong    = submitted && isSelected && !isCorrect

          return (
            <button
              key={key}
              onClick={() => !submitted && onSelect(question.id, key)}
              disabled={submitted}
              className={`w-full text-left text-sm px-4 py-2.5 rounded-xl border font-medium transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-green-100 border-green-300 text-green-800 font-bold'
                    : isWrong
                    ? 'bg-red-100 border-red-300 text-red-700 line-through'
                    : 'bg-white border-gray-100 text-gray-400'
                  : isSelected
                  ? 'bg-navy text-white border-navy shadow-sm'
                  : 'bg-white text-navy/70 border-navy/12 hover:border-navy/30 hover:bg-light'
              }`}
            >
              <span className="font-black mr-2">{key}.</span>{OPT_TEXT(question, key)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
