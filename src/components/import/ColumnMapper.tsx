/**
 * ColumnMapper — maps CSV headers to Orkestrix fields.
 * Auto-detection pre-fills selects; user can override.
 */
import type { ColumnMapping } from '@/lib/csvParser'

interface ColumnMapperProps {
  headers:   string[]
  mapping:   ColumnMapping
  onChange:  (mapping: ColumnMapping) => void
  onConfirm: () => void
}

const FIELDS: {
  key: keyof ColumnMapping
  label: string
  required: boolean
}[] = [
  { key: 'toolName',     label: 'Tool name',     required: true  },
  { key: 'cost',         label: 'Cost',           required: true  },
  { key: 'renewalDate',  label: 'Renewal date',   required: true  },
  { key: 'billingCycle', label: 'Billing cycle',  required: false },
  { key: 'category',     label: 'Category',       required: false },
  { key: 'notes',        label: 'Notes',          required: false },
]

const SKIP = '— skip —'

export function ColumnMapper({ headers, mapping, onChange, onConfirm }: ColumnMapperProps) {
  const canConfirm =
    mapping.toolName    !== null &&
    mapping.cost        !== null &&
    mapping.renewalDate !== null

  function handleChange(key: keyof ColumnMapping, value: string) {
    onChange({ ...mapping, [key]: value === SKIP ? null : value })
  }

  const selectStyle: React.CSSProperties = {
    width:        '100%',
    padding:      '8px 10px',
    borderRadius: 8,
    background:   'rgba(255,255,255,0.04)',
    border:       '1px solid rgba(255,255,255,0.10)',
    color:        '#f3fbfb',
    fontSize:     '0.82rem',
    outline:      'none',
    cursor:       'pointer',
  }

  return (
    <div>
      <p style={{ margin: '0 0 20px', fontSize: '0.88rem', color: 'rgba(219,243,244,0.60)' }}>
        We detected your CSV columns. Map each field below — required fields are marked&nbsp;
        <span style={{ color: '#f87171' }}>*</span>.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {(['Orkestrix field', 'CSV column'] as const).map(h => (
              <th
                key={h}
                style={{
                  padding:       '8px 12px',
                  textAlign:     'left',
                  fontSize:      '0.72rem',
                  fontWeight:    700,
                  color:         'rgba(219,243,244,0.40)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderBottom:  '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FIELDS.map(({ key, label, required }) => (
            <tr key={key}>
              <td
                style={{
                  padding:      '10px 12px',
                  fontSize:     '0.84rem',
                  fontWeight:   500,
                  color:        '#f3fbfb',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  whiteSpace:   'nowrap',
                }}
              >
                {label}
                {required && (
                  <span style={{ color: '#f87171', marginLeft: 3 }}>*</span>
                )}
              </td>
              <td
                style={{
                  padding:      '10px 12px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <select
                  value={mapping[key] ?? SKIP}
                  onChange={e => handleChange(key, e.target.value)}
                  style={selectStyle}
                >
                  <option value={SKIP}>{SKIP}</option>
                  {headers.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 24 }}>
        <button
          onClick={onConfirm}
          disabled={!canConfirm}
          style={{
            padding:      '10px 24px',
            borderRadius: 999,
            fontSize:     '0.85rem',
            fontWeight:   700,
            background:   canConfirm
              ? 'linear-gradient(135deg, rgba(34,211,238,0.92), rgba(15,118,110,0.92))'
              : 'rgba(255,255,255,0.08)',
            color:        canConfirm ? '#041012' : 'rgba(219,243,244,0.30)',
            border:       'none',
            cursor:       canConfirm ? 'pointer' : 'not-allowed',
            transition:   'all 0.15s ease',
          }}
        >
          Preview import →
        </button>
        {!canConfirm && (
          <span style={{ marginLeft: 12, fontSize: '0.78rem', color: 'rgba(219,243,244,0.40)' }}>
            Map Tool name, Cost, and Renewal date to continue
          </span>
        )}
      </div>
    </div>
  )
}
