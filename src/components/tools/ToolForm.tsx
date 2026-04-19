/** ToolForm — Zod-validated form for adding a SaaS or AI tool */
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input }    from '@/components/ui/input'
import { Button }   from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useTools } from '@/hooks/useTools'

// ── Static option lists ────────────────────────────────────────────────────
const BILLING_CYCLES = [
  { value: 'monthly',  label: 'Monthly'  },
  { value: 'yearly',   label: 'Yearly'   },
  { value: 'one_time', label: 'One-time' },
] as const

const CATEGORIES = [
  { value: 'productivity',  label: 'Productivity'  },
  { value: 'design',        label: 'Design'        },
  { value: 'development',   label: 'Development'   },
  { value: 'marketing',     label: 'Marketing'     },
  { value: 'ai',            label: 'AI'            },
  { value: 'communication', label: 'Communication' },
  { value: 'finance',       label: 'Finance'       },
  { value: 'other',         label: 'Other'         },
] as const

const STATUSES = [
  { value: 'active',    label: 'Active'    },
  { value: 'paused',    label: 'Paused'    },
  { value: 'cancelled', label: 'Cancelled' },
] as const

// ── Zod schema ─────────────────────────────────────────────────────────────
const toolSchema = z.object({
  toolName:     z.string().min(1, 'Name is required').max(100),
  cost:         z.coerce.number().min(0, 'Cost must be ≥ 0').max(99999, 'Cost must be < 100,000'),
  billingCycle: z.enum(['monthly', 'yearly', 'one_time']),
  renewalDate:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  category:     z.enum(['productivity','design','development','marketing','ai','communication','finance','other']),
  status:       z.enum(['active', 'paused', 'cancelled']),
  isAiTool:     z.boolean(),
  notes:        z.string().max(300, 'Max 300 characters').optional(),
})

type ToolFormValues = z.infer<typeof toolSchema>

// ── Styles ─────────────────────────────────────────────────────────────────
const aiBoxStyle: React.CSSProperties = {
  padding:      '14px 16px',
  borderRadius: 12,
  background:   'rgba(15, 118, 110, 0.10)',
  border:       '1px solid rgba(34, 211, 238, 0.20)',
}

const submitStyle: React.CSSProperties = {
  background:   'linear-gradient(135deg, rgba(34,211,238,0.92), rgba(15,118,110,0.92))',
  color:        '#041012',
  borderRadius: 999,
  fontWeight:   700,
  width:        '100%',
  height:       44,
  border:       'none',
  boxShadow:    '0 8px 24px rgba(34,211,238,0.18)',
}

// ── Component ──────────────────────────────────────────────────────────────
interface ToolFormProps {
  /** Called after a successful save so parent can navigate or react */
  onSuccess?: () => void
  /** Pre-filled values from catalog navigation */
  defaultValues?: Partial<ToolFormValues>
}

export function ToolForm({ onSuccess, defaultValues }: ToolFormProps) {
  const { addTool } = useTools()

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      toolName: '', cost: 0, billingCycle: 'monthly',
      renewalDate: '', category: 'other', status: 'active',
      isAiTool: false, notes: '',
      ...defaultValues,
    },
  })

  const onSubmit = async (data: ToolFormValues) => {
    try {
      await addTool(data)
      toast.success('Tool added successfully')
      form.reset()
      onSuccess?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add tool')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* Tool name */}
        <FormField control={form.control} name="toolName" render={({ field }) => (
          <FormItem>
            <FormLabel>Tool name</FormLabel>
            <FormControl><Input placeholder="e.g. GitHub Copilot" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Cost + Billing cycle */}
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="cost" render={({ field }) => (
            <FormItem>
              <FormLabel>Cost (USD)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="16.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="billingCycle" render={({ field }) => (
            <FormItem>
              <FormLabel>Billing cycle</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                <SelectContent>
                  {BILLING_CYCLES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Renewal date */}
        <FormField control={form.control} name="renewalDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Renewal / purchase date</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Category + Status */}
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* AI tool checkbox — visually distinct */}
        <FormField control={form.control} name="isAiTool" render={({ field }) => (
          <FormItem style={aiBoxStyle}>
            <div className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="is-ai-tool"
                />
              </FormControl>
              <div>
                <FormLabel htmlFor="is-ai-tool" className="text-sm font-semibold cursor-pointer" style={{ color: '#22d3ee' }}>
                  This is an AI tool / API service
                </FormLabel>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(219,243,244,0.50)' }}>
                  Enables AI spend tracking on the dashboard
                </p>
              </div>
            </div>
          </FormItem>
        )} />

        {/* Notes */}
        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem>
            <FormLabel>
              Notes{' '}
              <span style={{ color: 'rgba(219,243,244,0.45)', fontWeight: 400 }}>(optional)</span>
            </FormLabel>
            <FormControl>
              <Textarea placeholder="Anything worth noting about this tool…" maxLength={300} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Submit */}
        <Button type="submit" disabled={form.formState.isSubmitting} style={submitStyle}>
          {form.formState.isSubmitting ? 'Saving…' : 'Save tool'}
        </Button>

      </form>
    </Form>
  )
}
