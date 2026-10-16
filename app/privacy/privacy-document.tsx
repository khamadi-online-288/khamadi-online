'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Lang = 'kk' | 'ru'

type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }

type Section = {
  id: string
  title: string
  blocks: Block[]
}

type Copy = {
  home: string
  kicker: string
  title: string
  updated: string
  lead: string
  tocLabel: string
  sections: Section[]
  contactTitle: string
  contactText: string
}

const COPY: Record<Lang, Copy> = {
  kk: {
    home: 'Басты бет',
    kicker: 'KHAMADI ONLINE',
    title: 'Құпиялылық саясаты',
    updated: 'Жаңартылған күні: 2026 жылғы 16 қазан',
    lead: 'Бұл бетте khamadi.online қандай деректерді алатынын, оларды не үшін қолданатынын және сіз оларды қалай түзете алатыныңызды немесе жоя алатыныңызды жазамыз.',
    tocLabel: 'Мазмұны',
    contactTitle: 'Сұрақ болса, жазыңыз',
    contactText: 'Аккаунт сіздікі екенін растай алсақ, деректерді көрсетеміз, түзетеміз немесе жоямыз.',
    sections: [
      {
        id: 'about',
        title: 'Бұл құжат не туралы',
        blocks: [
          {
            type: 'p',
            text: 'KHAMADI ONLINE — Қазақстандағы оқушыларға арналған білім платформасы. Мұнда ҰБТ-ға дайындық, ағылшын тілі курстары және НИШ, РФМШ, БИЛ-ге дайындық бар.',
          },
          {
            type: 'p',
            text: 'Саясат сайтты, тіркелуді және оқу кабинеттерін қамтиды. Оны оқу үшін аккаунт қажет емес.',
          },
        ],
      },
      {
        id: 'data',
        title: 'Қандай деректер аламыз',
        blocks: [
          {
            type: 'p',
            text: 'Тіркелгенде және профиль толтырғанда мыналар сақталуы мүмкін:',
          },
          {
            type: 'ul',
            items: [
              'аты-жөні',
              'электрондық пошта',
              'құпия сөз — тек қорғалған түрде; ашық мәтінін көрмейміз және сақтамаймыз',
              'рөл: оқушы, ата-ана немесе оқытушы',
              'қала, сынып және оқыту тілі',
              'мақсатты балл, ҰБТ жылы және бейіндік пәндер',
              'оқушы коды және ата-ана аккаунтының оқушымен байланысы',
              'ағылшын курсының бағыты',
            ],
          },
          {
            type: 'p',
            text: 'Оқу кезінде платформа мыналарды сақтайды:',
          },
          {
            type: 'ul',
            items: [
              'тест пен симулятордағы жауаптар, ұпай және жұмсалған уақыт',
              'прогресс, тәжірибе ұпайы, сериялар және жетістіктер',
              'оқу жоспары, үй тапсырмасы, қатысу және сертификаттар',
              'оқушы мен оқытушы арасындағы платформа ішіндегі хабарламалар',
            ],
          },
          {
            type: 'p',
            text: 'Пошта, WhatsApp немесе Instagram арқылы жазсаңыз, өзіңіз жіберген хабарламаны аламыз. Банк картасының нөмірін жинамаймыз.',
          },
        ],
      },
      {
        id: 'why',
        title: 'Деректер не үшін керек',
        blocks: [
          {
            type: 'ul',
            items: [
              'аккаунт ашу және оған кіру',
              'курстарды, тесттерді және прогресті көрсету',
              'ата-анаға тек байланысқан оқушының нәтижесін көрсету',
              'оқушы мен оқытушы өтініштерін тексеру',
              'қателерді түсіндіру және оқу жоспарын дайындау',
              'сайтты жұмыс күйінде ұстау және аккаунтты қорғау',
            ],
          },
          {
            type: 'p',
            text: 'Дербес деректерді сатпаймыз және бөгде жарнамаға бермейміз.',
          },
        ],
      },
      {
        id: 'ai',
        title: 'Жасанды интеллект',
        blocks: [
          {
            type: 'p',
            text: 'AI-тьютор, қате талдауы және оқу жоспары жауап дайындау үшін сұрақты, сіздің жауабыңызды және пәнді Anthropic сервисіне (Claude) жібереді.',
          },
          {
            type: 'p',
            text: 'Құпия сөз бұл сұрауға кірмейді. Жіберілген мәтін тек сол жауапты көрсету үшін қолданылады.',
          },
        ],
      },
      {
        id: 'share',
        title: 'Кім деректерді өңдейді',
        blocks: [
          {
            type: 'p',
            text: 'Платформа жұмыс істеуі үшін деректер мына сервистерде өңделеді:',
          },
          {
            type: 'ul',
            items: [
              'Supabase — аккаунтқа кіру және дерекқор',
              'Vercel — сайтты орналастыру',
              'Anthropic — жоғарыда айтылған AI функциялары',
            ],
          },
          {
            type: 'p',
            text: 'Бұл компанияларға деректерді өз маркетингі үшін бермейміз.',
          },
        ],
      },
      {
        id: 'cookies',
        title: 'Cookie және браузердегі сақтау',
        blocks: [
          {
            type: 'p',
            text: 'Кіру сессиясы cookie арқылы сақталады, сондықтан әр бетте қайта кірудің қажеті жоқ.',
          },
          {
            type: 'p',
            text: 'Браузерде интерфейс тілі, симулятор нәтижесінің уақытша көшірмесі және хабарлама баптаулары тұруы мүмкін. Бөгде жарнамалық cookie қолданбаймыз.',
          },
        ],
      },
      {
        id: 'keep',
        title: 'Қанша уақыт сақтаймыз',
        blocks: [
          {
            type: 'p',
            text: 'Деректер аккаунт оқуға қажет болғанша сақталады. Сіз жоюды сұрасаңыз, заң ұзағырақ сақтауды міндеттемесе, жазбаны өшіреміз немесе кімге тиесілі екенін ажырату мүмкін болмайтындай етеміз.',
          },
        ],
      },
      {
        id: 'students',
        title: 'Оқушылар',
        blocks: [
          {
            type: 'p',
            text: 'Платформаны мектеп оқушылары қолданады. 18 жасқа толмаған болсаңыз, ата-анаңыздың немесе қамқоршыңыздың хабарымен қолданғаныңыз дұрыс.',
          },
          {
            type: 'p',
            text: 'Ата-ана бөлек аккаунт ашып, оны оқушы коды арқылы байланыстыра алады. Ата-ана тек сол байланысқан оқушының оқу нәтижесін көреді. Деректерді түзету немесе жою туралы ата-ана да, оқушы да жаза алады.',
          },
        ],
      },
      {
        id: 'rights',
        title: 'Сіздің құқықтарыңыз',
        blocks: [
          {
            type: 'p',
            text: 'Қазақстан Республикасының 2013 жылғы 21 мамырдағы № 94-V «Дербес деректер және оларды қорғау туралы» Заңы бойынша сіз:',
          },
          {
            type: 'ul',
            items: [
              'қандай дерек сақталатынын біле аласыз',
              'қате мәліметті түзетуді сұрай аласыз',
              'деректерді жоюды немесе өңдеуді шектеуді сұрай аласыз',
              'келісімді қайтарып ала аласыз',
            ],
          },
          {
            type: 'p',
            text: 'Өтінішті info@khamadi-online.kz адресіне жіберіңіз. Аккаунт сіздікі екенін растаған соң сұрауды орындаймыз.',
          },
        ],
      },
      {
        id: 'security',
        title: 'Қалай қорғаймыз',
        blocks: [
          {
            type: 'p',
            text: 'Құпия сөзді кіру жүйесі хеш түрінде сақтайды. Оқу жазбаларына қолжеткізу шектелген: адам өз деректерін көреді, ал ата-ана тек байланысқан оқушыны көреді.',
          },
          {
            type: 'p',
            text: 'Интернет арқылы берілетін ешбір дерек абсолютті қорғауға ие емес. Құпия сөзді басқа адамға айтпаңыз.',
          },
        ],
      },
      {
        id: 'changes',
        title: 'Саясат өзгерсе',
        blocks: [
          {
            type: 'p',
            text: 'Жаңа редакция осы бетте шығады, жоғарыда жаңартылған күні тұрады. Сайтты әрі қарай қолдану сол редакциямен таныс екеніңізді білдіреді.',
          },
        ],
      },
    ],
  },
  ru: {
    home: 'На главную',
    kicker: 'KHAMADI ONLINE',
    title: 'Политика конфиденциальности',
    updated: 'Дата обновления: 16 октября 2026',
    lead: 'Здесь написано, какие данные получает khamadi.online, зачем они нужны и как вы можете их исправить или удалить.',
    tocLabel: 'Содержание',
    contactTitle: 'Если есть вопрос — напишите',
    contactText: 'Когда подтвердим, что аккаунт ваш, покажем, исправим или удалим данные.',
    sections: [
      {
        id: 'about',
        title: 'О чём этот документ',
        blocks: [
          {
            type: 'p',
            text: 'KHAMADI ONLINE — образовательная платформа для школьников в Казахстане. На ней есть подготовка к ҰБТ, курсы английского и подготовка в НИШ, РФМШ и БИЛ.',
          },
          {
            type: 'p',
            text: 'Политика относится к сайту, регистрации и учебным кабинетам. Читать её можно без аккаунта.',
          },
        ],
      },
      {
        id: 'data',
        title: 'Какие данные мы получаем',
        blocks: [
          {
            type: 'p',
            text: 'При регистрации и заполнении профиля мы можем хранить:',
          },
          {
            type: 'ul',
            items: [
              'имя',
              'адрес электронной почты',
              'пароль — только в защищённом виде; открытый текст мы не видим и не храним',
              'роль: ученик, родитель или преподаватель',
              'город, класс и язык обучения',
              'целевой балл, год ҰБТ и комбинацию профильных предметов',
              'код ученика и связь аккаунта родителя с аккаунтом ученика',
              'направление курса английского',
            ],
          },
          {
            type: 'p',
            text: 'Во время учёбы платформа сохраняет:',
          },
          {
            type: 'ul',
            items: [
              'ответы в тестах и симуляторе, баллы и затраченное время',
              'прогресс, очки опыта, серии и достижения',
              'учебный план, домашние задания, посещаемость и сертификаты',
              'сообщения между учеником и преподавателем внутри платформы',
            ],
          },
          {
            type: 'p',
            text: 'Если вы пишете на почту, в WhatsApp или Instagram, мы получаем сообщение, которое вы сами отправили. Номер банковской карты мы не собираем.',
          },
        ],
      },
      {
        id: 'why',
        title: 'Зачем нужны данные',
        blocks: [
          {
            type: 'ul',
            items: [
              'создать аккаунт и входить в него',
              'показывать курсы, тесты и прогресс',
              'показывать родителю результаты только связанного ученика',
              'проверять заявки учеников и преподавателей',
              'объяснять ошибки и готовить учебный план',
              'поддерживать работу сайта и защищать аккаунт',
            ],
          },
          {
            type: 'p',
            text: 'Персональные данные мы не продаём и не передаём для чужой рекламы.',
          },
        ],
      },
      {
        id: 'ai',
        title: 'Искусственный интеллект',
        blocks: [
          {
            type: 'p',
            text: 'AI-тьютор, разбор ошибок и учебный план отправляют вопрос, ваш ответ и предмет в сервис Anthropic (Claude), чтобы подготовить ответ.',
          },
          {
            type: 'p',
            text: 'Пароль в этот запрос не входит. Переданный текст используется, чтобы показать вам этот ответ.',
          },
        ],
      },
      {
        id: 'share',
        title: 'Кто обрабатывает данные',
        blocks: [
          {
            type: 'p',
            text: 'Чтобы платформа работала, данные обрабатываются в таких сервисах:',
          },
          {
            type: 'ul',
            items: [
              'Supabase — вход в аккаунт и база данных',
              'Vercel — размещение сайта',
              'Anthropic — AI-функции, описанные выше',
            ],
          },
          {
            type: 'p',
            text: 'Этим компаниям мы не отдаём данные для их собственного маркетинга.',
          },
        ],
      },
      {
        id: 'cookies',
        title: 'Cookie и хранение в браузере',
        blocks: [
          {
            type: 'p',
            text: 'Сессия входа хранится в cookie, чтобы не входить заново на каждой странице.',
          },
          {
            type: 'p',
            text: 'В браузере могут оставаться язык интерфейса, временная копия результата симулятора и настройки уведомлений. Сторонние рекламные cookie мы не ставим.',
          },
        ],
      },
      {
        id: 'keep',
        title: 'Сколько храним',
        blocks: [
          {
            type: 'p',
            text: 'Данные хранятся, пока аккаунт нужен для учёбы. Если вы просите удалить их, мы стираем запись или делаем её несвязанной с человеком, кроме случаев, когда закон требует хранить её дольше.',
          },
        ],
      },
      {
        id: 'students',
        title: 'Ученики',
        blocks: [
          {
            type: 'p',
            text: 'Платформой пользуются школьники. Если вам нет 18 лет, лучше заниматься с ведома родителя или опекуна.',
          },
          {
            type: 'p',
            text: 'Родитель может открыть отдельный аккаунт и связать его по коду ученика. Родитель видит учебные результаты только этого ученика. Исправить или удалить данные может попросить и родитель, и ученик.',
          },
        ],
      },
      {
        id: 'rights',
        title: 'Ваши права',
        blocks: [
          {
            type: 'p',
            text: 'По Закону Республики Казахстан от 21 мая 2013 года № 94-V «О персональных данных и их защите» вы можете:',
          },
          {
            type: 'ul',
            items: [
              'узнать, какие данные хранятся',
              'попросить исправить неточность',
              'попросить удалить данные или ограничить обработку',
              'отозвать согласие',
            ],
          },
          {
            type: 'p',
            text: 'Напишите на info@khamadi-online.kz. После того как подтвердим, что аккаунт ваш, выполним запрос.',
          },
        ],
      },
      {
        id: 'security',
        title: 'Как защищаем',
        blocks: [
          {
            type: 'p',
            text: 'Пароль система входа хранит в виде хеша. Доступ к учебным записям ограничен: человек видит свои данные, а родитель — только связанного ученика.',
          },
          {
            type: 'p',
            text: 'Ни одна передача через интернет не защищена абсолютно. Не сообщайте пароль другим людям.',
          },
        ],
      },
      {
        id: 'changes',
        title: 'Если политика изменится',
        blocks: [
          {
            type: 'p',
            text: 'Новая редакция появится на этой странице, дата обновления стоит вверху. Дальнейшее использование сайта означает, что вы знакомы с этой редакцией.',
          },
        ],
      },
    ],
  },
}

function readLang(value: string | null): Lang {
  return value === 'ru' ? 'ru' : 'kk'
}

export default function PrivacyDocument() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<Lang>(() => readLang(searchParams.get('lang')))
  const copy = COPY[lang]

  function choose(next: Lang) {
    setLang(next)
    const url = next === 'ru' ? '/privacy?lang=ru' : '/privacy'
    window.history.replaceState(null, '', url)
  }

  return (
    <div className="privacy">
      <header className="privacy-bar">
        <a className="privacy-brand" href="/">
          <span className="privacy-mark" aria-hidden="true">K</span>
          <span>
            KHAMADI <em>ONLINE</em>
          </span>
        </a>
        <div className="privacy-langs" role="group" aria-label={lang === 'kk' ? 'Тіл' : 'Язык'}>
          <button
            type="button"
            aria-pressed={lang === 'kk'}
            onClick={() => choose('kk')}
          >
            Қазақша
          </button>
          <button
            type="button"
            aria-pressed={lang === 'ru'}
            onClick={() => choose('ru')}
          >
            Русский
          </button>
        </div>
      </header>

      <main className="privacy-main" lang={lang}>
        <p className="privacy-kicker">{copy.kicker}</p>
        <h1>{copy.title}</h1>
        <p className="privacy-updated">{copy.updated}</p>
        <p className="privacy-lead">{copy.lead}</p>

        <nav className="privacy-toc" aria-label={copy.tocLabel}>
          <p>{copy.tocLabel}</p>
          <ol>
            {copy.sections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {copy.sections.map((section, index) => (
          <section key={section.id} id={section.id}>
            <h2>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {section.title}
            </h2>
            {section.blocks.map((block, blockIndex) =>
              block.type === 'p' ? (
                <p key={blockIndex}>{block.text}</p>
              ) : (
                <ul key={blockIndex}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            )}
          </section>
        ))}

        <aside className="privacy-contact">
          <div>
            <h2>{copy.contactTitle}</h2>
            <p>{copy.contactText}</p>
          </div>
          <div className="privacy-contact-links">
            <a href="mailto:info@khamadi-online.kz">info@khamadi-online.kz</a>
            <a href="mailto:info@khamadi.online">info@khamadi.online</a>
            <a href="https://wa.me/77066405577" target="_blank" rel="noopener noreferrer">
              WhatsApp · +7 706 640 55 77
            </a>
          </div>
        </aside>

        <a className="privacy-back" href="/">
          ← {copy.home}
        </a>
      </main>

      <style>{`
        .privacy {
          min-height: 100vh;
          background:
            radial-gradient(900px 420px at 8% -10%, rgba(56, 189, 248, 0.18), transparent 60%),
            radial-gradient(700px 380px at 100% 0%, rgba(14, 165, 233, 0.12), transparent 55%),
            #f7fbfe;
          color: #0f172a;
        }

        .privacy-bar {
          position: sticky;
          top: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 6vw;
          background: rgba(247, 251, 254, 0.86);
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
          backdrop-filter: blur(16px);
        }

        .privacy-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .privacy-mark {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #38bdf8, #0284c7);
          color: #fff;
          font-size: 16px;
          font-weight: 800;
        }

        .privacy-brand em {
          color: #0284c7;
          font-style: normal;
        }

        .privacy-langs {
          display: flex;
          padding: 4px;
          border-radius: 999px;
          background: #fff;
          border: 1px solid rgba(14, 165, 233, 0.16);
        }

        .privacy-langs button {
          min-height: 44px;
          border-radius: 999px;
          padding: 8px 14px;
          background: transparent;
          color: #475569;
          font-size: 13px;
          font-weight: 800;
        }

        .privacy-langs button[aria-pressed="true"] {
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          color: #fff;
        }

        .privacy-main {
          width: min(760px, calc(100% - 40px));
          margin: 0 auto;
          padding: 56px 0 80px;
        }

        .privacy-kicker {
          margin-bottom: 12px;
          color: #0284c7;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .privacy h1 {
          max-width: 14ch;
          font-size: clamp(36px, 6vw, 56px);
          line-height: 1.02;
          font-weight: 800;
          letter-spacing: -0.045em;
        }

        .privacy-updated {
          margin-top: 18px;
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
        }

        .privacy-lead {
          margin-top: 16px;
          max-width: 62ch;
          color: #334155;
          font-size: 17px;
          line-height: 1.7;
          font-weight: 600;
        }

        .privacy-toc {
          margin-top: 36px;
          padding: 22px 22px 8px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
        }

        .privacy-toc p {
          margin-bottom: 8px;
          color: #64748b;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .privacy-toc ol {
          list-style: none;
        }

        .privacy-toc a {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding: 11px 0;
          border-top: 1px solid rgba(226, 232, 240, 0.9);
          color: #0f172a;
          font-size: 15px;
          font-weight: 700;
        }

        .privacy-toc a span {
          color: #0284c7;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .privacy-toc a:hover {
          color: #0284c7;
        }

        .privacy section {
          margin-top: 42px;
          scroll-margin-top: 96px;
        }

        .privacy section h2 {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 14px;
          font-size: 24px;
          line-height: 1.25;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .privacy section h2 span {
          color: #0284c7;
          font-size: 13px;
          letter-spacing: 0.04em;
        }

        .privacy section p,
        .privacy section li {
          max-width: 68ch;
          color: #334155;
          font-size: 16px;
          line-height: 1.75;
          font-weight: 600;
        }

        .privacy section p + p,
        .privacy section ul + p,
        .privacy section p + ul {
          margin-top: 12px;
        }

        .privacy section ul {
          margin: 12px 0 0;
          padding: 0;
          list-style: none;
        }

        .privacy section li {
          position: relative;
          padding: 6px 0 6px 18px;
        }

        .privacy section li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.85em;
          width: 7px;
          height: 7px;
          border-radius: 99px;
          background: #38bdf8;
        }

        .privacy-contact {
          margin-top: 56px;
          display: grid;
          gap: 22px;
          padding: 28px;
          border-radius: 32px;
          background: #0f172a;
          color: #fff;
        }

        .privacy-contact h2 {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .privacy-contact p {
          margin-top: 8px;
          max-width: 46ch;
          color: rgba(255, 255, 255, 0.72);
          font-size: 15px;
          line-height: 1.7;
          font-weight: 600;
        }

        .privacy-contact-links {
          display: grid;
          gap: 10px;
          align-content: end;
        }

        .privacy-contact a {
          color: #7dd3fc;
          font-size: 15px;
          font-weight: 800;
        }

        .privacy-contact a:hover {
          color: #fff;
        }

        .privacy-back {
          display: inline-flex;
          margin-top: 28px;
          color: #0369a1;
          font-size: 14px;
          font-weight: 800;
        }

        .privacy a:focus-visible,
        .privacy button:focus-visible {
          outline: 2px solid #0284c7;
          outline-offset: 3px;
        }

        @media (min-width: 800px) {
          .privacy-contact {
            grid-template-columns: 1.2fr 0.8fr;
            align-items: end;
          }
        }

        @media (max-width: 640px) {
          .privacy-bar {
            padding: 14px 16px;
          }

          .privacy-brand > span:last-child {
            display: none;
          }

          .privacy-main {
            width: min(760px, calc(100% - 32px));
            padding-top: 36px;
          }

          .privacy-langs button {
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  )
}
