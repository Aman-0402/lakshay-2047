import { ImageResponse } from '@vercel/og'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') ?? 'lab'
  const slug = searchParams.get('slug') ?? ''

  let title = 'Centre of Future Skills'
  let categoryLabel = ''

  try {
    if (type === 'lab' && slug) {
      const lab = await prisma.lab.findUnique({ where: { slug } })
      if (lab) {
        title = lab.name
        categoryLabel = lab.category.replace(/_/g, ' / ')
      }
    } else if (type === 'insight' && slug) {
      const insight = await prisma.insight.findUnique({ where: { slug } })
      if (insight) {
        title = insight.title
        categoryLabel = 'Insights'
      }
    }
  } catch {
    // db unavailable — use defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0A0A0F',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Gradient accent bar */}
        <div
          style={{
            height: '6px',
            background: 'linear-gradient(90deg, #6C63FF 0%, #00D4FF 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 80px',
          }}
        >
          {categoryLabel ? (
            <div
              style={{
                color: '#00D4FF',
                fontSize: '22px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '28px',
              }}
            >
              {categoryLabel}
            </div>
          ) : null}

          <div
            style={{
              color: '#F0F0F5',
              fontSize: title.length > 40 ? '52px' : '68px',
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {/* Violet pill */}
          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(108,99,255,0.2)',
                border: '1px solid rgba(108,99,255,0.5)',
                color: '#6C63FF',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontSize: '18px',
              }}
            >
              Parul University
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '24px 80px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ color: '#8888A0', fontSize: '20px' }}>
            Lakshay 2047 · Centre of Future Skills
          </div>
          <div style={{ color: '#444458', fontSize: '18px' }}>
            lakshay-2047-web-application.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
