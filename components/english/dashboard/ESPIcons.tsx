import type { ReactNode } from 'react'

const SZ = 80

export function AccountingIcon() {
  return (
    <svg width={SZ} height={SZ} viewBox="0 0 80 80" fill="none">
      <rect x="10" y="48" width="12" height="22" rx="2" fill="white" opacity="0.3"/>
      <rect x="28" y="36" width="12" height="34" rx="2" fill="white" opacity="0.5"/>
      <rect x="46" y="24" width="12" height="46" rx="2" fill="#C9933B" opacity="0.85"/>
      <rect x="64" y="40" width="12" height="30" rx="2" fill="white" opacity="0.4"/>
      <polyline points="16,48 34,36 52,24 70,40" fill="none" stroke="#C9933B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="48" r="3" fill="#C9933B"/>
      <circle cx="52" cy="24" r="3" fill="#C9933B"/>
      <circle cx="70" cy="40" r="3" fill="#C9933B"/>
    </svg>
  )
}

export function ComputerScienceIcon() {
  return (
    <svg width={SZ} height={SZ} viewBox="0 0 80 80" fill="none">
      <rect x="8" y="16" width="64" height="48" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <rect x="8" y="16" width="64" height="16" rx="6" fill="rgba(255,255,255,0.12)"/>
      <rect x="8" y="24" width="64" height="8" fill="rgba(255,255,255,0.12)"/>
      <circle cx="18" cy="24" r="3" fill="#ef4444" opacity="0.7"/>
      <circle cx="28" cy="24" r="3" fill="#f59e0b" opacity="0.7"/>
      <circle cx="38" cy="24" r="3" fill="#10b981" opacity="0.7"/>
      <text x="14" y="46" fontFamily="monospace" fontSize="10" fill="#1B8FC4" opacity="0.9">{'> _'}</text>
      <rect x="14" y="50" width="32" height="2" rx="1" fill="rgba(255,255,255,0.25)"/>
      <rect x="14" y="56" width="22" height="2" rx="1" fill="rgba(255,255,255,0.15)"/>
      <rect x="14" y="62" width="40" height="2" rx="1" fill="#C9933B" opacity="0.5"/>
    </svg>
  )
}

export function HospitalityIcon() {
  return (
    <svg width={SZ} height={SZ} viewBox="0 0 80 80" fill="none">
      <rect x="16" y="30" width="48" height="40" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <polygon points="40,12 12,30 68,30" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <rect x="22" y="36" width="10" height="9" rx="1" fill="rgba(255,255,255,0.35)"/>
      <rect x="36" y="36" width="10" height="9" rx="1" fill="#C9933B" opacity="0.7"/>
      <rect x="50" y="36" width="10" height="9" rx="1" fill="rgba(255,255,255,0.35)"/>
      <rect x="22" y="50" width="10" height="9" rx="1" fill="rgba(255,255,255,0.25)"/>
      <rect x="50" y="50" width="10" height="9" rx="1" fill="rgba(255,255,255,0.35)"/>
      <rect x="34" y="54" width="12" height="16" rx="2" fill="#C9933B" opacity="0.5"/>
      <text x="40" y="26" fontFamily="system-ui" fontSize="8" fill="#C9933B" textAnchor="middle">★★★</text>
    </svg>
  )
}

export function ManagementIcon() {
  return (
    <svg width={SZ} height={SZ} viewBox="0 0 80 80" fill="none">
      <rect x="28" y="10" width="24" height="14" rx="3" fill="#1B8FC4" opacity="0.7"/>
      <text x="40" y="21" fontFamily="system-ui" fontSize="8" fontWeight="600" fill="white" textAnchor="middle">CEO</text>
      <line x1="40" y1="24" x2="18" y2="38" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
      <line x1="40" y1="24" x2="40" y2="38" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
      <line x1="40" y1="24" x2="62" y2="38" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
      <rect x="6"  y="38" width="24" height="12" rx="2" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.8"/>
      <rect x="28" y="38" width="24" height="12" rx="2" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.8"/>
      <rect x="50" y="38" width="24" height="12" rx="2" fill="#C9933B"               opacity="0.4" stroke="#C9933B" strokeOpacity="0.4" strokeWidth="0.8"/>
      <line x1="18" y1="50" x2="12" y2="62" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
      <line x1="18" y1="50" x2="26" y2="62" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
      <rect x="4"  y="62" width="18" height="10" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"/>
      <rect x="24" y="62" width="18" height="10" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"/>
    </svg>
  )
}

export function FinanceIcon() {
  return (
    <svg width={SZ} height={SZ} viewBox="0 0 80 80" fill="none">
      <circle cx="36" cy="44" r="26" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10"/>
      <circle cx="36" cy="44" r="18" fill="none" stroke="#C9933B" strokeWidth="1.5" opacity="0.6"/>
      <text x="36" y="51" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#C9933B" opacity="0.9" textAnchor="middle">$</text>
      <line x1="62" y1="64" x2="62" y2="18" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="55,26 62,18 69,26" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="54,58 58,48 62,42 66,36" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5" strokeLinecap="round"/>
    </svg>
  )
}

export function SocialSciencesIcon() {
  return (
    <svg width={SZ} height={SZ} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="10" fill="#1B8FC4" opacity="0.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <text x="40" y="44" fontFamily="system-ui" fontSize="9" fill="white" textAnchor="middle" fontWeight="600">ORG</text>
      <circle cx="18" cy="22" r="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <circle cx="62" cy="22" r="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <circle cx="12" cy="58" r="8" fill="rgba(255,255,255,0.1)"  stroke="#C9933B"               strokeWidth="1"/>
      <circle cx="68" cy="58" r="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <circle cx="40" cy="70" r="8" fill="rgba(255,255,255,0.1)"  stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
      <line x1="32" y1="34" x2="24" y2="28" stroke="rgba(255,255,255,0.2)"  strokeWidth="1"/>
      <line x1="48" y1="34" x2="56" y2="28" stroke="rgba(255,255,255,0.2)"  strokeWidth="1"/>
      <line x1="32" y1="46" x2="18" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <line x1="48" y1="46" x2="62" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <line x1="40" y1="50" x2="40" y2="62" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <text x="18" y="25" fontFamily="system-ui" fontSize="8" fill="white"   opacity="0.7" textAnchor="middle">A</text>
      <text x="62" y="25" fontFamily="system-ui" fontSize="8" fill="white"   opacity="0.7" textAnchor="middle">B</text>
      <text x="12" y="61" fontFamily="system-ui" fontSize="8" fill="#C9933B" opacity="0.9" textAnchor="middle">C</text>
      <text x="68" y="61" fontFamily="system-ui" fontSize="8" fill="white"   opacity="0.7" textAnchor="middle">D</text>
    </svg>
  )
}

export function LawIcon() {
  return (
    <svg width={SZ} height={SZ} viewBox="0 0 80 80" fill="none">
      <line x1="40" y1="14" x2="40" y2="64" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="26" x2="64" y2="26" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="26" x2="16" y2="46" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <line x1="24" y1="26" x2="28" y2="46" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <path d="M12,46 Q22,54 30,46" fill="none" stroke="#C9933B" strokeWidth="2" strokeLinecap="round"/>
      <line x1="56" y1="26" x2="52" y2="38" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <line x1="60" y1="26" x2="64" y2="38" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      <path d="M48,38 Q58,46 68,38" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
      <rect x="32" y="62" width="16" height="4"  rx="2"   fill="rgba(255,255,255,0.3)"/>
      <rect x="28" y="66" width="24" height="3"  rx="1.5" fill="rgba(255,255,255,0.2)"/>
      <circle cx="40" cy="14" r="3" fill="rgba(255,255,255,0.4)"/>
    </svg>
  )
}

export function ESPDefaultIcon() {
  return (
    <svg width={SZ} height={SZ} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      <circle cx="40" cy="40" r="16" fill="rgba(255,255,255,0.08)"/>
      <text x="40" y="45" fontFamily="Georgia,serif" fontSize="16" fontWeight="700" fill="#C9933B" textAnchor="middle">ESP</text>
    </svg>
  )
}

export function getESPIcon(courseTitle: string): ReactNode {
  const t = courseTitle.toLowerCase()
  if (t.includes('accounting'))                    return <AccountingIcon />
  if (t.includes('computer') || t.includes('cs')) return <ComputerScienceIcon />
  if (t.includes('hospitality'))                   return <HospitalityIcon />
  if (t.includes('management'))                    return <ManagementIcon />
  if (t.includes('finance'))                       return <FinanceIcon />
  if (t.includes('social'))                        return <SocialSciencesIcon />
  if (t.includes('law'))                           return <LawIcon />
  return <ESPDefaultIcon />
}
