/** AddTool — page that hosts the ToolForm and redirects to dashboard on save */
import { useNavigate } from 'react-router-dom'
import { ToolForm } from '@/components/tools/ToolForm'

export function AddTool() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/')
  }

  return (
    <div
      style={{
        width:   'min(640px, calc(100vw - 40px))',
        margin:  '0 auto',
        padding: '40px 0 80px',
      }}
    >
      {/* ── Page header ── */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            margin:        0,
            fontSize:      'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight:    700,
            letterSpacing: '-0.04em',
            color:         '#f3fbfb',
          }}
        >
          Add a tool
        </h1>
        <p
          style={{
            margin:   '6px 0 0',
            color:    'rgba(219, 243, 244, 0.55)',
            fontSize: '0.95rem',
          }}
        >
          Track a new subscription or AI service.
        </p>
      </div>

      {/* ── Form panel ── */}
      <div
        style={{
          padding:      '28px 28px 32px',
          borderRadius: 20,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01)), rgba(16,24,25,0.80)',
          border:    '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        <ToolForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
