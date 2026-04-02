const COMPANIES = [
  { name: 'CVS Health', logo: '/brands/cvs-health.svg' },
  { name: 'United Airlines', logo: '/brands/united-airlines.svg' },
  { name: 'McKinsey', logo: '/brands/mckinsey.svg' },
  { name: 'Deloitte', logo: '/brands/deloitte.svg' },
  { name: 'Caterpillar', logo: '/brands/caterpillar.svg' },
  { name: 'Salesforce', logo: '/brands/salesforce.svg' },
  { name: 'Intuit', logo: '/brands/intuit.svg' },
  { name: 'Starbucks', logo: '/brands/starbucks.svg' },
  { name: 'TE Connectivity', logo: '/brands/te-connectivity.svg' },
]

function LogoItem({ company }: { company: (typeof COMPANIES)[number] }) {
  return (
    <div className="flex items-center justify-center w-24 h-9 shrink-0">
      <img
        src={company.logo}
        alt={company.name}
        className="max-w-full max-h-full object-contain grayscale opacity-60 dark:brightness-0 dark:invert transition-all"
        width={96}
        height={36}
        loading="lazy"
      />
    </div>
  )
}

export function LandingCreator() {
  return (
    <section id="creator" className="py-10 sm:py-20">
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
            <div className="overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex gap-10 animate-marquee w-max">
                {COMPANIES.map((company) => (
                  <LogoItem key={company.name} company={company} />
                ))}
                {COMPANIES.map((company) => (
                  <LogoItem key={`${company.name}-dup`} company={company} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
