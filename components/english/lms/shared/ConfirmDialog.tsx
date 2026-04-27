'use client'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Подтвердить', onConfirm, onCancel, danger = false }: {
  open: boolean; title: string; message: string; confirmLabel?: string
  onConfirm: () => void; onCancel: () => void; danger?: boolean
}) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onCancel}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 14, marginBottom: 24, alignItems: 'flex-start' }}>
          {danger && <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AlertTriangle size={22} color="#ef4444" /></div>}
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{message}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'Montserrat' }}>Отмена</button>
          <button onClick={onConfirm} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: danger ? '#ef4444' : '#1B8FC4', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'Montserrat' }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
