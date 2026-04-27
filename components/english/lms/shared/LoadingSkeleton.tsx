'use client'

export default function LoadingSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(27,58,107,0.08)' }}>
      <div style={{ background: '#f8fafc', padding: '11px 14px', display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 16 }}>
        {Array(cols).fill(0).map((_, i) => <div key={i} style={{ height: 12, background: '#e2e8f0', borderRadius: 4 }} />)}
      </div>
      {Array(rows).fill(0).map((_, r) => (
        <div key={r} style={{ padding: '13px 14px', background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 16 }}>
          {Array(cols).fill(0).map((_, c) => <div key={c} style={{ height: 14, background: '#f1f5f9', borderRadius: 4 }} />)}
        </div>
      ))}
    </div>
  )
}
