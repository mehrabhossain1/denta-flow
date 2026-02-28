import { Check, X } from 'lucide-react'
import LogoIcon from '../_common/LogoIcon'
import { SectionHeader } from '../_common/SectionHeader'

const COMPARISON_ROWS = [
  {
    category: 'Framework',
    betterStarter: 'TanStack Start',
    others: 'Next.js',
  },
  {
    category: 'Auth',
    betterStarter: 'better-auth (open source',
    others: 'Clerk, Firebase (vendor)',
  },
  {
    category: 'ORM',
    betterStarter: 'Drizzle (20-50% faster)',
    others: 'Prisma',
  },
  {
    category: 'Email',
    betterStarter: 'Plunk (open source)',
    others: 'Resend, Loop (vendors)',
  },
  {
    category: 'AI-Ready',
    betterStarter: true,
    others: false,
  },
  {
    category: 'AEO, SEO Ready',
    betterStarter: true,
    others: false,
  },
  {
    category: 'Deploy anywhere',
    betterStarter: true,
    others: false,
  },
  {
    category: 'Open source stack',
    betterStarter: true,
    others: false,
  },
  {
    category: 'No vendor lock-in',
    betterStarter: true,
    others: false,
  },
]

const CELL_STYLE = 'px-4 py-3 text-sm'

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
    ) : (
      <X className="w-4 h-4 text-muted-foreground/50" />
    )
  }
  return <span>{value}</span>
}

export function LandingComparison() {
  return (
    <section id="comparison" className="py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <SectionHeader
          title="How BetterStarter compares"
          description="A modern stack built on open source, not vendor lock-in."
        />

        <div className="rounded-xl border border-border/60 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th
                  className={`${CELL_STYLE} text-left font-medium text-muted-foreground`}
                >
                  &nbsp;
                </th>
                <th
                  className={`${CELL_STYLE} text-left font-semibold text-foreground`}
                >
                  <div className="flex gap-1 items-center">
                    <LogoIcon size="sm" />
                    BetterStarter
                  </div>
                </th>
                <th
                  className={`${CELL_STYLE} text-left font-medium text-muted-foreground`}
                >
                  Other starters
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {COMPARISON_ROWS.map((row) => (
                <tr
                  key={row.category}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td
                    className={`${CELL_STYLE} font-medium text-foreground/80`}
                  >
                    {row.category}
                  </td>
                  <td className={`${CELL_STYLE} text-foreground`}>
                    <CellValue value={row.betterStarter} />
                  </td>
                  <td className={`${CELL_STYLE} text-muted-foreground`}>
                    <CellValue value={row.others} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
