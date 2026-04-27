import Link from 'next/link'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'
import LevelBadge from './LevelBadge'
import Progress   from '@/components/english/ui/Progress'
import type { EnglishCourse } from '@/types/english/database'

type Props = {
  course: EnglishCourse
  progress?: number
  completedLessons?: number
  totalLessons?: number
}

export default function CourseCard({ course, progress = 0, completedLessons = 0, totalLessons = 0 }: Props) {
  return (
    <Link
      href={`/english/courses/${course.id}`}
      className="bg-white rounded-2xl border border-navy/8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden group"
    >
      {/* Cover */}
      <div className="h-28 bg-gradient-to-br from-navy to-mid flex items-center justify-center relative overflow-hidden shrink-0">
        <BookOpen className="text-white/20" size={48} />
        <div className="absolute top-3 left-3">
          <LevelBadge level={course.level} />
        </div>
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-navy text-sm leading-tight mb-1 group-hover:text-mid transition line-clamp-2">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
            {course.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
          {course.total_hours && (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {course.total_hours} ч.
            </span>
          )}
          {totalLessons > 0 && (
            <span>{completedLessons}/{totalLessons} уроков</span>
          )}
          <ChevronRight size={14} className="ml-auto" />
        </div>
      </div>
    </Link>
  )
}
