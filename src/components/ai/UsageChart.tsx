/** UsageChart — area chart of daily AI spend (OpenAI + Anthropic) over 30 days */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { UsageByDay } from '@/hooks/useAITracker'
import { formatCurrency } from '@/lib/utils'

interface UsageChartProps {
  usageByDay: UsageByDay[]
}

function formatDollars(cents: number): string {
  if (cents === 0) return '$0'
  return formatCurrency(cents)
}

function formatDateLabel(dateStr: string): string {
  const [, month, day] = dateStr.split('-')
  return `${parseInt(month!)}/${parseInt(day!)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const openai    = (payload.find((p: { dataKey: string }) => p.dataKey === 'openai')?.value   ?? 0) as number
  const anthropic = (payload.find((p: { dataKey: string }) => p.dataKey === 'anthropic')?.value ?? 0) as number

  return (
    <div style={{
      background:    'rgba(11,17,18,0.96)',
      border:        '1px solid rgba(34,211,238,0.18)',
      borderRadius:  10,
      padding:       '10px 14px',
      backdropFilter:'blur(12px)',
      fontSize:      '0.8rem',
    }}>
      <div style={{ color: 'rgba(219,243,244,0.55)', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ color: '#4ade80' }}>OpenAI: {formatDollars(openai)}</div>
        <div style={{ color: '#fb923c' }}>Anthropic: {formatDollars(anthropic)}</div>
        <div style={{ color: '#f3fbfb', fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 4, marginTop: 2 }}>
          Total: {formatDollars(openai + anthropic)}
        </div>
      </div>
    </div>
  )
}

export function UsageChart({ usageByDay }: UsageChartProps) {
  const hasData = usageByDay.some(d => d.total > 0)

  if (!hasData) {
    return (
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        height:         240,
        color:          'rgba(219,243,244,0.35)',
        fontSize:       '0.88rem',
        flexDirection:  'column',
        gap:            10,
      }}>
        <div style={{ fontSize: '1.8rem', opacity: 0.3 }}>📊</div>
        No usage data yet — sync your providers
      </div>
    )
  }

  // Show every 5th date label
  const tickDates = usageByDay
    .filter((_, i) => i % 5 === 0)
    .map(d => d.date)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={usageByDay} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="openaiGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="anthropicGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#fb923c" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#fb923c" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          ticks={tickDates}
          tickFormatter={formatDateLabel}
          tick={{ fill: 'rgba(219,243,244,0.40)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={v => formatDollars(v as number)}
          tick={{ fill: 'rgba(219,243,244,0.40)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '0.78rem', color: 'rgba(219,243,244,0.50)', paddingTop: 8 }}
          formatter={(value: string) => value === 'openai' ? 'OpenAI' : 'Anthropic'}
        />
        <Area
          type="monotone"
          dataKey="openai"
          stroke="#4ade80"
          strokeWidth={2}
          fill="url(#openaiGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#4ade80' }}
        />
        <Area
          type="monotone"
          dataKey="anthropic"
          stroke="#fb923c"
          strokeWidth={2}
          fill="url(#anthropicGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#fb923c' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
