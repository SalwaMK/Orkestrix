/**
 * exportUtils.ts — CSV and PDF export functionality for Orkestrix tools
 * Runs entirely client-side using Blob URLs and jsPDF.
 */
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Tool } from '../types'
import { normalizeToMonthly, formatCurrency, getUpcomingRenewals, daysUntilRenewal, formatRenewalDate } from './utils'

// ── CSV EXPORT ──────────────────────────────────────────────

export function exportToCSV(tools: Tool[]): void {
  const headers = [
    'Tool Name',
    'Cost ($/mo)',
    'Billing Cycle',
    'Renewal Date',
    'Category',
    'Is AI Tool',
    'Status',
    'Notes'
  ]

  const rows = tools.map((tool) => {
    // Normalise to monthly cents, then convert to dollars
    const monthlyCents = normalizeToMonthly(tool.cost, tool.billingCycle)
    const monthlyCostDollars = (monthlyCents / 100).toFixed(2)

    return [
      escapeCSVField(tool.toolName),
      monthlyCostDollars,
      tool.billingCycle,
      tool.renewalDate,
      tool.category,
      tool.isAiTool ? 'Yes' : 'No',
      tool.status,
      escapeCSVField(tool.notes ?? '')
    ].join(',')
  })

  const csvContent = [headers.join(','), ...rows].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const todayDateStr = new Date().toISOString().split('T')[0]

  const a = document.createElement('a')
  a.href = url
  a.download = `orkestrix-stack-${todayDateStr}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function escapeCSVField(str: string): string {
  if (/[,"\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

// ── PDF REPORT ───────────────────────────────────────────────

export function exportToPDF(tools: Tool[]): void {
  const doc = new jsPDF()

  // Colors
  const COLOR_PRIMARY: [number, number, number] = [15, 110, 86] // #0F6E56
  const COLOR_GRAY: [number, number, number] = [120, 120, 120]
  const COLOR_DARK: [number, number, number] = [30, 30, 30]

  const activeTools = tools.filter(t => t.status === 'active')

  // Calculate summary stats
  const totalMonthlyCents = activeTools.reduce((acc, t) => acc + normalizeToMonthly(t.cost, t.billingCycle), 0)
  const aiMonthlyCents = activeTools
    .filter(t => t.isAiTool)
    .reduce((acc, t) => acc + normalizeToMonthly(t.cost, t.billingCycle), 0)
  const annualTotalCents = totalMonthlyCents * 12

  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  // ── HEADER SECTION ──
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(...COLOR_PRIMARY)
  doc.text('Orkestrix', 15, 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(14)
  doc.setTextColor(...COLOR_GRAY)
  doc.text('Stack Report', 15, 28)

  doc.setFontSize(10)
  const dateText = `Generated ${todayStr}`
  const dateWidth = doc.getTextWidth(dateText)
  doc.text(dateText, 210 - 15 - dateWidth, 28)

  // Horizontal line
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  doc.line(15, 33, 195, 33)

  // ── SUMMARY SECTION ──
  const yStartSummary = 40
  const boxWidth = 41.25 // (195 - 15 - 3*5) / 4 ~ 41.25
  const boxHeight = 20

  const summaryBoxes = [
    { label: 'Monthly spend', value: formatCurrency(totalMonthlyCents) },
    { label: 'Annual spend', value: formatCurrency(annualTotalCents) },
    { label: 'Total tools', value: activeTools.length.toString() },
    { label: 'AI spend / mo', value: formatCurrency(aiMonthlyCents) },
  ]

  summaryBoxes.forEach((box, i) => {
    const xBox = 15 + i * (boxWidth + 5)
    
    // Box bg
    doc.setFillColor(245, 245, 245)
    doc.rect(xBox, yStartSummary, boxWidth, boxHeight, 'F')
    
    // Box title
    doc.setFontSize(8)
    doc.setTextColor(...COLOR_GRAY)
    doc.text(box.label, xBox + 4, yStartSummary + 6)
    
    // Box value
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(...COLOR_DARK)
    doc.text(box.value, xBox + 4, yStartSummary + 15)
  })

  // ── BREAKDOWN TABLE ──
  const yTableStart = yStartSummary + boxHeight + 15

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLOR_DARK)
  doc.text('Full stack breakdown', 15, yTableStart)

  const sortedTools = [...tools].sort((a, b) => {
    if (a.isAiTool && !b.isAiTool) return -1
    if (!a.isAiTool && b.isAiTool) return 1
    return a.toolName.localeCompare(b.toolName)
  })

  const tableData = sortedTools.map(t => {
    const costFormatted = formatCurrency(Math.round(normalizeToMonthly(t.cost, t.billingCycle)))
    const toolNameDisplay = t.isAiTool ? `${t.toolName} (AI)` : t.toolName
    return [
      toolNameDisplay,
      t.category,
      costFormatted,
      t.billingCycle,
      formatRenewalDate(t.renewalDate),
      t.status
    ]
  })

  autoTable(doc, {
    startY: yTableStart + 4,
    head: [['Tool', 'Category', 'Cost/mo', 'Billing', 'Renewal', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: COLOR_PRIMARY, textColor: [255, 255, 255] },
    margin: { left: 15, right: 15 },
    styles: { font: 'helvetica', fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    didDrawPage: (data) => {
      // Footer
      const pageCount = doc.internal.pages.length - 1
      doc.setFontSize(8)
      doc.setTextColor(...COLOR_GRAY)
      
      const footerText = 'Generated by Orkestrix — orkestrix.app'
      const textWidth = doc.getTextWidth(footerText)
      doc.text(footerText, 105 - (textWidth / 2), 285)
      
      doc.text(`Page ${data.pageNumber}`, 195 - doc.getTextWidth(`Page ${data.pageNumber}`), 285)
    }
  })

  // ── RENEWAL SECTION ──
  const finalY = (doc as any).lastAutoTable.finalY + 15
  
  const upcomingRenewals = getUpcomingRenewals(tools, 30).filter(t => t.status === 'active')
  
  if (upcomingRenewals.length > 0) {
    // If approaching bottom of page, add a new page (rough margin safeguard)
    if (finalY > 260) {
      doc.addPage()
    }
    
    const currentY = finalY > 260 ? 20 : finalY
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(230, 138, 0) // Amber
    doc.text('Renewals in the next 30 days', 15, currentY)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...COLOR_DARK)
    
    upcomingRenewals.forEach((t, i) => {
      const days = daysUntilRenewal(t.renewalDate)
      const costStr = formatCurrency(t.cost)
      const rowText = `• ${t.toolName} — renews in ${days} days (${costStr})`
      doc.text(rowText, 15, currentY + 8 + (i * 6))
    })
  }

  const todayDateStr = new Date().toISOString().split('T')[0]
  doc.save(`orkestrix-report-${todayDateStr}.pdf`)
}

// ── SHARE GENERATOR ────────────────────────────────────────────

export function generateShareText(tools: Tool[]): string {
  const activeTools = tools.filter(t => t.status === 'active')
  const toolCount = activeTools.length
  const totalMonthlyCents = activeTools.reduce((acc, t) => acc + normalizeToMonthly(t.cost, t.billingCycle), 0)
  const aiMonthlyCents = activeTools
    .filter(t => t.isAiTool)
    .reduce((acc, t) => acc + normalizeToMonthly(t.cost, t.billingCycle), 0)

  const aiPercent = totalMonthlyCents > 0 ? Math.round((aiMonthlyCents / totalMonthlyCents) * 100) : 0

  const lines = [
    'Just tracked my entire software stack with Orkestrix 📊',
    '',
    `💰 ${formatCurrency(totalMonthlyCents)}/month across ${toolCount} tools`
  ]

  if (aiPercent > 0) {
    lines.push(`🤖 ${aiPercent}% is AI tools`)
  }

  lines.push('')
  lines.push('Open source + local-first. Check yours 👇')
  lines.push('orkestrix.app')
  lines.push('')
  lines.push('#buildinpublic #saas #indiedev')

  const text = lines.join('\n')
  return text
}
