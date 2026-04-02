import { Check } from 'lucide-react'
import LogoIcon from '../_common/LogoIcon'
import { SectionHeader } from '../_common/SectionHeader'

const FEATURES = [
  { name: 'Authentication (email, OTP, OAuth)', scratch: '1–2 days' },
  { name: 'Stripe payments & webhooks', scratch: '2-3 days' },
  { name: 'Database schema & ORM setup', scratch: '1-2 days' },
  { name: 'Transactional email integration', scratch: '1-2 days' },
  { name: 'Admin dashboard', scratch: '5 days' },
  { name: 'Blog with MDX & RSS', scratch: '3-4 days' },
  { name: 'Docs site with sidebar nav', scratch: '3–4 days' },
  { name: 'SEO & structured data', scratch: '1-2 days' },
  { name: 'AI SDK integration', scratch: '1-2 days' },
  { name: 'Dark mode & theming', scratch: '1–2 days' },
  { name: 'Linting, formatting, CI setup', scratch: '1 day' },
]

const STATS = [
  { value: '4-6 wks', label: 'to build from scratch + AI' },
  { value: '130+ hrs', label: 'of dev time saved' },
  { value: 'Day 1', label: 'start shipping features' },
]

export function LandingComparison() {
  return (
    <section id="comparison" className="py-10 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <SectionHeader
          eyebrow="Build from scratch vs. Buy"
          title="Start Today, Not Someday"
          description="Skip manual setup, prompting and debugging. Start with a solid foundation."
        />

        <div className="rounded-xl border border-border overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_6rem_7rem] sm:grid-cols-[1fr_8rem_9rem] border-b border-border bg-muted/40">
            <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Feature
            </div>
            <div className="px-2 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground text-center">
              Scratch
            </div>
            <div className="px-2 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-green-700 dark:text-green-400 text-center bg-green-50/60 dark:bg-green-950/20">
              <span className="hidden sm:inline">BetterStarter</span>
              <span className="sm:hidden flex justify-center">
                <LogoIcon size="sm" />
              </span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/50">
            {FEATURES.map((f, i) => (
              <div
                key={f.name}
                className={`grid grid-cols-[1fr_6rem_7rem] sm:grid-cols-[1fr_8rem_9rem] items-center ${i % 2 === 0 ? '' : 'bg-muted/20'}`}
              >
                <div className="px-4 py-3 text-sm text-foreground/80">
                  {f.name}
                </div>
                <div className="px-2 py-3 text-xs text-muted-foreground text-center tabular-nums">
                  {f.scratch}
                </div>
                <div className="px-2 py-3 flex justify-center bg-green-50/30 dark:bg-green-950/10">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-950/60">
                    <Check className="w-3 h-3 text-green-700 dark:text-green-400" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary footer */}
          <div className="border-t border-border bg-muted/30 px-4 py-5 grid grid-cols-3 divide-x divide-border/60">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-0.5 px-2"
              >
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {value}
                </span>
                <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
