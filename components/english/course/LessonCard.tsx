import Link from 'next/link'
import { CheckCircle, Circle, Lock, PlayCircle, Clock } from 'lucide-react'

type Props = {
  lesson:    { id: string; title: string; lesson_order: number; duration_min?: number | null }
  courseId:  string
  completed: boolean
  score?:    number | null
  locked:    boolean
  isCurrent: boolean
}

export default function LessonCard({ lesson, courseId, completed, score, locked, isCurrent }: Props) {
  const inner = (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
      locked    ? 'bg-white border-navy/8 opacity-50'
      : completed ? 'bg-white border-green-200'
      : isCurrent ? 'bg-light border-gold/40 shadow-sm'
      : 'bg-white border-navy/8 hover:border-navy/20'
    }`}>
      {locked ? (
        <Lock size={18} className="text-gray-300 shrink-0" />
      ) : completed ? (
        <CheckCircle size={18} className="text-green-500 shrink-0" />
      ) : isCurrent ? (
        <PlayCircle size={18} className="text-gold shrink-0" />
      ) : (
        <Circle size={18} className="text-gray-300 shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${completed ? 'text-green-700' : 'text-navy'}`}>
          {lesson.lesson_order}. {lesson.title}
        </p>
        {lesson.duration_min && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Clock size={10} /> {lesson.duration_min} мин
          </p>
        )}
      </div>

      {score !== null && score !== undefined && (
        <span className={`text-sm font-black shrink-0 ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-gold' : 'text-red-500'}`}>
          {score}%
        </span>
      )}
      {isCurrent && (
        <span className="text-xs font-bold text-gold bg-gold/10 px-2.5 py-1 rounded-full shrink-0">
          Продолжить
        </span>
      )}
    </div>
  )

  return locked
    ? <div>{inner}</div>
    : <Link href={`/english/courses/${courseId}/lessons/${lesson.id}`}>{inner}</Link>
}
