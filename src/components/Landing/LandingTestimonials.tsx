import { Handshake, Rocket, Users } from 'lucide-react'
import { SectionHeader } from '../_common/SectionHeader'

const EARLY_ACCESS_LIMIT = 10

const PERKS = [
  {
    icon: Handshake,
    title: 'Personal onboarding',
    description:
      'I will personally walk you through the codebase and help you set everything up.',
  },
  {
    icon: Rocket,
    title: 'Launch support',
    description:
      'From idea to deployed product, I will be there to help you ship your first version.',
  },
  {
    icon: Users,
    title: 'Direct access to me',
    description:
      'Get a private channel with me for questions, feedback, and guidance as you build.',
  },
]

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeader
          title={
            <>I will hand-hold the first {EARLY_ACCESS_LIMIT} users to launch</>
          }
          description="No fake testimonials. Instead, here's my commitment: I'll personally help early adopters ship their app."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PERKS.map((perk) => (
            <div
              key={perk.title}
              className="rounded-xl border border-border/50 bg-muted/20 p-6 space-y-4"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <perk.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold">{perk.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/80">
                {perk.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Limited to the first {EARLY_ACCESS_LIMIT} buyers. After that, this
          section becomes testimonials from real users.
        </p>
      </div>
    </section>
  )
}
