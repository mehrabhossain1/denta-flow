import config from '@/appConfig'
import Footer from '@/components/_common/Footer'
import Header from '@/components/_common/Header'
import { LandingAIReady } from '@/components/Landing/LandingAIReady'
import { LandingComparison } from '@/components/Landing/LandingComparison'
import { LandingCreator } from '@/components/Landing/LandingCreator'
import { CTASection } from '@/components/Landing/LandingCTA'
import { FAQSection } from '@/components/Landing/LandingFAQ'
import { FeaturesSection } from '@/components/Landing/LandingFeatures'
import { LandingHero } from '@/components/Landing/LandingHero'
import { PricingSection } from '@/components/Landing/LandingPricing'
import { LandingTestimonials } from '@/components/Landing/LandingTestimonials'
import { generateCompleteSEO } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: generateCompleteSEO({
      title: `${config.appName} - Ship your SaaS in days, not months`,
      description: `Build your SaaS in days with BetterStarter. Complete starter with TanStack Start, PostgreSQL, authentication, and 130+ hours of saved development time.`,
    }),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen">
        <LandingHero />
        <LandingCreator />
        <FeaturesSection />
        <LandingAIReady />
        <LandingComparison />
        <LandingTestimonials />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
