'use client'

type Props = {
  statement: string
  index:     number
  selected:  boolean | undefined
  submitted: boolean
  correct:   boolean
  onSelect:  (value: boolean) => void
}

export default function TrueFalse({ statement, index, selected, submitted, correct, onSelect }: Props) {
  return (
    <div>
      <p className="text-sm font-bold text-navy mb-2">{index + 1}. {statement}</p>
      <div className="flex gap-2">
        {([true, false] as const).map(val => {
          const label     = val ? 'Верно' : 'Неверно'
          const isSelected = selected === val
          const isCorrect  = submitted && val === correct
          const isWrong    = submitted && isSelected && val !== correct

          return (
            <button
              key={String(val)}
              onClick={() => !submitted && onSelect(val)}
              disabled={submitted}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                submitted
                  ? isCorrect ? 'bg-green-100 border-green-300 text-green-800'
                  : isWrong   ? 'bg-red-100 border-red-300 text-red-700'
                  : 'bg-white border-gray-100 text-gray-400'
                  : isSelected ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy/70 border-navy/12 hover:bg-light'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
