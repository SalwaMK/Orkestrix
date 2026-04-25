import { Mail, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { useGmail } from '@/hooks/useGmail';
import { DiscoveredSubCard } from '@/components/gmail/DiscoveredSubCard';

export function Gmail() {
  const {
    connection,
    pendingSubs,
    loading,
    scanning,
    connectGmail,
    disconnectGmail,
    rescan,
    confirmSub,
    dismissSub,
    confirmAll,
    dismissAll,
  } = useGmail();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12, color: 'rgba(219,243,244,0.50)' }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Loading Gmail status…</span>
      </div>
    );
  }

  // Not connected state
  if (!connection) {
    return (
      <div style={{ width: 'min(1080px, calc(100vw - 40px))', margin: '0 auto', padding: '40px 0 80px' }}>
        <div style={{
          maxWidth: 540,
          margin: '40px auto 0',
          padding: '48px 40px',
          borderRadius: 24,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))',
          border: '1px dashed rgba(34,211,238,0.18)',
          textAlign: 'center'
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(239,68,68,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', marginBottom: 24 }}>
            <Mail size={32} />
          </div>
          <h2 style={{ margin: '0 0 12px', fontSize: '1.4rem', color: '#f3fbfb' }}>Find forgotten subscriptions</h2>
          <p style={{ margin: '0 0 24px', fontSize: '0.95rem', color: 'rgba(219,243,244,0.60)', lineHeight: 1.6 }}>
            Connect Gmail to automatically discover subscriptions from your billing emails. Read-only access, we never modify your inbox.
          </p>

          <button
            onClick={connectGmail}
            style={{
              padding: '12px 32px',
              borderRadius: 999,
              background: '#f3fbfb',
              color: '#041012',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 8px 24px rgba(255,255,255,0.1)',
              transition: 'transform 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            Connect Gmail
          </button>

          <div style={{ marginTop: 24, fontSize: '0.8rem', color: 'rgba(219,243,244,0.4)' }}>
            Orkestrix only reads emails matching billing keywords. No other emails are accessed.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: 'min(1080px, calc(100vw - 40px))', margin: '0 auto', padding: '40px 0 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#f3fbfb' }}>
            Inbox scan
          </h1>
          <p style={{ margin: '6px 0 0', color: 'rgba(219,243,244,0.55)', fontSize: '0.95rem' }}>
            Automatically find your recurring SaaS tools from billing emails.
          </p>
        </div>
      </div>

      {scanning ? (
        <div style={{ padding: '60px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1.5s linear infinite', color: '#22d3ee', margin: '0 auto 20px' }} />
          <h3 style={{ margin: '0 0 8px', color: '#f3fbfb', fontSize: '1.2rem' }}>Scanning your inbox...</h3>
          <p style={{ margin: 0, color: 'rgba(219,243,244,0.5)', fontSize: '0.9rem' }}>This may take up to a minute for large inboxes.</p>
        </div>
      ) : pendingSubs.length > 0 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#f3fbfb' }}>{pendingSubs.length} subscriptions found</h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={confirmAll}
                style={{ padding: '8px 16px', borderRadius: 999, background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Add all
              </button>
              <button
                onClick={dismissAll}
                style={{ padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', color: 'rgba(219,243,244,0.6)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              >
                Dismiss all
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pendingSubs.map(sub => (
              <DiscoveredSubCard
                key={sub.id}
                sub={sub}
                onConfirm={confirmSub}
                onDismiss={dismissSub}
              />
            ))}
          </div>

          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <button
              onClick={rescan}
              style={{ background: 'none', border: 'none', color: '#22d3ee', fontWeight: 600, cursor: 'pointer', padding: '10px 20px', fontSize: '0.9rem' }}
            >
              Rescan inbox
            </button>
          </div>
        </>
      ) : (
        <div style={{ padding: '60px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(34,197,94,0.15))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80', marginBottom: 24 }}>
            <CheckCircle2 size={32} />
          </div>
          <h3 style={{ margin: '0 0 12px', color: '#f3fbfb', fontSize: '1.4rem' }}>You're all caught up</h3>
          <p style={{ margin: '0 0 24px', color: 'rgba(219,243,244,0.5)', fontSize: '0.95rem' }}>
            {connection.lastScannedAt ? `Last scanned at ${new Date(connection.lastScannedAt).toLocaleString()}` : "We didn't find any pending subscriptions."}
          </p>
          <button
            onClick={rescan}
            style={{ padding: '10px 24px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f3fbfb', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            Rescan inbox
          </button>
        </div>
      )}

      {/* Footer / Account settings */}
      <div style={{ marginTop: 80, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(219,243,244,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Connected Account</div>
          <div style={{ fontSize: '0.95rem', color: '#f3fbfb', fontWeight: 500 }}>{connection.email}</div>
        </div>
        <button
          onClick={() => { if (confirm('Are you sure you want to disconnect? Any pending subscriptions will be cleared.')) disconnectGmail(); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', padding: '10px 16px', borderRadius: 8, transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <Trash2 size={16} /> Disconnect
        </button>
      </div>
    </div>
  );
}
