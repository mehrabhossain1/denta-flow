import { Link } from '@tanstack/react-router'
import { Bot, FileText, Heart, MessageSquare } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

export function DentaFlowHero() {
  return (
    <section className="max-w-5xl mx-auto py-20">
      <div className="mx-auto px-6 sm:px-8">
        <div className="flex flex-col gap-8 items-center text-center">
          <div className="space-y-4 max-w-2xl">
            <div className="flex gap-2 items-center justify-center text-xs border rounded-full p-1 pr-2">
              <Badge variant="default">AI-Powered</Badge>
              Built for modern dental practices
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tighter">
              AI-Powered Dental
              <br />
              Practice Management
            </h1>

            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Streamline patient follow-ups, explain treatments in plain
              language, generate post-care instructions, and publish SEO blog
              content for your clinic. All powered by AI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link to="/auth/$authView" params={{ authView: 'sign-up' }}>
                Start Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/" hash="features">
                See Features
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 w-full max-w-2xl">
            {[
              {
                icon: MessageSquare,
                label: 'Follow-up Messages',
              },
              {
                icon: Heart,
                label: 'Treatment Explanations',
              },
              {
                icon: Bot,
                label: 'Post-Care Instructions',
              },
              {
                icon: FileText,
                label: 'SEO Blog Generator',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 rounded-xl border bg-muted/40 p-4"
              >
                <item.icon className="size-5 text-primary" />
                <span className="text-xs font-medium text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
