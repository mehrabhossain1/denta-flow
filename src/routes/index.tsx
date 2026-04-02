import config from '@/appConfig'
import Footer from '@/components/_common/Footer'
import Header from '@/components/_common/Header'
import { LandingComparison } from '@/components/Landing/LandingComparison'
import { LandingCreator } from '@/components/Landing/LandingCreator'
import { LandingCTA } from '@/components/Landing/LandingCTA'
import { FAQSection } from '@/components/Landing/LandingFAQ'
import { FeaturesSection } from '@/components/Landing/LandingFeatures'
import { LandingHero } from '@/components/Landing/LandingHero'
import { PricingSection } from '@/components/Landing/LandingPricing'
import { LandingQuickstart } from '@/components/Landing/LandingQuickstart'
import { generateCompleteSEO } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: generateCompleteSEO({
      title: `${config.appName} - TanStack Start SaaS Starter Kit`,
      description: `TanStack Start SaaS boilerplate built with Better-Auth, Drizzle, Stripe, Plunk, shadcn/ui, and more. Feature Admin, Blog, Docs, SEO/AEO, and more.`,
    }),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen contain-paint">
        <LandingHero />
        <LandingQuickstart />
        <FeaturesSection />
        <LandingComparison />
        <PricingSection />
        <LandingCreator />
        <FAQSection />
        <LandingCTA />
      </main>
      <Footer />
    </div>
  )
}
