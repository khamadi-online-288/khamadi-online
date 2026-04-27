'use client'
import { useState, useMemo, ReactNode } from 'react'
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  width?: string
}

interface Props<T extends Record<string, unknown>> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchKeys?: string[]
  pageSize?: number
  emptyMessage?: string
  loading?: boolean
  onRowClick?: (row: T) => void
}

export default function DataTable<T extends Record<string, unknown>>({
  data, columns, searchable = true, searchKeys = [],
  pageSize = 25, emptyMessage = 'Нет данных', loading = false, onRowClick,
}: Props<T>) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter(row =>
      (searchKeys.length ? searchKeys : Object.keys(row)).some(k => String(row[k] ?? '').toLowerCase().includes(q))
    )
  }, [data, query, searchKeys])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), 'ru')
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / pageSize)
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize)

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {searchable && (
        <div style={{ position: 'relative', maxWidth: 300 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={query} onChange={e => { setQuery(e.target.value); setPage(0) }} placeholder="Поиск..."
            style={{ width: '100%', paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }} />
        </div>
      )}
      <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(27,58,107,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {columns.map(col => (
                <th key={col.key} onClick={() => col.sortable !== false && toggleSort(col.key)}
                  style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: col.sortable !== false ? 'pointer' : 'default', userSelect: 'none', width: col.width, borderBottom: '1px solid rgba(27,58,107,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.header}
                    {sortKey === col.key && (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array(5).fill(0).map((_, i) => (
              <tr key={i}>{columns.map(col => (
                <td key={col.key} style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ height: 14, background: '#e2e8f0', borderRadius: 4 }} />
                </td>
              ))}</tr>
            )) : paginated.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ padding: '40px 14px', textAlign: 'center', color: '#94a3b8', fontWeight: 600, fontSize: 14 }}>{emptyMessage}</td></tr>
            ) : paginated.map((row, i) => (
              <tr key={i} onClick={() => onRowClick?.(row)}
                style={{ borderBottom: '1px solid #f8fafc', cursor: onRowClick ? 'pointer' : 'default' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '11px 14px', fontSize: 13, fontWeight: 500, color: '#1e293b' }}>
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#64748b' }}>Показано {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} из {sorted.length}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', cursor: page === 0 ? 'default' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}><ChevronLeft size={14} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(0, Math.min(totalPages - 5, page - 2)) + i
              return <button key={p} onClick={() => setPage(p)} style={{ padding: '6px 11px', borderRadius: 8, border: '1.5px solid', fontSize: 13, fontWeight: 700, borderColor: p === page ? '#1B8FC4' : '#e2e8f0', background: p === page ? '#1B8FC4' : '#fff', color: p === page ? '#fff' : '#475569', cursor: 'pointer' }}>{p + 1}</button>
            })}
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', cursor: page >= totalPages - 1 ? 'default' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1 }}><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
