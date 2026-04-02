import { SectionHeader } from '../_common/SectionHeader'

const STEPS = [
  {
    step: 1,
    label: 'Clone the repo',
    commands: [
      'git clone https://github.com/azizali/betterstarter.git',
      'cd betterstarter',
    ],
  },
  {
    step: 2,
    label: 'Install dependencies',
    commands: ['pnpm install'],
  },
  {
    step: 3,
    label: 'Configure env',
    commands: ['cp .env.sample .env.local'],
  },
  {
    step: 4,
    label: 'Start dev server',
    commands: ['pnpm dev'],
  },
]

export function LandingQuickstart() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <SectionHeader
          eyebrow="Quickstart"
          title="Launch in under 5 minutes"
          description="Four commands and you're running a production-grade SaaS starter."
        />

        {/* Steps */}
        <ol className="relative flex flex-col gap-0">
          {STEPS.map((item, idx) => (
            <li key={item.step} className="flex gap-6 group">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-foreground bg-background text-foreground text-xs font-bold shrink-0 z-10">
                  {item.step}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1 mb-1" />
                )}
              </div>

              {/* Content */}
              <div
                className={`flex flex-col gap-2 pb-8 flex-1 ${idx === STEPS.length - 1 ? 'pb-0' : ''}`}
              >
                <span className="text-sm font-semibold text-foreground pt-1">
                  {item.label}
                </span>
                <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
                  {item.commands.map((cmd, cmdIdx) => (
                    <div
                      key={cmd}
                      className={`flex items-center gap-3 px-4 py-2.5 font-mono text-[12px] ${
                        cmdIdx < item.commands.length - 1
                          ? 'border-b border-border/60'
                          : ''
                      }`}
                    >
                      <span className="text-muted-foreground/50 select-none">
                        $
                      </span>
                      <span className="text-foreground">{cmd}</span>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
