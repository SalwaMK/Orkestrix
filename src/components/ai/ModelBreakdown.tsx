/** ModelBreakdown — table of per-model spend for the current month */
import type { UsageByModel } from '@/hooks/useAITracker'
import { formatCurrency } from '@/lib/utils'

interface ModelBreakdownProps {
  usageByModel: UsageByModel[]
}

function formatM(tokens: number): string {
  if (tokens === 0) return '0'
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(2)}M`
  if (tokens >= 1_000)     return `${(tokens / 1_000).toFixed(1)}K`
  return String(tokens)
}

export function ModelBreakdown({ usageByModel }: ModelBreakdownProps) {
  if (usageByModel.length === 0) {
    return (
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '40px 0',
        color:          'rgba(219,243,244,0.35)',
        fontSize:       '0.88rem',
        flexDirection:  'column',
        gap:            10,
      }}>
        <div style={{ fontSize: '1.8rem', opacity: 0.3 }}>🤖</div>
        No usage this month
      </div>
    )
  }

  const totalCents = usageByModel.reduce((s, m) => s + m.costCents, 0)
  const totalInput  = usageByModel.reduce((s, m) => s + m.inputTokens, 0)
  const totalOutput = usageByModel.reduce((s, m) => s + m.outputTokens, 0)

  const thStyle: React.CSSProperties = {
    padding:       '10px 14px',
    textAlign:     'left',
    fontSize:      '0.72rem',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color:         'rgba(219,243,244,0.40)',
    fontWeight:    600,
    whiteSpace:    'nowrap',
    borderBottom:  '1px solid rgba(255,255,255,0.06)',
  }

  const tdStyle: React.CSSProperties = {
    padding:      '12px 14px',
    fontSize:     '0.85rem',
    color:        '#f3fbfb',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    whiteSpace:   'nowrap',
  }

  const providerPill = (provider: string) => (
    <span style={{
      display:      'inline-block',
      padding:      '2px 8px',
      borderRadius: 999,
      fontSize:     '0.7rem',
      fontWeight:   700,
      background:   provider === 'openai' ? 'rgba(74,222,128,0.12)'  : 'rgba(251,146,60,0.12)',
      border:       provider === 'openai' ? '1px solid rgba(74,222,128,0.28)' : '1px solid rgba(251,146,60,0.28)',
      color:        provider === 'openai' ? '#4ade80' : '#fb923c',
    }}>
      {provider === 'openai' ? 'OpenAI' : 'Anthropic'}
    </span>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Model</th>
            <th style={thStyle}>Provider</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Input tokens</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Output tokens</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Cost</th>
          </tr>
        </thead>
        <tbody>
          {usageByModel.map(m => (
            <tr
              key={`${m.model}:${m.provider}`}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              style={{ transition: 'background 0.12s ease' }}
            >
              <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.82rem', color: '#22d3ee' }}>
                {m.model}
              </td>
              <td style={tdStyle}>{providerPill(m.provider)}</td>
              <td style={{ ...tdStyle, textAlign: 'right', color: 'rgba(219,243,244,0.70)' }}>
                {formatM(m.inputTokens)}
              </td>
              <td style={{ ...tdStyle, textAlign: 'right', color: 'rgba(219,243,244,0.70)' }}>
                {formatM(m.outputTokens)}
              </td>
              <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#f3fbfb' }}>
                {formatCurrency(m.costCents)}
              </td>
            </tr>
          ))}
          {/* Total row */}
          <tr style={{ borderTop: '1px solid rgba(34,211,238,0.15)' }}>
            <td style={{ ...tdStyle, fontWeight: 700, color: '#f3fbfb', borderBottom: 'none' }} colSpan={2}>
              Total
            </td>
            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#f3fbfb', borderBottom: 'none' }}>
              {formatM(totalInput)}
            </td>
            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#f3fbfb', borderBottom: 'none' }}>
              {formatM(totalOutput)}
            </td>
            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, fontSize: '0.95rem', color: '#22d3ee', borderBottom: 'none' }}>
              {formatCurrency(totalCents)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
