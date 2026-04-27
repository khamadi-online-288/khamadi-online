'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import type { EnglishUserRole } from '@/types/english/database'

type AuthState = {
  loading: boolean
  userId:  string | null
  profile: EnglishUserRole | null
}

export function useEnglishAuth(redirectTo = '/english/login') {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({ loading: true, userId: null, profile: null })

  useEffect(() => {
    const supabase = createEnglishClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(redirectTo); return }

      const { data } = await supabase
        .from('english_user_roles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      setState({ loading: false, userId: user.id, profile: data as EnglishUserRole | null })
    }

    load()
  }, [router, redirectTo])

  return state
}
