import { useState, useEffect } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

// Returns a short-lived signed URL (60s) for a Supabase Storage path.
// Refreshes before expiry so the URL is always valid during the session.
export function useSignedUrl(bucket: string, path: string | null | undefined, expiresIn = 60) {
  const supabase = createEnglishClient()
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!path) return
    let timer: ReturnType<typeof setTimeout>

    async function refresh() {
      const { data, error: err } = await supabase.storage.from(bucket).createSignedUrl(path!, expiresIn)
      if (err) { setError(err.message); return }
      setUrl(data.signedUrl)
      // Refresh 10 seconds before expiry
      timer = setTimeout(refresh, (expiresIn - 10) * 1000)
    }

    refresh()
    return () => clearTimeout(timer)
  }, [bucket, path, expiresIn])

  return { url, error }
}
