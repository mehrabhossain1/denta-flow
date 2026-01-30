import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { SectionHeader } from '../_common/SectionHeader'

const FAQ_ITEMS = [
  {
    question: 'What exactly do I get?',
    answer: `
        Better-Starter is available as a one-time purchase with lifetime access to the GitHub repository containing a Full-Stack, AI-Ready, TypeScript-based starter boilerplate.
        
        - GitHub code Access with lifetime access to make unlimited projects
        - Public documentation on how to use Better-Starter
      `,
  },
  {
    question: 'Do I need to be an experienced developer?',
    answer:
      'While experience with React and TypeScript helps, the starter is designed to be accessible. You get detailed documentation and the code is well-structured. If you get stuck, post a question on the GitHub repo and get answers.',
  },
  {
    question: 'Can I customize it for my needs?',
    answer:
      'Absolutely! This is your codebase. You have full access to all source code and can modify anything. The modular structure makes it easy to add features, change styles, or integrate with other services.',
  },
  {
    question: 'Which database does it support?',
    answer: `Better-Starter is set up with Drizzle ORM and PostgreSQL.
      
      You can host your PostgreSQL DB at Supabase, Neon, Vercel DB, Cloud, or your own server.
      
      Simply add your database URL in the code, and you're done.
      
      You can also easily swap Postgres out with other databases supported by Drizzle ORM like MySQL, SQLite, or others.`,
  },
  {
    question: 'Can my startup have subscription and one-time payment plans?',
    answer:
      'Yes! The Stripe setup supports both Subscription and One-time payment plans for your startup.',
  },
  {
    question: 'Can I use it for multiple projects?',
    answer:
      'Yes! Your license allows you to use Better-Starter for unlimited projects. You can even use it as a starting point for clients or products you build.',
  },
  {
    question: 'How often is it updated?',
    answer:
      'Better-Starter is actively maintained and updated regularly. Your purchase includes lifetime updates, so you always have access to the latest versions and features.',
  },
  {
    question: 'Is there support included?',
    answer: `Yes, you get access to our documentation and priority support. When stuck, simply post a GitHub issue on the repo, and we'll get to it immediately.`,
  },
  {
    question: 'Can I get a refund?',
    answer: `Once you get access to the GitHub repo, Better-Starter is yours forever and it cannot be refunded.
      `,
  },
  {
    question: 'Where do I host my app?',
    answer: `
      Anywhere you like. Better-Starter is hosting agnostic. Better-Starter is set up for Netlify, however, you can host on Vercel, Cloudflare, cloud, or your own server.
      `,
  },
  {
    question: 'Can I vibe code with Cursor, Copilot, etc.?',
    answer: `
      Yes! Better-Starter works with any coding editor, any vibe coding tool - Cursor, VS Code, IntelliJ, Antigravity, Kiro, Claude Code, etc.

      Better-Starter has special instructions for vibe-coding tools built-in to guide them for best output.
      `,
  },
  {
    question: `Why don't I use Lovable, Replit or just vibe code this?`,
    answer: `
      Lovable and Replit are great for prototyping and building landing pages.


      Vibe coding is great (I use it myself), however, you need a solid starting point.

      With Better-Starter you get
      - A good starting point (no blank slate)
      - Skip days of prompting to get it right
      - Skip troubleshooting bugs AI created
      - Skip over thinking what to do
      - Skip doubting if the AI did it right
      - Skip worry if the stack is right
      - Skip vendor-lock
      - Skip over-engineered bloated code
      
      Once you have a good starting point with Better-Starter, your startup has a solid foundation for growth and acceleration with AI and vibe coding.
      `,
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
    <section id="faq" className="py-20 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeader
          title="Frequently asked questions"
          description={
            <span>
              Have another question? Contact me on{' '}
              <a
                href="https://x.com/heyaziz"
                className="underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>{' '}
              or by{' '}
              <a
                href="mailto:support@ilovecoding.org"
                className="underline underline-offset-4"
              >
                email
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
