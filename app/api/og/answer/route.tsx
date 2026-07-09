export const runtime = 'edge'

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function wrap(text: string, charsPerLine: number) {
  if (text.length <= charsPerLine) return [text]
  const lines: string[] = []
  let current = ''
  for (const word of text.split(' ')) {
    if ((current + ' ' + word).trim().length > charsPerLine) {
      lines.push(current.trim())
      current = word
    } else {
      current += (current ? ' ' : '') + word
    }
  }
  if (current.trim()) lines.push(current.trim())
  return lines
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = escapeXml(searchParams.get('q') || 'Question').slice(0, 200)
  const a = escapeXml(searchParams.get('a') || 'Answer').slice(0, 500)
  const name = escapeXml(searchParams.get('name') || 'you').slice(0, 40)

  const qLines = wrap(q, 30)
  const aLines = wrap(a, 45)
  const qTspans = qLines.map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 62}">${l}</tspan>`).join('')
  const aTspans = aLines.map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 44}">${l}</tspan>`).join('')

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#1a0a00"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="80" y="90" fill="rgba(255,255,255,0.6)" font-family="system-ui,sans-serif" font-size="28">${name}'s answer on OneQuestion</text>
  <text x="80" y="170" fill="white" font-family="system-ui,sans-serif" font-size="52" font-weight="bold">${qTspans}</text>
  <text x="80" y="370" fill="rgba(255,255,255,0.9)" font-family="system-ui,sans-serif" font-size="36">${aTspans}</text>
  <text x="1120" y="580" fill="rgba(255,255,255,0.5)" font-family="system-ui,sans-serif" font-size="22" text-anchor="end">onequestion.space</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
