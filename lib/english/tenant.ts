export type TenantCode = 'khamadi' | 'zku'

export interface TenantConfig {
  code: TenantCode
  name: string
  logo: string
  primaryColor: string
  secondaryColor: string
  emailDomain: string | null
  poweredBy: boolean
  description: string
}

export function getTenantFromPath(pathname: string): TenantCode {
  if (pathname.startsWith('/english/zku')) return 'zku'
  return 'khamadi'
}

export const TENANT_CONFIG: Record<TenantCode, TenantConfig> = {
  khamadi: {
    code: 'khamadi',
    name: 'KHAMADI English',
    logo: '/logos/khamadi-english.svg',
    primaryColor: '#1B3A6B',
    secondaryColor: '#1B8FC4',
    emailDomain: null,
    poweredBy: false,
    description: 'Учи английский с нуля до C1. Курсы, видеоуроки, сертификаты.',
  },
  zku: {
    code: 'zku',
    name: 'ЗКУ by KHAMADI English',
    logo: '/logos/zku.svg',
    primaryColor: '#003876',
    secondaryColor: '#FFC72C',
    emailDomain: '@zku.kz',
    poweredBy: true,
    description: 'Платформа изучения английского языка для студентов и преподавателей ЗКУ.',
  },
}

export function validateTenantEmail(email: string, tenant: TenantCode): boolean {
  const config = TENANT_CONFIG[tenant]
  if (!config.emailDomain) return true
  return email.toLowerCase().endsWith(config.emailDomain)
}
