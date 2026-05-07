'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Sidebar from '@/components/english/layout/Sidebar'
import Navbar  from '@/components/english/layout/Navbar'
import type { UserRole, CefrLevel } from '@/types/english/database'

type Props = {
  children:  React.ReactNode
  role:      UserRole
  userName:  string
  level:     CefrLevel | ''
}

export default function EnglishShell({ children, role, userName, level }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile,    setIsMobile]    = useState(false)

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 1024) }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false)
  }, [isMobile])

  return (
    <div style={{ minHeight: '100vh', background: '#F5F9FD', position: 'relative' }}>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 40, backdropFilter: 'blur(2px)' }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: 256,
          zIndex: 50,
          overflowY: 'auto',
          overflowX: 'hidden',
          transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
          transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Mobile close button inside sidebar */}
        {isMobile && sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute', top: 14, right: 14, zIndex: 10,
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(255,255,255,0.12)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Закрыть меню"
          >
            <X size={18} color="#fff" />
          </button>
        )}
        <Sidebar role={role} userName={userName} />
      </div>

      {/* Main content area */}
      <div
        style={{
          marginLeft: isMobile ? 0 : 256,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.28s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: '#fff',
            borderBottom: '1px solid rgba(226,232,240,0.8)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxShadow: '0 2px 12px rgba(27,58,107,0.06)',
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                width: 40, height: 40, borderRadius: 12,
                border: '1.5px solid rgba(27,143,196,0.18)',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-label="Открыть меню"
            >
              <Menu size={20} color="#1B3A6B" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'linear-gradient(135deg,#1B3A6B,#1B8FC4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>K</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                KHAMADI ENGLISH
              </span>
            </div>
          </div>
        )}

        {/* Desktop navbar */}
        {!isMobile && <Navbar userName={userName} level={level as CefrLevel} />}

        {/* Page content */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: isMobile ? '16px 14px 48px' : '28px 32px 48px',
            minWidth: 0,
            flex: 1,
          }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
