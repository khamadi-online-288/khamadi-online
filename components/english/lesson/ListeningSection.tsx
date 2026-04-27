import { Headphones } from 'lucide-react'

type Props = { audioUrl: string; transcript?: string | null }

export default function ListeningSection({ audioUrl, transcript }: Props) {
  return (
    <div>
      <h2 className="text-base font-black text-navy mb-4 flex items-center gap-2">
        <Headphones size={17} className="text-gold" /> Аудирование
      </h2>
      <audio controls className="w-full rounded-xl mb-4 accent-navy">
        <source src={audioUrl} />
        Ваш браузер не поддерживает воспроизведение аудио.
      </audio>
      {transcript && (
        <details className="mt-3">
          <summary className="text-sm font-bold text-navy cursor-pointer hover:text-gold transition select-none">
            Показать транскрипт
          </summary>
          <div className="mt-3 text-sm text-navy/70 leading-relaxed bg-light rounded-xl p-4 whitespace-pre-wrap">
            {transcript}
          </div>
        </details>
      )}
    </div>
  )
}
