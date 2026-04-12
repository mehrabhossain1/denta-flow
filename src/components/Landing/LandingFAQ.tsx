import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { SectionHeader } from '../_common/SectionHeader'

const FAQ_ITEMS = [
  {
    question: 'What is DentaFlow?',
    answer:
      'DentaFlow is an AI-powered dental practice management tool. It helps dentists generate patient follow-up messages, explain treatments in simple language, create post-care instructions, and publish SEO blog content — all powered by AI.',
  },
  {
    question: 'Is DentaFlow free to use?',
    answer: `Yes! DentaFlow offers a free tier with 10 AI requests per month. This includes all features:
      - AI follow-up messages
      - Treatment explanations
      - Post-care instructions
      - Patient management

      Upgrade to Pro ($19/mo) for unlimited AI requests.`,
  },
  {
    question: 'Is the AI content medically accurate?',
    answer:
      'All AI-generated content is assistive only and should be reviewed by a qualified dental professional before sharing with patients. DentaFlow helps you draft content faster, but the final review and approval is always yours.',
  },
  {
    question: 'What AI features are included?',
    answer: `DentaFlow includes four AI-powered tools:
      - Follow-up message generator (WhatsApp, SMS, email)
      - Treatment explanation generator (simple or detailed)
      - Post-care instruction generator (with allergy awareness)
      - SEO blog post generator for your clinic website`,
  },
  {
    question: 'Can I manage my patients in DentaFlow?',
    answer:
      'Yes! DentaFlow includes a patient management system where you can add, search, and organize your patient records. Patient details can be used with AI tools for personalized content.',
  },
  {
    question: 'How does the Pro plan work?',
    answer: `Pro gives you unlimited AI requests for $19/month or $190/year (save 17%). You can upgrade, downgrade, or cancel anytime from your account settings. No long-term commitment required.`,
  },
  {
    question: 'Is my patient data secure?',
    answer:
      'Yes. All data is encrypted in transit and at rest. Patient records are tied to your authenticated account and are not shared with other users. AI processing happens server-side and patient data is not used to train AI models.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel anytime from your account settings. After cancellation, you keep Pro access until the end of your billing period, then revert to the free tier with 10 AI requests per month.',
  },
]

const FAQ_WRAPPER =
  'border border-border/60 rounded-xl bg-muted/20 divide-y divide-border/60'
const FAQ_TRIGGER =
  'w-full px-4 py-4 flex items-center justify-between text-left hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background'
const FAQ_QUESTION = 'font-semibold text-base text-foreground'
const FAQ_ANSWER = 'text-sm text-muted-foreground leading-relaxed'
const FAQ_ICON_WRAPPER =
  'inline-flex h-6 w-6 items-center justify-center text-foreground/70'
const FAQ_GUTTER = 'mt-8'

function FormattedAnswer({ text }: { text: string }) {
  const lines = text
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const elements: React.ReactNode[] = []
  let currentBullets: string[] = []
  let key = 0

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      elements.push(
        <ul
          key={`bullets-${key++}`}
          className="space-y-2 list-disc list-inside ml-2"
        >
          {currentBullets.map((bullet, i) => (
            <li key={i} className={FAQ_ANSWER}>
              {bullet}
            </li>
          ))}
        </ul>,
      )
      currentBullets = []
    }
  }

  for (const line of lines) {
    if (line.startsWith('-')) {
      currentBullets.push(line.slice(1).trim())
    } else {
      flushBullets()
      elements.push(
        <p key={`para-${key++}`} className={FAQ_ANSWER}>
          {line}
        </p>,
      )
    }
  }
  flushBullets()

  return <div className="space-y-3">{elements}</div>
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    // biome-ignore lint/correctness/useUniqueElementIds: Static landing page section IDs
    <section id="faq" className="py-10 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          description={
            <span>
              Have another question? Contact us at{' '}
              <a
                href="mailto:support@dentaflow.app"
                className="underline underline-offset-4"
              >
                support@dentaflow.app
              </a>
              .
            </span>
          }
        />

        {/* FAQ List */}
        <div className={FAQ_GUTTER}>
          <div className={FAQ_WRAPPER}>
            {FAQ_ITEMS.map((item, index) => (
              <div key={`${item.question}-${index}`} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className={FAQ_TRIGGER}
                >
                  <div className="flex items-center gap-3">
                    <span className={FAQ_ICON_WRAPPER}>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          openIndex === index && 'rotate-180',
                        )}
                      />
                    </span>
                    <span className={FAQ_QUESTION}>{item.question}</span>
                  </div>
                </button>

                <div
                  className={cn(
                    'overflow-hidden transition-[max-height,opacity] duration-300 ease-out',
                    openIndex === index
                      ? 'max-h-[500px] opacity-100'
                      : 'max-h-0 opacity-0',
                  )}
                >
                  <div className="px-4 pb-4">
                    <div className="pl-9 border-l border-border/60">
                      <FormattedAnswer text={item.answer} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
