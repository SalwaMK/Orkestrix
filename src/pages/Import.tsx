/**
 * Import — 4-step CSV import wizard.
 * Steps: 1 Upload → 2 Map columns → 3 Preview → 4 Done
 */
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { DropZone } from '@/components/import/DropZone'
import { ColumnMapper } from '@/components/import/ColumnMapper'
import { ImportPreviewTable } from '@/components/import/ImportPreviewTable'
import {
  parseCSVFile,
  autoDetectMapping,
  applyMapping,
} from '@/lib/csvParser'
import type { ColumnMapping, ParsedImportRow } from '@/lib/csvParser'
import { useTools } from '@/hooks/useTools'

// ── Template CSV ─────────────────────────────────────────────────────────────

const TEMPLATE_HEADERS = 'Tool Name,Cost ($),Billing Cycle,Renewal Date,Category,Notes'
const TEMPLATE_ROWS = [
  'Notion,16.00,monthly,2026-05-01,productivity,Team wiki',
  'Figma,15.00,monthly,2026-05-14,design,',
]
const TEMPLATE_CSV = [TEMPLATE_HEADERS, ...TEMPLATE_ROWS].join('\n')

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = 'orkestrix-import-template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// ── Step indicator ────────────────────────────────────────────────────────────

const STEPS = ['Upload', 'Map columns', 'Preview', 'Done'] as const
type StepIndex = 0 | 1 | 2 | 3

function StepIndicator({ current }: { current: StepIndex }) {
  return (
    <div
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            0,
        marginBottom:   40,
      }}
    >
      {STEPS.map((label, i) => {
        const done    = i < current
        const active  = i === current
        const last    = i === STEPS.length - 1

        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Step circle */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width:          32,
                  height:         32,
                  borderRadius:   '50%',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       done ? '0.75rem' : '0.80rem',
                  fontWeight:     700,
                  border:         active
                    ? '2px solid rgba(34,211,238,0.70)'
                    : done
                      ? '2px solid rgba(74,222,128,0.50)'
                      : '2px solid rgba(255,255,255,0.12)',
                  background:     active
                    ? 'rgba(34,211,238,0.14)'
                    : done
                      ? 'rgba(74,222,128,0.12)'
                      : 'rgba(255,255,255,0.04)',
                  color:          active
                    ? '#22d3ee'
                    : done
                      ? '#4ade80'
                      : 'rgba(219,243,244,0.35)',
                }}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7L5.5 10L11 4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  String(i + 1)
                )}
              </div>
              <span
                style={{
                  fontSize:    '0.70rem',
                  fontWeight:  active ? 700 : 500,
                  color:       active
                    ? '#22d3ee'
                    : done
                      ? '#4ade80'
                      : 'rgba(219,243,244,0.35)',
                  whiteSpace:  'nowrap',
                }}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {!last && (
              <div
                style={{
                  width:       48,
                  height:      2,
                  marginBottom:24,
                  background:  i < current
                    ? 'rgba(74,222,128,0.30)'
                    : 'rgba(255,255,255,0.08)',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function Import() {
  const navigate          = useNavigate()
  const { tools, addTool } = useTools()

  const [step, setStep]           = useState<StepIndex>(0)
  const [headers, setHeaders]     = useState<string[]>([])
  const [rawRows, setRawRows]     = useState<Record<string, string>[]>([])
  const [mapping, setMapping]     = useState<ColumnMapping>({
    toolName: null, cost: null, billingCycle: null,
    renewalDate: null, category: null, notes: null,
  })
  const [previewRows, setPreviewRows] = useState<ParsedImportRow[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; failed: number } | null>(null)

  // ── Step 1: file received ──
  const handleFile = useCallback(async (file: File) => {
    try {
      const { rows, headers: h } = await parseCSVFile(file)
      setHeaders(h)
      setRawRows(rows)
      setMapping(autoDetectMapping(h))
      setStep(1)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to parse CSV')
    }
  }, [])

  // ── Step 2: mapping confirmed ──
  const handleMappingConfirm = useCallback(() => {
    const existingNames = tools.map(t => t.toolName)
    const parsed = applyMapping(rawRows, mapping, existingNames)
    setPreviewRows(parsed)
    setStep(2)
  }, [rawRows, mapping, tools])

  // ── Toggle row selection ──
  const handleToggleRow = useCallback((idx: number) => {
    setPreviewRows(prev =>
      prev.map((r, i) =>
        i === idx && r.errors.length === 0 ? { ...r, selected: !r.selected } : r
      )
    )
  }, [])

  const handleToggleAll = useCallback((selected: boolean) => {
    setPreviewRows(prev =>
      prev.map(r => r.errors.length === 0 ? { ...r, selected } : r)
    )
  }, [])

  // ── Step 3: import ──
  const handleImport = useCallback(async () => {
    setIsImporting(true)
    const toImport = previewRows.filter(r => r.selected && r.errors.length === 0)
    let imported = 0
    let failed   = 0

    for (const row of toImport) {
      try {
        await addTool({
          toolName:    row.parsed.toolName!,
          cost:        row.parsed.cost!,
          billingCycle: row.parsed.billingCycle ?? 'monthly',
          renewalDate: row.parsed.renewalDate!,
          category:    row.parsed.category ?? 'other',
          status:      'active',
          isAiTool:    row.parsed.category === 'ai',
          notes:       row.parsed.notes,
        })
        imported++
      } catch {
        failed++
      }
    }

    setImportResult({ imported, failed })
    setIsImporting(false)
    setStep(3)
  }, [previewRows, addTool])

  // ── Reset ──
  const handleReset = useCallback(() => {
    setStep(0)
    setHeaders([])
    setRawRows([])
    setMapping({ toolName: null, cost: null, billingCycle: null, renewalDate: null, category: null, notes: null })
    setPreviewRows([])
    setImportResult(null)
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width:   'min(780px, calc(100vw - 40px))',
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
          Import from CSV
        </h1>
        <p style={{ margin: '6px 0 0', color: 'rgba(219,243,244,0.55)', fontSize: '0.95rem' }}>
          Migrate your subscriptions from a Google Sheet, Notion table, or spreadsheet.
        </p>
      </div>

      <StepIndicator current={step} />

      {/* ── Panel ── */}
      <div
        style={{
          padding:      '32px',
          borderRadius: 20,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01)), rgba(16,24,25,0.80)',
          border:    '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        {/* ── STEP 0: Upload ── */}
        {step === 0 && (
          <div>
            <DropZone onFile={handleFile} />

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button
                onClick={downloadTemplate}
                style={{
                  background:     'none',
                  border:         'none',
                  color:          'rgba(34,211,238,0.75)',
                  fontSize:       '0.82rem',
                  cursor:         'pointer',
                  textDecoration: 'underline',
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            5,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download template CSV
              </button>
              <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'rgba(219,243,244,0.35)' }}>
                Supported columns: Tool Name, Cost ($), Billing Cycle, Renewal Date, Category, Notes
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 1: Map columns ── */}
        {step === 1 && (
          <ColumnMapper
            headers={headers}
            mapping={mapping}
            onChange={setMapping}
            onConfirm={handleMappingConfirm}
          />
        )}

        {/* ── STEP 2: Preview ── */}
        {step === 2 && (
          <ImportPreviewTable
            rows={previewRows}
            onToggleRow={handleToggleRow}
            onToggleAll={handleToggleAll}
            onImport={handleImport}
            onBack={() => setStep(1)}
            isImporting={isImporting}
          />
        )}

        {/* ── STEP 3: Done ── */}
        {step === 3 && importResult && (
          <div
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              textAlign:      'center',
              gap:            20,
              padding:        '16px 0',
            }}
          >
            {/* Big checkmark / partial indicator */}
            <div
              style={{
                width:          72,
                height:         72,
                borderRadius:   '50%',
                background:     importResult.failed === 0
                  ? 'rgba(74,222,128,0.12)'
                  : 'rgba(245,158,11,0.12)',
                border:         importResult.failed === 0
                  ? '2px solid rgba(74,222,128,0.35)'
                  : '2px solid rgba(245,158,11,0.35)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
              }}
            >
              {importResult.failed === 0 ? (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path d="M6 16L13 23L26 9" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path d="M16 10v8" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="16" cy="22" r="1.5" fill="#fbbf24"/>
                  <path d="M6 16L13 23L26 9" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                </svg>
              )}
            </div>

            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f3fbfb', letterSpacing: '-0.02em' }}>
                {importResult.imported} tool{importResult.imported !== 1 ? 's' : ''} imported successfully
              </div>
              {importResult.failed > 0 && (
                <div style={{ marginTop: 6, fontSize: '0.85rem', color: '#fbbf24' }}>
                  {importResult.failed} row{importResult.failed !== 1 ? 's' : ''} failed to import
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/app')}
                style={{
                  padding:      '10px 24px',
                  borderRadius: 999,
                  fontSize:     '0.85rem',
                  fontWeight:   700,
                  background:   'linear-gradient(135deg, rgba(34,211,238,0.92), rgba(15,118,110,0.92))',
                  color:        '#041012',
                  border:       'none',
                  cursor:       'pointer',
                }}
              >
                View dashboard
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding:      '10px 20px',
                  borderRadius: 999,
                  fontSize:     '0.85rem',
                  fontWeight:   500,
                  background:   'rgba(255,255,255,0.06)',
                  color:        'rgba(219,243,244,0.70)',
                  border:       '1px solid rgba(255,255,255,0.10)',
                  cursor:       'pointer',
                }}
              >
                Import more
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
