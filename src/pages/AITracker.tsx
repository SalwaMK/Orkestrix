/** AITracker — main page for tracking OpenAI and Anthropic API spend */
import { Link } from 'react-router-dom'
import { Loader2, RefreshCw, Trash2, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useAITracker } from '@/hooks/useAITracker'
import { AddProviderForm } from '@/components/ai/AddProviderForm'
import { UsageChart } from '@/components/ai/UsageChart'
import { ModelBreakdown } from '@/components/ai/ModelBreakdown'
import { formatCurrency } from '@/lib/utils'

export function AITracker() {
  const {
    providers,
    totalThisMonth,
    totalLastMonth,
    usageByDay,
    usageByModel,
    loading,
    syncing,
    error,
    addProvider,
    removeProvider,
    syncAll,
  } = useAITracker()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12, color: 'rgba(219,243,244,0.50)' }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Loading AI spend…</span>
      </div>
    )
  }

  const isEmpty = providers.length === 0

  const trend = totalLastMonth === 0 ? 0 : ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100

  return (
    <div style={{ width: 'min(1080px, calc(100vw - 40px))', margin: '0 auto', padding: '40px 0 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#f3fbfb' }}>
            AI Spend
          </h1>
          <p style={{ margin: '6px 0 0', color: 'rgba(219,243,244,0.55)', fontSize: '0.95rem' }}>
            Track your token usage across OpenAI and Anthropic.
          </p>
        </div>
        {!isEmpty && (
          <button
            onClick={() => void syncAll()}
            disabled={syncing}
            style={{
              padding: '10px 20px',
              borderRadius: 999,
              border: '1px solid rgba(34,211,238,0.20)',
              background: 'rgba(34,211,238,0.06)',
              color: '#22d3ee',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: syncing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw size={14} style={{ animation: syncing ? 'spin 1.5s linear infinite' : 'none' }} />
            {syncing ? 'Syncing...' : 'Sync now'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ marginBottom: 24, padding: 16, borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          {error}
        </div>
      )}

      {isEmpty ? (
        <div style={{
          maxWidth: 480,
          margin: '40px auto 0',
          padding: 40,
          borderRadius: 24,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))',
          border: '1px dashed rgba(34,211,238,0.18)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(34,211,238,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', marginBottom: 16 }}>
              <Shield size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f3fbfb' }}>Track your AI token spend</h2>
            <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'rgba(219,243,244,0.50)', lineHeight: 1.5 }}>
              Connect your API keys to see exactly how much you're spending on tokens per model, per day.
            </p>
          </div>
          <AddProviderForm onAdd={addProvider} />
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div className="glass-panel" style={{ padding: 24 }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(219,243,244,0.5)', marginBottom: 8 }}>This Month</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f3fbfb' }}>{formatCurrency(totalThisMonth)}</div>
            </div>
            <div className="glass-panel" style={{ padding: 24 }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(219,243,244,0.5)', marginBottom: 8 }}>Last Month</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'rgba(243,251,251,0.6)' }}>{formatCurrency(totalLastMonth)}</div>
            </div>
            <div className="glass-panel" style={{ padding: 24 }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(219,243,244,0.5)', marginBottom: 8 }}>Month Trend</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, color: trend > 0 ? '#f87171' : trend < 0 ? '#4ade80' : 'rgba(219,243,244,0.4)' }}>
                {trend > 0 ? <TrendingUp size={24} /> : trend < 0 ? <TrendingDown size={24} /> : <Minus size={24} />}
                {trend === 0 ? '—' : `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-panel" style={{ padding: 24, marginBottom: 32 }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '1rem', color: '#f3fbfb' }}>Daily Spend (Last 30 Days)</h3>
            <UsageChart usageByDay={usageByDay} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }} className="md-grid-flip">
            {/* Model Breakdown */}
            <div className="glass-panel" style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 24px', fontSize: '1rem', color: '#f3fbfb' }}>This month by model</h3>
              <ModelBreakdown usageByModel={usageByModel} />
            </div>

            {/* Providers List */}
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'rgba(219,243,244,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connected Providers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {providers.map(p => (
                  <div key={p.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, color: '#f3fbfb', fontSize: '0.95rem' }}>
                          {p.provider === 'openai' ? 'OpenAI' : 'Anthropic'}
                        </span>
                        <span style={{ color: 'rgba(219,243,244,0.4)', fontSize: '0.85rem' }}>·</span>
                        <span style={{ color: 'rgba(219,243,244,0.6)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                          {p.keyHint}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(219,243,244,0.4)', marginTop: 4 }}>
                        {p.lastSyncedAt ? `Synced ${new Date(p.lastSyncedAt).toLocaleString()}` : 'Never synced'}
                      </div>
                    </div>
                    <button
                      onClick={() => void removeProvider(p.id)}
                      style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.6)', cursor: 'pointer', padding: 8, transition: 'color 0.15s' }}
                      title="Remove provider"
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.6)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="glass-panel" style={{ padding: 24, background: 'rgba(255,255,255,0.01)' }}>
                <h4 style={{ margin: '0 0 16px', fontSize: '0.9rem', color: '#f3fbfb' }}>Add Provider</h4>
                <AddProviderForm onAdd={addProvider} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
