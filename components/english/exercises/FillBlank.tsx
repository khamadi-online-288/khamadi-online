'use client'

type Props = {
  sentence:  string
  index:     number
  value:     string
  submitted: boolean
  correct:   string
  onChange:  (v: string) => void
}

export default function FillBlank({ sentence, index, value, submitted, correct, onChange }: Props) {
  const isCorrect = submitted && value.trim().toLowerCase() === correct.trim().toLowerCase()
  const isWrong   = submitted && !isCorrect

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-bold text-navy">{index + 1}.</span>
      {sentence.split('___').map((part, i, arr) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-sm text-navy/80">{part}</span>
          {i < arr.length - 1 && (
            <input
              type="text"
              value={value}
              onChange={e => !submitted && onChange(e.target.value)}
              disabled={submitted}
              className={`w-28 px-2 py-1 rounded-lg border text-sm text-center font-bold outline-none transition ${
                submitted
                  ? isCorrect ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-red-300 bg-red-50 text-red-700'
                  : 'border-navy/20 focus:border-mid focus:ring-1 focus:ring-mid/30'
              }`}
            />
          )}
          {submitted && i < arr.length - 1 && isWrong && (
            <span className="text-xs text-green-600 font-bold">({correct})</span>
          )}
        </span>
      ))}
    </div>
  )
}
