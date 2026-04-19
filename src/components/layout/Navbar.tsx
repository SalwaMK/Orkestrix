/**
 * Navbar — sticky top bar with brand mark, navigation, and a
 * bell notification popup for upcoming renewal alerts.
 */
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Plus, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTools } from '@/hooks/useTools'
import {
  getUpcomingRenewals,
  daysUntilRenewal,
  formatCurrency,
  formatRenewalDate,
} from '@/lib/utils'

const logoSrc = '/assets/orkestrix_logo.svg'

/** Single renewal row inside the popup */
function RenewalRow({ tool }: { tool: ReturnType<typeof getUpcomingRenewals>[number] }) {
  const days = daysUntilRenewal(tool.renewalDate)
  const daysText =
    days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`

  const dotColor =
    days <= 3 ? '#E24B4A' : days <= 7 ? '#EF9F27' : days <= 30 ? '#4ade80' : '#888780'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e =>
        ((e.currentTarget as HTMLDivElement).style.background = 'rgba(34,211,238,0.05)')}
      onMouseLeave={e =>
        ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)')}
    >
      {/* urgency dot */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: dotColor,
          flexShrink: 0,
          boxShadow: `0 0 6px ${dotColor}88`,
        }}
      />
      {/* info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#f3fbfb',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {tool.toolName}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(219,243,244,0.45)', marginTop: 1 }}>
          {formatRenewalDate(tool.renewalDate)}
        </div>
      </div>
      {/* right side */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#22d3ee' }}>
          {formatCurrency(tool.cost)}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(219,243,244,0.45)', marginTop: 1 }}>
          {daysText}
        </div>
      </div>
    </div>
  )
}

export function Navbar() {
  const location = useLocation()
  const isAddPage     = location.pathname === '/add'
  const isCatalogPage = location.pathname === '/catalog'

  const { tools } = useTools()
  const [open, setOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const upcoming30 = getUpcomingRenewals(tools, 30)
  const critical7   = getUpcomingRenewals(tools, 7)
  const badgeCount  = critical7.length

  // Close popup on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(34,211,238,0.10)',
        width: 'min(1180px, calc(100vw - 40px))',
        margin: '0 auto',
      }}
    >
      {/* ── Brand mark ── */}
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <img
          src={logoSrc}
          alt="Orkestrix logo"
          style={{
            display: 'block',
            width: 40,
            height: 'auto',
            filter: 'drop-shadow(0 0 18px rgba(34,211,238,0.28))',
          }}
          onError={e => {
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
        <span
          style={{
            background: 'linear-gradient(90deg, #f3fbfb 60%, rgba(34,211,238,0.75))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Orkestrix
        </span>
      </Link>

      {/* ── Right side actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Browse catalog link */}
        {!isCatalogPage && (
          <Link
            to="/catalog"
            style={{
              fontSize:      '0.82rem',
              fontWeight:    500,
              color:         'rgba(219,243,244,0.62)',
              textDecoration: 'none',
              letterSpacing: '0.01em',
              padding:       '6px 10px',
              borderRadius:  8,
              transition:    'color 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#f3fbfb' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(219,243,244,0.62)' }}
          >
            Browse catalog
          </Link>
        )}

        {/* Bell button */}
        <div style={{ position: 'relative' }}>
          <button
            ref={btnRef}
            onClick={() => setOpen(v => !v)}
            aria-label="Renewal notifications"
            style={{
              position: 'relative',
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: open
                ? '1px solid rgba(34,211,238,0.40)'
                : '1px solid rgba(255,255,255,0.10)',
              background: open
                ? 'rgba(34,211,238,0.10)'
                : 'rgba(255,255,255,0.04)',
              color: open ? '#22d3ee' : 'rgba(219,243,244,0.72)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: open ? '0 0 18px rgba(34,211,238,0.12)' : 'none',
            }}
          >
            <Bell size={17} strokeWidth={2} />
            {badgeCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
                  color: '#fff',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  border: '1.5px solid #0b0f10',
                  boxShadow: '0 2px 8px rgba(239,68,68,0.5)',
                  animation: 'bell-pulse 2s ease-in-out infinite',
                }}
              >
                {badgeCount}
              </span>
            )}
          </button>

          {/* ── Popup panel ── */}
          {open && (
            <div
              ref={popupRef}
              style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: 0,
                width: 320,
                borderRadius: 16,
                background:
                  'linear-gradient(160deg, rgba(18,27,29,0.98), rgba(11,17,18,0.98))',
                border: '1px solid rgba(34,211,238,0.18)',
                boxShadow:
                  '0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                overflow: 'hidden',
                animation: 'popup-in 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 100,
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '14px 16px 12px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#f3fbfb',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Upcoming Renewals
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(219,243,244,0.45)', marginTop: 2 }}>
                    Next 30 days · {upcoming30.length} tool{upcoming30.length !== 1 ? 's' : ''}
                  </div>
                </div>
                {badgeCount > 0 && (
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: 999,
                      background: 'rgba(239,68,68,0.14)',
                      border: '1px solid rgba(239,68,68,0.28)',
                      color: '#f87171',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {badgeCount} urgent
                  </span>
                )}
              </div>

              {/* List */}
              <div
                style={{
                  padding: 10,
                  maxHeight: 340,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {upcoming30.length === 0 ? (
                  <div
                    style={{
                      padding: '28px 16px',
                      textAlign: 'center',
                      color: 'rgba(219,243,244,0.4)',
                      fontSize: '0.85rem',
                    }}
                  >
                    No renewals in the next 30 days
                  </div>
                ) : (
                  upcoming30.map(tool => <RenewalRow key={tool.id} tool={tool} />)
                )}
              </div>

              {/* Footer */}
              {upcoming30.length > 0 && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.72rem',
                    color: 'rgba(219,243,244,0.35)',
                    textAlign: 'center',
                  }}
                >
                  Scroll dashboard for full renewal timeline
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Tool / Back button */}
        {!isAddPage && (
          <Button
            asChild
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.92), rgba(15,118,110,0.92))',
              color: '#041012',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
              padding: '10px 20px',
              height: 'auto',
              gap: 8,
              border: 'none',
              boxShadow: '0 6px 20px rgba(34,211,238,0.20)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(34,211,238,0.30)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(34,211,238,0.20)'
            }}
          >
            <Link to="/add" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} strokeWidth={2.5} />
              Add tool
            </Link>
          </Button>
        )}

        {isAddPage && (
          <Button
            asChild
            variant="ghost"
            style={{
              color: 'rgba(219,243,244,0.68)',
              borderRadius: 999,
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
            }}
          >
            <Link to="/">← Back</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
