/** ToolCard — displays a single tool's details with status/category/AI badges */
import { Trash2, Calendar, StickyNote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  formatCurrency,
  normalizeToMonthly,
  formatRenewalDate,
  isRenewingSoon,
} from '@/lib/utils'
import type { Tool, BillingCycle } from '@/types'

interface ToolCardProps {
  tool: Tool
  onDelete: (id: string) => void
}

function cycleSuffix(cycle: BillingCycle): string {
  switch (cycle) {
    case 'monthly':  return '/ mo'
    case 'yearly':   return '/ yr'
    case 'one_time': return 'one-time'
  }
}

function statusVariant(status: Tool['status']): 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'active':    return 'success'
    case 'paused':    return 'warning'
    case 'cancelled': return 'danger'
  }
}

function categoryLabel(cat: Tool['category']): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1)
}

export function ToolCard({ tool, onDelete }: ToolCardProps) {
  const renewingSoon = isRenewingSoon(tool.renewalDate)
  const monthlyCost  = normalizeToMonthly(tool.cost, tool.billingCycle)

  return (
    <Card
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01)), rgba(16,24,25,0.80)',
        border:     '1px solid rgba(255,255,255,0.07)',
        boxShadow:  '0 8px 32px rgba(0,0,0,0.35)',
        borderRadius: 20,
        transition:   'border-color 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor =
          'rgba(34,211,238,0.22)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor =
          'rgba(255,255,255,0.07)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      <CardContent className="p-5">
        {/* ── Top row ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 min-w-0">
            {/* Name */}
            <h3
              className="font-bold text-base leading-tight truncate"
              style={{ color: '#f3fbfb' }}
            >
              {tool.toolName}
            </h3>

            {/* Cost */}
            <p
              className="text-lg font-semibold tabular-nums"
              style={{ color: '#22d3ee' }}
            >
              {formatCurrency(tool.cost)}{' '}
              <span
                className="text-xs font-normal"
                style={{ color: 'rgba(219,243,244,0.55)' }}
              >
                {cycleSuffix(tool.billingCycle)}
              </span>
              {tool.billingCycle === 'yearly' && monthlyCost > 0 && (
                <span
                  className="text-xs font-normal ml-2"
                  style={{ color: 'rgba(219,243,244,0.45)' }}
                >
                  ({formatCurrency(monthlyCost)}/mo)
                </span>
              )}
            </p>
          </div>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(tool.id)}
            aria-label={`Delete ${tool.toolName}`}
            className="shrink-0 opacity-40 hover:opacity-100 hover:text-red-400 transition-opacity"
            style={{ color: 'inherit' }}
          >
            <Trash2 size={15} />
          </Button>
        </div>

        {/* ── Badge row ── */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Badge variant={statusVariant(tool.status)}>
            {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
          </Badge>

          <Badge variant="cyan">
            {categoryLabel(tool.category)}
          </Badge>

          {tool.isAiTool && (
            <Badge variant="purple">
              AI Tool
            </Badge>
          )}
        </div>

        {/* ── Renewal date ── */}
        <div
          className="flex items-center gap-1.5 mt-3 text-xs"
          style={{
            color: renewingSoon
              ? 'rgba(251,191,36,0.85)'
              : 'rgba(219,243,244,0.50)',
          }}
        >
          <Calendar size={12} />
          <span>
            {tool.billingCycle === 'one_time'
              ? `Purchased ${formatRenewalDate(tool.renewalDate)}`
              : `Renews ${formatRenewalDate(tool.renewalDate)}`}
            {renewingSoon && (
              <span className="ml-1 font-semibold">(soon)</span>
            )}
          </span>
        </div>

        {/* ── Notes ── */}
        {tool.notes && tool.notes.trim().length > 0 && (
          <div
            className="flex items-start gap-1.5 mt-2 text-xs leading-relaxed"
            style={{ color: 'rgba(219,243,244,0.45)' }}
          >
            <StickyNote size={12} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{tool.notes}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
