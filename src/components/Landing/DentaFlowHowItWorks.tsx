import { Bot, ClipboardCheck, UserPlus } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    step: '1',
    title: 'Sign Up and Add Patients',
    description:
      'Create your account in seconds. Add your patients with their basic details so AI tools can personalize outputs.',
  },
  {
    icon: Bot,
    step: '2',
    title: 'Use AI Tools',
    description:
      'Generate follow-up messages, treatment explanations, post-care instructions, or blog posts. Fill in the structured inputs for product-level results.',
  },
  {
    icon: ClipboardCheck,
    step: '3',
    title: 'Review and Send',
    description:
      'Preview AI-generated content, edit if needed, then copy to WhatsApp, publish to your blog, or share with your patient.',
  },
]

export function DentaFlowHowItWorks() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Three simple steps to transform your practice communication
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.step}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="relative">
                <div className="rounded-full bg-primary/10 p-4">
                  <step.icon className="size-6 text-primary" />
                </div>
                <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {step.step}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
