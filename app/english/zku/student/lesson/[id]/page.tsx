import { getZkuLesson } from '@/lib/english/zku-lessons'
import LessonClient from './lesson-client'

// Server wrapper: loads only the requested lesson's JSON so the full
// lesson catalogue never ships in the client bundle.
export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lesson = await getZkuLesson(id)
  return <LessonClient id={id} lesson={lesson} />
}
