import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

export function DentaFlowCTA() {
  return (
    <section className="pb-16">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="rounded-2xl border border-border bg-muted/40 px-8 py-12 sm:px-12 flex flex-col items-center text-center gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to modernize your practice?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Join dental professionals using AI to save hours on patient
              communication and content creation.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/auth/$authView" params={{ authView: 'sign-up' }}>
              Get Started Free
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
