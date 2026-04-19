/**
 * CatalogToolCard — displays a single tool from the catalog grid.
 * Shows color avatar, name, description, default cost, category.
 * "Add" button pre-fills AddTool form via navigation state.
 * Shows checkmark + "In stack" if tool already added by user.
 */
import type { CatalogTool } from '@/data/catalogTools'
import { formatCurrency } from '@/lib/utils'

/** Derive up-to-2-letter initials from a tool name */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return (words[0]![0] ?? '').toUpperCase()
  return (words[0]![0]! + words[1]![0]!).toUpperCase()
}

/** Category badge label mapping */
const CATEGORY_LABELS: Record<string, string> = {
  productivity:  'Productivity',
  design:        'Design',
  development:   'Development',
  marketing:     'Marketing',
  ai:            'AI',
  communication: 'Communication',
  finance:       'Finance',
  other:         'Other',
}

interface CatalogToolCardProps {
  tool: CatalogTool
  isInStack: boolean
  onAdd: () => void
}

export function CatalogToolCard({ tool, isInStack, onAdd }: CatalogToolCardProps) {
  const initials = getInitials(tool.name)
  const costLabel = tool.defaultCost === 0
    ? 'Usage-based'
    : `${formatCurrency(tool.defaultCost)}/mo`
  const categoryLabel = CATEGORY_LABELS[tool.category] ?? tool.category

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           10,
        padding:       '14px 16px',
        borderRadius:  14,
        background:    'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01)), rgba(16,24,25,0.80)',
        border:        '1px solid rgba(255,255,255,0.07)',
        boxShadow:     '0 4px 16px rgba(0,0,0,0.25)',
        transition:    'border-color 0.18s ease, box-shadow 0.18s ease',
      }}
      onMouseEnter={e =>
        Object.assign((e.currentTarget as HTMLDivElement).style, {
          borderColor: 'rgba(34,211,238,0.25)',
          boxShadow:   '0 6px 24px rgba(0,0,0,0.35)',
        })
      }
      onMouseLeave={e =>
        Object.assign((e.currentTarget as HTMLDivElement).style, {
          borderColor: 'rgba(255,255,255,0.07)',
          boxShadow:   '0 4px 16px rgba(0,0,0,0.25)',
        })
      }
    >
      {/* ── Top row: avatar + info ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Avatar circle */}
        <div
          style={{
            width:          40,
            height:         40,
            borderRadius:   '50%',
            background:     tool.color,
            flexShrink:     0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       '0.75rem',
            fontWeight:     700,
            color:          '#fff',
            letterSpacing:  '0.02em',
            border:         '1px solid rgba(255,255,255,0.12)',
            boxShadow:      `0 0 12px ${tool.color}44`,
          }}
        >
          {initials}
        </div>

        {/* Name + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize:     '0.81rem',
              fontWeight:   600,
              color:        '#f3fbfb',
              letterSpacing: '-0.01em',
              whiteSpace:   'nowrap',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {tool.name}
          </div>
          <div
            style={{
              fontSize:     '0.68rem',
              color:        'rgba(219,243,244,0.50)',
              marginTop:    2,
              whiteSpace:   'nowrap',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {tool.description}
          </div>
        </div>

        {/* Cost */}
        <div
          style={{
            fontSize:    '0.75rem',
            fontWeight:  600,
            color:       tool.defaultCost === 0 ? 'rgba(219,243,244,0.45)' : '#22d3ee',
            flexShrink:  0,
            whiteSpace:  'nowrap',
          }}
        >
          {costLabel}
        </div>
      </div>

      {/* ── Bottom row: category badge + Add / In stack ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {/* Category badge */}
        <span
          style={{
            display:      'inline-flex',
            alignItems:   'center',
            padding:      '2px 8px',
            borderRadius: 999,
            fontSize:     '0.65rem',
            fontWeight:   600,
            letterSpacing:'0.03em',
            color:        tool.isAiTool ? '#22d3ee' : 'rgba(219,243,244,0.55)',
            background:   tool.isAiTool ? 'rgba(34,211,238,0.10)' : 'rgba(255,255,255,0.06)',
            border:       tool.isAiTool ? '1px solid rgba(34,211,238,0.20)' : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {categoryLabel}
        </span>

        {/* Add / In stack */}
        {isInStack ? (
          <span
            style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          4,
              padding:      '4px 10px',
              borderRadius: 999,
              fontSize:     '0.69rem',
              fontWeight:   600,
              color:        '#4ade80',
              background:   'rgba(74,222,128,0.10)',
              border:       '1px solid rgba(74,222,128,0.20)',
              userSelect:   'none',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            In stack
          </span>
        ) : (
          <button
            onClick={onAdd}
            style={{
              padding:      '4px 12px',
              borderRadius: 999,
              fontSize:     '0.69rem',
              fontWeight:   700,
              color:        '#041012',
              background:   'linear-gradient(135deg, rgba(34,211,238,0.92), rgba(15,118,110,0.92))',
              border:       'none',
              cursor:       'pointer',
              letterSpacing:'0.02em',
              transition:   'opacity 0.15s ease, transform 0.15s ease',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.85'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }}
          >
            Add
          </button>
        )}
      </div>
    </div>
  )
}
