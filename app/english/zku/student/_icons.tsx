// Shared SVG icon library for ZKU English platform
// All icons: 24×24 viewBox, stroke-based, Lucide-style

import React from 'react'

interface IconProps { size?: number; color?: string; strokeWidth?: number }

const base = (d: string | React.ReactNode, { size = 20, color = 'currentColor', strokeWidth = 1.8 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
)

export const IcHome        = (p: IconProps) => base(<><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></>, p)
export const IcBook        = (p: IconProps) => base(<><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>, p)
export const IcBookOpen    = (p: IconProps) => base(<><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></>, p)
export const IcGraduation  = (p: IconProps) => base(<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>, p)
export const IcTarget      = (p: IconProps) => base(<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>, p)
export const IcStar        = (p: IconProps) => base('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', p)
export const IcTrophy      = (p: IconProps) => base(<><path d="M8 21h8M12 17v4M7 3h10"/><path d="M7 3a5 5 0 005 5 5 5 0 005-5"/><path d="M17 3c0 4-1.3 6.5-4 8H11c-2.7-1.5-4-4-4-8"/><path d="M5 3H3v1.5A5.5 5.5 0 007 10M19 3h2v1.5A5.5 5.5 0 0117 10"/></>, p)
export const IcMedal       = (p: IconProps) => base(<><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>, p)
export const IcDiamond     = (p: IconProps) => base('M2.7 10.3l9.3 9.3 9.3-9.3L12 2.7zm0 0L12 7.4l9.3 2.9', p)
export const IcLightning   = (p: IconProps) => base('M13 2L3 14h9l-1 8 10-12h-9z', p)
export const IcFlame       = (p: IconProps) => base('M12 2c0 6-8 8-8 14a8 8 0 0016 0c0-3-1-6-3-8-1 3-3 4-5 2z', p)
export const IcLock        = (p: IconProps) => base(<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>, p)
export const IcCheckCircle = (p: IconProps) => base(<><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>, p)
export const IcXCircle     = (p: IconProps) => base(<><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>, p)
export const IcAlertTri    = (p: IconProps) => base(<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>, p)
export const IcBarChart    = (p: IconProps) => base(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>, p)
export const IcTrendUp     = (p: IconProps) => base('M23 6l-9.5 9.5-5-5L1 18M17 6h6v6', p)
export const IcClipboard   = (p: IconProps) => base(<><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></>, p)
export const IcBell        = (p: IconProps) => base(<><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></>, p)
export const IcUser        = (p: IconProps) => base(<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>, p)
export const IcUsers       = (p: IconProps) => base(<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>, p)
export const IcMail        = (p: IconProps) => base(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, p)
export const IcEdit        = (p: IconProps) => base('M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z', p)
export const IcHeadphones  = (p: IconProps) => base(<><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></>, p)
export const IcMic         = (p: IconProps) => base(<><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></>, p)
export const IcSearch      = (p: IconProps) => base(<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>, p)
export const IcSave        = (p: IconProps) => base(<><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>, p)
export const IcSend        = (p: IconProps) => base(<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>, p)
export const IcTool        = (p: IconProps) => base('M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z', p)
export const IcPalette     = (p: IconProps) => base(<><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></>, p)
export const IcCheck       = (p: IconProps) => base('M20 6L9 17l-5-5', p)
export const IcX           = (p: IconProps) => base('M18 6L6 18M6 6l12 12', p)
export const IcArrowRight  = (p: IconProps) => base('M5 12h14M12 5l7 7-7 7', p)
export const IcChevronDown = (p: IconProps) => base('M6 9l6 6 6-6', p)
export const IcInfo        = (p: IconProps) => base(<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>, p)
export const IcRocket      = (p: IconProps) => base(<><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M15 12v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>, p)
export const IcAward       = (p: IconProps) => base(<><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>, p)
export const IcLogOut      = (p: IconProps) => base(<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>, p)
export const IcSettings    = (p: IconProps) => base(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>, p)
export const IcClock       = (p: IconProps) => base(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, p)
export const IcFileText    = (p: IconProps) => base(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>, p)
export const IcVolume      = (p: IconProps) => base(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></>, p)