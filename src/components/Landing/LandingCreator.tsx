const COMPANIES = [
  { name: 'CVS Health', logo: '/brands/cvs-health.svg' },
  { name: 'United Airlines', logo: '/brands/united-airlines.svg' },
  { name: 'McKinsey', logo: '/brands/mckinsey.svg' },
  { name: 'Deloitte', logo: '/brands/deloitte.svg' },
  { name: 'Caterpillar', logo: '/brands/caterpillar.svg' },
  { name: 'Starbucks', logo: '/brands/starbucks.svg' },
  { name: 'Salesforce', logo: '/brands/salesforce.svg' },
  { name: 'Intuit', logo: '/brands/intuit.svg' },
]

export function LandingCreator() {
  return (
    <section
      id="creator"
      className="py-20 sm:py-32 bg-gradient-to-b from-muted/40 to-background"
    >
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        {/* Header */}
        <div className="mb-16 space-y-6">
          <div className="space-y-4">
            <p className="text-xl sm:text-2xl font-semibold">
              Hey, it's Aziz 👋
            </p>
            <div className="space-y-3 text-base sm:text-lg leading-relaxed text-foreground/80">
              <p>
                I used to build things the hard way. Spent months wiring up
                auth, payments, emails, and databases. Every new project meant
                repeating the same setup dance. I shipped 8 startups and
                realized I was doing the same plumbing work over and over.
              </p>
              <p>
                That's when I decided to stop solving the same problems and
                start building the solution. Better-Starter is the exact
                playbook I use now. Every integration, every pattern, every
                default comes from real launches.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              I have worked for the following firms
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-5">
              {COMPANIES.map((company) => (
                <div
                  key={company.name}
                  className="flex items-center justify-center h-8 sm:h-12"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-8 w-24 object-contain grayscale-100 hover:opacity-100 hover:grayscale-0 transition-opacity"
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
