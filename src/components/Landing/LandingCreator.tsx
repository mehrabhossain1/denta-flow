const COMPANIES = [
  { name: 'CVS Health', logo: '/brands/cvs-health.svg' },
  { name: 'United Airlines', logo: '/brands/united-airlines.svg' },
  { name: 'McKinsey', logo: '/brands/mckinsey.svg' },
  { name: 'Deloitte', logo: '/brands/deloitte.svg' },
  { name: 'Caterpillar', logo: '/brands/caterpillar.svg' },
  { name: 'Salesforce', logo: '/brands/salesforce.svg' },
  { name: 'Intuit', logo: '/brands/intuit.svg' },
]

export function LandingCreator() {
  return (
    <section id="creator" className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="flex flex-col items-center text-center gap-6">
          <p className="text-lg sm:text-xl leading-relaxed text-foreground/80 max-w-2xl">
            Built by{' '}
            <span className="font-semibold text-foreground">Aziz Ali</span>,
            engineer who shipped production systems at McKinsey, Deloitte, and 8
            of his own startups. BetterStarter is the foundation he wished he
            had from day one.
          </p>

          <div className="space-y-3 w-full">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Previously at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10">
              {COMPANIES.map((company) => (
                <div
                  key={company.name}
                  className="flex items-center justify-center w-20 h-8 sm:w-24 sm:h-9"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-w-full
                    max-h-full
                    object-contain
                    p-1
                    grayscale-100
                    opacity-70
                    dark:brightness-0
                    dark:invert
                    hover:grayscale-0
                    hover:opacity-100
                    dark:hover:invert-0
                    dark:hover:brightness-100
                    dark:hover:bg-white
                    transition-all"
                    width={96}
                    height={32}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
