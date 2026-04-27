import { List } from 'lucide-react'
import type { VocabItem } from '@/types/english/database'

type Props = { items: VocabItem[] }

export default function VocabularySection({ items }: Props) {
  return (
    <div>
      <h2 className="text-base font-black text-navy mb-4 flex items-center gap-2">
        <List size={17} className="text-gold" /> Словарь ({items.length} слов)
      </h2>
      <div className="grid sm:grid-cols-2 gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between bg-light rounded-xl px-4 py-3">
            <span className="font-bold text-navy text-sm">{item.en}</span>
            <span className="text-gray-500 text-sm">{item.ru}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
