import config from '@/appConfig'
import Footer from '@/components/_common/Footer'
import Header from '@/components/_common/Header'
import { LandingCreator } from '@/components/Landing/LandingCreator'
import { FAQSection } from '@/components/Landing/LandingFAQ'
import { FeaturesSection } from '@/components/Landing/LandingFeatures'
import { LandingHero } from '@/components/Landing/LandingHero'
import { PricingSection } from '@/components/Landing/LandingPricing'
import { CACHE_DURATIONS, getNetlifyCacheHeaders } from '@/lib/cache'
import { generateCompleteSEO } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: generateCompleteSEO({
      title: `${config.appName} - Ship your SaaS in days, not months`,
      description: `Build your SaaS in days with Better-Starter. Complete starter with TanStack Start, PostgreSQL, authentication, and 130+ hours of saved development time.`,
    }),
    headers: getNetlifyCacheHeaders(CACHE_DURATIONS.INDIVIDUAL_PAGE),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen">
        <LandingHero />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <LandingCreator />
      </main>
      <Footer />
    </div>
  )
}
