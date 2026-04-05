function InfoCard({
  title,
  subtitle,
  children,
  glow,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  glow?: string
}) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.82)',
        border: '1px solid rgba(226,232,240,0.95)',
        borderRadius: '26px',
        padding: '22px',
        boxShadow:
          '0 20px 40px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.45)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {glow && (
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-10px',
            width: '120px',
            height: '120px',
            borderRadius: '999px',
            background: glow,
            filter: 'blur(28px)',
            opacity: 0.45,
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '6px',
            letterSpacing: '-0.4px',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: '13px',
              color: '#64748B',
              lineHeight: 1.7,
              marginBottom: '16px',
            }}
          >
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

function SmallStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.82)',
        border: '1px solid rgba(226,232,240,0.95)',
        borderRadius: '22px',
        padding: '18px',
        boxShadow:
          '0 18px 34px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.45)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: 800,
          color: '#64748B',
          marginBottom: '8px',
          letterSpacing: '0.35px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#0F172A',
          letterSpacing: '-0.5px',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '999px',
          background: '#0EA5E9',
          marginTop: '8px',
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontSize: '14px',
          color: '#334155',
          lineHeight: 1.75,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: '999px',
        background: 'linear-gradient(135deg, #E0F2FE, #F8FAFC)',
        border: '1px solid #BAE6FD',
        color: '#0369A1',
        fontSize: '13px',
        fontWeight: 800,
      }}
    >
      {children}
    </div>
  )
}

function TableRow({
  left,
  right,
}: {
  left: string
  right: string
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        padding: '14px 0',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#0F172A',
        }}
      >
        {left}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: '#64748B',
          fontWeight: 700,
        }}
      >
        {right}
      </div>
    </div>
  )
}

export default function UbtInfoPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '34px',
          padding: '30px',
          background:
            'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 22%), linear-gradient(135deg, #020617 0%, #0F172A 36%, #0369A1 68%, #0EA5E9 100%)',
          color: '#FFFFFF',
          boxShadow: '0 30px 60px rgba(14,165,233,0.18)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-40px',
            width: '220px',
            height: '220px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.10)',
            filter: 'blur(26px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-70px',
            left: '-40px',
            width: '220px',
            height: '220px',
            borderRadius: '999px',
            background: 'rgba(125,211,252,0.12)',
            filter: 'blur(28px)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '10px 14px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.16)',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '16px',
            }}
          >
            ҰБТ АҚПАРАТЫ
          </div>

          <h1
            style={{
              fontSize: '40px',
              fontWeight: 800,
              lineHeight: 1.18,
              marginBottom: '12px',
              letterSpacing: '-1px',
            }}
          >
            ҰБТ туралы маңызды ақпараттың бәрі бір жерде
          </h1>

          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.86)',
              maxWidth: '820px',
            }}
          >
            Бұл бөлімде ҰБТ форматы, пәндер құрылымы, уақыт, тапсыру кезеңдері,
            рұқсат етілетін және тыйым салынатын заттар, сертификат және
            шекті баллдар туралы қысқаша әрі түсінікті мәлімет берілген.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}
      >
        <SmallStat label="СҰРАҚ САНЫ" value="120" />
        <SmallStat label="ЕҢ ЖОҒАРЫ БАЛЛ" value="140" />
        <SmallStat label="ТЕСТ УАҚЫТЫ" value="240 мин" />
        <SmallStat label="ПӘН САНЫ" value="5" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '18px',
        }}
      >
        <InfoCard
          title="ҰБТ форматы"
          subtitle="Толық оқу формасына түсетін талапкерлер үшін негізгі құрылым."
          glow="rgba(56,189,248,0.55)"
        >
          <div style={{ display: 'grid', gap: '12px' }}>
            <Bullet>ҰБТ 5 пәннен тұрады: 3 міндетті және 2 бейіндік пән.</Bullet>
            <Bullet>
              Міндетті пәндер: Қазақстан тарихы, Оқу сауаттылығы, Математикалық
              сауаттылық.
            </Bullet>
            <Bullet>
              Бейіндік пәндер талапкер таңдаған мамандық бағытына байланысты.
            </Bullet>
            <Bullet>
              Жалпы тапсырма саны — 120, ең жоғары балл — 140.
            </Bullet>
            <Bullet>
              Тест уақыты — 4 сағат немесе 240 минут.
            </Bullet>
          </div>
        </InfoCard>

        <InfoCard
          title="Шығармашылық бағыттар"
          subtitle="Шығармашылық мамандықтарға түсетін талапкерлер үшін."
          glow="rgba(14,165,233,0.45)"
        >
          <div style={{ display: 'grid', gap: '12px' }}>
            <Bullet>
              Шығармашылық бағыт таңдағандар 3 міндетті пәнді тапсырады.
            </Bullet>
            <Bullet>
              2 бейіндік пәннің орнына ЖОО-да 2 шығармашылық емтихан өтеді.
            </Bullet>
            <Bullet>
              Бұл ерекшелікті университет таңдағанда міндетті түрде ескеру керек.
            </Bullet>
          </div>
        </InfoCard>
      </div>

      <InfoCard
        title="Пәндер және сұрақтар құрылымы"
        subtitle="Әр блок бойынша тапсырма саны мен шекті балл."
      >
        <div>
          <TableRow left="Қазақстан тарихы" right="20 сұрақ • шекті 5 балл" />
          <TableRow left="Оқу сауаттылығы" right="10 сұрақ • шекті 3 балл" />
          <TableRow left="Математикалық сауаттылық" right="10 сұрақ • шекті 3 балл" />
          <TableRow left="1-бейіндік пән" right="40 сұрақ • 50 балл • шекті 5" />
          <TableRow left="2-бейіндік пән" right="40 сұрақ • 50 балл • шекті 5" />
        </div>
      </InfoCard>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '18px',
        }}
      >
        <InfoCard
          title="ҰБТ уақыты"
          subtitle="Тапсыру кезінде уақыт менеджменті өте маңызды."
        >
          <div style={{ display: 'grid', gap: '12px' }}>
            <Bullet>Негізгі уақыт — 240 минут.</Bullet>
            <Bullet>
              Ерекше білім беру қажеттілігі бар талапкерлерге қосымша 40 минут
              беріледі.
            </Bullet>
            <Bullet>
              Таймерді дұрыс басқару үшін KHAMADI ішіндегі симуляторды тұрақты
              түрде тапсырып тұрған дұрыс.
            </Bullet>
          </div>
        </InfoCard>

        <InfoCard
          title="Қашан тапсырады"
          subtitle="ҰБТ жыл ішінде бірнеше кезеңмен өткізіледі."
        >
          <div style={{ display: 'grid', gap: '12px' }}>
            <Bullet>
              Нақты күн, уақыт және орын талапкердің НЦТ-дағы жеке кабинетінде
              көрсетіледі.
            </Bullet>
            <Bullet>
              Тіркелу `app.testcenter.kz` жүйесі арқылы жасалады.
            </Bullet>
            <Bullet>
              Негізгі, ақылы және басқа кезеңдер бойынша өтініш беру мерзімдері
              жыл сайын ресми түрде жарияланады.
            </Bullet>
          </div>
        </InfoCard>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '18px',
        }}
      >
        <InfoCard
          title="Не алып кіруге болады"
          subtitle="Қысқаша ереже."
        >
          <div style={{ display: 'grid', gap: '12px' }}>
            <Bullet>Жеке басын куәландыратын құжат.</Bullet>
            <Bullet>Тестілеуге қатысу үшін қажет ресми мәліметтер.</Bullet>
            <Bullet>
              Қалған нақты ережелерді тіркелген кезде ресми нұсқаулықтан тексеру қажет.
            </Bullet>
          </div>
        </InfoCard>

        <InfoCard
          title="Не алып кіруге болмайды"
          subtitle="Тәртіп бұзса, нәтижеге әсер етуі мүмкін."
        >
          <div style={{ display: 'grid', gap: '12px' }}>
            <Bullet>Телефон және басқа электронды құрылғылар.</Bullet>
            <Bullet>Шпаргалка, қағаз жазбалар, смарт-гаджеттер.</Bullet>
            <Bullet>
              Емтихан ережелеріне қайшы кез келген көмекші заттар.
            </Bullet>
          </div>
        </InfoCard>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '18px',
        }}
      >
        <InfoCard
          title="ҰБТ сертификаты"
          subtitle="Ресми сертификатты қайдан көруге және алуға болады."
          glow="rgba(56,189,248,0.42)"
        >
          <div style={{ display: 'grid', gap: '12px' }}>
            <Bullet>
              Сертификатты `app.testcenter.kz` жеке кабинетінен көруге болады.
            </Bullet>
            <Bullet>
              Сондай-ақ `certificate.testcenter.kz` арқылы тест түрі, жыл,
              ЖСН және ИКТ арқылы тексеруге болады.
            </Bullet>
            <Bullet>
              Бұл сертификат грант конкурсына және құжат тапсыру кезінде қажет.
            </Bullet>
          </div>
        </InfoCard>

        <InfoCard
          title="Сертификатты жүктеу"
          subtitle="Бұл — KHAMADI ішіндегі жеке функция."
          glow="rgba(14,165,233,0.35)"
        >
          <div style={{ display: 'grid', gap: '12px' }}>
            <Bullet>
              Оқушы кейін өз сертификатының PDF немесе скрин нұсқасын профильге жүктей алады.
            </Bullet>
            <Bullet>
              Бұл университеттер бөлімімен және жеке ұсыныстар жүйесімен байланыстырылады.
            </Bullet>
            <Bullet>
              Яғни ресми сертификат НЦТ-дан алынады, ал KHAMADI ішінде сақталады.
            </Bullet>
          </div>
        </InfoCard>
      </div>

      <InfoCard
        title="Шекті баллдар"
        subtitle="Ресми шектерді есте сақтау маңызды."
      >
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Tag>Қазақстан тарихы — 5</Tag>
          <Tag>Оқу сауаттылығы — 3</Tag>
          <Tag>Математикалық сауаттылық — 3</Tag>
          <Tag>Әр бейіндік пән — 5</Tag>
        </div>
      </InfoCard>

      <InfoCard
        title="Жиі қойылатын сұрақтар"
        subtitle="Қысқа FAQ."
      >
        <div style={{ display: 'grid', gap: '14px' }}>
          {[
            [
              'ҰБТ неше сұрақтан тұрады?',
              'Жалпы саны — 120 сұрақ.',
            ],
            [
              'Ең жоғары балл қанша?',
              'Ең жоғары балл — 140.',
            ],
            [
              'ҰБТ қанша уақытқа созылады?',
              'Негізгі уақыт — 240 минут.',
            ],
            [
              'Сертификатты қайдан алуға болады?',
              'НЦТ-ның жеке кабинетінен немесе certificate.testcenter.kz арқылы.',
            ],
          ].map(([q, a]) => (
            <div
              key={q}
              style={{
                padding: '18px',
                borderRadius: '18px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#0F172A',
                  marginBottom: '6px',
                }}
              >
                {q}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#64748B',
                  lineHeight: 1.75,
                }}
              >
                {a}
              </div>
            </div>
          ))}
        </div>
      </InfoCard>
    </div>
  )
}