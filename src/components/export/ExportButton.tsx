/**
 * ExportButton — Dropdown button for exporting data
 * Renders CSV, PDF and Share on X actions.
 */
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, FileText, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Tool } from '@/types'
import { exportToCSV, exportToPDF, generateShareText } from '@/lib/exportUtils'

interface ExportButtonProps {
  tools: Tool[]
}

export function ExportButton({ tools }: ExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExportCSV = () => {
    exportToCSV(tools)
    setOpen(false)
  }

  const handleExportPDF = async () => {
    if (isGeneratingPdf) return
    setIsGeneratingPdf(true)
    
    // Allow React state to update so "Generating..." shows
    setTimeout(() => {
      try {
        exportToPDF(tools)
      } finally {
        setIsGeneratingPdf(false)
        setOpen(false)
      }
    }, 10)
  }

  const handleShareOnX = () => {
    const text = generateShareText(tools)
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    setOpen(false)
  }

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    fontSize: '0.85rem',
    color: '#f3fbfb',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  }

  return (
    <div style={{ position: 'relative' }}>
      <Button
        ref={btnRef}
        variant="outline"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: open ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.02)',
          borderColor: open ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.1)',
          color: open ? '#22d3ee' : '#f3fbfb',
        }}
      >
        <Download size={14} />
        Export
        <ChevronDown size={14} style={{ opacity: 0.7 }} />
      </Button>

      {open && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 180,
            background: 'rgba(16,24,25,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 50,
            backdropFilter: 'blur(16px)',
          }}
        >
          <button
            onClick={handleExportCSV}
            style={itemStyle}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Download size={15} style={{ opacity: 0.7 }} />
            Export CSV
          </button>
          
          <button
            onClick={handleExportPDF}
            disabled={isGeneratingPdf}
            style={{ ...itemStyle, opacity: isGeneratingPdf ? 0.6 : 1, cursor: isGeneratingPdf ? 'not-allowed' : 'pointer' }}
            onMouseEnter={e => { if (!isGeneratingPdf) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <FileText size={15} style={{ opacity: 0.7 }} />
            {isGeneratingPdf ? 'Generating...' : 'Export PDF'}
          </button>
          
          <button
            onClick={handleShareOnX}
            style={itemStyle}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Share2 size={15} style={{ opacity: 0.7 }} />
            Share on X
          </button>
        </div>
      )}
    </div>
  )
}
