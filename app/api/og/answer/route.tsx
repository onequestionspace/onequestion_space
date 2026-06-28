import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || 'Question'
  const a = searchParams.get('a') || 'Answer'
  const name = searchParams.get('name') || 'you'

  const logoUrl = new URL('/logo.png', req.url).toString()

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 100%)',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        color: 'white',
        fontFamily: 'Inter'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 32, opacity: 0.6, marginBottom: 20 }}>
            {name}&apos;s answer on OneQuestion
          </div>
          <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, marginBottom: 40, lineHeight: 1.2 }}>
            {q}
          </div>
          <div style={{ display: 'flex', fontSize: 40, opacity: 0.9, lineHeight: 1.4 }}>
            {a}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} width={48} height={48} style={{ marginRight: 16 }} alt="" />
          <div style={{ fontSize: 24, opacity: 0.5 }}>
            onequestion.space
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
