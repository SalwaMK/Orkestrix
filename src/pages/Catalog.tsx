/**
 * Catalog — searchable, filterable grid of all catalog tools.
 * Users browse and add tools to their stack in one click.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATALOG_TOOLS } from '@/data/catalogTools'
import type { CatalogTool } from '@/data/catalogTools'
import { CatalogToolCard } from '@/components/catalog/CatalogToolCard'
import { useTools } from '@/hooks/useTools'
import type { ToolCategory } from '@/types'

// ── Category filter tabs ────────────────────────────────────────────────────
type FilterTab = 'all' | ToolCategory

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'all',           label: 'All' },
  { value: 'ai',            label: 'AI Tools' },
  { value: 'productivity',  label: 'Productivity' },
  { value: 'design',        label: 'Design' },
  { value: 'development',   label: 'Development' },
  { value: 'communication', label: 'Communication' },
  { value: 'marketing',     label: 'Marketing' },
  { value: 'finance',       label: 'Finance' },
  { value: 'other',         label: 'Other' },
]

export function Catalog() {
  const navigate = useNavigate()
  const { tools } = useTools()

  const [query, setQuery]       = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  // Build a Set of tool names already in the user's stack (lowercase for comparison)
  const stackNames = new Set(tools.map(t => t.toolName.toLowerCase()))

  // Filter logic
  const filtered: CatalogTool[] = CATALOG_TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(query.toLowerCase())
    const matchesTab    = activeTab === 'all' || tool.category === activeTab
    return matchesSearch && matchesTab
  })

  function handleAdd(tool: CatalogTool) {
    navigate('/app/add', {
      state: {
        prefill: {
          toolName:    tool.name,
          cost:        tool.defaultCost / 100,   // cents → dollars
          billingCycle: tool.billingCycle,
          category:    tool.category,
          isAiTool:    tool.isAiTool,
        },
      },
    })
  }

  return (
    <div
      style={{
        width:   'min(1180px, calc(100vw - 40px))',
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
          Tool catalog
        </h1>
        <p
          style={{
            margin:   '6px 0 0',
            color:    'rgba(219,243,244,0.55)',
            fontSize: '0.95rem',
          }}
        >
          Browse {CATALOG_TOOLS.length}+ popular tools and add them to your stack in one click.
        </p>
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(219,243,244,0.35)', pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          placeholder="Search tools…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width:           '100%',
            boxSizing:       'border-box',
            padding:         '11px 14px 11px 40px',
            borderRadius:    12,
            background:      'rgba(255,255,255,0.04)',
            border:          '1px solid rgba(255,255,255,0.10)',
            color:           '#f3fbfb',
            fontSize:        '0.9rem',
            outline:         'none',
            transition:      'border-color 0.18s ease',
          }}
          onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(34,211,238,0.35)' }}
          onBlur={e =>  { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.10)' }}
        />
      </div>

      {/* ── Category tabs ── */}
      <div
        style={{
          display:    'flex',
          flexWrap:   'wrap',
          gap:        6,
          marginBottom: 16,
        }}
      >
        {TABS.map(tab => {
          const isActive = tab.value === activeTab
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                padding:      '6px 14px',
                borderRadius: 999,
                fontSize:     '0.78rem',
                fontWeight:   isActive ? 700 : 500,
                border:       isActive
                  ? '1px solid rgba(34,211,238,0.40)'
                  : '1px solid rgba(255,255,255,0.08)',
                background:   isActive
                  ? 'rgba(34,211,238,0.12)'
                  : 'rgba(255,255,255,0.04)',
                color:        isActive
                  ? '#22d3ee'
                  : 'rgba(219,243,244,0.65)',
                cursor:       'pointer',
                transition:   'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Tool count ── */}
      <div
        style={{
          fontSize:     '0.78rem',
          color:        'rgba(219,243,244,0.40)',
          marginBottom: 20,
        }}
      >
        Showing {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* ── Grid / empty state ── */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign:  'center',
            padding:    '80px 20px',
            color:      'rgba(219,243,244,0.40)',
            fontSize:   '0.95rem',
          }}
        >
          No tools match &ldquo;{query}&rdquo;
        </div>
      ) : (
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap:                 16,
          }}
        >
          {filtered.map(tool => (
            <CatalogToolCard
              key={tool.id}
              tool={tool}
              isInStack={stackNames.has(tool.name.toLowerCase())}
              onAdd={() => handleAdd(tool)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
