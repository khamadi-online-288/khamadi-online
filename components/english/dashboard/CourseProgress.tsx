import Link from 'next/link'
import Progress from '@/components/english/ui/Progress'
import LevelBadge from '@/components/english/course/LevelBadge'
import type { ActiveCourse } from '@/types/english/database'

type Props = { course: ActiveCourse }

export default function CourseProgress({ course }: Props) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-navy/8 p-4">
      <div className="w-10 h-10 rounded-lg bg-light flex items-center justify-center shrink-0">
        <LevelBadge level={course.level} size="sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-navy text-sm truncate">{course.title}</span>
        </div>
        {course.last_lesson_title && (
          <p className="text-xs text-gray-400 mb-1.5 truncate">↳ {course.last_lesson_title}</p>
        )}
        <Progress value={course.progress_percent} color="mid" size="sm" showLabel />
      </div>
      <Link
        href={`/english/courses/${course.id}`}
        className="shrink-0 text-xs font-bold bg-navy text-white px-3 py-1.5 rounded-lg hover:bg-mid transition"
      >
        Продолжить
      </Link>
    </div>
  )
}
