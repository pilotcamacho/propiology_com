import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Propiology — Your Personal OS for behavioral transformation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #0b2a38 0%, #135465 50%, #1aa6ad 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Score circle decoration */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '8px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f0a000',
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          87
        </div>

        {/* Wordmark */}
        <p style={{ fontSize: 28, color: 'rgba(255,255,255,0.6)', margin: 0, letterSpacing: 4 }}>
          PROPIOLOGY
        </p>

        {/* Headline */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#ffffff',
            margin: '16px 0 24px',
            lineHeight: 1.1,
            maxWidth: 800,
          }}
        >
          Your Personal OS for behavioral transformation
        </h1>

        {/* Tagline */}
        <p style={{ fontSize: 24, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
          Habits · Readiness Score · AI Tools · WhatsApp micro-learning
        </p>
      </div>
    ),
    { ...size }
  );
}
