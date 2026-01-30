import { SiDrizzle, SiShadcnui, SiTailwindcss } from 'react-icons/si'

const TECH_STACK = [
  {
    name: 'TanStack Start - Full-Stack Framework',
    logo: '/brands/tanstack.png',
    tagline: 'Better than Next.js',
    description:
      'Easier, Faster, Type-safe. Deploy anywhere: Netlify, Vercel etc.',
  },
  {
    name: 'Drizzle - Database Integration',
    icon: SiDrizzle,
    iconColor: 'text-[#f5a524]',
    tagline: '20%-50% faster than Prisma',
    description: 'Use Postgres anywhere: Supabase, Neon etc.',
  },
  {
    name: 'Better-Auth - Login',
    logo: '/brands/better-auth.svg',
    tagline: 'Do not pay vendors like clerk, firebase auth etc.',
    description: 'Open-source Auth. Magic-link, OTP, 34+ login providers',
  },
  {
    name: 'Plunk - Email Management',
    logo: '/brands/plunk.svg',
    tagline: 'Do not pay vendors like Resend, Loop, Mailgun etc.',
    description: 'Your own open-source email infrastructure',
  },
  {
    name: 'TailwindCSS + Shadcn - Styles',
    icons: [
      { icon: SiTailwindcss, color: 'text-[#38bdf8]' },
      { icon: SiShadcnui, color: 'text-foreground' },
    ],
    tagline: 'Industry standard styling',
    description: '60+ Beautiful, accessible components out of the box',
  },
  {
    name: 'Stripe - Payment',
    logo: '/brands/stripe-icon.svg',
    tagline: '125+ payment methods, 50+ countries',
    description: 'Accept money from day one',
  },
]

export function BuiltWithSection() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Built Better With
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          All open-source. Best in class. Configured with best practices.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {TECH_STACK.map((tech) => (
          <div
            key={tech.name}
            className="flex gap-3 p-3 rounded-lg border border-border/50 bg-muted/30 backdrop-blur-sm transition-shadow hover:shadow-md"
          >
            <div className="shrink-0 flex items-center justify-center w-8 h-8">
              {tech.logo ? (
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="w-8 h-8 rounded"
                  width={32}
                  height={32}
                  loading="lazy"
                />
              ) : tech.icon ? (
                <tech.icon className={`w-8 h-8 ${tech.iconColor}`} />
              ) : tech.icons ? (
                <div className="flex gap-1">
                  {tech.icons.map((iconData) => (
                    <iconData.icon
                      key={iconData.color}
                      className={`w-4 h-4 ${iconData.color}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{tech.name}</h3>
              <p className="text-xs font-medium text-primary">{tech.tagline}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tech.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
