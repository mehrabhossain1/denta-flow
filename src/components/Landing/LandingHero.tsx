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
                Stack for the AI era
              </Badge>
              <h1 className="text-4xl font-bold leading-tight">
                Vibe code the features. Don't vibe code the foundation.
              </h1>
              <p className="lead text-foreground">
                BetterStarter is a startup boilerplate which is just built
                better with modern open-source stack. Give your AI the right
                starting point so you focus on building your idea and not the
                foundation.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2 items-center lg:items-start">
              <Button size="lg" asChild className=" w-min">
                <Link to="/" hash="pricing">
                  Get BetterStarter
                </Link>
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-green-600">$100 off</span>{' '}
                  Launch special ending soon
                </span>
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
