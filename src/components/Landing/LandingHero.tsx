import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { BuiltWithSection } from './BuiltWithSection'

const FEATURE_LINKS = [
  { label: 'Auth', hash: 'feature-auth' },
  { label: 'Payments', hash: 'feature-payment' },
  { label: 'AI SDK', hash: 'feature-ai-ready' },
  { label: 'Admin', hash: 'feature-admin' },
  { label: 'Email', hash: 'feature-email' },
  { label: 'Blog', hash: 'feature-blog' },
  { label: 'Docs', hash: 'feature-docs' },
  { label: 'SEO/AEO', hash: 'feature-seo-aeo' },
  { label: 'More', hash: 'feature-more' },
]

export function LandingHero() {
  return (
    <section className="max-w-5xl mx-auto py-20">
      <div className="mx-auto px-6 sm:px-8 ">
        <div className="grid grid-cols-1 items-center gap-8">
          {/* Left: Hero Text & CTA */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4 items-center flex flex-col max-w-xl mx-auto text-center">
              <div className="flex gap-2 items-center justify-center text-xs border rounded-full p-1 pr-2">
                <Badge variant="default">New</Badge>
                AI Agent Support: Build AI powered apps (Coming)
              </div>

              <h1 className="text-4xl font-bold leading-10 tracking-tighter">
                TanStack Start SaaS Starter Kit for Serious Founders
              </h1>
              <p className="lead text-sm">
                Everything you need to launch your startup in days, not months.
                <br />
                <span className="inline-flex flex-wrap gap-x-1 gap-y-0.5 justify-center mt-1">
                  {FEATURE_LINKS.map((f, i) => (
                    <span key={f.label}>
                      <Link
                        to="/"
                        hash={f.hash}
                        className="text-foreground font-medium underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors"
                      >
                        {f.label}
                      </Link>
                      {i < FEATURE_LINKS.length - 1 && (
                        <span className="text-muted-foreground">&nbsp; </span>
                      )}
                    </span>
                  ))}
                </span>
              </p>
              {/* <p className="lead text-sm">
                BetterStarter is a startup starter kit built with a 100% open-source stack: TanStack Start, Drizzle, Better-Auth, Plunk, shadcn/ui, and more.
              </p> */}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 items-center">
              <Button asChild className="w-min">
                <Link to="/" hash="pricing">
                  Get lifetime access
                </Link>
              </Button>

              {/* Social proof */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Loved by{' '}
                  <span className="font-medium text-foreground">founders</span>{' '}
                  shipping faster
                </p>
              </div>
            </div>
          </div>

          {/* Right: Built With Section */}
          <BuiltWithSection />
        </div>
      </div>
    </section>
  )
}
