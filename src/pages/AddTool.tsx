/** AddTool — page that hosts the ToolForm and redirects to dashboard on save */
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ToolForm } from '@/components/tools/ToolForm'
import type { ToolCategory, BillingCycle } from '@/types'

/** Shape of pre-fill state sent from the catalog */
interface PrefillState {
  toolName?:    string
  cost?:        number
  billingCycle?: BillingCycle
  category?:    ToolCategory
  isAiTool?:    boolean
}

export function AddTool() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const prefill   = (location.state as { prefill?: PrefillState } | null)?.prefill

  const [bannerDismissed, setBannerDismissed] = useState(false)

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
      {/* ── Pre-fill banner ── */}
      {prefill && !bannerDismissed && (
        <div
          style={{
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'space-between',
            gap:          12,
            padding:      '12px 16px',
            marginBottom: 20,
            borderRadius: 12,
            background:   'rgba(245,158,11,0.12)',
            border:       '1px solid rgba(245,158,11,0.30)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#fbbf24' }}>
              Pre-filled from catalog — review and confirm
            </span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss"
            style={{
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      'rgba(251,191,36,0.60)',
              fontSize:   '1.1rem',
              lineHeight: 1,
              padding:    '0 2px',
            }}
          >
            ×
          </button>
        </div>
      )}

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
        <ToolForm onSuccess={handleSuccess} defaultValues={prefill} />
      </div>
    </div>
  )
}
