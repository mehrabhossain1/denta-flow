import { Link } from '@tanstack/react-router'
import { Gift } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { BuiltWithSection } from './BuiltWithSection'

export function LandingHero() {
  return (
    <section className="max-w-5xl mx-auto py-20">
      <div className="mx-auto px-6 sm:px-8 ">
        <div className="grid grid-cols-1 items-center lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Hero Text & CTA */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4 items-center lg:items-start flex flex-col max-w-lg mx-auto text-center lg:text-left">
              <Badge
                variant={'outline'}
                className="w-fit"
                style={{ animation: 'float 3s ease-in-out infinite' }}
              >
                No more overthinking
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight leading-tight">
                Better-Starter is a<br />
                <span className="relative inline-block">
                  <span className="relative z-10">Fast</span>
                  <svg
                    aria-hidden
                    viewBox="0 0 120 12"
                    preserveAspectRatio="none"
                    className="absolute left-0 right-0 -bottom-2 h-3 w-full"
                  >
                    <title>zig-zag</title>
                    <path
                      d="M0 6 L10 0 L20 12 L30 0 L40 12 L50 0 L60 12 L70 0 L80 12 L90 0 L100 12 L110 0 L120 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>{' '}
                Starter Boilerplate
              </h1>
              <p className="text-lg text-foreground xleading-relaxed">
                The best open-source tech put together with best practices, so
                you don't have to!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2 items-center lg:items-start">
              <Button size="lg" asChild className=" w-min">
                <Link to="/" hash="pricing">
                  Get Better-Starter
                </Link>
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-green-600">$100 off</span>{' '}
                  Launch special for the next 10 customers.
                </span>
              </div>
            </div>

            {/* Special Offer */}

            {/* Benefits */}
            {/* <div className="grid grid-cols-2 gap-3 pt-2">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.label} className="flex gap-2">
                    <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{benefit.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div> */}
          </div>

          {/* Right: Built With Section */}
          <BuiltWithSection />
        </div>
      </div>
    </section>
  )
}
