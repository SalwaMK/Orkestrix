/** Catalog tool data — pre-built library of 50+ popular SaaS and AI tools */
import type { ToolCategory, BillingCycle } from '@/types'

export interface CatalogTool {
  id: string
  name: string
  /** Monthly cost equivalent in cents (0 = usage-based / free) */
  defaultCost: number
  billingCycle: BillingCycle
  category: ToolCategory
  isAiTool: boolean
  /** One short sentence, max 60 chars */
  description: string
  website: string
  /** Hex brand color for avatar circle */
  color: string
}

export const CATALOG_TOOLS: CatalogTool[] = [
  // ── PRODUCTIVITY ────────────────────────────────────────────────────────
  { id: 'notion',        name: 'Notion',         defaultCost: 1600, billingCycle: 'monthly', category: 'productivity', isAiTool: false, description: 'All-in-one workspace for notes and wikis',      website: 'notion.so',       color: '#000000' },
  { id: 'obsidian',      name: 'Obsidian',        defaultCost: 0,    billingCycle: 'monthly', category: 'productivity', isAiTool: false, description: 'Local-first markdown knowledge base',          website: 'obsidian.md',     color: '#7C3AED' },
  { id: 'todoist',       name: 'Todoist',         defaultCost: 400,  billingCycle: 'monthly', category: 'productivity', isAiTool: false, description: 'Task manager for individuals and teams',       website: 'todoist.com',     color: '#DB4035' },
  { id: 'cron',          name: 'Cron',            defaultCost: 0,    billingCycle: 'monthly', category: 'productivity', isAiTool: false, description: 'Next-generation calendar app',                  website: 'cron.com',        color: '#111827' },
  { id: 'craft',         name: 'Craft',           defaultCost: 500,  billingCycle: 'monthly', category: 'productivity', isAiTool: false, description: 'Beautiful document editor for Mac',            website: 'craft.do',        color: '#007AFF' },

  // ── DESIGN ───────────────────────────────────────────────────────────────
  { id: 'figma',         name: 'Figma',           defaultCost: 1500, billingCycle: 'monthly', category: 'design',       isAiTool: false, description: 'Collaborative interface design tool',           website: 'figma.com',       color: '#F24E1E' },
  { id: 'framer',        name: 'Framer',          defaultCost: 2000, billingCycle: 'monthly', category: 'design',       isAiTool: false, description: 'Design and publish interactive sites',         website: 'framer.com',      color: '#0055FF' },
  { id: 'canva',         name: 'Canva',           defaultCost: 1500, billingCycle: 'monthly', category: 'design',       isAiTool: false, description: 'Online graphic design platform',               website: 'canva.com',       color: '#00C4CC' },
  { id: 'sketch',        name: 'Sketch',          defaultCost: 900,  billingCycle: 'monthly', category: 'design',       isAiTool: false, description: 'Digital design toolkit for Mac',               website: 'sketch.com',      color: '#F7B500' },
  { id: 'lottiefiles',   name: 'LottieFiles',     defaultCost: 1900, billingCycle: 'monthly', category: 'design',       isAiTool: false, description: 'Animation platform for lightweight files',     website: 'lottiefiles.com', color: '#00DDB3' },

  // ── DEVELOPMENT ──────────────────────────────────────────────────────────
  { id: 'github',        name: 'GitHub',          defaultCost: 400,  billingCycle: 'monthly', category: 'development',  isAiTool: false, description: 'Code hosting and collaboration platform',      website: 'github.com',      color: '#181717' },
  { id: 'gitlab',        name: 'GitLab',          defaultCost: 1900, billingCycle: 'monthly', category: 'development',  isAiTool: false, description: 'DevOps lifecycle and code platform',           website: 'gitlab.com',      color: '#FC6D26' },
  { id: 'vercel',        name: 'Vercel',          defaultCost: 2000, billingCycle: 'monthly', category: 'development',  isAiTool: false, description: 'Frontend cloud deployment platform',           website: 'vercel.com',      color: '#000000' },
  { id: 'netlify',       name: 'Netlify',         defaultCost: 1900, billingCycle: 'monthly', category: 'development',  isAiTool: false, description: 'Web hosting and automation platform',          website: 'netlify.com',     color: '#00C7B7' },
  { id: 'railway',       name: 'Railway',         defaultCost: 500,  billingCycle: 'monthly', category: 'development',  isAiTool: false, description: 'Infrastructure deployment made simple',        website: 'railway.app',     color: '#0B0D0E' },
  { id: 'supabase',      name: 'Supabase',        defaultCost: 2500, billingCycle: 'monthly', category: 'development',  isAiTool: false, description: 'Open source Firebase alternative',            website: 'supabase.com',    color: '#3ECF8E' },
  { id: 'planetscale',   name: 'PlanetScale',     defaultCost: 3900, billingCycle: 'monthly', category: 'development',  isAiTool: false, description: 'MySQL-compatible serverless database',         website: 'planetscale.com', color: '#000000' },
  { id: 'linear',        name: 'Linear',          defaultCost: 800,  billingCycle: 'monthly', category: 'development',  isAiTool: false, description: 'Issue tracking built for modern teams',        website: 'linear.app',      color: '#5E6AD2' },
  { id: 'sentry',        name: 'Sentry',          defaultCost: 2600, billingCycle: 'monthly', category: 'development',  isAiTool: false, description: 'Application monitoring and error tracking',    website: 'sentry.io',       color: '#362D59' },
  { id: 'datadog',       name: 'Datadog',         defaultCost: 1500, billingCycle: 'monthly', category: 'development',  isAiTool: false, description: 'Cloud monitoring and analytics platform',      website: 'datadoghq.com',   color: '#632CA6' },

  // ── AI TOOLS ─────────────────────────────────────────────────────────────
  { id: 'chatgpt-plus',  name: 'ChatGPT Plus',    defaultCost: 2000, billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'OpenAI flagship conversational AI',            website: 'chat.openai.com', color: '#10A37F' },
  { id: 'claude-pro',    name: 'Claude Pro',      defaultCost: 2000, billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'Anthropic AI assistant subscription',          website: 'claude.ai',       color: '#D97757' },
  { id: 'cursor',        name: 'Cursor',          defaultCost: 2000, billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'AI-first code editor built on VS Code',        website: 'cursor.com',      color: '#000000' },
  { id: 'copilot',       name: 'GitHub Copilot',  defaultCost: 1000, billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'AI pair programmer in your editor',            website: 'github.com',      color: '#181717' },
  { id: 'perplexity',    name: 'Perplexity',      defaultCost: 2000, billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'AI-powered answer engine',                     website: 'perplexity.ai',   color: '#20808D' },
  { id: 'midjourney',    name: 'Midjourney',      defaultCost: 1000, billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'AI image generation via Discord',              website: 'midjourney.com',  color: '#000000' },
  { id: 'elevenlabs',    name: 'ElevenLabs',      defaultCost: 2200, billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'AI voice synthesis and cloning',               website: 'elevenlabs.io',   color: '#000000' },
  { id: 'runway',        name: 'Runway',          defaultCost: 1500, billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'AI video generation and editing',              website: 'runwayml.com',    color: '#000000' },
  { id: 'openai-api',    name: 'OpenAI API',      defaultCost: 0,    billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'Pay-as-you-go GPT and DALL·E API',            website: 'openai.com',      color: '#10A37F' },
  { id: 'anthropic-api', name: 'Anthropic API',   defaultCost: 0,    billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'Pay-as-you-go Claude API access',             website: 'anthropic.com',   color: '#D97757' },
  { id: 'replicate',     name: 'Replicate',       defaultCost: 0,    billingCycle: 'monthly', category: 'ai',           isAiTool: true,  description: 'Run AI models via API',                        website: 'replicate.com',   color: '#000000' },

  // ── COMMUNICATION ────────────────────────────────────────────────────────
  { id: 'slack',         name: 'Slack',           defaultCost: 750,  billingCycle: 'monthly', category: 'communication', isAiTool: false, description: 'Business messaging and collaboration',         website: 'slack.com',       color: '#4A154B' },
  { id: 'discord',       name: 'Discord',         defaultCost: 999,  billingCycle: 'monthly', category: 'communication', isAiTool: false, description: 'Community and team communication',             website: 'discord.com',     color: '#5865F2' },
  { id: 'loom',          name: 'Loom',            defaultCost: 1250, billingCycle: 'monthly', category: 'communication', isAiTool: false, description: 'Async video messaging for teams',              website: 'loom.com',        color: '#625DF5' },
  { id: 'zoom',          name: 'Zoom',            defaultCost: 1599, billingCycle: 'monthly', category: 'communication', isAiTool: false, description: 'Video conferencing and webinars',              website: 'zoom.us',         color: '#2D8CFF' },
  { id: 'intercom',      name: 'Intercom',        defaultCost: 7400, billingCycle: 'monthly', category: 'communication', isAiTool: false, description: 'Customer messaging platform',                  website: 'intercom.com',    color: '#1F8DED' },

  // ── MARKETING ────────────────────────────────────────────────────────────
  { id: 'mailchimp',     name: 'Mailchimp',       defaultCost: 1300, billingCycle: 'monthly', category: 'marketing',    isAiTool: false, description: 'Email marketing and automation',               website: 'mailchimp.com',   color: '#FFE01B' },
  { id: 'convertkit',    name: 'ConvertKit',      defaultCost: 900,  billingCycle: 'monthly', category: 'marketing',    isAiTool: false, description: 'Email platform for creators',                  website: 'convertkit.com',  color: '#FB6970' },
  { id: 'buffer',        name: 'Buffer',          defaultCost: 600,  billingCycle: 'monthly', category: 'marketing',    isAiTool: false, description: 'Social media scheduling and analytics',        website: 'buffer.com',      color: '#168EEA' },
  { id: 'ahrefs',        name: 'Ahrefs',          defaultCost: 9900, billingCycle: 'monthly', category: 'marketing',    isAiTool: false, description: 'SEO tools and backlink analysis',              website: 'ahrefs.com',      color: '#FF7043' },
  { id: 'hotjar',        name: 'Hotjar',          defaultCost: 3200, billingCycle: 'monthly', category: 'marketing',    isAiTool: false, description: 'Website heatmaps and session recording',       website: 'hotjar.com',      color: '#FD3A5C' },

  // ── FINANCE ──────────────────────────────────────────────────────────────
  { id: 'stripe',        name: 'Stripe',          defaultCost: 0,    billingCycle: 'monthly', category: 'finance',      isAiTool: false, description: 'Online payment processing platform',           website: 'stripe.com',      color: '#635BFF' },
  { id: 'paddle',        name: 'Paddle',          defaultCost: 0,    billingCycle: 'monthly', category: 'finance',      isAiTool: false, description: 'Revenue delivery platform for SaaS',           website: 'paddle.com',      color: '#0ACF83' },
  { id: 'quickbooks',    name: 'QuickBooks',      defaultCost: 3000, billingCycle: 'monthly', category: 'finance',      isAiTool: false, description: 'Accounting software for small business',       website: 'quickbooks.com',  color: '#2CA01C' },
  { id: 'mercury',       name: 'Mercury',         defaultCost: 0,    billingCycle: 'monthly', category: 'finance',      isAiTool: false, description: 'Banking built for startups',                   website: 'mercury.com',     color: '#000000' },

  // ── OTHER ────────────────────────────────────────────────────────────────
  { id: 'zapier',        name: 'Zapier',          defaultCost: 1999, billingCycle: 'monthly', category: 'other',        isAiTool: false, description: 'Automation for connecting apps',               website: 'zapier.com',      color: '#FF4A00' },
  { id: 'make',          name: 'Make',            defaultCost: 900,  billingCycle: 'monthly', category: 'other',        isAiTool: false, description: 'Visual workflow automation platform',          website: 'make.com',        color: '#6D00CC' },
  { id: 'retool',        name: 'Retool',          defaultCost: 1000, billingCycle: 'monthly', category: 'other',        isAiTool: false, description: 'Build internal tools fast',                    website: 'retool.com',      color: '#3D52F4' },
  { id: 'airtable',      name: 'Airtable',        defaultCost: 2000, billingCycle: 'monthly', category: 'other',        isAiTool: false, description: 'Spreadsheet-database hybrid platform',         website: 'airtable.com',    color: '#FCB400' },
  { id: 'typeform',      name: 'Typeform',        defaultCost: 2900, billingCycle: 'monthly', category: 'other',        isAiTool: false, description: 'Conversational forms and surveys',             website: 'typeform.com',    color: '#262627' },
  { id: 'posthog',       name: 'PostHog',         defaultCost: 0,    billingCycle: 'monthly', category: 'other',        isAiTool: false, description: 'Open source product analytics',               website: 'posthog.com',     color: '#F54E00' },
  { id: 'cal-com',       name: 'Cal.com',         defaultCost: 1200, billingCycle: 'monthly', category: 'other',        isAiTool: false, description: 'Open source scheduling infrastructure',       website: 'cal.com',         color: '#292929' },
  { id: 'cloudflare',    name: 'Cloudflare',      defaultCost: 2000, billingCycle: 'monthly', category: 'other',        isAiTool: false, description: 'CDN, security, and edge computing',            website: 'cloudflare.com',  color: '#F38020' },
]

export const CATALOG_BY_CATEGORY = CATALOG_TOOLS.reduce<
  Partial<Record<ToolCategory, CatalogTool[]>>
>((acc, tool) => {
  const key = tool.category
  if (!acc[key]) acc[key] = []
  acc[key]!.push(tool)
  return acc
}, {})
