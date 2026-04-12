import {
  Bot,
  FileText,
  Heart,
  MessageSquare,
  ShieldCheck,
  Users,
} from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'AI Follow-up Messages',
    description:
      'Generate polite, professional follow-up messages for patients after treatment. Customizable for WhatsApp, SMS, or email with tone and timing controls.',
  },
  {
    icon: Heart,
    title: 'Treatment Explanations',
    description:
      'Explain dental procedures in simple, patient-friendly language. Perfect for nervous patients. Adjust complexity based on age and concerns.',
  },
  {
    icon: Bot,
    title: 'Post-Care Instructions',
    description:
      'Generate general post-treatment care suggestions with things to avoid and warning signs to watch. Considers allergies and procedure severity.',
  },
  {
    icon: FileText,
    title: 'SEO Blog Generator',
    description:
      'Create dental blog posts optimized for search engines. Choose audience, tone, and keywords. Publish directly to your clinic blog in one click.',
  },
  {
    icon: Users,
    title: 'Patient Management',
    description:
      'Keep track of your patients with a simple, searchable directory. Add patient details and reference them across AI tools.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure and Assistive',
    description:
      'All AI features are assistive only, with clear disclaimers. Your data stays secure with built-in authentication and encrypted sessions.',
  },
]

export function DentaFlowFeatures() {
  return (
    <section id="features" className="py-16">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything your practice needs
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            AI-powered tools designed specifically for dental professionals.
            Save hours every week on patient communication and content creation.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-muted/40 p-6 space-y-3 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
