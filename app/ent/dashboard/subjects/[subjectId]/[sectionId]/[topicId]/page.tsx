'use client'

/**
 * Topic pages are removed from the new structure.
 * Subjects → Modules → Quiz  (no topic drill-down)
 * Redirect to the parent section (module) quiz page.
 */
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function TopicRedirectPage() {
  const { subjectId, sectionId } = useParams<{ subjectId: string; sectionId: string }>()
  const router = useRouter()

  useEffect(() => {
    router.replace(`/ent/dashboard/subjects/${subjectId}/${sectionId}`)
  }, [subjectId, sectionId, router])

  return null
}
