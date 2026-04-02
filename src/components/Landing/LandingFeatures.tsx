import { cn } from '@/lib/utils'
import {
  Bot,
  Check,
  Code2,
  CreditCard,
  Database,
  FileText,
  LayoutDashboard,
  Mail,
  Palette,
  Search,
  Shield,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SiDrizzle, SiShadcnui, SiTailwindcss } from 'react-icons/si'
import { SectionHeader } from '../_common/SectionHeader'

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
    better: 'Open source. Self-hostable. No vendor lock-in',
    description:
      '34+ integrations supported including Google, GitHub, Twitter, and more. Email OTP and session management control built in.',
    highlights: [
      '34+ providers, Google Auth, Magic-Link, OTP support out of the box',
      'Email OTP login',
      'Session management',
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
      'AI Agent SDK (coming soon)',
    ],
  },
  {
    id: 'admin',
    title: 'Admin Panel (Soon)',
    icon: LayoutDashboard,
    tech: 'Built-in',
    timeSaved: '~6 hours on admin scaffolding',
    better:
      'User management, billing overview, and feature flags — ready to go',
    description:
      'A pre-built admin panel to manage users, view subscription status, and toggle feature flags. No external tool needed — it ships with the kit.',
    highlights: [
      'User management table',
      'Subscription & billing overview',
      'Feature flag controls',
      'Role-based access',
    ],
  },
  {
    id: 'email',
    title: 'Email',
    icon: Mail,
    tech: 'Plunk',
    timeSaved: '~3 hours on email setup',
    better: 'Open source. Self-hostable. No vendor lock-in',
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
    id: 'blog',
    title: 'Blog',
    icon: FileText,
    tech: 'Content Collections',
    timeSaved: '~4 hours on blog setup',
    better: 'MDX, syntax highlighting, RSS, sitemap — all pre-wired',
    description:
      'A fully functional blog with MDX support, syntax highlighting, reading time, RSS feed, and SEO meta tags. Write in Markdown, ship a professional blog.',
    highlights: [
      'MDX + Markdown support',
      'Syntax highlighted code blocks',
      'RSS feed & sitemap',
      'Reading time & meta tags',
    ],
  },
  {
    id: 'docs',
    title: 'Docs',
    icon: FileText,
    tech: 'Content Collections',
    timeSaved: '~3 hours on docs setup',
    better: 'Ship your product docs alongside your product — no extra tooling',
    description:
      'A fully featured documentation site built in. Nested sections, sidebar navigation, search, and MDX support out of the box. Your docs live in your repo — versioned and always in sync.',
    highlights: [
      'Nested sections & sidebar nav',
      'MDX — embed components in docs',
      'Syntax highlighted code blocks',
      'Search-ready structure',
    ],
  },
  {
    id: 'seo-aeo',
    title: 'SEO / AEO',
    icon: Search,
    tech: 'Meta tags',
    timeSaved: '~5 hours on SEO & AEO wiring',
    better: 'Title, Meta tags, OG, Twitter',
    description:
      'Complete SEO & AEO setup with meta tags, Open Graph, Twitter Cards, and sitemap generation. Optimized for search engines out of the box.',
    highlights: [
      'Meta tags configured',
      'Open Graph support',
      'Twitter Cards',
      'Sitemap.xml generation',
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
    id: 'more',
    title: 'More',
    icon: Zap,
    tech: 'Biome + Husky',
    timeSaved: '~5 hours on quality, legal & template setup',
    better:
      'Code quality, legal docs, templates, and best practices — all in one',
    description:
      'The finishing touches that make a starter kit truly production-ready: automated code quality tooling, legal document prompts, deployment guides, and reusable templates so you spend zero time on boilerplate.',
    highlights: [
      'Biome linting & Husky pre-commit hooks',
      'TypeScript strict mode configured',
      'Legal prompts: Terms of Service & Privacy Policy',
      'Deployment guides for Vercel, Cloudflare, Netlify',
      'Code templates & step-by-step tutorials',
      'Dark mode — system-aware, one toggle',
      'Mobile-friendly — fully responsive out of the box',
      'Internationalization support (Coming soon)',
    ],
  },
]

const STYLES = {
  card: 'relative rounded-2xl border border-border/50 bg-card p-7 transition-shadow hover:shadow-sm',
  bulletItem: 'flex items-start gap-2 text-sm',
  bulletColors: {
    time: 'text-green-600 dark:text-green-400 font-medium ',
    better: 'text-blue-600 dark:text-blue-400 font-medium ',
    default: '',
  },
}

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
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span>Built with</span>
      {brands.map((brand, index) => (
        <span key={brand.name} className="inline-flex items-center gap-1">
          {index > 0 && <span>and</span>}
          {'Icon' in brand ? (
            <brand.Icon className={cn('w-3.5 h-3.5', brand.color)} />
          ) : (
            <img
              src={brand.img}
              alt={brand.name}
              className="h-3.5 w-3.5 rounded-sm object-contain"
              loading="lazy"
              width={14}
              height={14}
            />
          )}
          <span className="font-medium text-foreground">{brand.name}</span>
        </span>
      ))}
    </span>
  )
}

const FeatureContent = ({
  feature,
}: {
  feature: (typeof FEATURES)[number]
}) => {
  const Icon = feature.icon
  const timeSavedMatch = feature.timeSaved.match(/~(\d+)/)
  const hoursValue = timeSavedMatch ? timeSavedMatch[1] : ''

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-foreground/50 shrink-0" />
          <div className="space-y-0.5">
            <h3 className="font-semibold text-base leading-tight">
              {feature.title}
            </h3>
            <BrandBadge tech={feature.tech} />
          </div>
        </div>
        <span className="shrink-0 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">
          Save {hoursValue}h
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>

      {/* Meta rows */}
      <div className="flex flex-col gap-1.5 border-l-2 border-border pl-3 text-xs">
        <div className="flex gap-2">
          <span className="w-20 shrink-0 font-semibold text-emerald-700 dark:text-emerald-400">
            Time saved
          </span>
          <span className="text-muted-foreground">{feature.timeSaved}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 shrink-0 font-semibold text-blue-700 dark:text-blue-400">
            Why better
          </span>
          <span className="text-muted-foreground">{feature.better}</span>
        </div>
      </div>

      {/* Highlights grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {feature.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm">
            <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
            <span className="text-foreground/80">{h}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FeaturesSection() {
  const [activeSection, setActiveSection] = useState(FEATURES[0].id)
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-feature-id')
            if (id) setActiveSection(id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -60% 0%',
        threshold: 0.1,
      },
    )

    sectionRefs.current.forEach((section) => {
      observerRef.current?.observe(section)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const scrollToFeature = (id: string) => {
    const element = sectionRefs.current.get(id)
    if (element) {
      const offset = 100
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section id="features" className="py-10 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to launch"
          description="No more juggling 10 different services. BetterStarter has everything built in and ready to go."
        />

        {/* Desktop: Sidebar + Scroll Content */}
        <div className="hidden lg:flex gap-12 items-start">
          {/* Left Sidebar: Feature Navigation */}
          <div className="w-52 shrink-0 sticky top-24">
            <nav className="flex flex-col gap-0.5">
              {FEATURES.map((feature) => {
                const Icon = feature.icon
                const isActive = activeSection === feature.id
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => scrollToFeature(feature.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left',
                      isActive
                        ? 'text-foreground font-medium bg-muted'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-3.5 h-3.5 shrink-0',
                        isActive ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    />
                    <span className="leading-tight">{feature.title}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Right Content: Scrollable Feature Cards */}
          <div className="flex-1 space-y-7">
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                id={`feature-${feature.id}`}
                data-feature-id={feature.id}
                ref={(el) => {
                  if (el) sectionRefs.current.set(feature.id, el)
                  else sectionRefs.current.delete(feature.id)
                }}
                className={STYLES.card}
              >
                <FeatureContent feature={feature} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet: Stacked Cards */}
        <div className="lg:hidden space-y-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              id={`feature-${feature.id}`}
              className={STYLES.card}
            >
              <FeatureContent feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
