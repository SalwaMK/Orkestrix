/**
 * ImportPreviewTable — shows all parsed rows before final import.
 * Rows with errors highlighted red. Duplicates highlighted amber.
 * User can deselect individual rows via checkbox.
 */
import type { ParsedImportRow } from '@/lib/csvParser'
import { formatCurrency } from '@/lib/utils'

interface ImportPreviewTableProps {
  rows:          ParsedImportRow[]
  onToggleRow:   (index: number) => void
  onToggleAll:   (selected: boolean) => void
  onImport:      () => void
  onBack:        () => void
  isImporting?:  boolean
}

function StatusBadge({ row }: { row: ParsedImportRow }) {
  if (row.errors.length > 0) {
    return (
      <span
        title={row.errors.join('\n')}
        style={{
          display:      'inline-flex',
          alignItems:   'center',
          padding:      '2px 8px',
          borderRadius: 999,
          fontSize:     '0.65rem',
          fontWeight:   700,
          color:        '#fca5a5',
          background:   'rgba(239,68,68,0.14)',
          border:       '1px solid rgba(239,68,68,0.25)',
          cursor:       'help',
          maxWidth:     160,
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
        }}
      >
        {row.errors[0]}
      </span>
    )
  }
  if (row.isDuplicate) {
    return (
      <span
        style={{
          display:      'inline-flex',
          alignItems:   'center',
          padding:      '2px 8px',
          borderRadius: 999,
          fontSize:     '0.65rem',
          fontWeight:   700,
          color:        '#fbbf24',
          background:   'rgba(245,158,11,0.12)',
          border:       '1px solid rgba(245,158,11,0.25)',
        }}
      >
        Duplicate
      </span>
    )
  }
  return (
    <span
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        padding:      '2px 8px',
        borderRadius: 999,
        fontSize:     '0.65rem',
        fontWeight:   700,
        color:        '#4ade80',
        background:   'rgba(74,222,128,0.10)',
        border:       '1px solid rgba(74,222,128,0.18)',
      }}
    >
      Ready
    </span>
  )
}

export function ImportPreviewTable({
  rows,
  onToggleRow,
  onToggleAll,
  onImport,
  onBack,
  isImporting = false,
}: ImportPreviewTableProps) {
  const validRows     = rows.filter(r => r.errors.length === 0)
  const selectedCount = validRows.filter(r => r.selected).length
  const dupCount      = rows.filter(r => r.isDuplicate && r.errors.length === 0).length
  const errorCount    = rows.filter(r => r.errors.length > 0).length
  const allSelected   = validRows.length > 0 && validRows.every(r => r.selected)

  const TH: React.CSSProperties = {
    padding:       '8px 10px',
    textAlign:     'left',
    fontSize:      '0.68rem',
    fontWeight:    700,
    color:         'rgba(219,243,244,0.40)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    borderBottom:  '1px solid rgba(255,255,255,0.06)',
    whiteSpace:    'nowrap',
  }

  return (
    <div>
      {/* ── Scrollable table ── */}
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ ...TH, width: 40, paddingLeft: 12 }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={e => onToggleAll(e.target.checked)}
                  aria-label="Select all valid rows"
                  style={{ cursor: 'pointer', accentColor: '#22d3ee' }}
                />
              </th>
              {(['Tool name', 'Cost', 'Cycle', 'Renewal date', 'Category', 'Status'] as const).map(h => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const hasError = row.errors.length > 0
              const rowBg = hasError
                ? 'rgba(239,68,68,0.06)'
                : row.isDuplicate
                  ? 'rgba(245,158,11,0.06)'
                  : 'transparent'

              const TD: React.CSSProperties = {
                padding:      '9px 10px',
                fontSize:     '0.80rem',
                color:        hasError
                  ? 'rgba(252,165,165,0.70)'
                  : !row.selected
                    ? 'rgba(219,243,244,0.30)'
                    : '#f3fbfb',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                whiteSpace:   'nowrap',
              }

              return (
                <tr key={i} style={{ background: rowBg }}>
                  <td style={{ ...TD, paddingLeft: 12, width: 40 }}>
                    <input
                      type="checkbox"
                      checked={row.selected && !hasError}
                      disabled={hasError}
                      onChange={() => onToggleRow(i)}
                      style={{
                        cursor:      hasError ? 'not-allowed' : 'pointer',
                        accentColor: '#22d3ee',
                        opacity:     hasError ? 0.35 : 1,
                      }}
                    />
                  </td>
                  <td style={{ ...TD, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.parsed.toolName ?? <span style={{ color: 'rgba(219,243,244,0.30)' }}>—</span>}
                  </td>
                  <td style={TD}>
                    {row.parsed.cost !== undefined
                      ? formatCurrency(Math.round(row.parsed.cost * 100))
                      : <span style={{ color: 'rgba(219,243,244,0.30)' }}>—</span>}
                  </td>
                  <td style={TD}>
                    {row.parsed.billingCycle ?? <span style={{ color: 'rgba(219,243,244,0.30)' }}>—</span>}
                  </td>
                  <td style={TD}>
                    {row.parsed.renewalDate ?? <span style={{ color: 'rgba(219,243,244,0.30)' }}>—</span>}
                  </td>
                  <td style={TD}>
                    {row.parsed.category ?? <span style={{ color: 'rgba(219,243,244,0.30)' }}>—</span>}
                  </td>
                  <td style={{ ...TD, minWidth: 90 }}>
                    <StatusBadge row={row} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Summary + actions ── */}
      <div
        style={{
          marginTop:     16,
          display:       'flex',
          alignItems:    'center',
          flexWrap:      'wrap',
          gap:           12,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '0.80rem', color: 'rgba(219,243,244,0.50)' }}>
          <span style={{ color: '#f3fbfb', fontWeight: 600 }}>{selectedCount}</span> of {validRows.length} rows selected
          {dupCount > 0 && (
            <span style={{ marginLeft: 10, color: '#fbbf24' }}>
              · {dupCount} duplicate{dupCount !== 1 ? 's' : ''}
            </span>
          )}
          {errorCount > 0 && (
            <span style={{ marginLeft: 10, color: '#f87171' }}>
              · {errorCount} error{errorCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onBack}
            style={{
              padding:      '8px 16px',
              borderRadius: 999,
              fontSize:     '0.82rem',
              fontWeight:   500,
              background:   'transparent',
              color:        'rgba(219,243,244,0.60)',
              border:       '1px solid rgba(255,255,255,0.10)',
              cursor:       'pointer',
            }}
          >
            ← Back
          </button>

          <button
            onClick={onImport}
            disabled={selectedCount === 0 || isImporting}
            style={{
              padding:      '8px 20px',
              borderRadius: 999,
              fontSize:     '0.85rem',
              fontWeight:   700,
              background:   selectedCount > 0 && !isImporting
                ? 'linear-gradient(135deg, rgba(34,211,238,0.92), rgba(15,118,110,0.92))'
                : 'rgba(255,255,255,0.08)',
              color:        selectedCount > 0 && !isImporting ? '#041012' : 'rgba(219,243,244,0.30)',
              border:       'none',
              cursor:       selectedCount > 0 && !isImporting ? 'pointer' : 'not-allowed',
              transition:   'all 0.15s ease',
            }}
          >
            {isImporting ? 'Importing…' : `Import ${selectedCount} tool${selectedCount !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}
