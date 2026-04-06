'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  full_name: string | null
  email: string | null
  city: string | null
  role: string | null
  student_code: string | null
  profile_subject_1: string | null
  profile_subject_2: string | null
  approval_status: string | null
  created_at?: string | null
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [workingId, setWorkingId] = useState<string | null>(null)

  async function loadProfiles() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          city,
          role,
          student_code,
          profile_subject_1,
          profile_subject_2,
          approval_status,
          created_at
        `)
        .in('role', ['student', 'parent'])
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        setProfiles([])
        return
      }

      setProfiles((data || []) as Profile[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  async function updateStatus(
    id: string,
    status: 'approved' | 'rejected' | 'pending'
  ) {
    try {
      setWorkingId(id)

      const { error } = await supabase
        .from('profiles')
        .update({ approval_status: status })
        .eq('id', id)

      if (error) {
        alert(error.message)
        return
      }

      setProfiles((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, approval_status: status } : item
        )
      )
    } finally {
      setWorkingId(null)
    }
  }

  const pendingProfiles = useMemo(
    () => profiles.filter((p) => (p.approval_status || 'pending') === 'pending'),
    [profiles]
  )

  const approvedProfiles = useMemo(
    () => profiles.filter((p) => p.approval_status === 'approved'),
    [profiles]
  )

  const rejectedProfiles = useMemo(
    () => profiles.filter((p) => p.approval_status === 'rejected'),
    [profiles]
  )

  return (
    <div style={s.page}>
      <div style={s.bgGlowTop} />
      <div style={s.bgGlowBottom} />

      <div style={s.wrap}>
        <div style={s.hero}>
          <div style={s.heroBadge}>ADMIN PANEL</div>
          <h1 style={s.heroTitle}>Оқушыларды растау</h1>
          <p style={s.heroText}>
            Жаңа тіркелген аккаунттарды осы жерден approve немесе reject жасайсың.
            Pending статусындағы қолданушылар платформаға кіре алмайды.
          </p>

          <div style={s.heroStats}>
            <StatCard label="Pending" value={pendingProfiles.length} />
            <StatCard label="Approved" value={approvedProfiles.length} />
            <StatCard label="Rejected" value={rejectedProfiles.length} />
          </div>
        </div>

        <SectionCard
          title="Күтіп тұрғандар"
          subtitle="Алдымен осы тізімнен жаңа тіркелген аккаунттарды раста."
        >
          {loading ? (
            <div style={s.emptyBox}>Жүктелуде...</div>
          ) : pendingProfiles.length === 0 ? (
            <div style={s.emptyBox}>Қазір pending аккаунт жоқ.</div>
          ) : (
            <div style={s.list}>
              {pendingProfiles.map((item) => (
                <ProfileCard
                  key={item.id}
                  item={item}
                  status="pending"
                  working={workingId === item.id}
                  onApprove={() => updateStatus(item.id, 'approved')}
                  onReject={() => updateStatus(item.id, 'rejected')}
                  onBackToPending={() => updateStatus(item.id, 'pending')}
                />
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Расталған аккаунттар"
          subtitle="Approve жасалған қолданушылар."
        >
          {approvedProfiles.length === 0 ? (
            <div style={s.emptyBox}>Approved аккаунт жоқ.</div>
          ) : (
            <div style={s.list}>
              {approvedProfiles.map((item) => (
                <ProfileCard
                  key={item.id}
                  item={item}
                  status="approved"
                  working={workingId === item.id}
                  onApprove={() => updateStatus(item.id, 'approved')}
                  onReject={() => updateStatus(item.id, 'rejected')}
                  onBackToPending={() => updateStatus(item.id, 'pending')}
                />
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Reject етілгендер"
          subtitle="Қажет болса pending немесе approved-қа қайтара аласың."
        >
          {rejectedProfiles.length === 0 ? (
            <div style={s.emptyBox}>Rejected аккаунт жоқ.</div>
          ) : (
            <div style={s.list}>
              {rejectedProfiles.map((item) => (
                <ProfileCard
                  key={item.id}
                  item={item}
                  status="rejected"
                  working={workingId === item.id}
                  onApprove={() => updateStatus(item.id, 'approved')}
                  onReject={() => updateStatus(item.id, 'rejected')}
                  onBackToPending={() => updateStatus(item.id, 'pending')}
                />
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div style={s.statCard}>
      <div style={s.statLabel}>{label}</div>
      <div style={s.statValue}>{value}</div>
    </div>
  )
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div style={s.sectionCard}>
      <div style={s.sectionTitle}>{title}</div>
      <div style={s.sectionSubtitle}>{subtitle}</div>
      <div style={{ marginTop: 18 }}>{children}</div>
    </div>
  )
}

function ProfileCard({
  item,
  status,
  working,
  onApprove,
  onReject,
  onBackToPending,
}: {
  item: Profile
  status: 'pending' | 'approved' | 'rejected'
  working: boolean
  onApprove: () => void
  onReject: () => void
  onBackToPending: () => void
}) {
  return (
    <div style={s.profileCard}>
      <div style={s.profileTop}>
        <div>
          <div style={s.profileName}>{item.full_name || 'Аты жоқ'}</div>
          <div style={s.profileMeta}>
            {item.role || '-'} · {item.email || '-'} · {item.city || '-'}
          </div>
        </div>

        <div
          style={{
            ...s.statusPill,
            ...(status === 'pending'
              ? s.pendingPill
              : status === 'approved'
              ? s.approvedPill
              : s.rejectedPill),
          }}
        >
          {status}
        </div>
      </div>

      <div style={s.infoGrid}>
        <InfoBox label="Student code" value={item.student_code || '-'} />
        <InfoBox label="Пән 1" value={item.profile_subject_1 || '-'} />
        <InfoBox label="Пән 2" value={item.profile_subject_2 || '-'} />
      </div>

      <div style={s.actions}>
        {status !== 'approved' && (
          <button
            onClick={onApprove}
            disabled={working}
            style={s.approveBtn}
          >
            {working ? '...' : 'Approve'}
          </button>
        )}

        {status !== 'rejected' && (
          <button
            onClick={onReject}
            disabled={working}
            style={s.rejectBtn}
          >
            Reject
          </button>
        )}

        {status !== 'pending' && (
          <button
            onClick={onBackToPending}
            disabled={working}
            style={s.secondaryBtn}
          >
            Pending-ке қайтару
          </button>
        )}
      </div>
    </div>
  )
}

function InfoBox({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div style={s.infoBox}>
      <div style={s.infoLabel}>{label}</div>
      <div style={s.infoValue}>{value}</div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 22%), linear-gradient(180deg, #F8FCFF 0%, #FFFFFF 58%, #EEF8FF 100%)',
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },

  bgGlowTop: {
    position: 'absolute',
    right: -120,
    top: -120,
    width: 320,
    height: 320,
    borderRadius: '999px',
    background: 'rgba(56,189,248,0.12)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },

  bgGlowBottom: {
    position: 'absolute',
    left: -100,
    bottom: -100,
    width: 280,
    height: 280,
    borderRadius: '999px',
    background: 'rgba(14,165,233,0.10)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },

  wrap: {
    maxWidth: 1200,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    gap: 18,
  },

  hero: {
    borderRadius: 28,
    padding: 28,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(240,249,255,0.94) 100%)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 24px 50px rgba(15,23,42,0.06)',
  },

  heroBadge: {
    display: 'inline-flex',
    padding: '8px 12px',
    borderRadius: 999,
    background: '#E0F2FE',
    color: '#0369A1',
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 12,
  },

  heroTitle: {
    fontSize: 38,
    fontWeight: 900,
    letterSpacing: '-0.04em',
    color: '#0F172A',
    margin: 0,
    marginBottom: 10,
  },

  heroText: {
    fontSize: 15,
    lineHeight: 1.8,
    color: '#64748B',
    margin: 0,
    marginBottom: 18,
    maxWidth: 760,
  },

  heroStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 12,
  },

  statCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 18,
    padding: 18,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: 800,
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  statValue: {
    fontSize: 30,
    fontWeight: 900,
    color: '#0F172A',
  },

  sectionCard: {
    background: 'rgba(255,255,255,0.86)',
    border: '1px solid rgba(226,232,240,0.95)',
    borderRadius: 24,
    padding: 20,
    boxShadow: '0 14px 26px rgba(15,23,42,0.04)',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 900,
    color: '#0F172A',
    letterSpacing: '-0.03em',
    marginBottom: 6,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 1.7,
  },

  list: {
    display: 'grid',
    gap: 14,
  },

  profileCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 20,
    padding: 18,
  },

  profileTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },

  profileName: {
    fontSize: 18,
    fontWeight: 900,
    color: '#0F172A',
    marginBottom: 6,
  },

  profileMeta: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 1.7,
  },

  statusPill: {
    padding: '8px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    height: 'fit-content',
    textTransform: 'capitalize',
  },

  pendingPill: {
    background: '#FEF3C7',
    color: '#92400E',
  },

  approvedPill: {
    background: '#DCFCE7',
    color: '#166534',
  },

  rejectedPill: {
    background: '#FEE2E2',
    color: '#991B1B',
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 12,
    marginBottom: 14,
  },

  infoBox: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: 12,
  },

  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: 800,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  infoValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: 700,
    lineHeight: 1.5,
  },

  actions: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },

  approveBtn: {
    minHeight: 42,
    padding: '0 16px',
    borderRadius: 14,
    border: 'none',
    background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    color: '#FFFFFF',
    fontWeight: 800,
    cursor: 'pointer',
  },

  rejectBtn: {
    minHeight: 42,
    padding: '0 16px',
    borderRadius: 14,
    border: 'none',
    background: '#EF4444',
    color: '#FFFFFF',
    fontWeight: 800,
    cursor: 'pointer',
  },

  secondaryBtn: {
    minHeight: 42,
    padding: '0 16px',
    borderRadius: 14,
    border: '1px solid #CBD5E1',
    background: '#FFFFFF',
    color: '#0F172A',
    fontWeight: 800,
    cursor: 'pointer',
  },

  emptyBox: {
    padding: 18,
    borderRadius: 16,
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    color: '#64748B',
  },
}