/**
 * ExportSummaryCard — small summary card shown at the bottom of the dashboard
 * to promote exporting and sharing the stack once >3 tools are configured.
 */
import { FileText, Download, Share2 } from 'lucide-react'
import type { Tool } from '@/types'
import { exportToCSV, exportToPDF, generateShareText } from '@/lib/exportUtils'
import { normalizeToMonthly, formatCurrency } from '@/lib/utils'

export function ExportSummaryCard({ tools }: { tools: Tool[] }) {
  if (tools.length < 3) return null

  const activeTools = tools.filter(t => t.status === 'active')
  const totalMonthlyCents = activeTools.reduce((acc, t) => acc + normalizeToMonthly(t.cost, t.billingCycle), 0)
  const aiMonthlyCents = activeTools
    .filter(t => t.isAiTool)
    .reduce((acc, t) => acc + normalizeToMonthly(t.cost, t.billingCycle), 0)

  const costStr = formatCurrency(totalMonthlyCents)
  const aiPercent = totalMonthlyCents > 0 ? Math.round((aiMonthlyCents / totalMonthlyCents) * 100) : 0

  return (
    <div
      style={{
        marginTop: 48,
        padding: '24px 32px',
        borderRadius: 16,
        background: 'linear-gradient(180deg, rgba(34,211,238,0.05), rgba(34,211,238,0.01))',
        border: '1px solid rgba(34,211,238,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(219,243,244,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Share your stack
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f3fbfb', marginTop: 4 }}>
          You use {activeTools.length} tools — {costStr}/mo {aiPercent > 0 && `— ${aiPercent}% AI`}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          title="Export CSV"
          onClick={() => exportToCSV(tools)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#22d3ee',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(34,211,238,0.1)'
            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
          }}
        >
          <Download size={18} />
        </button>

        <button
          title="Export PDF report"
          onClick={() => exportToPDF(tools)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#22d3ee',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(34,211,238,0.1)'
            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
          }}
        >
          <FileText size={18} />
        </button>

        <button
          title="Share on X"
          onClick={() => {
            const text = generateShareText(tools)
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
            window.open(url, '_blank')
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#22d3ee',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(34,211,238,0.1)'
            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
          }}
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  )
}
