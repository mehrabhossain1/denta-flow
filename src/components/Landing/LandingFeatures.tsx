import { cn } from '@/lib/utils'
import {
  BookOpen,
  Bot,
  Check,
  Code2,
  CreditCard,
  Database,
  Mail,
  Palette,
  Search,
  Shield,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { SiDrizzle, SiShadcnui, SiTailwindcss } from 'react-icons/si'
import { SectionHeader } from '../_common/SectionHeader'
import { Badge } from '../ui/badge'

const FEATURES = [
  {
    id: 'framework',
    title: 'Framework',
    icon: Code2,
    tech: 'TanStack Start',
    timeSaved: '~5 hours on routing + server setup + best practices',
    better: 'Fast & flexible full-stack without glue code across frameworks',
    description:
      'Full-stack React framework with file-based routing, server functions, and SSR. Build both frontend and backend seamlessly with type-safe APIs.',
    highlights: [
      'File-based routing',
      'Server functions',
      'SSR & SSG support',
      'Type-safe end-to-end',
    ],
  },
  {
    id: 'auth',
    title: 'Login',
    icon: Shield,
    tech: 'better-auth',
    timeSaved: '~2 hours on auth + sessions',
    better: 'Own your auth. No paying vendors',
    description:
      '34+ integrations supported including Google, GitHub, Twitter, and more. Email OTP and session management control built in.',
    highlights: [
      '34+ providers, Google Auth, Magic-Link, OTP support out of the box',
      'Email OTP login',
      'Session management',
    ],
  },
  {
    id: 'database',
    title: 'Database',
    icon: Database,
    tech: 'Drizzle ORM',
    timeSaved: '~3 hours on ORM + migrations',
    better: '20-50% faster than Prisma',
    description:
      'Type-safe queries with any Postgres database. Works seamlessly with Supabase, Neon, Vercel Postgres, and more. Migrations included.',
    highlights: [
      'Works with any Postgres',
      'Supabase, Neon, Vercel',
      'Type-safe queries',
      'Migration system',
    ],
  },
  {
    id: 'email',
    title: 'Email',
    icon: Mail,
    tech: 'Plunk',
    timeSaved: '~3 hours on email setup',
    better: 'Open-source & affordable. No paying vendor-lock',
    description:
      'Send transactional and marketing emails with ease. Templates, automation, and analytics included. Reliable delivery out of the box.',
    highlights: [
      'Email templates',
      'Transactional emails',
      'Marketing campaigns',
      'Delivery tracking',
    ],
  },
  {
    id: 'seo',
    title: 'SEO / AEO',
    icon: Search,
    tech: 'Meta tags',
    timeSaved: '~3 hours on SEO & AEO wiring',
    better: 'Title, Meta tags, OG, Twitter',
    description:
      'Complete SEO & AEO setup with meta tags, Open Graph, Twitter Cards, and sitemap generation. Optimized for search engines out of the box.',
    highlights: [
      'Meta tags configured',
      'Open Graph support',
      'Twitter Cards',
      'Sitemap generation (coming soon)',
    ],
  },
  {
    id: 'style',
    title: 'Style',
    icon: Palette,
    tech: 'TailwindCSS & Shadcn',
    timeSaved: '~6 hours on UI scaffolding',
    better: 'Modern, performant and light-weight',
    description:
      'Beautiful UI components built with TailwindCSS and Shadcn. Dark mode support, responsive design, and 60+ pre-built components.',
    highlights: [
      'TailwindCSS v4',
      '60+ Shadcn components',
      'Dark mode support',
      'Fully responsive',
    ],
  },
  {
    id: 'payment',
    title: 'Payment',
    icon: CreditCard,
    tech: 'Stripe',
    timeSaved: '~5 hours on payments setup',
    better: 'Stripe subscriptions, one-time purchase, webhooks',
    description:
      'Accept payments with Stripe. Subscription management, webhooks, and customer portal included. Start monetizing from day one.',
    highlights: [
      'Stripe subscriptions',
      'Webhook handling',
      'Customer portal',
      'Invoice management',
    ],
  },
  {
    id: 'quality',
    title: 'Code Quality',
    icon: Zap,
    tech: 'Biome + Husky',
    timeSaved: '~2 hours on linting & formatting setup',
    better: 'Pre-commit hooks, formatting, and linting automated',
    description:
      'Built-in code quality tools with Biome, Husky pre-commit hooks, and automated formatting. Consistent code style across your team from day one.',
    highlights: [
      'Biome linting & formatting',
      'Husky pre-commit hooks',
      'Type checking included',
      'Cache invalidation helpers',
    ],
  },
  {
    id: 'resources',
    title: 'Developer Resources',
    icon: BookOpen,
    tech: 'Docs & Templates',
    timeSaved: '~3 hours on docs, templates & legal setup',
    better: 'Everything you need to launch in one place',
    description:
      'Comprehensive collection including code templates, tutorials, legal document prompts, and more. From getting started to deployment, we have you covered.',
    highlights: [
      'Caching for speed',
      'Code templates',
      'Step-by-step tutorials & documentation',
      'Legal document prompts (Terms, Privacy)',
    ],
  },
  {
    id: 'ai-ready',
    title: 'AI-Ready',
    icon: Bot,
    tech: 'Agent Instructions',
    timeSaved: '~1 hours on AI setup',
    better: 'Built-in instructions for Coding Agents & Copilot',
    description:
      'Pre-configured agent instructions and prompts for AI coding assistants. Work 10x faster with Claude, GitHub Copilot, and other AI models.',
    highlights: [
      'Copilot instructions included',
      'Agent guidelines documented',
      'Best practices for AI pair programming',
      'Continuous refinement',
    ],
  },
]

const STYLES = {
  tabBase:
    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
  tabActive: 'bg-foreground text-background',
  tabInactive: 'bg-muted/30 hover:bg-muted',
  card: 'relative border border-border/50 bg-muted/30 backdrop-blur-sm rounded-xl p-6 space-y-4 transition-shadow hover:shadow-md',
  iconContainer: 'inline-flex p-2 rounded-lg bg-primary/10',
  bulletItem: 'flex items-center gap-2 text-sm',
  bulletColors: {
    time: 'text-green-600 dark:text-green-400 font-medium ',
    better: 'text-blue-600 dark:text-blue-400 font-medium ',
    default: '',
  },
}

const BRAND_ICON_SIZE = 28
const BRANDS = {
  'TailwindCSS & Shadcn': [
    { Icon: SiTailwindcss, color: 'text-[#38bdf8]', name: 'TailwindCSS' },
    { Icon: SiShadcnui, color: 'text-[#0f172a]', name: 'Shadcn' },
  ],
  'Drizzle ORM': [
    { Icon: SiDrizzle, color: 'text-[#f5a524]', name: 'Drizzle ORM' },
  ],
  Plunk: [{ img: '/brands/plunk.svg', name: 'Plunk' }],
  Stripe: [{ img: '/brands/stripe-icon.svg', name: 'Stripe' }],
  'TanStack Start': [{ img: '/brands/tanstack.png', name: 'TanStack Start' }],
  'better-auth': [{ img: '/brands/better-auth.svg', name: 'better-auth' }],
} as const

const BrandBadge = ({ tech }: { tech: string }) => {
  const brands = BRANDS[tech as keyof typeof BRANDS]
  if (!brands) return null

  return (
    <Badge variant="outline" className="inline-flex items-center gap-1">
      <span className="text-xs text-muted-foreground">Built with</span>
      {brands.map((brand, index) => (
        <span key={brand.name} className="inline-flex items-center gap-1.5">
          {index > 0 && (
            <span className="text-xs text-muted-foreground">and</span>
          )}
          {'Icon' in brand ? (
            <brand.Icon
              className={brand.color}
              style={{ height: BRAND_ICON_SIZE, width: BRAND_ICON_SIZE }}
            />
          ) : (
            <img
              src={brand.img}
              alt={brand.name}
              className="h-7 w-7 rounded-sm"
              loading="lazy"
              width={28}
              height={28}
            />
          )}
          <span className="text-xs font-medium">{brand.name}</span>
        </span>
      ))}
    </Badge>
  )
}

const BulletList = ({ feature }: { feature: (typeof FEATURES)[number] }) => {
  const bullets = [
    { text: `Time saved: ${feature.timeSaved}`, tone: 'time' as const },
    { text: `Better: ${feature.better}`, tone: 'better' as const },
    ...feature.highlights.map((h) => ({ text: h, tone: 'default' as const })),
  ]

  return (
    <ul className="space-y-2">
      {bullets.map((item) => (
        <li key={item.text} className={STYLES.bulletItem}>
          <Check
            className={cn(
              'w-4 h-4 flex-shrink-0',
              STYLES.bulletColors[item.tone],
            )}
          />
          <span className={cn(STYLES.bulletColors[item.tone])}>
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  )
}

const TimeSavedBadge = ({
  text,
  size = 'sm',
}: {
  text: string
  size?: 'sm' | 'base'
}) => (
  <span
    className={cn(
      'pointer-events-none absolute font-semibold bg-emerald-50 p-0.5 rounded-sm text-emerald-600 dark:text-emerald-400 inline-block z-10',
      size === 'sm' ? 'text-xs top-1 right-2' : 'text-base -top-5 -right-4',
    )}
  >
    {text}
  </span>
)

const FeatureContent = ({
  feature,
}: {
  feature: (typeof FEATURES)[number]
}) => {
  const timeSavedMatch = feature.timeSaved.match(/~(\d+)/)
  const hoursValue = timeSavedMatch ? timeSavedMatch[1] : ''

  return (
    <>
      <TimeSavedBadge text={`Save ${hoursValue}h`} />
      <div>
        <h3 className={cn('font-bold mb-2 text-xl')}>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
      <BulletList feature={feature} />
      <BrandBadge tech={feature.tech} />
    </>
  )
}

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(FEATURES[0].id)
  const activeFeature = FEATURES.find((f) => f.id === activeTab) || FEATURES[0]

  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeader
          title={
            <span className="relative inline-flex flex-wrap items-center justify-center">
              Everything you need to launch
              <TimeSavedBadge text="Save 33h" size="base" />
            </span>
          }
          description="No more juggling 10 different services. Better-starter has everything built in and ready to go."
        />

        {/* Desktop: Tabs */}
        <div className="hidden lg:block">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => setActiveTab(feature.id)}
                  className={cn(
                    STYLES.tabBase,
                    activeTab === feature.id
                      ? STYLES.tabActive
                      : STYLES.tabInactive,
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {feature.title}
                </button>
              )
            })}
          </div>
          <div className={STYLES.card}>
            <FeatureContent feature={activeFeature} />
          </div>
        </div>

        {/* Mobile & Tablet: Stacked Cards */}
        <div className="lg:hidden space-y-4">
          {FEATURES.map((feature) => (
            <div key={feature.id} className={STYLES.card}>
              <FeatureContent feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
