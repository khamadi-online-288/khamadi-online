'use client'

import { useState } from 'react'
import { PenLine } from 'lucide-react'

type Props = {
  task:     string
  value:    string
  onChange: (v: string) => void
}

export default function WritingSection({ task, value, onChange }: Props) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0

  return (
    <div>
      <h2 className="text-base font-black text-navy mb-3 flex items-center gap-2">
        <PenLine size={17} className="text-gold" /> Письмо
      </h2>
      <div className="bg-light rounded-xl p-4 mb-4 text-sm text-navy/80 leading-relaxed">
        {task}
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={8}
        placeholder="Напишите ваш ответ здесь..."
        className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder-gray-300 outline-none focus:border-mid focus:ring-2 focus:ring-mid/20 resize-none transition"
      />
      <p className="text-xs text-gray-400 mt-1.5 text-right">{wordCount} слов</p>
    </div>
  )
}
