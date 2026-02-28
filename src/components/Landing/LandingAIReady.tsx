import { Bot, Code2, Sparkles } from 'lucide-react'
import { SectionHeader } from '../_common/SectionHeader'

const AI_FEATURES = [
  {
    icon: Bot,
    title: 'Built-in AI instructions',
    description:
      'Ships with pre-configured instructions for Cursor, GitHub Copilot, and Claude Code so your AI assistant understands the codebase from day one.',
  },
  {
    icon: Code2,
    title: 'Skip the blank slate',
    description:
      'Give an AI a blank project and you spend days debugging hallucinated architecture decisions. Give it BetterStarter and it already knows the stack, the patterns, and the best practices.',
  },
  {
    icon: Sparkles,
    title: 'Vibe code on a solid foundation',
    description:
      'Lovable and Cursor are amazing. But they need a solid starting point to build on. BetterStarter is that starting point.',
  },
]

export function LandingAIReady() {
  return (
    <section id="ai-ready" className="py-20 sm:py-32 bg-muted/40">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeader
          title="Built for the AI era"
          description="Vibe code the features. Don't vibe code the foundation."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AI_FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border/50 bg-background p-6 space-y-3 transition-shadow hover:shadow-md"
              >
                <div className="inline-flex p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
