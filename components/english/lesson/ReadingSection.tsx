import { BookOpen } from 'lucide-react'

type Props = { text: string }

export default function ReadingSection({ text }: Props) {
  return (
    <div>
      <h2 className="text-base font-black text-navy mb-4 flex items-center gap-2">
        <BookOpen size={17} className="text-gold" /> Текст для чтения
      </h2>
      <div className="prose prose-sm max-w-none text-navy/80 leading-relaxed whitespace-pre-wrap bg-light/50 rounded-xl p-5">
        {text}
      </div>
    </div>
  )
}
