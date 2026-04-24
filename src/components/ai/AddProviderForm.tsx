/** AddProviderForm — form to connect OpenAI or Anthropic API key */
import { useState } from 'react'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'

interface AddProviderFormProps {
  onAdd: (provider: 'openai' | 'anthropic', apiKey: string) => Promise<void>
}

function validateKey(provider: 'openai' | 'anthropic', key: string): string | null {
  if (!key) return null
  if (provider === 'openai'    && !key.startsWith('sk-'))     return 'OpenAI keys must start with sk-'
  if (provider === 'anthropic' && !key.startsWith('sk-ant-')) return 'Anthropic keys must start with sk-ant-'
  return null
}

export function AddProviderForm({ onAdd }: AddProviderFormProps) {
  const [provider,   setProvider]   = useState<'openai' | 'anthropic'>('openai')
  const [apiKey,     setApiKey]     = useState('')
  const [showKey,    setShowKey]    = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [submitErr,  setSubmitErr]  = useState<string | null>(null)

  const inlineError = apiKey.length > 6 ? validateKey(provider, apiKey) : null
  const isValid     = apiKey.length > 6 && !validateKey(provider, apiKey)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validateKey(provider, apiKey)
    if (err) return
    setSubmitting(true)
    setSubmitErr(null)
    try {
      await onAdd(provider, apiKey)
      setSuccess(true)
      setApiKey('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (ex) {
      setSubmitErr(ex instanceof Error ? ex.message : 'Failed to add provider')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Provider toggle */}
      <div>
        <label style={{ fontSize: '0.78rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(219,243,244,0.5)', display: 'block', marginBottom: 10 }}>
          Provider
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          {(['openai', 'anthropic'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => { setProvider(p); setApiKey('') }}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 10,
                border: provider === p
                  ? '1px solid rgba(34,211,238,0.50)'
                  : '1px solid rgba(255,255,255,0.10)',
                background: provider === p
                  ? 'rgba(34,211,238,0.10)'
                  : 'rgba(255,255,255,0.03)',
                color: provider === p ? '#22d3ee' : 'rgba(219,243,244,0.55)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                letterSpacing: '0.02em',
              }}
            >
              {p === 'openai' ? '⬡ OpenAI' : '◆ Anthropic'}
            </button>
          ))}
        </div>
      </div>

      {/* API Key input */}
      <div>
        <label style={{ fontSize: '0.78rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(219,243,244,0.5)', display: 'block', marginBottom: 10 }}>
          API Key
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder={provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
            autoComplete="off"
            spellCheck={false}
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px 44px 12px 14px',
              borderRadius: 10,
              border: inlineError
                ? '1px solid rgba(239,68,68,0.55)'
                : isValid
                  ? '1px solid rgba(74,222,128,0.40)'
                  : '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: '#f3fbfb',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
          />
          <button
            type="button"
            onClick={() => setShowKey(v => !v)}
            tabIndex={-1}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'rgba(219,243,244,0.45)',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Inline validation */}
        <div style={{ minHeight: 20, marginTop: 6 }}>
          {inlineError && (
            <span style={{ fontSize: '0.78rem', color: '#f87171' }}>
              ⚠ {inlineError}
            </span>
          )}
          {isValid && (
            <span style={{ fontSize: '0.78rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Check size={12} /> Looks good
            </span>
          )}
        </div>
      </div>

      {/* Submit error */}
      {submitErr && (
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 8, padding: '10px 14px' }}>
          {submitErr}
        </p>
      )}

      {/* Success */}
      {success && (
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.20)', borderRadius: 8, padding: '10px 14px' }}>
          ✓ Connected. Syncing usage in the background…
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || submitting}
        style={{
          padding: '12px 24px',
          borderRadius: 10,
          border: 'none',
          background: isValid && !submitting
            ? 'linear-gradient(135deg, rgba(34,211,238,0.92), rgba(15,118,110,0.92))'
            : 'rgba(255,255,255,0.06)',
          color: isValid && !submitting ? '#041012' : 'rgba(219,243,244,0.35)',
          fontWeight: 700,
          fontSize: '0.9rem',
          cursor: isValid && !submitting ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'all 0.18s ease',
          boxShadow: isValid && !submitting ? '0 4px 16px rgba(34,211,238,0.18)' : 'none',
        }}
      >
        {submitting ? (
          <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Connecting…</>
        ) : (
          'Connect provider'
        )}
      </button>

      {/* Security note */}
      <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(219,243,244,0.35)', textAlign: 'center', lineHeight: 1.5 }}>
        🔒 Your API key is encrypted locally and never sent to any server.
      </p>
    </form>
  )
}
