/**
 * DropZone — drag-and-drop CSV file upload area.
 * Accepts .csv files only. Shows filename after selection.
 * Calls onFile(file) when a valid file is selected.
 */
import { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'

interface DropZoneProps {
  onFile: (file: File) => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DropZone({ onFile }: DropZoneProps) {
  const [dragging, setDragging]   = useState(false)
  const [selected, setSelected]   = useState<File | null>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File | undefined | null) => {
    if (!file) return
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      toast.error('Please upload a .csv file')
      return
    }
    setSelected(file)
    onFile(file)
  }, [onFile])

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const onDragLeave = () => setDragging(false)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0])
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload CSV file"
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        padding:       '48px 32px',
        borderRadius:  16,
        border:        dragging
          ? '2px solid rgba(34,211,238,0.60)'
          : selected
            ? '2px solid rgba(74,222,128,0.40)'
            : '2px dashed rgba(255,255,255,0.15)',
        background:    dragging
          ? 'rgba(34,211,238,0.06)'
          : selected
            ? 'rgba(74,222,128,0.04)'
            : 'rgba(255,255,255,0.02)',
        cursor:        'pointer',
        textAlign:     'center',
        transition:    'all 0.18s ease',
        userSelect:    'none',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />

      {selected ? (
        /* ── File selected state ── */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {/* Green checkmark */}
          <div
            style={{
              width:          52,
              height:         52,
              borderRadius:   '50%',
              background:     'rgba(74,222,128,0.12)',
              border:         '1px solid rgba(74,222,128,0.30)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13L9 17L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f3fbfb' }}>
              {selected.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(219,243,244,0.45)', marginTop: 2 }}>
              {formatBytes(selected.size)}
            </div>
          </div>

          <button
            onClick={e => {
              e.stopPropagation()
              setSelected(null)
              if (inputRef.current) inputRef.current.value = ''
              inputRef.current?.click()
            }}
            style={{
              background:   'none',
              border:       'none',
              color:        'rgba(34,211,238,0.80)',
              fontSize:     '0.8rem',
              cursor:       'pointer',
              textDecoration: 'underline',
              padding:      0,
            }}
          >
            Change file
          </button>
        </div>
      ) : (
        /* ── Empty / drag state ── */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {/* Upload icon */}
          <div
            style={{
              width:          52,
              height:         52,
              borderRadius:   '50%',
              background:     dragging ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.06)',
              border:         dragging ? '1px solid rgba(34,211,238,0.30)' : '1px solid rgba(255,255,255,0.10)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              transition:     'all 0.18s ease',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dragging ? '#22d3ee' : 'rgba(219,243,244,0.55)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: dragging ? '#22d3ee' : '#f3fbfb' }}>
              Drop your CSV here
            </div>
            <div style={{ fontSize: '0.80rem', color: 'rgba(219,243,244,0.40)', marginTop: 4 }}>
              or click to browse
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
