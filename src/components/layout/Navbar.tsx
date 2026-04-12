/** Navbar — top navigation bar preserving the existing Orkestrix topbar design */
import { Link, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const logoSrc = '/assets/orkestrix_logo.svg'

export function Navbar() {
  const location = useLocation()
  const isAddPage = location.pathname === '/add'

  return (
    <header
      style={{
        position:       'sticky',
        top:            0,
        zIndex:         20,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '18px 0',
        backdropFilter: 'blur(16px)',
        borderBottom:   '1px solid rgba(34, 211, 238, 0.10)',
        width:          'min(1180px, calc(100vw - 40px))',
        margin:         '0 auto',
      }}
    >
      {/* ── Brand mark ── */}
      <Link
        to="/"
        style={{
          display:       'inline-flex',
          alignItems:    'center',
          gap:           12,
          fontSize:      '1rem',
          fontWeight:    700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color:         'inherit',
        }}
      >
        <img
          src={logoSrc}
          alt="Orkestrix logo"
          style={{
            display: 'block',
            width:   44,
            height:  'auto',
            filter:  'drop-shadow(0 0 22px rgba(34, 211, 238, 0.18))',
          }}
          onError={(e) => {
            // gracefully hide missing logo without breaking layout
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
        <span>Orkestrix</span>
      </Link>

      {/* ── Actions ── */}
      {!isAddPage && (
        <Button
          asChild
          style={{
            background:   'linear-gradient(135deg, rgba(34,211,238,0.92), rgba(15,118,110,0.92))',
            color:        '#041012',
            borderRadius: 999,
            fontWeight:   700,
            fontSize:     '0.85rem',
            letterSpacing: '0.04em',
            padding:      '10px 20px',
            height:       'auto',
            gap:          8,
            border:       'none',
            boxShadow:    '0 8px 24px rgba(34, 211, 238, 0.18)',
            transition:   'transform 0.18s ease, box-shadow 0.18s ease',
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
            color:        'rgba(219, 243, 244, 0.68)',
            borderRadius: 999,
            fontSize:     '0.85rem',
            letterSpacing: '0.04em',
          }}
        >
          <Link to="/">← Back to dashboard</Link>
        </Button>
      )}
    </header>
  )
}
