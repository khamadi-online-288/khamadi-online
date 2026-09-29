/** Capture only the certificate node and download it as a single A4 PDF. */

export async function downloadCertificatePdf(element: HTMLElement, filename: string): Promise<void> {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (_doc, cloned) => {
      // The page fade-in restarts inside the clone and is captured mid-animation,
      // which composites the certificate onto white and washes the colors out.
      const nodes: HTMLElement[] = [cloned, ...cloned.querySelectorAll<HTMLElement>('*')]
      for (const node of nodes) {
        node.style.animation = 'none'
        node.style.transition = 'none'
      }
      cloned.style.opacity = '1'
      cloned.style.filter = 'none'
      cloned.style.boxShadow = 'none'
      cloned.style.margin = '0'
    },
  })

  const flat = document.createElement('canvas')
  flat.width = canvas.width
  flat.height = canvas.height
  const ctx = flat.getContext('2d')
  if (!ctx) throw new Error('Canvas is unavailable')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, flat.width, flat.height)
  ctx.drawImage(canvas, 0, 0)

  const image = flat.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const margin = 6
  const maxW = pageW - margin * 2
  const maxH = pageH - margin * 2
  const ratio = canvas.width / canvas.height

  let drawW = maxW
  let drawH = drawW / ratio
  if (drawH > maxH) {
    drawH = maxH
    drawW = drawH * ratio
  }

  const x = (pageW - drawW) / 2
  const y = (pageH - drawH) / 2
  pdf.addImage(image, 'PNG', x, y, drawW, drawH)
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
}
