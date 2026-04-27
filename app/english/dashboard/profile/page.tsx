import { redirect } from 'next/navigation'
import { User, Mail, GraduationCap, BookOpen, Award } from 'lucide-react'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import Badge from '@/components/english/ui/Badge'
import type { EnglishUserRole, CefrLevel } from '@/types/english/database'

const LEVEL_LABEL: Record<CefrLevel, string> = {
  A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate',
  B2: 'Upper-Intermediate', C1: 'Advanced', C2: 'Proficient',
}

export default async function ProfilePage() {
  const supabase = await createEnglishServerClient()

  const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
  if (!user) redirect('/english/login')

  const [{ data: profile }, { data: stats }] = await Promise.all([
    supabase
      .from('english_user_roles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase.rpc('get_english_dashboard'),
  ])

  const p = profile as EnglishUserRole | null
  const s = (stats as { stats?: { enrolled_courses: number; completed_lessons: number; certificates: number } } | null)?.stats

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-2xl font-black text-navy">Профиль</h1>

      {/* Avatar card */}
      <div className="bg-navy rounded-2xl p-6 text-white flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-black text-gold shrink-0">
          {p?.full_name?.charAt(0).toUpperCase() ?? '?'}
        </div>
        <div>
          <h2 className="text-lg font-black">{p?.full_name ?? 'Студент'}</h2>
          <p className="text-white/60 text-sm">{user.email}</p>
          {p?.current_level && (
            <div className="mt-2">
              <Badge color="gold" size="sm">
                {p.current_level} — {LEVEL_LABEL[p.current_level] ?? ''}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {s && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: BookOpen, label: 'Курсов',    value: s.enrolled_courses  },
            { icon: GraduationCap, label: 'Уроков', value: s.completed_lessons },
            { icon: Award, label: 'Сертификатов', value: s.certificates      },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl border border-navy/8 p-4 text-center">
              <item.icon className="mx-auto mb-1.5 text-gold" size={20} />
              <div className="text-xl font-black text-navy">{item.value}</div>
              <div className="text-xs text-gray-400 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-white rounded-2xl border border-navy/8 divide-y divide-gray-50">
        {[
          { icon: User,        label: 'Полное имя',      value: p?.full_name ?? '—'         },
          { icon: Mail,        label: 'Email',            value: user.email ?? '—'           },
          { icon: GraduationCap, label: 'Уровень',        value: p?.current_level ? `${p.current_level} (${LEVEL_LABEL[p.current_level]})` : '—' },
          { icon: BookOpen,    label: 'ID студента',      value: p?.student_id ?? '—'        },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-4 px-5 py-3.5">
            <row.icon size={16} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-400 font-semibold w-32 shrink-0">{row.label}</span>
            <span className="text-sm font-bold text-navy">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
