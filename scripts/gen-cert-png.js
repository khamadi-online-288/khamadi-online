// One-off script: render certificate HTML → PNG via Edge headless
// Run: node scripts/gen-cert-png.js
const fs   = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const QRCode = require('qrcode')

const ROOT      = path.join(__dirname, '..')
const HTML_FILE = path.join(ROOT, 'public', 'cert-preview.html')
const PNG_FILE  = path.join(ROOT, 'public', 'test-certificate.png')
const EDGE      = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function generate() {
  // QR as inline data URL
  const qrDataUrl = await QRCode.toDataURL(
    'https://khamadi.online/english/cert/KHEN-2026-TEST-001',
    { width: 160, margin: 1, color: { dark: '#1B3A6B', light: '#FFFEF9' } }
  )

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,800;0,900;1,400;1,700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 794px; height: 562px; overflow: hidden; background: #fff; }
  .cert {
    width: 794px; height: 562px;
    background: #FFFEF9;
    border: 2px solid #1B3A6B;
    position: relative;
    font-family: 'Montserrat', DejaVu Sans, Arial, sans-serif;
    display: flex;
    flex-direction: column;
  }
  /* Inner border */
  .cert::after {
    content: '';
    position: absolute; inset: 9px;
    border: 1px solid rgba(201,147,59,0.4);
    pointer-events: none;
  }
  .corner {
    position: absolute; width: 30px; height: 30px;
    pointer-events: none;
  }
  .corner-tl { top:16px; left:16px; border-top:1.5px solid #1B3A6B; border-left:1.5px solid #1B3A6B; }
  .corner-tr { top:16px; right:16px; border-top:1.5px solid #1B3A6B; border-right:1.5px solid #1B3A6B; }
  .corner-bl { bottom:16px; left:16px; border-bottom:1.5px solid #1B3A6B; border-left:1.5px solid #1B3A6B; }
  .corner-br { bottom:16px; right:16px; border-bottom:1.5px solid #1B3A6B; border-right:1.5px solid #1B3A6B; }
  .dot {
    position: absolute; width: 6px; height: 6px;
    background: #C9933B; border-radius: 50%;
  }
  .dot-tl { top:13px; left:13px; }
  .dot-tr { top:13px; right:13px; }
  .dot-bl { bottom:13px; left:13px; }
  .dot-br { bottom:13px; right:13px; }
</style>
</head>
<body>
<div class="cert">
  <!-- Corner ornaments -->
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>
  <div class="dot dot-tl"></div>
  <div class="dot dot-tr"></div>
  <div class="dot dot-bl"></div>
  <div class="dot dot-br"></div>

  <!-- QR placeholder (bottom-right) -->
  <div style="position:absolute;right:20px;bottom:20px;width:70px;height:70px;z-index:2;">
    <img src="${qrDataUrl}" width="70" height="70" style="display:block;">
    <div style="font-size:6.5px;color:#94a3b8;text-align:center;margin-top:3px;font-family:Montserrat,sans-serif;">Сканируй для верификации</div>
  </div>

  <!-- Header -->
  <div style="text-align:center;padding-top:22px;position:relative;z-index:2;">
    <div style="font-size:19px;font-weight:900;color:#1B3A6B;letter-spacing:0.22em;text-transform:uppercase;">KHAMADI ENGLISH</div>
    <div style="font-size:10px;font-style:italic;color:#C9933B;letter-spacing:0.08em;margin-top:3px;">by KHAMADI ONLINE</div>
  </div>

  <!-- Ornamental divider -->
  <div style="display:flex;align-items:center;margin:8px 76px 0;gap:8px;position:relative;z-index:2;">
    <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(201,147,59,0.55));"></div>
    <div style="font-size:9px;color:#C9933B;line-height:1;">◆</div>
    <div style="flex:1;height:1px;background:linear-gradient(90deg,rgba(201,147,59,0.55),transparent);"></div>
  </div>

  <!-- Main content -->
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;z-index:2;padding-bottom:8px;">
    <!-- Title -->
    <div style="text-align:center;margin-bottom:14px;">
      <div style="font-size:40px;font-weight:900;color:#1B3A6B;letter-spacing:0.14em;line-height:1;">СЕРТИФИКАТ</div>
      <div style="width:56px;height:2.5px;background:#C9933B;margin:7px auto 5px;"></div>
      <div style="font-size:11px;color:#64748b;letter-spacing:0.1em;">о прохождении курса</div>
    </div>
    <!-- Recipient -->
    <div style="text-align:center;">
      <div style="font-size:12px;font-style:italic;color:#94a3b8;font-family:Georgia,serif;margin-bottom:6px;">настоящим подтверждается, что</div>
      <div style="font-size:33px;font-weight:900;color:#C9933B;line-height:1.15;letter-spacing:0.03em;">Адилет Хаметов</div>
      <div style="width:240px;height:1px;background:rgba(201,147,59,0.35);margin:5px auto 7px;"></div>
      <div style="font-size:12px;font-style:italic;color:#64748b;margin-bottom:6px;">успешно завершил(а) курс</div>
      <div style="font-size:20px;font-weight:800;color:#1B3A6B;margin-bottom:4px;">Computer Science B1-C1</div>
      <div style="font-size:12px;color:#1B8FC4;font-weight:700;">Уровень: B1-C1 · Итоговый балл: 95/100</div>
    </div>
  </div>

  <!-- Footer -->
  <div style="display:flex;align-items:flex-end;justify-content:space-between;padding:0 36px 18px;padding-right:116px;position:relative;z-index:2;">
    <!-- Sig 1 -->
    <div style="text-align:center;">
      <div style="width:96px;height:1px;background:#1B3A6B;margin:0 auto 4px;"></div>
      <div style="font-size:9.5px;font-weight:700;color:#475569;letter-spacing:0.04em;">Директор программы</div>
    </div>
    <!-- Stamp -->
    <div style="text-align:center;">
      <div style="width:58px;height:58px;border-radius:50%;border:1.5px dashed #1B3A6B;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 4px;position:relative;">
        <div style="position:absolute;width:46px;height:46px;border-radius:50%;border:0.8px solid rgba(201,147,59,0.55);"></div>
        <div style="font-size:13px;color:#C9933B;line-height:1;position:relative;z-index:1;">★</div>
        <div style="font-size:5.5px;font-weight:800;color:#1B3A6B;letter-spacing:0.1em;line-height:1.3;position:relative;z-index:1;margin-top:1px;">KHAMADI</div>
        <div style="font-size:4.5px;font-weight:700;color:#C9933B;letter-spacing:0.08em;line-height:1.3;position:relative;z-index:1;">ENGLISH</div>
      </div>
      <div style="font-size:8.5px;color:#94a3b8;">№ KHEN-2026-TEST-001</div>
      <div style="font-size:9.5px;font-weight:700;color:#475569;margin-top:1px;">1 мая 2026 г.</div>
    </div>
    <!-- Sig 2 -->
    <div style="text-align:center;">
      <div style="width:96px;height:1px;background:#1B3A6B;margin:0 auto 4px;"></div>
      <div style="font-size:9.5px;font-weight:700;color:#475569;letter-spacing:0.04em;">Академический директор</div>
    </div>
  </div>
</div>
</body>
</html>`

  fs.writeFileSync(HTML_FILE, html, 'utf8')
  console.log('HTML written →', HTML_FILE)

  // Edge headless screenshot
  const fileUrl = 'file:///' + HTML_FILE.replace(/\\/g, '/')

  console.log('Launching Edge headless...')
  const result = spawnSync(EDGE, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--virtual-time-budget=3000',
    `--screenshot=${PNG_FILE}`,
    '--window-size=994,762',
    fileUrl,
  ], { timeout: 15000 })

  if (result.status === 0 || fs.existsSync(PNG_FILE)) {
    const size = fs.existsSync(PNG_FILE) ? fs.statSync(PNG_FILE).size : 0
    console.log('PNG saved →', PNG_FILE, `(${size} bytes)`)
  } else {
    console.error('Edge screenshot failed. stderr:', result.stderr?.toString()?.slice(0, 400))
    console.log('PDF is still available at /public/test-certificate.pdf')
    console.log('HTML preview available at /public/cert-preview.html')
  }
}

generate().catch(e => { console.error(e); process.exit(1) })
